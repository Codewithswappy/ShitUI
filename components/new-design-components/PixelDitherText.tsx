'use client';

import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

// ─── Color Helper Functions ──────────────────────────────────────────────────
interface RgbColor {
  r: number;
  g: number;
  b: number;
  a?: number;
}

function parseCssColor(color: string, fallback: RgbColor): RgbColor {
  if (!color) return fallback;
  const c = color.trim().toLowerCase();

  if (c.startsWith('#')) {
    let hex = c.slice(1);
    if (hex.length === 3 || hex.length === 4) {
      hex = hex.split('').map((ch) => ch + ch).join('');
    }
    const num = parseInt(hex.slice(0, 6), 16);
    if (isNaN(num)) return fallback;
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    const a = hex.length >= 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;
    return { r, g, b, a };
  }

  const rgbMatch = c.match(/rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\)/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1], 10),
      g: parseInt(rgbMatch[2], 10),
      b: parseInt(rgbMatch[3], 10),
      a: rgbMatch[4] !== undefined ? parseFloat(rgbMatch[4]) : 1,
    };
  }

  if (c === 'blue') return { r: 37, g: 99, b: 235, a: 1 };
  if (c === 'white') return { r: 255, g: 255, b: 255, a: 1 };
  if (c === 'black') return { r: 0, g: 0, b: 0, a: 1 };
  if (c === 'cyan') return { r: 6, g: 182, b: 212, a: 1 };
  if (c === 'emerald') return { r: 16, g: 185, b: 129, a: 1 };
  if (c === 'indigo') return { r: 99, g: 102, b: 241, a: 1 };
  if (c === 'purple') return { r: 168, g: 85, b: 247, a: 1 };

  // Support hsl, oklch, named colors, etc. via canvas context parsing
  if (typeof document !== 'undefined') {
    try {
      const helperCanvas = document.createElement('canvas');
      helperCanvas.width = 1;
      helperCanvas.height = 1;
      const helperCtx = helperCanvas.getContext('2d');
      if (helperCtx) {
        helperCtx.fillStyle = color;
        helperCtx.fillRect(0, 0, 1, 1);
        const data = helperCtx.getImageData(0, 0, 1, 1).data;
        return { r: data[0], g: data[1], b: data[2], a: data[3] / 255 };
      }
    } catch {}
  }

  return fallback;
}

// ─── Liquid Pixel Particle Definition ────────────────────────────────────────
interface LiquidParticle {
  origHomeX: number;
  origHomeY: number;
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  friction: number;
  springStrength: number;
  size: number;
  randomOffset: number;
  splashAbility: number;
}

interface DitherRipple {
  id: number;
  x: number;
  y: number;
  startTime: number;
  duration: number;
  maxRadius: number;
}

export interface PixelDitherTextProps {
  text?: string;
  className?: string;
  style?: React.CSSProperties;
  pixelSize?: number;
  color?: string;
  secondaryColor?: string;
  highlightColor?: string;
  sparkleColor?: string;
  opacity?: number;
  // Dedicated dark mode overrides
  darkColor?: string;
  darkSecondaryColor?: string;
  darkHighlightColor?: string;
  darkSparkleColor?: string;
  darkOpacity?: number;
  density?: number;
  animated?: boolean;
  speed?: number;
  interactive?: boolean;
  rippleEffect?: boolean;
  align?: 'middle' | 'bottom';
  fullWidth?: boolean;
  scale?: number;
  springStretch?: boolean;
  sparkle?: boolean;
  shape?: 'square' | 'circle';
  rippleSpread?: number;
  triggerRipple?: { x: number; y: number; id?: number } | null;
  onStretchChange?: (stretch: number) => void;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export function PixelDitherText({
  text = 'SHITUI',
  className,
  style,
  pixelSize = 3,
  color,
  secondaryColor,
  highlightColor,
  sparkleColor,
  opacity = 1,
  darkColor,
  darkSecondaryColor,
  darkHighlightColor,
  darkSparkleColor,
  darkOpacity,
  density = 1,
  animated = true,
  speed = 0.8,
  interactive = true,
  rippleEffect = true,
  align = 'bottom',
  fullWidth = true,
  scale = 1,
  springStretch = true,
  sparkle = true,
  shape = 'square',
  rippleSpread = 500,
  triggerRipple,
  onStretchChange,
  onClick,
}: PixelDitherTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripplesRef = useRef<DitherRipple[]>([]);
  const particlesRef = useRef<LiquidParticle[]>([]);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: -999, y: -999, active: false });
  const prevMouseRef = useRef<{ x: number; y: number }>({ x: -999, y: -999 });
  const animFrameRef = useRef<number | null>(null);
  const stretchRef = useRef<number>(0);
  const onStretchChangeRef = useRef(onStretchChange);
  onStretchChangeRef.current = onStretchChange;

  const { resolvedTheme } = useTheme();

  // The definitive source of theme truth is whether <html class="dark"> is present
  const [isDark, setIsDark] = React.useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  React.useEffect(() => {
    const checkTheme = () => {
      const hasDark = document.documentElement.classList.contains('dark');
      setIsDark(hasDark);
    };

    checkTheme();

    const observer = new MutationObserver(() => {
      checkTheme();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, [resolvedTheme]);

  const effectiveOpacity = isDark && darkOpacity !== undefined ? darkOpacity : opacity;

  const resolvedColors = useMemo(() => {
    const isDarkMode = isDark;

    const primaryColorStr = isDarkMode
      ? darkColor || color || '#d4d4d4'
      : color || '#c1c1c1';

    const primary = parseCssColor(primaryColorStr, { r: 193, g: 193, b: 193, a: 1 });

    const defaultSecondary: RgbColor = isDarkMode
      ? { r: 96, g: 165, b: 250, a: 1 } // #60A5FA
      : { r: 37, g: 99, b: 235, a: 1 }; // Electric blue #2563EB

    const secondaryColorStr = isDarkMode
      ? darkSecondaryColor || secondaryColor || ''
      : secondaryColor || '';

    const secondary = parseCssColor(secondaryColorStr, defaultSecondary);

    // Highlight / sparkle color for splashing droplets and shimmer
    const defaultHighlight: RgbColor = {
      r: Math.min(255, Math.round(secondary.r * 1.25 + 30)),
      g: Math.min(255, Math.round(secondary.g * 1.25 + 30)),
      b: Math.min(255, Math.round(secondary.b * 1.25 + 30)),
      a: 1,
    };

    const highlightColorStr = isDarkMode
      ? darkHighlightColor || darkSparkleColor || highlightColor || sparkleColor || ''
      : highlightColor || sparkleColor || '';

    const highlight = parseCssColor(highlightColorStr, defaultHighlight);

    return { primary, secondary, highlight };
  }, [
    color,
    secondaryColor,
    highlightColor,
    sparkleColor,
    darkColor,
    darkSecondaryColor,
    darkHighlightColor,
    darkSparkleColor,
    isDark,
  ]);

  // Spawn ripple explosion wave
  const spawnRipple = useCallback(
    (x: number, y: number) => {
      if (!rippleEffect || !interactive) return;
      const now = performance.now();

      ripplesRef.current.push({
        id: Math.random(),
        x,
        y,
        startTime: now,
        duration: 950,
        maxRadius: rippleSpread,
      });

      if (ripplesRef.current.length > 6) {
        ripplesRef.current.shift();
      }
    },
    [rippleEffect, interactive, rippleSpread]
  );

  useEffect(() => {
    if (rippleEffect && triggerRipple) {
      spawnRipple(triggerRipple.x, triggerRipple.y);
    }
  }, [rippleEffect, triggerRipple, spawnRipple]);

  // ─── Spring Overscroll Physics Listener (Scroll Accumulation & Snap Limit) ──
  useEffect(() => {
    if (!springStretch) return;

    let animId: number;
    let stretch = 0;
    let velocity = 0;
    let targetStretch = 0;
    let releaseTimer: NodeJS.Timeout | null = null;
    let hitLimitCount = 0;

    const MAX_STRETCH = 0.52;
    const stiffness = 85;
    const damping = 7.5;

    let isHovered = false;
    const container = containerRef.current;

    const isAtBottom = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const docHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        document.documentElement.offsetHeight,
        document.body.offsetHeight
      );
      return scrollY + windowHeight >= docHeight - 50;
    };

    const triggerSpringRelease = () => {
      targetStretch = 0;
      hitLimitCount = 0;
      if (releaseTimer) {
        clearTimeout(releaseTimer);
        releaseTimer = null;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      const atBottom = isAtBottom() || isHovered;

      if ((atBottom || targetStretch > 0.01 || stretch > 0.01) && e.deltaY > 0) {
        if (releaseTimer) clearTimeout(releaseTimer);

        const remaining = Math.max(0, MAX_STRETCH - targetStretch);
        const resistance = Math.max(0.08, remaining / MAX_STRETCH);

        targetStretch += Math.min(e.deltaY, 160) * 0.0055 * resistance;

        if (targetStretch >= MAX_STRETCH - 0.04) {
          targetStretch = MAX_STRETCH;
          hitLimitCount++;
          if (hitLimitCount >= 2) {
            triggerSpringRelease();
            return;
          }
        }

        releaseTimer = setTimeout(() => {
          triggerSpringRelease();
        }, 190);
      } else if ((targetStretch > 0.01 || stretch > 0.01) && e.deltaY < 0) {
        triggerSpringRelease();
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      if (releaseTimer) clearTimeout(releaseTimer);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const atBottom = isAtBottom() || isHovered;
      const dy = touchStartY - e.touches[0].clientY;
      if ((atBottom || targetStretch > 0.01 || stretch > 0.01) && dy > 0) {
        if (releaseTimer) clearTimeout(releaseTimer);
        const remaining = Math.max(0, MAX_STRETCH - targetStretch);
        const resistance = Math.max(0.08, remaining / MAX_STRETCH);
        targetStretch += Math.min(dy, 60) * 0.006 * resistance;

        if (targetStretch >= MAX_STRETCH - 0.04) {
          targetStretch = MAX_STRETCH;
          hitLimitCount++;
          if (hitLimitCount >= 2) {
            triggerSpringRelease();
            return;
          }
        }

        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = () => {
      triggerSpringRelease();
    };

    let isMouseDown = false;
    let dragStartY = 0;
    const handleMouseDown = (e: MouseEvent) => {
      if (containerRef.current?.contains(e.target as Node)) {
        isMouseDown = true;
        dragStartY = e.clientY;
        if (releaseTimer) clearTimeout(releaseTimer);
      }
    };

    const handleMouseMoveWindow = (e: MouseEvent) => {
      if (isMouseDown) {
        const dy = dragStartY - e.clientY;
        if (dy > 0) {
          const remaining = Math.max(0, MAX_STRETCH - targetStretch);
          const resistance = Math.max(0.08, remaining / MAX_STRETCH);
          targetStretch += Math.min(dy, 40) * 0.006 * resistance;
          dragStartY = e.clientY;

          if (targetStretch >= MAX_STRETCH - 0.04) {
            targetStretch = MAX_STRETCH;
          }
        }
      }
    };

    const handleMouseUpWindow = () => {
      if (isMouseDown) {
        isMouseDown = false;
        triggerSpringRelease();
      }
    };

    const handleMouseEnter = () => { isHovered = true; };
    const handleMouseLeave = () => { isHovered = false; };

    container?.addEventListener('mouseenter', handleMouseEnter);
    container?.addEventListener('mouseleave', handleMouseLeave);

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMoveWindow);
    window.addEventListener('mouseup', handleMouseUpWindow);

    let lastTime = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) * 0.001, 0.035);
      lastTime = now;

      const displacement = stretch - targetStretch;
      const springForce = -stiffness * displacement - damping * velocity;
      velocity += springForce * dt;
      stretch += velocity * dt;

      if (targetStretch === 0) {
        if (stretch < -0.10) {
          stretch = -0.10;
          velocity = 0;
        }
      } else {
        if (stretch < 0) {
          stretch = 0;
          velocity = 0;
        }
      }

      if (stretch > MAX_STRETCH + 0.15) {
        stretch = MAX_STRETCH + 0.15;
      }

      if (targetStretch === 0 && Math.abs(stretch) < 0.001 && Math.abs(velocity) < 0.008) {
        stretch = 0;
        velocity = 0;
      }

      stretchRef.current = stretch;
      onStretchChangeRef.current?.(stretch);
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      if (releaseTimer) clearTimeout(releaseTimer);
      container?.removeEventListener('mouseenter', handleMouseEnter);
      container?.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMoveWindow);
      window.removeEventListener('mouseup', handleMouseUpWindow);
      cancelAnimationFrame(animId);
    };
  }, [springStretch]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    if (rippleEffect) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spawnRipple(x, y);
    }
    onClick?.(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const newX = e.clientX - rect.left;
    const newY = e.clientY - rect.top;

    if (!mouseRef.current.active) {
      prevMouseRef.current = { x: newX, y: newY };
    }

    mouseRef.current = {
      x: newX,
      y: newY,
      active: true,
    };
  };

  const handleMouseLeave = () => {
    mouseRef.current.active = false;
  };

  // Support touch interaction on mobile
  const handleTouchMoveDirect = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!interactive || e.touches.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    const newX = touch.clientX - rect.left;
    const newY = touch.clientY - rect.top;

    if (!mouseRef.current.active) {
      prevMouseRef.current = { x: newX, y: newY };
    }

    mouseRef.current = {
      x: newX,
      y: newY,
      active: true,
    };
  };

  const handleTouchEndDirect = () => {
    mouseRef.current.active = false;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    // Rasterize text to an offscreen buffer and generate discrete liquid pixel particles
    const initParticles = (w: number, h: number) => {
      if (w <= 0 || h <= 0) return;

      const offCanvas = document.createElement('canvas');
      offCanvas.width = w;
      offCanvas.height = h;
      const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
      if (!offCtx) return;

      offCtx.clearRect(0, 0, w, h);

      // Fit text to use canvas width cleanly
      const isMobile = w < 640;
      const effectiveScale = isMobile ? Math.max(scale, 0.94) : scale;
      const targetWidth = w * (fullWidth ? 0.98 : 0.90) * effectiveScale;
      const fontStack =
        'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", "Outfit", sans-serif';
      offCtx.font = `900 100px ${fontStack}`;
      const baseWidth = offCtx.measureText(text).width;
      let fontSize = Math.round(100 * (targetWidth / Math.max(1, baseWidth)));

      const maxFontSize = Math.floor(h * 0.94 * effectiveScale);
      fontSize = Math.min(fontSize, maxFontSize);

      if (!fullWidth) {
        fontSize = Math.min(fontSize, Math.floor(h * 0.48 * effectiveScale));
      }

      offCtx.font = `900 ${fontSize}px ${fontStack}`;
      offCtx.textAlign = 'center';

      let textY = h * 0.5;
      if (align === 'bottom') {
        offCtx.textBaseline = 'alphabetic';
        textY = h - (isMobile ? 22 : 6); // elevated on mobile to stay clear of bottom blur & home bar
      } else {
        offCtx.textBaseline = 'middle';
        textY = h * 0.5;
      }

      offCtx.fillStyle = '#ffffff';
      offCtx.fillText(text, w * 0.5, textY);

      const imgData = offCtx.getImageData(0, 0, w, h);
      const data = imgData.data;

      // Density and sampling step (aiming for ~3,000 to ~4,800 responsive particles)
      const baseStep = Math.max(2, Math.round(pixelSize * 1.05));
      const step = density >= 1 ? baseStep : Math.max(2, Math.round(baseStep / Math.max(0.2, density)));

      const newParticles: LiquidParticle[] = [];

      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          const idx = (y * w + x) * 4 + 3;
          if (data[idx] > 110) {
            const mass = 0.82 + Math.random() * 0.45;
            const friction = 0.90 + Math.random() * 0.035;
            const springStrength = 0.042 + Math.random() * 0.018;

            newParticles.push({
              origHomeX: x,
              origHomeY: y,
              homeX: x,
              homeY: y,
              x: x,
              y: y,
              vx: 0,
              vy: 0,
              mass,
              friction,
              springStrength,
              size: pixelSize,
              randomOffset: Math.random() * Math.PI * 2,
              splashAbility: Math.random() < 0.16 ? 1.6 : 1.0,
            });
          }
        }
      }

      particlesRef.current = newParticles;
    };

    const updateSize = () => {
      if (stretchRef.current > 0.001) return;

      const rect = container.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const newW = Math.floor(rect.width);
      const newH = Math.floor(rect.height);

      if (newW <= 0 || newH <= 0) return;

      const widthChanged = newW !== width;
      const heightChanged = newH !== height;
      width = newW;
      height = newH;

      if (widthChanged || heightChanged || canvas.width === 0) {
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }

      if (widthChanged || heightChanged || particlesRef.current.length === 0) {
        initParticles(width, height);
      }
    };

    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      if (stretchRef.current > 0.001) return;
      updateSize();
    });
    resizeObserver.observe(container);

    window.addEventListener('resize', updateSize);

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        const newX = e.clientX - rect.left;
        const newY = e.clientY - rect.top;

        if (!mouseRef.current.active) {
          prevMouseRef.current = { x: newX, y: newY };
        }

        mouseRef.current = {
          x: newX,
          y: newY,
          active: true,
        };
      } else if (mouseRef.current.active) {
        mouseRef.current.active = false;
      }
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (!interactive || e.touches.length === 0) return;
      const rect = container.getBoundingClientRect();
      const touch = e.touches[0];
      if (
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom
      ) {
        const newX = touch.clientX - rect.left;
        const newY = touch.clientY - rect.top;

        if (!mouseRef.current.active) {
          prevMouseRef.current = { x: newX, y: newY };
        }

        mouseRef.current = {
          x: newX,
          y: newY,
          active: true,
        };
      } else if (mouseRef.current.active) {
        mouseRef.current.active = false;
      }
    };

    const handleGlobalTouchEnd = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });
    window.addEventListener('touchmove', handleGlobalTouchMove, { passive: true });
    window.addEventListener('touchend', handleGlobalTouchEnd, { passive: true });

    const startTime = performance.now();

    const render = (currentTime: number) => {
      if (width <= 0 || height <= 0 || particlesRef.current.length === 0) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const elapsed = (currentTime - startTime) * 0.001 * speed;
      const now = performance.now();

      // Filter active ripples
      const activeRipples = rippleEffect
        ? ripplesRef.current.filter((r) => now - r.startTime < r.duration + 200)
        : [];
      ripplesRef.current = activeRipples;

      const { primary, secondary, highlight } = resolvedColors;
      const mouse = mouseRef.current;
      const currentStretch = stretchRef.current;

      // Mouse velocity
      const cursorVx = mouse.x - prevMouseRef.current.x;
      const cursorVy = mouse.y - prevMouseRef.current.y;
      const cursorSpeed = Math.hypot(cursorVx, cursorVy);
      prevMouseRef.current.x = mouse.x;
      prevMouseRef.current.y = mouse.y;

      const interactionRadius = 105;
      const radiusSq = interactionRadius * interactionRadius;
      const particles = particlesRef.current;

      const drawPx = pixelSize * dpr;
      const halfDrawPx = drawPx * 0.5;
      const isCircle = shape === 'circle';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 1. Interactive Liquid Mouse Force
        if (interactive && mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < radiusSq && distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            const nx = dx / dist;
            const ny = dy / dist;

            // Fluid force falloff: intense near cursor, spreading outwards
            const factor = Math.pow(1 - dist / interactionRadius, 1.45);

            // A. Fluid separation repulsion (pushes pixels apart like fluid)
            const push = (14.5 / p.mass) * factor;
            p.vx += nx * push;
            p.vy += ny * push;

            // B. Fluid velocity transfer (drags fluid in the stroke direction)
            if (cursorSpeed > 0.3) {
              const streamDrag = (0.36 / p.mass) * factor;
              p.vx += cursorVx * streamDrag;
              p.vy += cursorVy * streamDrag;
            }

            // C. Liquid curl turbulence (swirling lateral dispersion)
            const swirlDir = (i % 2 === 0 ? 1 : -1);
            const swirlForce = (cursorSpeed * 0.15 + 1.2) * factor * 0.45;
            p.vx += -ny * swirlDir * swirlForce;
            p.vy += nx * swirlDir * swirlForce;

            // D. Splash droplets: fast cursor flick causes particles to fly upward/outward
            if (cursorSpeed > 5.5 && p.splashAbility > 1.2) {
              p.vy -= (cursorSpeed * 0.35 + 2.5) * factor;
              p.vx += (Math.sin(p.randomOffset) * 4) * factor;
            }
          }
        }

        // 2. Click Shockwave Ripples
        if (rippleEffect) {
          for (let j = 0; j < activeRipples.length; j++) {
            const rip = activeRipples[j];
            const dt = (now - rip.startTime) / rip.duration;
            if (dt < 0 || dt > 1) continue;

            const currentR = dt * rip.maxRadius;
            const rdx = p.x - rip.x;
            const rdy = p.y - rip.y;
            const dist = Math.hypot(rdx, rdy);
            const ringDist = Math.abs(dist - currentR);

            const ringThickness = 32 + (1 - dt) * 20;
            if (ringDist < ringThickness) {
              const crest = Math.exp(-Math.pow(ringDist / (ringThickness * 0.5), 2));
              const fade = Math.sin(dt * Math.PI);
              const pushPower = crest * fade * 11;
              const rnx = dist > 0.01 ? rdx / dist : 0;
              const rny = dist > 0.01 ? rdy / dist : -1;

              p.vx += rnx * pushPower;
              p.vy += rny * pushPower;
            }
          }
        }

        // 3. Spring Overscroll Stretch (Vertical rubber-band displacement)
        if (currentStretch > 0) {
          p.homeY = height - (height - p.origHomeY) * (1 + currentStretch * 0.38);
        } else {
          p.homeY = p.origHomeY;
        }
        p.homeX = p.origHomeX;

        // 4. Elastic Liquid Spring Force (pulls particles smoothly back to letter home)
        const hdx = p.homeX - p.x;
        const hdy = p.homeY - p.y;
        p.vx += hdx * p.springStrength;
        p.vy += hdy * p.springStrength;

        // 5. Liquid Viscosity Damping
        p.vx *= p.friction;
        p.vy *= p.friction;

        // 6. Integrate Position
        p.x += p.vx;
        p.y += p.vy;

        // 7. Dynamic Fluid Color Transition
        const disp = Math.hypot(p.x - p.homeX, p.y - p.homeY);
        const pSpeed = Math.hypot(p.vx, p.vy);

        // Fluid excitation factor: 0 (resting color) to 1 (liquid secondaryColor)
        const t = Math.min(1, Math.max(0, (disp / 22) * 0.72 + (pSpeed / 3.2) * 0.55));

        // Base color interpolated between primary (color) and secondary (secondaryColor)
        let r = Math.round(primary.r + (secondary.r - primary.r) * t);
        let g = Math.round(primary.g + (secondary.g - primary.g) * t);
        let b = Math.round(primary.b + (secondary.b - primary.b) * t);

        // Splashing flying droplet highlight (using user-configured highlightColor!)
        if (t > 0.75 && sparkle && disp > 25) {
          const hRatio = Math.min(1, (disp - 25) / 25);
          r = Math.round(r + (highlight.r - r) * hRatio);
          g = Math.round(g + (highlight.g - g) * hRatio);
          b = Math.round(b + (highlight.b - b) * hRatio);
        }

        // Subtle idle shimmer between color and highlightColor
        if (animated && t < 0.05) {
          const shimmer = Math.sin(p.origHomeX * 0.03 + p.origHomeY * 0.03 + elapsed * 1.5 + p.randomOffset);
          if (shimmer > 0.92) {
            const shift = (shimmer - 0.92) * 1.8;
            r = Math.round(r + (highlight.r - r) * shift);
            g = Math.round(g + (highlight.g - g) * shift);
            b = Math.round(b + (highlight.b - b) * shift);
          }
        }

        // Apply configurable opacity (supporting darkOpacity)
        const finalAlpha = Math.max(0, Math.min(1, effectiveOpacity));
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${finalAlpha})`;

        // Render pixel block strictly at particle position
        if (isCircle) {
          ctx.beginPath();
          ctx.arc(p.x * dpr, p.y * dpr, halfDrawPx * 0.95, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(
            Math.round(p.x * dpr - halfDrawPx),
            Math.round(p.y * dpr - halfDrawPx),
            Math.max(1, drawPx - 0.4),
            Math.max(1, drawPx - 0.4)
          );
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('touchmove', handleGlobalTouchMove);
      window.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, [
    text,
    pixelSize,
    density,
    animated,
    speed,
    interactive,
    rippleEffect,
    align,
    fullWidth,
    scale,
    sparkle,
    shape,
    resolvedColors,
    effectiveOpacity,
  ]);

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchMoveDirect}
      onTouchMove={handleTouchMoveDirect}
      onTouchEnd={handleTouchEndDirect}
      className={cn('relative w-full cursor-pointer select-none overflow-visible', className)}
      style={style}
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full pointer-events-none"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
}

export default PixelDitherText;
