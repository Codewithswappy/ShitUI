'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
} from 'motion/react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePreviewStage } from './preview-context';

export interface SidebarItem {
  title: string;
  href: string;
  badge?: string;
  depth?: number;
}

export interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

export interface DocsSidebarProps extends React.ComponentProps<'nav'> {
  sections: SidebarSection[];
  onLinkClick?: () => void;
  containerRef?: React.RefObject<HTMLElement | null>;
  variant?: 'full' | 'floating';
  animatedSteps?: boolean;
  fadeEdges?: boolean;
  isOpen?: boolean;
  className?: string;
}

const RAIL_X = 11;
const BUMP_WIDTH = 10;
const BUMP_HEIGHT = 16;
const DOT_OFFSET = 3.5;
const DOT_RADIUS = 2.2;
const LABEL_GAP = 9;

// Spring physics: fast leading apex, heavier lagging trail
const LEAD_SPRING = { stiffness: 260, damping: 26, mass: 0.65 };
const TRAIL_SPRING = { stiffness: 140, damping: 24, mass: 1.35 };

const useIsoLayoutEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

/**
 * Builds the smooth organic curve / bump path protruding towards the active text,
 * exactly matching the user's hand-drawn concept:
 * - 'full' (default): Continuous vertical line running the full length of the sidebar with curve at active item.
 * - 'floating': Localized curve segment around the active item that fades in and out.
 */
function buildOrganicCurvePath(
  railX: number,
  leadY: number,
  trailY: number,
  totalHeight: number,
  hasTarget: boolean,
  variant: 'full' | 'floating' = 'full'
): { d: string; topY: number; botY: number } {
  if (!hasTarget || totalHeight <= 0) {
    return {
      d: variant === 'full' ? `M ${railX} 0 L ${railX} ${totalHeight}` : '',
      topY: 0,
      botY: 0,
    };
  }

  const span = Math.abs(leadY - trailY);
  const apexY = leadY;
  const apexX = railX + BUMP_WIDTH;

  if (variant === 'floating') {
    const trailExtend = Math.max(34, 26 + span * 0.45);
    const topY = Math.max(0, Math.min(leadY, trailY) - trailExtend);
    const botY = Math.min(totalHeight, Math.max(leadY, trailY) + trailExtend);

    const d = [
      `M ${railX} ${topY.toFixed(1)}`,
      `L ${railX} ${(apexY - BUMP_HEIGHT).toFixed(1)}`,
      `C ${railX} ${(apexY - BUMP_HEIGHT * 0.45).toFixed(1)}, ${apexX} ${(apexY - BUMP_HEIGHT * 0.45).toFixed(1)}, ${apexX} ${apexY.toFixed(1)}`,
      `C ${apexX} ${(apexY + BUMP_HEIGHT * 0.45).toFixed(1)}, ${railX} ${(apexY + BUMP_HEIGHT * 0.45).toFixed(1)}, ${railX} ${(apexY + BUMP_HEIGHT).toFixed(1)}`,
      `L ${railX} ${botY.toFixed(1)}`,
    ].join(' ');

    return { d, topY, botY };
  }

  // variant === 'full': Full-height line running down the entire sidebar with curve at active item
  const topY = 0;
  const botY = totalHeight;

  const d = [
    `M ${railX} 0`,
    `L ${railX} ${(apexY - BUMP_HEIGHT).toFixed(1)}`,
    `C ${railX} ${(apexY - BUMP_HEIGHT * 0.45).toFixed(1)}, ${apexX} ${(apexY - BUMP_HEIGHT * 0.45).toFixed(1)}, ${apexX} ${apexY.toFixed(1)}`,
    `C ${apexX} ${(apexY + BUMP_HEIGHT * 0.45).toFixed(1)}, ${railX} ${(apexY + BUMP_HEIGHT * 0.45).toFixed(1)}, ${railX} ${(apexY + BUMP_HEIGHT).toFixed(1)}`,
    `L ${railX} ${totalHeight.toFixed(1)}`,
  ].join(' ');

  return { d, topY, botY };
}

function findScrollParent(node: HTMLElement | null): HTMLElement | Window {
  if (!node) return window;
  let parent = node.parentElement;
  while (parent) {
    const style = window.getComputedStyle(parent);
    if (
      style.overflowY === 'auto' ||
      style.overflowY === 'scroll' ||
      parent.classList.contains('overflow-y-auto')
    ) {
      return parent;
    }
    parent = parent.parentElement;
  }
  return window;
}

export function DocsSidebar({
  className,
  sections,
  onLinkClick,
  containerRef,
  variant = 'full',
  animatedSteps = false,
  fadeEdges = true,
  isOpen = true,
  ...props
}: DocsSidebarProps) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const { setIsInfoOpen, setIsCodeOpen } = usePreviewStage();

  // Flatten items for measuring and index tracking across sections
  const flatItems = React.useMemo(() => {
    const list: Array<
      SidebarItem & {
        sectionTitle: string;
        sectionIndex: number;
        isFirstInSection: boolean;
        globalIndex: number;
      }
    > = [];
    let count = 0;
    sections.forEach((sec, sIdx) => {
      sec.items.forEach((item, iIdx) => {
        list.push({
          ...item,
          sectionTitle: sec.title,
          sectionIndex: sIdx,
          isFirstInSection: iIdx === 0,
          globalIndex: count++,
        });
      });
    });
    return list;
  }, [sections]);

  const activeIndex = flatItems.findIndex((item) => pathname === item.href);
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const [clickedIndex, setClickedIndex] = React.useState<number | null>(null);

  // Clear clicked item lock once the new pathname has finished loading
  React.useEffect(() => {
    setClickedIndex(null);
  }, [pathname]);

  // Target item driving the curve:
  // 1. clicked item (locked during route transition so it never jumps back to old page)
  // 2. hovered item while browsing
  // 3. active route
  const targetIndex =
    clickedIndex !== null
      ? clickedIndex
      : hoveredIndex !== null
      ? hoveredIndex
      : activeIndex !== -1
      ? activeIndex
      : 0;

  const hasTarget = flatItems.length > 0 && targetIndex >= 0;

  const listRef = React.useRef<HTMLDivElement>(null);
  const rowRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const baseRailRef = React.useRef<SVGLineElement>(null);
  const curvePathRef = React.useRef<SVGPathElement>(null);
  const trailGradRef = React.useRef<SVGLinearGradientElement>(null);
  const activeDotRef = React.useRef<SVGCircleElement>(null);

  const [rowYs, setRowYs] = React.useState<number[]>([]);
  const [listHeight, setListHeight] = React.useState(0);

  // Target Y motion values with spring physics
  const initialY = rowYs[targetIndex] ?? 24;
  const targetMotionY = useMotionValue(initialY);

  const leadSpringY = useSpring(targetMotionY, LEAD_SPRING);
  const trailSpringY = useSpring(targetMotionY, TRAIL_SPRING);

  const leadY = reduceMotion ? targetMotionY : leadSpringY;
  const trailY = reduceMotion ? targetMotionY : trailSpringY;

  const isInitializedRef = React.useRef(false);

  // Measure row center positions relative to listRef using viewport coordinates (immune to offsetParent / transforms)
  const measure = React.useCallback(() => {
    if (!listRef.current) return;
    const listRect = listRef.current.getBoundingClientRect();
    const height = listRef.current.offsetHeight;
    const ys = flatItems.map((_, i) => {
      const row = rowRefs.current[i];
      if (!row) return 0;
      const rowRect = row.getBoundingClientRect();
      return rowRect.top - listRect.top + rowRect.height / 2;
    });
    setRowYs(ys);
    setListHeight(height);

    if (!isInitializedRef.current && ys[targetIndex] !== undefined && ys[targetIndex] > 0) {
      isInitializedRef.current = true;
      targetMotionY.set(ys[targetIndex]);
      if ('jump' in leadSpringY) (leadSpringY as any).jump(ys[targetIndex]);
      if ('jump' in trailSpringY) (trailSpringY as any).jump(ys[targetIndex]);
    }
  }, [flatItems, targetIndex, targetMotionY, leadSpringY, trailSpringY]);

  // Real-time hover handler that immediately sets spring target to exact hovered row
  const handleHover = React.useCallback(
    (index: number | null) => {
      setHoveredIndex(index);
      const targetIdx =
        clickedIndex !== null
          ? clickedIndex
          : index !== null
          ? index
          : (activeIndex !== -1 ? activeIndex : 0);
      const row = rowRefs.current[targetIdx];
      if (row && listRef.current) {
        const listRect = listRef.current.getBoundingClientRect();
        const rowRect = row.getBoundingClientRect();
        const y = rowRect.top - listRect.top + rowRect.height / 2;
        if (!isNaN(y) && y > 0) {
          targetMotionY.set(y);
        }
      } else if (rowYs[targetIdx] !== undefined && rowYs[targetIdx] > 0) {
        targetMotionY.set(rowYs[targetIdx]);
      }
    },
    [clickedIndex, activeIndex, targetMotionY, rowYs]
  );

  const handleItemClick = React.useCallback(
    (idx: number) => {
      setClickedIndex(idx);
      setIsInfoOpen(false);
      setIsCodeOpen(false);
      const row = rowRefs.current[idx];
      if (row && listRef.current) {
        const listRect = listRef.current.getBoundingClientRect();
        const rowRect = row.getBoundingClientRect();
        const y = rowRect.top - listRect.top + rowRect.height / 2;
        if (!isNaN(y) && y > 0) {
          targetMotionY.set(y);
        }
      } else if (rowYs[idx] !== undefined && rowYs[idx] > 0) {
        targetMotionY.set(rowYs[idx]);
      }
      onLinkClick?.();
    },
    [rowYs, targetMotionY, onLinkClick, setIsInfoOpen, setIsCodeOpen]
  );

  useIsoLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (listRef.current) ro.observe(listRef.current);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => ro.disconnect();
  }, [measure]);

  // Re-measure as stepped entrance animations settle
  React.useEffect(() => {
    if (animatedSteps && isOpen) {
      const t1 = setTimeout(measure, 80);
      const t2 = setTimeout(measure, 220);
      const t3 = setTimeout(measure, 450);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [measure, animatedSteps, isOpen]);

  // Update spring target when active route or row measurements change (while not hovering)
  React.useEffect(() => {
    if (hoveredIndex === null && hasTarget && rowYs[targetIndex] !== undefined && rowYs[targetIndex] > 0) {
      targetMotionY.set(rowYs[targetIndex]);
    }
  }, [targetIndex, rowYs, hasTarget, hoveredIndex, targetMotionY]);

  // Real-time 60fps SVG manipulation without React re-renders
  const updateSVG = React.useCallback(() => {
    if (!isOpen) {
      if (curvePathRef.current) curvePathRef.current.setAttribute('opacity', '0');
      if (activeDotRef.current) activeDotRef.current.setAttribute('opacity', '0');
      return;
    }

    const lY = leadY.get();
    const tY = trailY.get();

    if (hasTarget && listHeight > 0) {
      const { d, topY, botY } = buildOrganicCurvePath(RAIL_X, lY, tY, listHeight, true, variant);

      // 1. Update Organic Curve Path
      if (curvePathRef.current) {
        curvePathRef.current.setAttribute('d', d);
        curvePathRef.current.setAttribute('opacity', '1');
      }

      // 2. Update Trail Gradient coordinates for smooth start and end fade (in floating mode)
      if (trailGradRef.current && variant === 'floating') {
        trailGradRef.current.setAttribute('y1', `${topY}`);
        trailGradRef.current.setAttribute('y2', `${botY}`);
      }

      // 3. Update ONLY the Active Dot positioned right beside the curve apex
      if (activeDotRef.current) {
        activeDotRef.current.setAttribute('cx', `${RAIL_X + BUMP_WIDTH + DOT_OFFSET}`);
        activeDotRef.current.setAttribute('cy', `${lY}`);
        activeDotRef.current.setAttribute('opacity', '1');
      }
    } else {
      if (curvePathRef.current) curvePathRef.current.setAttribute('opacity', '0');
      if (activeDotRef.current) activeDotRef.current.setAttribute('opacity', '0');
    }
  }, [leadY, trailY, hasTarget, listHeight, variant, isOpen]);

  useMotionValueEvent(leadY, 'change', updateSVG);
  useMotionValueEvent(trailY, 'change', updateSVG);

  React.useEffect(() => {
    updateSVG();
  }, [updateSVG, listHeight, isOpen]);

  // Scroll active item into view on load if below viewport
  React.useEffect(() => {
    if (activeIndex !== -1 && rowRefs.current[activeIndex]) {
      const el = rowRefs.current[activeIndex];
      const scroller = containerRef?.current ?? findScrollParent(listRef.current);
      if (el && scroller !== window) {
        const scrollerRect = (scroller as HTMLElement).getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        if (elRect.top < scrollerRect.top || elRect.bottom > scrollerRect.bottom) {
          el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }
    }
  }, [activeIndex, containerRef]);

  const railColor = '[--rail:var(--primary,#3074fe)]';
  const maskId = `rail-line-fade-${React.useId().replace(/[^\w-]/g, '')}`;

  // Top and bottom 14px subtle soft fade calculation (valid SVG 0-1 fractions)
  const topFadeOffset = listHeight > 0 ? Math.min(0.04, 14 / listHeight).toFixed(4) : '0.02';
  const botFadeOffset = listHeight > 0 ? Math.max(0.96, (listHeight - 14) / listHeight).toFixed(4) : '0.98';

  return (
    <nav
      data-slot="docs-sidebar"
      aria-label="Docs Navigation"
      className={cn(
        'relative w-full text-sm select-none pt-2 pb-6',
        fadeEdges && '[mask-image:linear-gradient(to_bottom,transparent_0px,black_20px,black_calc(100%-24px),transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0px,black_20px,black_calc(100%-24px),transparent_100%)]',
        railColor,
        className 
      )}
      onMouseLeave={() => handleHover(null)}
      {...props}
    >
      <div ref={listRef} className="relative">
        {/* SVG Container: Soft Faded Guide Rail + Dynamic Active Curve & Outside Dot */}
        {listHeight > 0 && (
          <motion.svg
            initial={false}
            animate={{ opacity: isOpen ? 1 : 0 }}
            transition={{ duration: 0.18, ease: 'easeInOut' }}
            className="pointer-events-none absolute top-0 left-0 overflow-visible z-10"
            width={RAIL_X + BUMP_WIDTH + DOT_OFFSET + 12}
            height={listHeight}
            aria-hidden="true"
          >
            <defs>
              {/* Very small soft fade at start (top) and end (bottom) of the line */}
              <linearGradient
                id={`${maskId}-base-grad`}
                x1="0"
                y1="0"
                x2="0"
                y2={listHeight}
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="white" stopOpacity="0" />
                <stop offset={topFadeOffset} stopColor="white" stopOpacity="1" />
                <stop offset={botFadeOffset} stopColor="white" stopOpacity="1" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <mask id={`${maskId}-base-mask`}>
                <rect
                  x={-20}
                  y={0}
                  width={RAIL_X + BUMP_WIDTH + DOT_OFFSET + 40}
                  height={listHeight}
                  fill={`url(#${maskId}-base-grad)`}
                />
              </mask>

              {/* Active Trail Line Gradient for floating mode: Soft fade on start of trail line and end of the trail */}
              <linearGradient
                ref={trailGradRef}
                id={`${maskId}-trail-grad`}
                x1={RAIL_X}
                y1="0"
                x2={RAIL_X}
                y2="100"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="var(--rail)" stopOpacity="0" />
                <stop offset="24%" stopColor="var(--rail)" stopOpacity="1" />
                <stop offset="76%" stopColor="var(--rail)" stopOpacity="1" />
                <stop offset="100%" stopColor="var(--rail)" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Faded Rail Line Group (Slight 12px fade at start and end of line) */}
            <g mask={`url(#${maskId}-base-mask)`}>
              {/* 1. Straight Subtle Guide Rail */}
              <line
                ref={baseRailRef}
                x1={RAIL_X}
                y1={0}
                x2={RAIL_X}
                y2={listHeight}
                stroke="currentColor"
                strokeWidth="1.25"
                opacity={0}
                className="text-border/50 dark:text-border/30"
              />

              {/* 2. Active Liquid Trail Curve (Full line with curve or floating segment) */}
              <path
                ref={curvePathRef}
                d=""
                fill="none"
                stroke={variant === 'floating' ? `url(#${maskId}-trail-grad)` : 'var(--rail)'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-opacity duration-150"
                opacity={0}
              />
            </g>

            {/* 3. ONLY Dot: Positioned outside the apex of the curve, pointing toward the active text */}
            <circle
              ref={activeDotRef}
              cx={RAIL_X + BUMP_WIDTH + DOT_OFFSET}
              cy={0}
              r={DOT_RADIUS}
              fill="var(--rail)"
              opacity={0}
              className="transition-opacity duration-150"
            />
          </motion.svg>
        )}

        {/* Sections and Navigation Items */}
        <div className="space-y-4.5 sm:space-y-5">
          {sections.map((section, sIdx) => {
            const sectionStartIndex = sections
              .slice(0, sIdx)
              .reduce((acc, s) => acc + s.items.length, 0);

            const sectionContent = (
              <div className="space-y-1">
                {/* Section Header */}
                <div className="flex items-center justify-between px-1.5 pt-1.5 pb-1 text-[10px] font-medium tracking-[0.06em] text-foreground uppercase select-none">
                  <span className="flex items-center gap-1.5" style={{ paddingLeft: RAIL_X + 6 }}>
                    {section.title}
                  </span>
                  <span className="text-[8px] text-muted-foreground/50 rounded-full px-1.5 py-0.5 bg-muted/40 border border-border/30">
                    {section.items.length}
                  </span>
                </div>

                {/* Items in Section */}
                <ul className="space-y-0.5">
                  {section.items.map((item, itemIdx) => {
                    const globalIdx = sectionStartIndex + itemIdx;
                    const isActive = pathname === item.href;
                    const isHovered = hoveredIndex === globalIdx;
                    const isExternal = item.href.startsWith('http');

                    const linkContent = (
                      <div
                        ref={(el) => {
                          if (globalIdx !== -1) {
                            rowRefs.current[globalIdx] = el;
                          }
                        }}
                        onMouseEnter={() => handleHover(globalIdx)}
                        className={cn(
                          'group flex w-full items-center justify-between rounded-md py-1.25 pr-2 text-left text-[13px] leading-[1.38] tracking-[-0.01em] transition-colors duration-150 outline-none',
                          isActive
                            ? 'font-medium text-foreground'
                            : isHovered
                            ? 'text-foreground'
                            : 'text-muted-foreground/75 hover:text-foreground'
                        )}
                        style={{
                          paddingLeft: RAIL_X + BUMP_WIDTH + DOT_OFFSET + LABEL_GAP,
                        }}
                      >
                        <span className="truncate">{item.title}</span>

                        {item.badge && (
                          <span
                            className={cn(
                              'shrink-0 rounded px-1.5 py-0.5 text-[7px] font-medium tracking-wider uppercase transition-all select-none',
                              item.badge.toLowerCase() === 'new' &&
                                'bg-[#3f80ff] text-white shadow-pill-glow border border-white/20',
                              item.badge.toLowerCase() === 'updated' &&
                                'border border-border bg-muted text-muted-foreground',
                              item.badge.toLowerCase() === 'pro' &&
                                'border border-amber-500/30 bg-amber-500/20 text-amber-600 dark:text-amber-400',
                              !['new', 'updated', 'pro'].includes(item.badge.toLowerCase()) &&
                                'bg-[#3f80ff] text-white shadow-pill-glow border border-white/20'
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                    );

                    return (
                      <li key={item.href}>
                        {isExternal ? (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => handleItemClick(globalIdx)}
                            className="block outline-none"
                          >
                            {linkContent}
                          </a>
                        ) : (
                          <Link
                            href={item.href}
                            onClick={() => handleItemClick(globalIdx)}
                            className="block outline-none"
                          >
                            {linkContent}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );

            if (animatedSteps) {
              return (
                <motion.div
                  key={section.title || sIdx}
                  initial={{ opacity: 0, y: -16 }}
                  animate={
                    isOpen
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: -12 }
                  }
                  transition={
                    isOpen
                      ? {
                          type: 'spring',
                          stiffness: 340,
                          damping: 26,
                          mass: 0.8,
                          delay: sIdx * 0.05,
                        }
                      : {
                          duration: 0.16,
                          ease: [0.32, 0, 0.67, 0],
                          delay: Math.max(0, (sections.length - 1 - sIdx) * 0.03),
                        }
                  }
                >
                  {sectionContent}
                </motion.div>
              );
            }

            return (
              <div key={section.title || sIdx}>
                {sectionContent}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default DocsSidebar;
