'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

function rgbToHex(rgbStr: string): string {
  if (!rgbStr || rgbStr === 'transparent' || rgbStr === 'rgba(0, 0, 0, 0)') return 'transparent';
  const match = rgbStr.match(/\d+/g);
  if (!match || match.length < 3) return rgbStr;
  const [r, g, b] = match.map(Number);
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('').toUpperCase();
}

function getFontWeightName(weight: string): string {
  const map: Record<string, string> = {
    '100': 'Thin',
    '200': 'Extra Light',
    '300': 'Light',
    '400': 'Regular',
    '500': 'Medium',
    '600': 'Semi Bold',
    '700': 'Bold',
    '800': 'Extra Bold',
    '900': 'Black',
  };
  return map[weight] || weight;
}

// ============================================================================
// MICRO-ICONS FOR BOX MODEL CHIPS (Matching AA, A_, |A| Style)
// ============================================================================

function PaddingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1.5" y="1.5" width="11" height="11" rx="1.5" strokeDasharray="2 2" opacity="0.6" />
      <rect x="4" y="4" width="6" height="6" rx="0.5" fill="currentColor" fillOpacity="0.3" />
    </svg>
  );
}

function MarginIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1.5" y="1.5" width="11" height="11" rx="1.5" strokeDasharray="2 2" stroke="currentColor" />
      <rect x="4" y="4" width="6" height="6" rx="0.5" fill="currentColor" fillOpacity="0.35" stroke="currentColor" />
    </svg>
  );
}

function RadiusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2.5 11.5V6C2.5 4.07 4.07 2.5 6 2.5H11.5" strokeLinecap="round" />
      <circle cx="6" cy="6" r="1" fill="currentColor" />
    </svg>
  );
}

function GapIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="2" width="3" height="10" rx="0.5" fill="currentColor" fillOpacity="0.35" />
      <rect x="9" y="2" width="3" height="10" rx="0.5" fill="currentColor" fillOpacity="0.35" />
      <path d="M5.5 7H8.5" strokeLinecap="round" />
    </svg>
  );
}

interface GapRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface ElementMetrics {
  tagName: string;
  className: string;
  rect: {
    top: number;
    bottom: number;
    left: number;
    right: number;
    width: number;
    height: number;
  };
  contentBox: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
    hasPadding: boolean;
  };
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
    hasMargin: boolean;
  };
  border: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  radius: {
    text: string;
    hasRadius: boolean;
  };
  isFlexOrGrid: boolean;
  displayType: string;
  gapText: string;
  hasGap: boolean;
  gapRects: GapRect[];
  bgColor: string;
  bgHex: string;
  textColor: string;
  textHex: string;
  fontSize: string;
  lineHeight: string;
  letterSpacing: string;
  fontFamily: string;
  fontWeight: string;
}

interface LabInspectorProps {
  enabled: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function LabInspector({ enabled, containerRef }: LabInspectorProps) {
  const [metrics, setMetrics] = useState<ElementMetrics | null>(null);
  const hoveredElRef = useRef<HTMLElement | null>(null);

  // Universal inspector compute logic (works for ANY component: cards, buttons, switches, inputs, dialogs, layouts)
  const computeMetrics = useCallback((target: HTMLElement) => {
    const rect = target.getBoundingClientRect();
    const computed = window.getComputedStyle(target);

    // Numeric Box-Model Offsets
    const pTop = parseFloat(computed.paddingTop) || 0;
    const pRight = parseFloat(computed.paddingRight) || 0;
    const pBottom = parseFloat(computed.paddingBottom) || 0;
    const pLeft = parseFloat(computed.paddingLeft) || 0;

    const mTop = parseFloat(computed.marginTop) || 0;
    const mRight = parseFloat(computed.marginRight) || 0;
    const mBottom = parseFloat(computed.marginBottom) || 0;
    const mLeft = parseFloat(computed.marginLeft) || 0;

    const bTop = parseFloat(computed.borderTopWidth) || 0;
    const bRight = parseFloat(computed.borderRightWidth) || 0;
    const bBottom = parseFloat(computed.borderBottomWidth) || 0;
    const bLeft = parseFloat(computed.borderLeftWidth) || 0;

    // Corner Radius Measurement
    const rTopLeft = Math.round(parseFloat(computed.borderTopLeftRadius) || 0);
    const rTopRight = Math.round(parseFloat(computed.borderTopRightRadius) || 0);
    const rBottomRight = Math.round(parseFloat(computed.borderBottomRightRadius) || 0);
    const rBottomLeft = Math.round(parseFloat(computed.borderBottomLeftRadius) || 0);

    const hasRadius = rTopLeft > 0 || rTopRight > 0 || rBottomRight > 0 || rBottomLeft > 0;
    let radiusText = '';
    if (hasRadius) {
      if (rTopLeft === rTopRight && rTopRight === rBottomRight && rBottomRight === rBottomLeft) {
        radiusText = rTopLeft >= 999 ? 'full' : `${rTopLeft}px`;
      } else {
        radiusText = `${rTopLeft} ${rTopRight} ${rBottomRight} ${rBottomLeft}`;
      }
    }

    // Inner Content Box
    const contentTop = rect.top + bTop + pTop;
    const contentLeft = rect.left + bLeft + pLeft;
    const contentWidth = Math.max(0, rect.width - bLeft - bRight - pLeft - pRight);
    const contentHeight = Math.max(0, rect.height - bTop - bBottom - pTop - pBottom);

    // Flex & Grid Container Detection
    const display = computed.display;
    const isFlexOrGrid =
      display === 'flex' ||
      display === 'inline-flex' ||
      display === 'grid' ||
      display === 'inline-grid';

    // Defined CSS Gaps
    const definedRowGap = parseFloat(computed.rowGap) || parseFloat(computed.gap) || 0;
    const definedColGap = parseFloat(computed.columnGap) || parseFloat(computed.gap) || 0;

    // Calculate Flex & Grid Gaps:
    // Captures BOTH Element Nodes AND Non-Empty Text Nodes (anonymous flex items)
    const gapRects: GapRect[] = [];

    if (isFlexOrGrid && target.childNodes.length > 1) {
      const flexItems: Array<{ rect: DOMRect; el?: HTMLElement }> = [];

      for (let i = 0; i < target.childNodes.length; i++) {
        const node = target.childNodes[i];
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as HTMLElement;
          const s = window.getComputedStyle(el);
          if (s.display !== 'none' && s.visibility !== 'hidden' && s.position !== 'absolute') {
            const r = el.getBoundingClientRect();
            if (r.width > 0 && r.height > 0) {
              flexItems.push({ rect: r, el });
            }
          }
        } else if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent?.trim();
          if (text && text.length > 0) {
            const range = document.createRange();
            range.selectNodeContents(node);
            const r = range.getBoundingClientRect();
            if (r.width > 0 && r.height > 0) {
              flexItems.push({ rect: r });
            }
          }
        }
      }

      if (flexItems.length > 1) {
        // Group items into rows by vertical overlap
        const rows: Array<{ top: number; bottom: number; items: typeof flexItems }> = [];
        for (const item of flexItems) {
          let placed = false;
          for (const r of rows) {
            if (item.rect.bottom > r.top && item.rect.top < r.bottom) {
              r.items.push(item);
              r.top = Math.min(r.top, item.rect.top);
              r.bottom = Math.max(r.bottom, item.rect.bottom);
              placed = true;
              break;
            }
          }
          if (!placed) {
            rows.push({
              top: item.rect.top,
              bottom: item.rect.bottom,
              items: [item],
            });
          }
        }

        // Sort rows top-to-bottom
        rows.sort((a, b) => a.top - b.top);

        // 1. Measure horizontal gaps:
        // Capped by definedColGap so child margins don't falsely enlarge the gap
        for (const r of rows) {
          r.items.sort((a, b) => a.rect.left - b.rect.left);
          for (let i = 0; i < r.items.length - 1; i++) {
            const a = r.items[i].rect;
            const b = r.items[i + 1].rect;
            if (b.left > a.right) {
              const rawWidth = b.left - a.right;
              const gapWidth = definedColGap > 0 ? Math.min(definedColGap, rawWidth) : rawWidth;
              gapRects.push({
                left: a.right,
                top: r.top,
                width: gapWidth,
                height: r.bottom - r.top,
              });
            }
          }
        }

        // 2. Measure vertical gaps:
        // Capped by definedRowGap so child margins (like mt-2) are NOT falsely shaded as flex gap!
        for (let i = 0; i < rows.length - 1; i++) {
          const prevRow = rows[i];
          const nextRow = rows[i + 1];
          if (nextRow.top > prevRow.bottom) {
            const rawHeight = nextRow.top - prevRow.bottom;
            const gapHeight = definedRowGap > 0 ? Math.min(definedRowGap, rawHeight) : rawHeight;
            gapRects.push({
              left: contentLeft,
              top: prevRow.bottom,
              width: contentWidth,
              height: gapHeight,
            });
          }
        }
      }
    }

    const hasGapVal = computed.gap !== 'normal' && parseFloat(computed.gap) > 0;
    const hasSpaceBetween =
      isFlexOrGrid &&
      (computed.justifyContent === 'space-between' ||
        computed.justifyContent === 'space-around' ||
        computed.justifyContent === 'space-evenly');

    const gapText = hasGapVal
      ? computed.gap
      : hasSpaceBetween
      ? computed.justifyContent
      : gapRects.length > 0
      ? 'flex gap'
      : '';

    const lh =
      computed.lineHeight === 'normal'
        ? 'normal'
        : `${Math.round(parseFloat(computed.lineHeight) || 0)}px`;
    const ls =
      computed.letterSpacing === 'normal'
        ? '0px'
        : `${Math.round(parseFloat(computed.letterSpacing) || 0)}px`;

    const fontClean =
      computed.fontFamily.split(',')[0]?.replace(/["']/g, '').trim() || 'System UI';

    setMetrics({
      tagName: target.tagName.toLowerCase(),
      className:
        target.className && typeof target.className === 'string'
          ? target.className.slice(0, 30)
          : '',
      rect: {
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right,
        width: Math.round(rect.width * 10) / 10,
        height: Math.round(rect.height * 10) / 10,
      },
      contentBox: {
        top: contentTop,
        left: contentLeft,
        width: contentWidth,
        height: contentHeight,
      },
      padding: {
        top: Math.round(pTop),
        right: Math.round(pRight),
        bottom: Math.round(pBottom),
        left: Math.round(pLeft),
        hasPadding: pTop > 0 || pRight > 0 || pBottom > 0 || pLeft > 0,
      },
      margin: {
        top: Math.round(mTop),
        right: Math.round(mRight),
        bottom: Math.round(mBottom),
        left: Math.round(mLeft),
        hasMargin: mTop > 0 || mRight > 0 || mBottom > 0 || mLeft > 0,
      },
      border: {
        top: bTop,
        right: bRight,
        bottom: bBottom,
        left: bLeft,
      },
      radius: {
        text: radiusText,
        hasRadius,
      },
      isFlexOrGrid,
      displayType: display,
      gapText,
      hasGap: gapRects.length > 0 || hasGapVal || hasSpaceBetween,
      gapRects,
      bgColor: computed.backgroundColor,
      bgHex: rgbToHex(computed.backgroundColor),
      textColor: computed.color,
      textHex: rgbToHex(computed.color),
      fontSize: computed.fontSize,
      lineHeight: lh,
      letterSpacing: ls,
      fontFamily: fontClean,
      fontWeight: getFontWeightName(computed.fontWeight),
    });
  }, []);

  // Pointer tracking & Scroll / Resize Synchronization
  useEffect(() => {
    if (!enabled || !containerRef.current) {
      setMetrics(null);
      hoveredElRef.current = null;
      return;
    }

    const container = containerRef.current;
    let resizeObserver: ResizeObserver | null = null;

    const handlePointerMove = (e: MouseEvent) => {
      const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;

      if (!target || !container.contains(target) || target === container) {
        setMetrics(null);
        if (hoveredElRef.current && resizeObserver) {
          resizeObserver.unobserve(hoveredElRef.current);
        }
        hoveredElRef.current = null;
        return;
      }

      if (target.closest('[data-lab-inspector="true"]')) {
        return;
      }

      if (target !== hoveredElRef.current) {
        if (hoveredElRef.current && resizeObserver) {
          resizeObserver.unobserve(hoveredElRef.current);
        }
        hoveredElRef.current = target;
        computeMetrics(target);

        if (resizeObserver && target) {
          resizeObserver.observe(target);
        }
      } else {
        computeMetrics(target);
      }
    };

    resizeObserver = new ResizeObserver(() => {
      if (hoveredElRef.current) {
        computeMetrics(hoveredElRef.current);
      }
    });

    const handleScrollOrResize = () => {
      if (hoveredElRef.current) {
        computeMetrics(hoveredElRef.current);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', handleScrollOrResize, { passive: true, capture: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
      if (hoveredElRef.current && resizeObserver) {
        resizeObserver.unobserve(hoveredElRef.current);
      }
      resizeObserver?.disconnect();
    };
  }, [enabled, containerRef, computeMetrics]);

  if (!enabled || !metrics) return null;

  const {
    rect,
    contentBox,
    padding,
    margin,
    border,
    radius,
    isFlexOrGrid,
    gapText,
    hasGap,
    gapRects,
    fontSize,
    lineHeight,
    letterSpacing,
    fontFamily,
    fontWeight,
    bgHex,
    bgColor,
    textHex,
    textColor,
  } = metrics;

  // Tooltip HUD dimensions & clean placement (fully responsive on mobile)
  const cardWidth =
    typeof window !== 'undefined'
      ? Math.min(350, Math.max(260, window.innerWidth - 24))
      : 350;
  const hasExtraRow =
    padding.hasPadding ||
    margin.hasMargin ||
    hasGap ||
    radius.hasRadius ||
    bgHex !== 'transparent';
  const estimatedHeight = hasExtraRow ? 135 : 85;

  // Smart Direction: Automatically places HUD opposite to the component's body so it never covers it!
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 900;
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;

  // Outer bounds including margin (so HUD never overlaps margin overlays)
  const elementOuterTop = rect.top - margin.top;
  const elementOuterBottom = rect.bottom + margin.bottom;

  const topDockClearance = 76; // Keep clear of top floating toolbar dock (y=0 to y=64)
  const spaceAbove = elementOuterTop - topDockClearance;
  const spaceBelow = viewportHeight - elementOuterBottom - 16;

  let placeBelow = true;

  if (spaceBelow < estimatedHeight + 10) {
    // Not enough room below -> must place above
    placeBelow = false;
  } else if (spaceAbove < estimatedHeight + 10) {
    // Not enough room above without hitting the top floating dock -> must place below
    placeBelow = true;
  } else if (containerRef.current) {
    const containerRect = containerRef.current.getBoundingClientRect();
    const elementCenterY = (rect.top + rect.bottom) / 2;
    const containerCenterY = (containerRect.top + containerRect.bottom) / 2;

    // Smart opposite direction:
    // If element is in upper half of component, show info card BELOW it so top header/badge is not blocked!
    // If element is in lower half of component, if room below exists, dock into open canvas below, else above.
    if (elementCenterY < containerCenterY) {
      placeBelow = true;
    } else {
      placeBelow = spaceBelow >= estimatedHeight + 20;
    }
  } else {
    // Default DevTools: place below unless near screen bottom
    placeBelow = spaceBelow >= estimatedHeight + 10;
  }

  // Anchor point:
  // If placing below: top edge at elementOuterBottom + 8, clamped so bottom never overflows screen
  // If placing above: bottom edge anchored 8px above elementOuterTop via translate: 0 -100%,
  // clamped so top never hits the top floating dock!
  const top = placeBelow
    ? Math.min(viewportHeight - estimatedHeight - 12, elementOuterBottom + 8)
    : Math.max(topDockClearance + estimatedHeight + 8, elementOuterTop - 8);

  // Horizontal smart alignment: center HUD on small elements, align left on wide elements
  let left = rect.width > cardWidth + 24
    ? rect.left + 4
    : rect.left + (rect.width - cardWidth) / 2;
  left = Math.max(16, Math.min(viewportWidth - cardWidth - 16, left));

  return (
    <div
      id="lab-inspector-overlay"
      data-lab-inspector="true"
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden select-none"
    >
      {/* =========================================================================
          1. MARGIN OVERLAYS (DevTools Orange #f6b26b / rgba(246, 178, 107, 0.45))
          Rendered strictly outside the element bounds.
         ========================================================================= */}
      {margin.hasMargin && (
        <>
          {/* Top Margin */}
          {margin.top > 0 && (
            <div
              className="absolute bg-[#f6b26b]/40 border-t border-dashed border-[#f6b26b]/70"
              style={{
                top: rect.top - margin.top,
                left: rect.left - margin.left,
                width: rect.width + margin.left + margin.right,
                height: margin.top,
              }}
            />
          )}
          {/* Bottom Margin */}
          {margin.bottom > 0 && (
            <div
              className="absolute bg-[#f6b26b]/40 border-b border-dashed border-[#f6b26b]/70"
              style={{
                top: rect.bottom,
                left: rect.left - margin.left,
                width: rect.width + margin.left + margin.right,
                height: margin.bottom,
              }}
            />
          )}
          {/* Left Margin */}
          {margin.left > 0 && (
            <div
              className="absolute bg-[#f6b26b]/40 border-l border-dashed border-[#f6b26b]/70"
              style={{
                top: rect.top,
                left: rect.left - margin.left,
                width: margin.left,
                height: rect.height,
              }}
            />
          )}
          {/* Right Margin */}
          {margin.right > 0 && (
            <div
              className="absolute bg-[#f6b26b]/40 border-r border-dashed border-[#f6b26b]/70"
              style={{
                top: rect.top,
                left: rect.right,
                width: margin.right,
                height: rect.height,
              }}
            />
          )}
        </>
      )}

      {/* =========================================================================
          2. PADDING OVERLAYS (DevTools Green #c3deb7 / rgba(147, 196, 125, 0.55))
          Placed between the border edge and content edge.
         ========================================================================= */}
      {padding.hasPadding && (
        <div
          className="absolute bg-[#c3deb7]/55"
          style={{
            top: rect.top + border.top,
            left: rect.left + border.left,
            width: rect.width - border.left - border.right,
            height: rect.height - border.top - border.bottom,
          }}
        />
      )}

      {/* =========================================================================
          3. INNER CONTENT BOX (DevTools Blue #96c4ea / rgba(111, 168, 220, 0.5))
          NOTE: rounded-none is explicitly used so the inspect overlay does NOT round corners.
         ========================================================================= */}
      <div
        className={
          isFlexOrGrid
            ? 'absolute bg-[#96c4ea]/45 border border-dashed border-[#8b5cf6] transition-all duration-75 rounded-none'
            : 'absolute bg-[#96c4ea]/50 border-[1.5px] border-[#3074fe] transition-all duration-75 rounded-none'
        }
        style={{
          top: contentBox.top,
          left: contentBox.left,
          width: contentBox.width,
          height: contentBox.height,
        }}
      >
        {/* Corner handles only on standard non-flex elements */}
        {!isFlexOrGrid && (
          <>
            <div className="absolute -top-[3px] -left-[3px] h-[6px] w-[6px] border border-[#3074fe] bg-white shadow-xs" />
            <div className="absolute -top-[3px] -right-[3px] h-[6px] w-[6px] border border-[#3074fe] bg-white shadow-xs" />
            <div className="absolute -bottom-[3px] -left-[3px] h-[6px] w-[6px] border border-[#3074fe] bg-white shadow-xs" />
            <div className="absolute -bottom-[3px] -right-[3px] h-[6px] w-[6px] border border-[#3074fe] bg-white shadow-xs" />
          </>
        )}
      </div>

      {/* =========================================================================
          4. FLEX & GRID GAPS (DevTools Purple Diagonal Stripes + Dashed Border)
          Spans strictly the defined CSS gap between adjacent items and rows!
         ========================================================================= */}
      {gapRects.map((gr, idx) => (
        <div
          key={`gap-${idx}`}
          className="absolute pointer-events-none border border-dashed border-[#8b5cf6] bg-[#8b5cf6]/20"
          style={{
            top: gr.top,
            left: gr.left,
            width: gr.width,
            height: gr.height,
            backgroundImage:
              'repeating-linear-gradient(45deg, rgba(139, 92, 246, 0.45) 0px, rgba(139, 92, 246, 0.45) 3px, transparent 3px, transparent 7px)',
          }}
        />
      ))}

      {/* =========================================================================
          5. ELEMENT INFO CARD (NO BORDER, SLIGHTLY BIG YET COMPACT, PADDING ON SIDES)
         ========================================================================= */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.1 }}
          style={{
            top,
            left,
            width: cardWidth,
            translate: placeBelow ? undefined : '0 -100%',
          }}
          className="absolute z-50 rounded-2xl bg-white/95 px-4.5 py-3 shadow-[0_12px_36px_rgba(0,0,0,0.12)] backdrop-blur-2xl dark:bg-neutral-900/95 dark:shadow-[0_16px_40px_rgba(0,0,0,0.7)] font-sans select-none border-0"
        >
          {/* Row 1: [T] Icon + Typography Name & Weight + Dimension Badge */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-[10px] font-medium text-neutral-700 dark:text-neutral-300">
                T
              </span>
              <span className="truncate text-xs font-normal text-neutral-800 dark:text-neutral-200">
                {fontFamily} - {fontWeight}
              </span>
            </div>

            <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 font-mono text-[10px] font-normal text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
              {rect.width} × {rect.height}
            </span>
          </div>

          {/* Row 2: Typography Metrics & Color Swatch (AA, A_, |A|, Hex) */}
          <div className="mt-2 flex items-center justify-between text-xs font-mono text-neutral-600 dark:text-neutral-300">
            <div className="flex items-center gap-3">
              <span title="Font Size" className="flex items-center gap-0.5">
                <span className="text-[10px] font-normal text-neutral-400">AA</span>
                <span className="font-normal text-neutral-800 dark:text-neutral-200">{fontSize}</span>
              </span>

              <span title="Line Height (Leading)" className="flex items-center gap-0.5">
                <span className="text-[10px] font-normal text-neutral-400">A_</span>
                <span className="font-normal">{lineHeight}</span>
              </span>

              <span title="Letter Spacing (Tracking)" className="flex items-center gap-0.5">
                <span className="text-[10px] font-normal text-neutral-400">|A|</span>
                <span className="font-normal">{letterSpacing}</span>
              </span>
            </div>

            {/* Color Swatch & Hex Badge */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span
                className="h-3.5 w-3.5 rounded-full border border-neutral-300 dark:border-neutral-700 shadow-xs"
                style={{ backgroundColor: textColor }}
              />
              <span className="text-[11px] font-normal text-neutral-800 dark:text-neutral-200">
                {textHex}
              </span>
            </div>
          </div>

          {/* Row 3: Box Model Chips with Icons (Margin, Padding, Radius, Gap, Background) */}
          {hasExtraRow && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5 border-t border-neutral-100/80 pt-2 font-mono text-[9.5px] dark:border-neutral-800/80">
              {/* Padding Chip with Icon */}
              {padding.hasPadding && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-700 dark:text-emerald-300 font-normal">
                  <PaddingIcon className="h-2.5 w-2.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>pad: {padding.top} {padding.right} {padding.bottom} {padding.left}</span>
                </span>
              )}

              {/* Margin Chip with Icon */}
              {margin.hasMargin && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-amber-700 dark:text-amber-300 font-normal">
                  <MarginIcon className="h-2.5 w-2.5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>mar: {margin.top} {margin.right} {margin.bottom} {margin.left}</span>
                </span>
              )}

              {/* Border Radius Chip with Icon */}
              {radius.hasRadius && (
                <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/10 px-2 py-0.5 text-sky-700 dark:text-sky-300 font-normal">
                  <RadiusIcon className="h-2.5 w-2.5 shrink-0 text-sky-600 dark:text-sky-400" />
                  <span>rad: {radius.text}</span>
                </span>
              )}

              {/* Gap Chip with Icon */}
              {hasGap && gapText && (
                <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2 py-0.5 text-purple-700 dark:text-purple-300 font-normal">
                  <GapIcon className="h-2.5 w-2.5 shrink-0 text-purple-600 dark:text-purple-400" />
                  <span>gap: {gapText}</span>
                </span>
              )}

              {/* Background Color Chip */}
              {bgHex !== 'transparent' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 text-neutral-600 dark:text-neutral-300 font-normal">
                  <span
                    className="h-2 w-2 rounded-full border border-neutral-300 dark:border-neutral-700"
                    style={{ backgroundColor: bgColor }}
                  />
                  <span>bg: {bgHex}</span>
                </span>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default LabInspector;
