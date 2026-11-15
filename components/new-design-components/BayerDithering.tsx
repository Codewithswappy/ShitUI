'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

const VERTEX_SHADER = `#version 300 es
in vec2 position;
void main() {
    gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

uniform vec3  uColor;
uniform vec3  uHoverColor;
uniform vec2  uResolution;
uniform float uTime;
uniform float uPixelSize;
uniform int   uShapeType;
uniform float uDirection;
uniform float uSpeed;
uniform float uDensityScale;
uniform float uDensityOffset;

uniform vec2  uMouse;
uniform float uMouseActive;
uniform float uMagneticRadius;
uniform float uMagneticStrength;

const int SHAPE_SQUARE   = 0;
const int SHAPE_CIRCLE   = 1;
const int SHAPE_TRIANGLE = 2;
const int SHAPE_DIAMOND  = 3;

const int MAX_CLICKS = 10;
uniform vec2  uClickPos[MAX_CLICKS];
uniform float uClickTimes[MAX_CLICKS];
uniform float uClickLevels[MAX_CLICKS];

out vec4 fragColor;

// Bayer ordered dithering (8x8)
float Bayer2(vec2 a) {
    a = floor(a);
    return fract(a.x / 2. + a.y * a.y * .75);
}
#define Bayer4(a) (Bayer2(.5*(a)) * 0.25 + Bayer2(a))
#define Bayer8(a) (Bayer4(.5*(a)) * 0.25 + Bayer2(a))

// FBM noise for organic cloud waves
#define FBM_OCTAVES    4
#define FBM_LACUNARITY 1.4
#define FBM_GAIN       0.8
#define FBM_SCALE      3.2

float hash11(float n) { return fract(sin(n) * 43758.5453); }

float vnoise(vec3 p) {
    vec3 ip = floor(p), fp = fract(p);
    float n000 = hash11(dot(ip + vec3(0,0,0), vec3(1,57,113)));
    float n100 = hash11(dot(ip + vec3(1,0,0), vec3(1,57,113)));
    float n010 = hash11(dot(ip + vec3(0,1,0), vec3(1,57,113)));
    float n110 = hash11(dot(ip + vec3(1,1,0), vec3(1,57,113)));
    float n001 = hash11(dot(ip + vec3(0,0,1), vec3(1,57,113)));
    float n101 = hash11(dot(ip + vec3(1,0,1), vec3(1,57,113)));
    float n011 = hash11(dot(ip + vec3(0,1,1), vec3(1,57,113)));
    float n111 = hash11(dot(ip + vec3(1,1,1), vec3(1,57,113)));
    vec3 w = fp * fp * fp * (fp * (fp * 6. - 15.) + 10.);
    float x00 = mix(n000, n100, w.x), x10 = mix(n010, n110, w.x);
    float x01 = mix(n001, n101, w.x), x11 = mix(n011, n111, w.x);
    float y0  = mix(x00,  x10,  w.y), y1  = mix(x01,  x11,  w.y);
    return mix(y0, y1, w.z) * 2.0 - 1.0;
}

float fbm2(vec2 uv, float t) {
    vec3  p    = vec3(uv * FBM_SCALE, t);
    float amp  = 1., freq = 1., sum = 1.;
    for (int i = 0; i < FBM_OCTAVES; ++i) {
        sum  += amp * vnoise(p * freq);
        freq *= FBM_LACUNARITY;
        amp  *= FBM_GAIN;
    }
    return sum * 0.5 + 0.5;
}

// Pixel-shape masks
float maskCircle(vec2 p, float cov) {
    if (cov <= 0.0) return 0.0;
    float r  = 0.42;
    float d  = length(p - 0.5) - r;
    float aa = 0.5 * fwidth(d);
    return 1.0 - smoothstep(-aa, aa, d);
}

float maskTriangle(vec2 p, vec2 id, float cov) {
    if (cov <= 0.0) return 0.0;
    bool flip = mod(id.x + id.y, 2.0) > 0.5;
    if (flip) p.x = 1.0 - p.x;
    float r  = 0.6;
    float d  = p.y - r * (1.0 - p.x);
    float aa = fwidth(d);
    return clamp(0.5 - d / aa, 0.0, 1.0);
}

float maskDiamond(vec2 p, float cov) {
    if (cov <= 0.0) return 0.0;
    return step(abs(p.x - 0.5) + abs(p.y - 0.5), 0.48);
}

void main() {
    vec2  fragCoord    = gl_FragCoord.xy - uResolution * .5;
    float ar           = uResolution.x / max(uResolution.y, 1.0);
    vec2  warpedCoord  = fragCoord;

    // 1. Magnetic attract effect towards uMouse:
    // Attracts towards cursor perimeter like a magnet, but NEVER collapses/pinches onto cursor
    vec2 toMouse = uMouse - fragCoord;
    float mouseDist = length(toMouse);
    float magnetRadius = max(uMagneticRadius, 20.0);
    float coreRadius = 42.0; // Comfort zone: dots maintain field spacing around cursor

    if (mouseDist < magnetRadius && uMouseActive > 0.001) {
        // Outside coreRadius: attracts smoothly inward
        // Inside coreRadius: gently maintains space so dots don't collapse on cursor
        float radialDelta = mouseDist - coreRadius;
        float falloff = smoothstep(magnetRadius, coreRadius, mouseDist);
        if (mouseDist < coreRadius) {
            falloff = smoothstep(0.0, coreRadius, mouseDist);
        }
        vec2 radialNorm = mouseDist > 0.001 ? (toMouse / mouseDist) : vec2(0.0);
        float radialPull = radialDelta * falloff * 0.32 * uMouseActive;

        // Dipole field curvature: bends lines outward to the left and right (matching flux lines)
        vec2 normDelta = toMouse / max(mouseDist, 1.0);
        vec2 dipoleFlux;
        dipoleFlux.x = (normDelta.x * normDelta.x - normDelta.y * normDelta.y);
        dipoleFlux.y = (2.0 * normDelta.x * normDelta.y);
        float dipolePull = smoothstep(magnetRadius, 0.0, mouseDist) * uMouseActive * 16.0;

        warpedCoord -= radialNorm * radialPull;
        warpedCoord += dipoleFlux * dipolePull;
    }

    // 2. Expanding horizontal click waves:
    // Pushes dither wave left-right. As user clicks repeatedly in one place, distance increases further
    float totalWavePushX = 0.0;
    float totalWavePushY = 0.0;
    float rippleIntensity = 0.0;

    for (int i = 0; i < MAX_CLICKS; ++i) {
        if (uClickTimes[i] < 0.0) continue;
        float dt = uTime - uClickTimes[i];
        if (dt < 0.0 || dt > 3.2) continue;

        float level = max(uClickLevels[i], 1.0);
        // Max distance expands with consecutive clicks in same spot
        float maxDist = 95.0 + (level - 1.0) * 125.0;
        float waveSpeed = 260.0 + level * 55.0;
        float currentRadius = dt * waveSpeed;

        if (currentRadius > maxDist + 60.0) continue;

        vec2 diff = fragCoord - uClickPos[i];
        // Elliptical distance: wave stretches and spreads predominantly along left-right horizontal axis
        float distH = sqrt(diff.x * diff.x + (diff.y * 2.8) * (diff.y * 2.8));
        
        float ringDist = abs(distH - currentRadius);
        float thickness = 22.0 + level * 5.0;
        float ringProfile = exp(-pow(ringDist / thickness, 2.0));

        // Smooth fade out as wave approaches its max distance
        float distFade = smoothstep(maxDist + 40.0, maxDist * 0.6, currentRadius);
        float timeFade = exp(-dt * 1.5);
        float waveStrength = ringProfile * distFade * timeFade;

        // Push dither dots outward horizontally to the left and to the right
        float pushDirX = diff.x >= 0.0 ? 1.0 : -1.0;
        float pushAmount = waveStrength * (18.0 + level * 8.0);
        totalWavePushX += pushDirX * pushAmount;
        totalWavePushY += (diff.y / max(abs(diff.y) + 12.0, 1.0)) * pushAmount * 0.25;

        rippleIntensity = max(rippleIntensity, waveStrength);
    }

    warpedCoord.x += totalWavePushX;
    warpedCoord.y += totalWavePushY;

    // Displaced pixel and cell coordinates
    vec2  pixelId      = floor(warpedCoord / uPixelSize);
    vec2  pixelUV      = fract(warpedCoord / uPixelSize);
    float cellPx       = 8.0 * uPixelSize;
    vec2  cellCoord    = floor(warpedCoord / cellPx) * cellPx;
    vec2  uv           = cellCoord / uResolution * vec2(ar, 1.0);

    // Continuous flow along horizontal axis
    // uDirection: +1.0 = right-to-left, -1.0 = left-to-right
    vec2 driftUv = uv + vec2(uDirection * uTime * uSpeed, 0.0);

    float noise = fbm2(driftUv, uTime * 0.04);
    float feed  = clamp(noise * uDensityScale + uDensityOffset, 0.0, 1.0);

    // Mouse hover reveals / pushes dots in hover zone
    float hoverRadius = magnetRadius * 0.85;
    float hoverDist = length(fragCoord - uMouse);
    float hoverInfluence = smoothstep(hoverRadius, 0.0, hoverDist) * uMouseActive;
    feed = clamp(feed + hoverInfluence * 0.42 + rippleIntensity * 0.75, 0.0, 1.0);

    // Bayer 8x8 threshold
    float bayer = Bayer8(warpedCoord / uPixelSize);
    float bw    = step(bayer, feed);

    // Shape mask
    float M;
    if      (uShapeType == SHAPE_CIRCLE)   M = maskCircle(pixelUV, bw);
    else if (uShapeType == SHAPE_TRIANGLE) M = maskTriangle(pixelUV, pixelId, bw);
    else if (uShapeType == SHAPE_DIAMOND)  M = maskDiamond(pixelUV, bw);
    else                                   M = bw;

    // Color transition: base color to #3074fe under cursor and during left-right wave
    float blueMix = clamp(hoverInfluence * 0.95 + rippleIntensity * 0.95, 0.0, 1.0);
    vec3 finalColor = mix(uColor, uHoverColor, blueMix);
    float finalAlpha = M * mix(1.0, 1.5, blueMix);

    fragColor = vec4(finalColor, finalAlpha);
}
`;

export interface BayerDitheringProps {
  direction?: 'right-to-left' | 'left-to-right';
  speed?: number;
  pixelSize?: number;
  shapeType?: 'square' | 'circle' | 'triangle' | 'diamond';
  densityScale?: number;
  densityOffset?: number;
  color?: string; // hex color string, or auto-detected by theme
  hoverColor?: string; // hex color string, default '#3074fe'
  magneticRadius?: number; // magnetic influence radius in px (default 190)
  magneticStrength?: number; // max displacement in px (default 42)
  opacity?: number;
  className?: string;
  style?: React.CSSProperties;
}

const SHAPE_MAP = {
  square: 0,
  circle: 1,
  triangle: 2,
  diamond: 3,
};

export function BayerDithering({
  direction = 'right-to-left',
  speed = 0.16,
  pixelSize = 5,
  shapeType = 'circle',
  densityScale = 0.65,
  densityOffset = 0.15,
  color,
  hoverColor = '#3074fe',
  magneticRadius = 190,
  magneticStrength = 42,
  opacity,
  className,
  style,
}: BayerDitheringProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  // Instant DOM-based dark theme detection + MutationObserver
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    const checkDark = () => {
      const hasDarkClass = document.documentElement.classList.contains('dark');
      setIsDark(hasDarkClass || resolvedTheme === 'dark');
    };
    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, [resolvedTheme]);

  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const rafRef = useRef<number>(0);
  const clockRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // Click ripple tracking
  const clickSlotRef = useRef<number>(0);
  const clickPosRef = useRef<Float32Array>(new Float32Array(20).fill(-1));
  const clickTimesRef = useRef<Float32Array>(new Float32Array(10).fill(-1));
  const clickLevelsRef = useRef<Float32Array>(new Float32Array(10).fill(1));

  // Tracking consecutive clicks in the same place
  const lastClickTimeRef = useRef<number>(0);
  const lastClickPosRef = useRef<[number, number]>([-9999, -9999]);
  const consecutiveClicksRef = useRef<number>(1);

  // Hover & Magnetic Tracking Refs
  const targetMouseRef = useRef<[number, number]>([0, 0]);
  const mouseRef = useRef<[number, number]>([0, 0]);
  const targetActiveRef = useRef<number>(0);
  const mouseActiveRef = useRef<number>(0);

  // Live uniform refs
  const dirValue = direction === 'right-to-left' ? 1.0 : -1.0;
  const dirRef = useRef(dirValue);
  const speedRef = useRef(speed);
  const pixelSizeRef = useRef(pixelSize);
  const shapeTypeRef = useRef(SHAPE_MAP[shapeType]);
  const densityScaleRef = useRef(densityScale);
  const densityOffsetRef = useRef(densityOffset);
  const magneticRadiusRef = useRef(magneticRadius);
  const magneticStrengthRef = useRef(magneticStrength);

  useEffect(() => {
    dirRef.current = dirValue;
  }, [dirValue]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    pixelSizeRef.current = pixelSize;
  }, [pixelSize]);

  useEffect(() => {
    shapeTypeRef.current = SHAPE_MAP[shapeType];
  }, [shapeType]);

  useEffect(() => {
    densityScaleRef.current = densityScale;
  }, [densityScale]);

  useEffect(() => {
    densityOffsetRef.current = densityOffset;
  }, [densityOffset]);

  useEffect(() => {
    magneticRadiusRef.current = magneticRadius;
  }, [magneticRadius]);

  useEffect(() => {
    magneticStrengthRef.current = magneticStrength;
  }, [magneticStrength]);

  // Base dot color:
  // Dark mode: close to neutral-800 (#262626 / #2b2b2e) -> [0.24, 0.24, 0.26]
  // Light mode: subtle dark neutral dots -> [0.12, 0.12, 0.14]
  const resolvedColor = useMemo(() => {
    if (color) {
      if (color.startsWith('#')) {
        const c = color.slice(1);
        const num = parseInt(c.length === 3 ? c.split('').map((x) => x + x).join('') : c, 16);
        return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
      }
      return [0.5, 0.5, 0.5];
    }
    return isDark ? [0.24, 0.24, 0.26] : [0.12, 0.12, 0.14];
  }, [color, isDark]);

  const colorRef = useRef(resolvedColor);
  useEffect(() => {
    colorRef.current = resolvedColor;
  }, [resolvedColor]);

  // Hover color: default vibrant #3074fe (RareUI primary blue)
  const resolvedHoverColor = useMemo(() => {
    if (hoverColor) {
      if (hoverColor.startsWith('#')) {
        const c = hoverColor.slice(1);
        const num = parseInt(c.length === 3 ? c.split('').map((x) => x + x).join('') : c, 16);
        return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
      }
    }
    return [0.1882, 0.4549, 0.9961]; // #3074fe
  }, [hoverColor]);

  const hoverColorRef = useRef(resolvedHoverColor);
  useEffect(() => {
    hoverColorRef.current = resolvedHoverColor;
  }, [resolvedHoverColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
      depth: false,
      preserveDrawingBuffer: false,
    });

    if (!gl) {
      console.warn('WebGL2 not supported for BayerDithering');
      return;
    }
    glRef.current = gl;

    // Compile shaders
    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = createShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }
    programRef.current = program;
    gl.useProgram(program);

    // Fullscreen quad buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uColorLoc = gl.getUniformLocation(program, 'uColor');
    const uHoverColorLoc = gl.getUniformLocation(program, 'uHoverColor');
    const uResLoc = gl.getUniformLocation(program, 'uResolution');
    const uTimeLoc = gl.getUniformLocation(program, 'uTime');
    const uPixelSizeLoc = gl.getUniformLocation(program, 'uPixelSize');
    const uShapeTypeLoc = gl.getUniformLocation(program, 'uShapeType');
    const uDirLoc = gl.getUniformLocation(program, 'uDirection');
    const uSpeedLoc = gl.getUniformLocation(program, 'uSpeed');
    const uDensityScaleLoc = gl.getUniformLocation(program, 'uDensityScale');
    const uDensityOffsetLoc = gl.getUniformLocation(program, 'uDensityOffset');
    const uMouseLoc = gl.getUniformLocation(program, 'uMouse');
    const uMouseActiveLoc = gl.getUniformLocation(program, 'uMouseActive');
    const uMagneticRadiusLoc = gl.getUniformLocation(program, 'uMagneticRadius');
    const uMagneticStrengthLoc = gl.getUniformLocation(program, 'uMagneticStrength');
    const uClickPosLoc =
      gl.getUniformLocation(program, 'uClickPos[0]') || gl.getUniformLocation(program, 'uClickPos');
    const uClickTimesLoc =
      gl.getUniformLocation(program, 'uClickTimes[0]') ||
      gl.getUniformLocation(program, 'uClickTimes');
    const uClickLevelsLoc =
      gl.getUniformLocation(program, 'uClickLevels[0]') ||
      gl.getUniformLocation(program, 'uClickLevels');

    // Handle resolution sizing
    const updateSize = () => {
      if (!canvas || !container) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const width = Math.floor(container.clientWidth * dpr);
      const height = Math.floor(container.clientHeight * dpr);
      if (width === 0 || height === 0) return;

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };
    updateSize();

    const ro = new ResizeObserver(() => {
      updateSize();
    });
    ro.observe(container);

    lastTimeRef.current = performance.now();

    // Render loop
    const render = () => {
      rafRef.current = requestAnimationFrame(render);
      const now = performance.now();
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;
      clockRef.current += dt;

      // Smooth magnetic inertia lerp
      mouseRef.current[0] += (targetMouseRef.current[0] - mouseRef.current[0]) * 0.16;
      mouseRef.current[1] += (targetMouseRef.current[1] - mouseRef.current[1]) * 0.16;
      mouseActiveRef.current += (targetActiveRef.current - mouseActiveRef.current) * 0.1;

      gl.useProgram(program);
      gl.viewport(0, 0, canvas.width, canvas.height);

      gl.uniform2f(uResLoc, canvas.width, canvas.height);
      gl.uniform1f(uTimeLoc, clockRef.current);
      gl.uniform3f(uColorLoc, colorRef.current[0], colorRef.current[1], colorRef.current[2]);
      if (uHoverColorLoc) {
        gl.uniform3f(
          uHoverColorLoc,
          hoverColorRef.current[0],
          hoverColorRef.current[1],
          hoverColorRef.current[2]
        );
      }
      gl.uniform1f(uPixelSizeLoc, pixelSizeRef.current);
      gl.uniform1i(uShapeTypeLoc, shapeTypeRef.current);
      gl.uniform1f(uDirLoc, dirRef.current);
      gl.uniform1f(uSpeedLoc, speedRef.current);
      gl.uniform1f(uDensityScaleLoc, densityScaleRef.current);
      gl.uniform1f(uDensityOffsetLoc, densityOffsetRef.current);

      // Magnetic & Hover Uniforms
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      if (uMouseLoc) {
        gl.uniform2f(uMouseLoc, mouseRef.current[0], mouseRef.current[1]);
      }
      if (uMouseActiveLoc) {
        gl.uniform1f(uMouseActiveLoc, mouseActiveRef.current);
      }
      if (uMagneticRadiusLoc) {
        gl.uniform1f(uMagneticRadiusLoc, magneticRadiusRef.current * dpr);
      }
      if (uMagneticStrengthLoc) {
        gl.uniform1f(uMagneticStrengthLoc, magneticStrengthRef.current * dpr);
      }

      if (uClickPosLoc && uClickTimesLoc) {
        gl.uniform2fv(uClickPosLoc, clickPosRef.current);
        gl.uniform1fv(uClickTimesLoc, clickTimesRef.current);
        if (uClickLevelsLoc) {
          gl.uniform1fv(uClickLevelsLoc, clickLevelsRef.current);
        }
      }

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    render();

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      if (positionBuffer) gl.deleteBuffer(positionBuffer);
      if (program) gl.deleteProgram(program);
      if (vs) gl.deleteShader(vs);
      if (fs) gl.deleteShader(fs);
      glRef.current = null;
      programRef.current = null;
    };
  }, []);

  // Click ripple handler
  const triggerRippleAt = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const canvasX = (clientX - rect.left) * dpr;
    const canvasY = (rect.height - (clientY - rect.top)) * dpr;

    const fragX = canvasX - canvas.width * 0.5;
    const fragY = canvasY - canvas.height * 0.5;

    const now = clockRef.current;
    let currentLevel = 1;

    // Check if clicking near the previous click within 1.8s
    const dt = now - lastClickTimeRef.current;
    const dx = fragX - lastClickPosRef.current[0];
    const dy = fragY - lastClickPosRef.current[1];
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dt < 1.8 && dist < 160 * dpr) {
      consecutiveClicksRef.current = Math.min(consecutiveClicksRef.current + 1, 8);
      currentLevel = consecutiveClicksRef.current;
    } else {
      consecutiveClicksRef.current = 1;
      currentLevel = 1;
    }

    lastClickTimeRef.current = now;
    lastClickPosRef.current = [fragX, fragY];

    const slot = clickSlotRef.current;
    clickPosRef.current[slot * 2] = fragX;
    clickPosRef.current[slot * 2 + 1] = fragY;
    clickTimesRef.current[slot] = now;
    clickLevelsRef.current[slot] = currentLevel;
    clickSlotRef.current = (slot + 1) % 10;
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      triggerRippleAt(e.clientX, e.clientY);
    },
    [triggerRippleAt]
  );

  // Pointer movement & hover tracking for magnetic attract and #3074fe glow
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const target =
      container.closest('[data-slot="new-component-preview"]') || container.parentElement || container;

    const handlePointerMove = (e: PointerEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const canvasX = (e.clientX - rect.left) * dpr;
      const canvasY = (rect.height - (e.clientY - rect.top)) * dpr;

      targetMouseRef.current[0] = canvasX - canvas.width * 0.5;
      targetMouseRef.current[1] = canvasY - canvas.height * 0.5;
      targetActiveRef.current = 1.0;
    };

    const handlePointerLeave = () => {
      targetActiveRef.current = 0.0;
    };

    const handleTargetClick = (e: PointerEvent) => {
      triggerRippleAt(e.clientX, e.clientY);
    };

    target.addEventListener('pointermove', handlePointerMove as EventListener, { passive: true });
    target.addEventListener('pointerenter', handlePointerMove as EventListener, { passive: true });
    target.addEventListener('pointerleave', handlePointerLeave as EventListener, { passive: true });
    target.addEventListener('pointerdown', handleTargetClick as EventListener, { passive: true });

    return () => {
      target.removeEventListener('pointermove', handlePointerMove as EventListener);
      target.removeEventListener('pointerenter', handlePointerMove as EventListener);
      target.removeEventListener('pointerleave', handlePointerLeave as EventListener);
      target.removeEventListener('pointerdown', handleTargetClick as EventListener);
    };
  }, [triggerRippleAt]);

  const defaultOpacity = isDark ? 0.78 : 0.24;
  const effectiveOpacity = opacity !== undefined ? opacity : defaultOpacity;

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      className={cn('relative w-full h-full overflow-hidden', className)}
      style={{
        opacity: effectiveOpacity,
        ...style,
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}

export default BayerDithering;

