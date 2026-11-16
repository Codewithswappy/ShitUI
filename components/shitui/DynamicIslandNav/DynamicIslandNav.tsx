"use client";

import React, {
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import {
  motion,
  AnimatePresence,
  LayoutGroup,
} from "motion/react";
import { cn } from "@/lib/utils";



export const ICONS: Record<string, { viewBox: string; svg: string }> = {
  home: {
    viewBox: "0 0 48 48",
    svg: '<path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M20.5682 2.81246c2.1784 -0.99734 4.6852 -0.99734 6.8636 0 7.7657 3.5554 13.5513 8.64154 16.3373 11.38514 1.5022 1.4793 2.3049 3.4519 2.4175 5.4865 0.1388 2.5072 0.3134 6.5725 0.3134 11.1586 0 3.2363 -0.087 6.2126 -0.1868 8.5643 -0.1601 3.7688 -3.1695 6.7252 -6.9275 6.8541 -3.4773 0.1192 -8.6464 0.2389 -15.3857 0.2389s-11.9084 -0.1197 -15.38569 -0.2389c-3.75796 -0.1289 -6.76743 -3.0853 -6.92748 -6.8541C1.58696 37.0553 1.5 34.079 1.5 30.8427c0 -4.5861 0.17463 -8.6514 0.31339 -11.1586 0.1126 -2.0346 0.91528 -4.0072 2.41753 -5.4865C7.01693 11.454 12.8025 6.36786 20.5682 2.81246ZM16 36c-1.1046 0 -2 0.8954 -2 2s0.8954 2 2 2h16c1.1046 0 2 -0.8954 2 -2s-0.8954 -2 -2 -2H16Z"/>',
  },
  feature: {
    viewBox: "0 0 24 24",
    svg: '<path fill="currentColor" opacity="0.45" d="M2 12c0 -4.71405 0 -7.07107 1.46447 -8.53553C4.92893 2 7.28595 2 12 2c4.714 0 7.0711 0 8.5355 1.46447C22 4.92893 22 7.28595 22 12c0 4.714 0 7.0711 -1.4645 8.5355C19.0711 22 16.714 22 12 22c-4.71405 0 -7.07107 0 -8.53553 -1.4645C2 19.0711 2 16.714 2 12Z"/><path fill="currentColor" d="M3.46451 20.5355C4.92902 22 7.28611 22 12.0003 22c4.7142 0 7.0713 0 8.5358 -1.4645C21.8931 19.1785 21.9927 17.0551 22 13h-3.1598c-0.9052 0 -1.3578 0 -1.7556 0.183 -0.3978 0.1829 -0.6924 0.5266 -1.2815 1.2138l-0.6054 0.7064c-0.5891 0.6872 -0.8837 1.0309 -1.2815 1.2138 -0.3978 0.183 -0.8504 0.183 -1.7556 0.183H11.84c-0.9052 0 -1.3578 0 -1.7556 -0.183 -0.39785 -0.1829 -0.6924 -0.5266 -1.28149 -1.2138l-0.60544 -0.7064c-0.5891 -0.6872 -0.88365 -1.0309 -1.28148 -1.2138C6.51815 13 6.06555 13 5.16035 13H2c0.0073 4.0551 0.10744 6.1785 1.46451 7.5355Z"/><path fill="currentColor" d="M8 6.25c-0.41421 0 -0.75 0.33579 -0.75 0.75s0.33579 0.75 0.75 0.75h8c0.4142 0 0.75 -0.33579 0.75 -0.75s-0.3358 -0.75 -0.75 -0.75H8Z"/><path fill="currentColor" d="M10 9.75c-0.41421 0 -0.75 0.3358 -0.75 0.75s0.33579 0.75 0.75 0.75h4c0.4142 0 0.75 -0.3358 0.75 -0.75s-0.3358 -0.75 -0.75 -0.75h-4Z"/>',
  },
  showcase: {
    viewBox: "0 0 24 24",
    svg: '<path fill="currentColor" opacity="0.45" d="M2 17.5c0 -2.1213 0 -3.182 0.65901 -3.841C3.31802 13 4.37868 13 6.5 13s3.18198 0 3.841 0.659C11 14.318 11 15.3787 11 17.5s0 3.182 -0.659 3.841C9.68198 22 8.62132 22 6.5 22s-3.18198 0 -3.84099 -0.659C2 20.682 2 19.6213 2 17.5Z"/><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M17.5 2.75c0.4142 0 0.75 0.33579 0.75 0.75v2.25h2.25c0.4142 0 0.75 0.33579 0.75 0.75s-0.3358 0.75 -0.75 0.75h-2.25V9.5c0 0.41421 -0.3358 0.75 -0.75 0.75s-0.75 -0.33579 -0.75 -0.75V7.25H14.5c-0.4142 0 -0.75 -0.33579 -0.75 -0.75s0.3358 -0.75 0.75 -0.75h2.25V3.5c0 -0.41421 0.3358 -0.75 0.75 -0.75Z"/><path fill="currentColor" d="M2 6.5c0 -2.12132 0 -3.18198 0.65901 -3.84099C3.31802 2 4.37868 2 6.5 2s3.18198 0 3.841 0.65901C11 3.31802 11 4.37868 11 6.5s0 3.18198 -0.659 3.841C9.68198 11 8.62132 11 6.5 11s-3.18198 0 -3.84099 -0.659C2 9.68198 2 8.62132 2 6.5Z"/><path fill="currentColor" d="M13 17.5c0 -2.1213 0 -3.182 0.659 -3.841C14.318 13 15.3787 13 17.5 13s3.182 0 3.841 0.659C22 14.318 22 15.3787 22 17.5s0 3.182 -0.659 3.841C20.682 22 19.6213 22 17.5 22s-3.182 0 -3.841 -0.659C13 20.682 13 19.6213 13 17.5Z"/>',
  },
  about: {
    viewBox: "0 0 24 24",
    svg: '<path fill="currentColor" opacity="0.45" d="M20 17.5c0 2.4853 0 4.5 -8 4.5s-8 -2.0147 -8 -4.5S7.58172 13 12 13c4.4183 0 8 2.0147 8 4.5Z"/><path fill="currentColor" d="M12 10c2.2091 0 4 -1.79086 4 -4s-1.7909 -4 -4 -4C9.79086 2 8 3.79086 8 6s1.79086 4 4 4Z"/>',
  },
  contact: {
    viewBox: "0 0 24 24",
    svg: '<path fill="currentColor" opacity="0.45" d="M14.2 3H9.8C5.65164 3 3.57746 3 2.28873 4.31802 1 5.63604 1 7.75736 1 12c0 4.2426 0 6.364 1.28873 7.682C3.57746 21 5.65164 21 9.8 21h4.4c4.1484 0 6.2225 0 7.5113 -1.318C23 18.364 23 16.2426 23 12c0 -4.24264 0 -6.36396 -1.2887 -7.68198C20.4225 3 18.3484 3 14.2 3Z"/><path fill="currentColor" d="M19.1284 8.034c0.35 -0.29169 0.3973 -0.81191 0.1056 -1.16194 -0.2917 -0.35002 -0.8119 -0.39732 -1.1619 -0.10563l-2.3748 1.97899c-1.0263 0.85521 -1.7388 1.44708 -2.3403 1.83398 -0.5823 0.3745 -0.9772 0.5002 -1.3568 0.5002 -0.3796 0 -0.7744 -0.1257 -1.3567 -0.5002 -0.6016 -0.3869 -1.31409 -0.97877 -2.34035 -1.83398L5.92837 6.76643c-0.35003 -0.29169 -0.87025 -0.24439 -1.16194 0.10563 -0.29169 0.35003 -0.24439 0.87025 0.10563 1.16194l2.41615 2.0135c0.97499 0.8125 1.76523 1.471 2.4627 1.9196 0.72659 0.4673 1.43409 0.7625 2.24929 0.7625 0.8152 0 1.5228 -0.2952 2.2493 -0.7625 0.6975 -0.4486 1.4877 -1.1071 2.4627 -1.9197l2.4162 -2.0134Z"/>',
  },
  dots: {
    viewBox: "0 0 24 24",
    svg: '<path fill="currentColor" opacity="0.45" d="M14 12c0 1.1046 -0.8954 2 -2 2s-2 -0.8954 -2 -2 0.8954 -2 2 -2 2 0.8954 2 2Z"/><path fill="currentColor" d="M7 12c0 1.1046 -0.89543 2 -2 2s-2 -0.8954 -2 -2 0.89543 -2 2 -2 2 0.8954 2 2Z"/><path fill="currentColor" d="M21 12c0 1.1046 -0.8954 2 -2 2s-2 -0.8954 -2 -2 0.8954 -2 2 -2 2 0.8954 2 2Z"/>',
  },
};

function Glyph({ name = "home" }: { name?: string }) {
  const icon = ICONS[name] || ICONS.home;
  return (
    <svg
      className="w-5 h-5 flex-none overflow-visible"
      viewBox={icon.viewBox}
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: icon.svg }}
    />
  );
}

function findSection(id: string) {
  if (!id || typeof document === "undefined") return null;
  const cleanId = id.replace(/^#/, "");
  const el = document.getElementById(cleanId);
  if (el) return el;
  try {
    return document.querySelector(`[data-section="${cleanId}" i], #${cleanId}`);
  } catch {
    return null;
  }
}

export interface DynamicIslandNavItem {
  id: string;
  label: string;
  icon?: string;
  section?: string;
  href?: string;
}

export interface DynamicIslandNavProps {
  items?: DynamicIslandNavItem[];
  activeId?: string;
  onSelect?: (id: string) => void;
  theme?: "dark" | "light";
  compactOnScroll?: boolean;
  scrollOffset?: number;
  className?: string;
  containerClassName?: string;
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
  forceCompact?: boolean;
}

const DEFAULT_ITEMS: DynamicIslandNavItem[] = [
  { id: "home", label: "Home", icon: "home", section: "home" },
  { id: "features", label: "Features", icon: "feature", section: "features" },
  { id: "showcase", label: "Showcase", icon: "showcase", section: "showcase" },
  { id: "about", label: "About", icon: "about", section: "about" },
  { id: "contact", label: "Contact", icon: "contact", section: "contact" },
];

const springTransition = {
  type: "spring" as const,
  stiffness: 420,
  damping: 32,
  mass: 0.8,
};

const swapTransition = {
  type: "spring" as const,
  stiffness: 380,
  damping: 28,
  mass: 0.6,
};

const swapVariants = {
  enter: (dir: number) => ({
    y: dir * 12,
    opacity: 0,
    filter: "blur(3px)",
  }),
  center: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
  },
  exit: (dir: number) => ({
    y: -dir * 12,
    opacity: 0,
    filter: "blur(3px)",
  }),
};

export default function DynamicIslandNav({
  items = DEFAULT_ITEMS,
  activeId: controlledActiveId,
  onSelect,
  theme = "dark",
  compactOnScroll = true,
  scrollOffset = 80,
  className = "",
  containerClassName,
  scrollContainerRef,
  forceCompact,
}: DynamicIslandNavProps) {
  const reactId = useId();
  const navId = "din-" + reactId.replace(/[^a-zA-Z0-9_-]/g, "");

  const [activeIdx, setActiveIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState(0);
  const [direction, setDirection] = useState(1);

  if (activeIdx !== prevIdx) {
    setDirection(activeIdx > prevIdx ? 1 : -1);
    setPrevIdx(activeIdx);
  }

  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [hoverOpen, setHoverOpen] = useState(false);
  const [forceOpen, setForceOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const forceOpenRef = useRef(false);
  const scrolledRef = useRef(false);
  const spyLockRef = useRef<number>(0);
  const shapeAtRef = useRef<number>(0);
  const armRef = useRef({ armed: true, x: -1, y: -1 });

  forceOpenRef.current = forceOpen;

  // Responsive Breakpoint Observer
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Sync external controlled activeId
  useEffect(() => {
    if (controlledActiveId) {
      const idx = items.findIndex((it) => it.id === controlledActiveId);
      if (idx >= 0) setActiveIdx(idx);
    }
  }, [controlledActiveId, items]);

  // Compact state calculation (supports manual override via forceCompact prop)
  const isCompactState =
    forceCompact !== undefined
      ? forceCompact
      : (!isMobile && compactOnScroll && scrolled);
  const compact = isCompactState && !forceOpen && !hoverOpen;

  // Protect clicks on links that slide under resting pointer when expanding
  const prevCompactRef = useRef(compact);
  useEffect(() => {
    if (prevCompactRef.current !== compact) {
      prevCompactRef.current = compact;
      shapeAtRef.current = performance.now();
      armRef.current = { armed: false, x: -1, y: -1 };
    }
  }, [compact]);

  // Scroll compaction listener (supports window, custom scrollContainerRef, or auto-detected scrolling ancestor)
  useEffect(() => {
    if (!compactOnScroll && forceCompact === undefined) return;

    const getScrollParent = (node: HTMLElement | null): HTMLElement | Window => {
      if (scrollContainerRef?.current) return scrollContainerRef.current;
      let parent = node?.parentElement;
      while (parent) {
        const style = window.getComputedStyle(parent);
        if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
          return parent;
        }
        parent = parent.parentElement;
      }
      return window;
    };

    const scrollParent = getScrollParent(containerRef.current);
    const targets = scrollParent === window ? [window] : [scrollParent, window];

    const getScrollY = () => {
      if (scrollParent !== window) {
        return (scrollParent as HTMLElement).scrollTop || 0;
      }
      return window.scrollY || 0;
    };

    let lastY = getScrollY();
    let down = 0;
    let up = 0;
    let sinceOpen = 0;
    let raf = 0;

    const run = () => {
      raf = 0;
      const y = getScrollY();
      const dy = y - lastY;
      lastY = y;

      if (y <= scrollOffset) {
        down = 0;
        up = 0;
        scrolledRef.current = false;
        setScrolled(false);
        forceOpenRef.current = false;
        setForceOpen(false);
        return;
      }

      // Scrolling down by >48px while force-opened folds it back
      if (forceOpenRef.current && dy > 0) {
        sinceOpen += dy;
        if (sinceOpen > 48) {
          sinceOpen = 0;
          forceOpenRef.current = false;
          setForceOpen(false);
        }
      } else if (!forceOpenRef.current || dy < 0) {
        sinceOpen = 0;
      }

      if (dy > 0) {
        down += dy;
        up = 0;
        if (down > 15) {
          scrolledRef.current = true;
          setScrolled(true);
        }
      } else if (dy < 0) {
        up -= dy;
        down = 0;
        if (up > 15) {
          scrolledRef.current = false;
          setScrolled(false);
          forceOpenRef.current = false;
          setForceOpen(false);
        }
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(run);
    };

    targets.forEach((t) => t.addEventListener("scroll", onScroll, { passive: true, capture: true }));
    return () => {
      targets.forEach((t) => t.removeEventListener("scroll", onScroll, { capture: true } as any));
      if (raf) cancelAnimationFrame(raf);
    };
  }, [compactOnScroll, scrollOffset, scrollContainerRef, forceCompact]);

  // Outside click closes forceOpen & mobile menu
  useEffect(() => {
    if (!forceOpen && !open) return;
    let timer: NodeJS.Timeout | null = null;
    const onOutside = (e: MouseEvent | PointerEvent) => {
      const container = containerRef.current;
      if (container && e.target instanceof Node && !container.contains(e.target)) {
        if (forceOpen) {
          forceOpenRef.current = false;
          setForceOpen(false);
        }
        if (open) setOpen(false);
      }
    };
    timer = setTimeout(() => {
      document.addEventListener("pointerdown", onOutside);
    }, 60);

    return () => {
      if (timer) clearTimeout(timer);
      document.removeEventListener("pointerdown", onOutside);
    };
  }, [forceOpen, open]);

  // Section Tracking (Scroll Spy)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const getScrollParent = (node: HTMLElement | null): HTMLElement | Window => {
      if (scrollContainerRef?.current) return scrollContainerRef.current;
      let parent = node?.parentElement;
      while (parent) {
        const style = window.getComputedStyle(parent);
        if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
          return parent;
        }
        parent = parent.parentElement;
      }
      return window;
    };

    const scrollParent = getScrollParent(containerRef.current);
    const targets = scrollParent === window ? [window] : [scrollParent, window];

    const handleSpy = () => {
      if (Date.now() < spyLockRef.current) return;
      const isWindow = scrollParent === window;
      const vh = isWindow ? window.innerHeight : (scrollParent as HTMLElement).clientHeight;
      const containerTop = isWindow ? 0 : (scrollParent as HTMLElement).getBoundingClientRect().top;
      const rootSearch = isWindow ? document : (scrollParent as HTMLElement);

      let bestIdx = -1;
      let maxCover = -1;

      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        const secId = it.section || it.id;
        const cleanId = secId.replace(/^#/, "");
        const el = rootSearch.querySelector(`[data-section="${cleanId}" i], #${cleanId}`) || findSection(secId);
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        const top = rect.top - containerTop;
        const bottom = rect.bottom - containerTop;
        const visibleHeight = Math.min(bottom, vh) - Math.max(top, 0);

        if (visibleHeight > 0) {
          const ratio = visibleHeight / Math.min(vh, rect.height || vh);
          if (ratio > maxCover) {
            maxCover = ratio;
            bestIdx = i;
          }
        }
      }

      if (bestIdx >= 0 && maxCover > 0.2) {
        setActiveIdx(bestIdx);
        onSelect?.(items[bestIdx].id);
      }
    };

    targets.forEach((t) => t.addEventListener("scroll", handleSpy, { passive: true, capture: true }));
    handleSpy();
    return () => targets.forEach((t) => t.removeEventListener("scroll", handleSpy, { capture: true } as any));
  }, [items, onSelect, scrollContainerRef]);

  // Hover Intent (Opens compact island on hover, keeps open while pointer is inside)
  const startHoverIntent = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    if (hoverOpen || hoverTimerRef.current) return;
    hoverTimerRef.current = setTimeout(() => {
      hoverTimerRef.current = null;
      setHoverOpen(true);
    }, 80);
  };

  const handleIslandEnter = () => {
    if (isMobile) return;
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    startHoverIntent();
  };

  const handleIslandMove = (e: React.PointerEvent) => {
    if (isMobile) return;
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    const arm = armRef.current;
    if (!arm.armed) {
      if (arm.x < 0) {
        arm.x = e.clientX;
        arm.y = e.clientY;
      } else if (Math.hypot(e.clientX - arm.x, e.clientY - arm.y) > 6) {
        arm.armed = true;
      }
    }
    if (!hoverOpen) {
      startHoverIntent();
    }
  };

  const handleIslandLeave = () => {
    if (isMobile) return;
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setHoverIdx(null);

    // If forceOpen was activated by clicking ⋯, do not fold back on mouse leave
    if (forceOpenRef.current) return;

    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    leaveTimerRef.current = setTimeout(() => {
      leaveTimerRef.current = null;
      setHoverOpen(false);
    }, 350);
  };

  const handleItemClick = (i: number, e: React.MouseEvent) => {
    // Slid-in link guard: ignore resting click on item that just slid into view
    const timeSinceShape = performance.now() - shapeAtRef.current;
    if (!isMobile && !armRef.current.armed && timeSinceShape < 450) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    setActiveIdx(i);
    onSelect?.(items[i].id);
    setOpen(false);
    forceOpenRef.current = false;
    setForceOpen(false);
    setHoverOpen(false);

    const it = items[i];
    const targetId = it.section || it.id;
    const cleanId = targetId.replace(/^#/, "");

    const getScrollParent = (node: HTMLElement | null): HTMLElement | Window => {
      if (scrollContainerRef?.current) return scrollContainerRef.current;
      let parent = node?.parentElement;
      while (parent) {
        const style = window.getComputedStyle(parent);
        if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
          return parent;
        }
        parent = parent.parentElement;
      }
      return window;
    };

    const scrollParent = getScrollParent(containerRef.current);
    const rootSearch = scrollParent === window ? document : (scrollParent as HTMLElement);
    const el = rootSearch.querySelector(`[data-section="${cleanId}" i], #${cleanId}`) || findSection(targetId);

    if (el) {
      e.preventDefault();
      spyLockRef.current = Date.now() + 1000;
      if (scrollParent !== window) {
        const parentEl = scrollParent as HTMLElement;
        const targetTop =
          (el as HTMLElement).getBoundingClientRect().top -
          parentEl.getBoundingClientRect().top +
          parentEl.scrollTop -
          75;
        parentEl.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
      } else {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleMoreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    forceOpenRef.current = true;
    setForceOpen(true);
  };

  return (
    <div
      className={cn(
        "fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none select-none",
        containerClassName
      )}
    >
      <LayoutGroup id={navId}>
        <motion.nav
          ref={containerRef}
          layout
          transition={springTransition}
          onPointerEnter={handleIslandEnter}
          onPointerMove={handleIslandMove}
          onPointerLeave={handleIslandLeave}
          className={cn(
            "relative pointer-events-auto flex flex-col items-center overflow-hidden border backdrop-blur-2xl transition-colors duration-300",
            isMobile && open ? "rounded-[28px] w-full max-w-[340px]" : "rounded-full",
            theme === "dark"
              ? "bg-[#121214]/94 border-white/10 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.65),0_1px_2px_rgba(0,0,0,0.2),inset_0_1px_0_0_rgba(255,255,255,0.12)] text-white"
              : "bg-white/92 border-black/8 shadow-[0_16px_36px_-12px_rgba(15,15,20,0.2),0_1px_2px_rgba(15,15,20,0.06),inset_0_1px_0_0_rgba(255,255,255,0.7)] text-neutral-900",
            className
          )}
        >
          {/* Main Horizontal Island Bar (Height 48px) */}
          <div className="relative flex items-center h-12 px-1.5 w-full">
            {/* Desktop Navigation Links */}
            {!isMobile && (
              <div className="flex items-center gap-1">
                {compact ? (
                  <>
                    {/* Compact Active Capsule with Buttery Vertical Slide + Blur */}
                    <motion.button
                      key="compact-active-pill"
                      layout
                      type="button"
                      transition={springTransition}
                      onClick={(e) => handleItemClick(activeIdx, e)}
                      className={cn(
                        "relative flex items-center h-[38px] rounded-full transition-colors cursor-pointer outline-none overflow-hidden select-none",
                        theme === "dark"
                          ? "text-white bg-white/[0.14] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.14)]"
                          : "text-neutral-950 bg-black/[0.08] shadow-[inset_0_1px_0_0_rgba(0,0,0,0.06)]"
                      )}
                    >
                      <div className="relative overflow-hidden h-[38px] flex items-center">
                        <AnimatePresence mode="popLayout" custom={direction} initial={false}>
                          <motion.div
                            key={items[activeIdx]?.id}
                            custom={direction}
                            variants={swapVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={swapTransition}
                            className="flex items-center gap-2 whitespace-nowrap px-3 h-full"
                          >
                            <span className="grid place-items-center w-5 h-5 flex-none">
                              <Glyph name={items[activeIdx]?.icon || items[activeIdx]?.id} />
                            </span>
                            <span className="text-sm font-medium tracking-tight">
                              {items[activeIdx]?.label}
                            </span>
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </motion.button>

                    {/* Compact State More Button (Dots) */}
                    <motion.button
                      key="compact-more"
                      layout
                      type="button"
                      initial={{ opacity: 0, scale: 0.8, width: 0 }}
                      animate={{ opacity: 1, scale: 1, width: 38 }}
                      exit={{ opacity: 0, scale: 0.8, width: 0 }}
                      transition={springTransition}
                      onClick={handleMoreClick}
                      onMouseEnter={handleIslandEnter}
                      aria-label="Expand all links"
                      className={cn(
                        "relative grid place-items-center w-[38px] h-[38px] rounded-full transition-colors cursor-pointer outline-none flex-none",
                        theme === "dark"
                          ? "text-white/60 hover:text-white hover:bg-white/10"
                          : "text-neutral-600 hover:text-neutral-900 hover:bg-black/5"
                      )}
                    >
                      <Glyph name="dots" />
                    </motion.button>
                  </>
                ) : (
                  items.map((it, i) => {
                    const isCur = i === activeIdx;
                    const isHovered = hoverIdx === i;
                    const showLabel = isHovered || (hoverIdx === null && isCur);

                    return (
                      <motion.button
                        key={it.id}
                        layout
                        type="button"
                        transition={springTransition}
                        onMouseEnter={() => setHoverIdx(i)}
                        onClick={(e) => handleItemClick(i, e)}
                        className={cn(
                          "relative flex items-center h-[38px] rounded-full px-2.5 transition-colors cursor-pointer outline-none",
                          isCur || isHovered
                            ? theme === "dark"
                              ? "text-white"
                              : "text-neutral-950"
                            : theme === "dark"
                            ? "text-white/60 hover:text-white/90"
                            : "text-neutral-600 hover:text-neutral-900"
                        )}
                      >
                        {/* Spring Liquid Indicator Pill */}
                        {(isHovered || (hoverIdx === null && isCur)) && (
                          <motion.div
                            layoutId={`pill-${navId}`}
                            transition={springTransition}
                            className={cn(
                              "absolute inset-0 rounded-full",
                              theme === "dark"
                                ? "bg-white/[0.14] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.14)]"
                                : "bg-black/[0.08] shadow-[inset_0_1px_0_0_rgba(0,0,0,0.06)]"
                            )}
                          />
                        )}

                        <span className="relative z-10 flex items-center">
                          <span className="grid place-items-center w-5 h-5 flex-none">
                            <Glyph name={it.icon || it.id} />
                          </span>

                          <AnimatePresence initial={false}>
                            {showLabel && (
                              <motion.span
                                initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                                animate={{ opacity: 1, width: "auto", marginLeft: 8 }}
                                exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                                transition={springTransition}
                                className="overflow-hidden whitespace-nowrap text-sm font-medium tracking-tight"
                              >
                                {it.label}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </span>
                      </motion.button>
                    );
                  })
                )}
              </div>
            )}

            {/* Mobile View: Active item label + Hamburger menu button */}
            {isMobile && (
              <div className="flex items-center justify-between w-full px-1">
                <div className="relative overflow-hidden h-[38px] flex items-center pl-2">
                  <AnimatePresence mode="popLayout" custom={direction} initial={false}>
                    <motion.div
                      key={items[activeIdx]?.id}
                      custom={direction}
                      variants={swapVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={swapTransition}
                      className="flex items-center gap-2 text-sm font-medium whitespace-nowrap"
                    >
                      <span className="grid place-items-center w-5 h-5 flex-none">
                        <Glyph name={items[activeIdx]?.icon || items[activeIdx]?.id} />
                      </span>
                      <span>{items[activeIdx]?.label}</span>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen((v) => !v)}
                  aria-label={open ? "Close menu" : "Open menu"}
                  className={cn(
                    "relative grid place-items-center w-[38px] h-[38px] rounded-full transition-colors cursor-pointer",
                    theme === "dark" ? "text-white" : "text-neutral-900"
                  )}
                >
                  <motion.span
                    animate={{ rotate: open ? 45 : 0, y: open ? 0 : -3.5 }}
                    transition={springTransition}
                    className="absolute w-4 h-[1.75px] rounded-full bg-current"
                  />
                  <motion.span
                    animate={{ rotate: open ? -45 : 0, y: open ? 0 : 3.5 }}
                    transition={springTransition}
                    className="absolute w-4 h-[1.75px] rounded-full bg-current"
                  />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Animated Dropdown Modal Panel */}
          <AnimatePresence initial={false}>
            {isMobile && open && (
              <motion.div
                key="mobile-panel"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={springTransition}
                className="w-full px-2.5 pb-3 pt-1 overflow-hidden"
              >
                <div className="flex flex-col gap-1 w-full">
                  {items.map((it, i) => {
                    const isCur = i === activeIdx;
                    return (
                      <motion.button
                        key={it.id}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.04 + i * 0.025, ...springTransition }}
                        onClick={(e) => handleItemClick(i, e)}
                        className={cn(
                          "flex items-center justify-start gap-3 w-full h-12 px-3.5 rounded-2xl text-left transition-colors cursor-pointer",
                          isCur
                            ? theme === "dark"
                              ? "bg-white/[0.14] text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]"
                              : "bg-black/[0.08] text-neutral-900"
                            : theme === "dark"
                            ? "text-white/60 hover:text-white hover:bg-white/[0.08]"
                            : "text-neutral-600 hover:text-neutral-900 hover:bg-black/[0.05]"
                        )}
                      >
                        <span className="grid place-items-center w-6 h-6 flex-none">
                          <Glyph name={it.icon || it.id} />
                        </span>
                        <span className="text-[15px] font-medium leading-none">
                          {it.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      </LayoutGroup>
    </div>
  );
}
