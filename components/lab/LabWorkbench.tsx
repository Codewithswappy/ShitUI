'use client';

import React, { useState, useRef, Component, ErrorInfo, ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sun,
  Moon,
  RotateCcw,
  Smartphone,
  Tablet,
  Monitor,
  Maximize2,
  Sparkles,
  Plus,
  Copy,
  Check,
  ArrowLeft,
  X,
  Code2,
  Ruler,
  ChevronDown,
  ChevronUp,
  Box,
  ExternalLink,
} from 'lucide-react';
import { DuoPaintBrush, DuoLayoutGrid } from '@/components/new-design-components/DuoIcons';
import { LAB_DRAFTS } from './registry';
import { LabGuides, GuidesState, DEFAULT_GUIDES_STATE } from './LabGuides';
import { GuidesConfigPopover } from './GuidesConfigPopover';
import { LabInspector } from './LabInspector';
import { LabReferenceOverlay } from './LabReferenceOverlay';
import { LabTooltip } from './LabTooltip';
import { cn } from '@/lib/utils';

// ============================================================================
// STREAMLINE CORE COLOR SWATCHES ICON
// ============================================================================
function ColorSwatchesIcon({ className, isActive, ...props }: React.SVGProps<SVGSVGElement> & { isActive?: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 14 14"
      id="Color-Swatches--Streamline-Core"
      className={className || 'h-3.5 w-3.5'}
      {...props}
    >
      <g id="color-swatches--color-colors-design-painting-palette-sample-swatch">
        <path
          fill={isActive ? 'rgba(255, 255, 255, 0.65)' : '#8fbffa'}
          d="M14 12.5v-3c0 -0.39782 -0.158 -0.77936 -0.4393 -1.06066C13.2794 8.15804 12.8978 8 12.5 8L3 8c-0.79565 0 -1.55871 0.31607 -2.121321 0.87868 -0.278575 0.27858 -0.499553 0.60929 -0.650318 0.97327C0.0775967 10.2159 1.72e-8 10.606 0 11c-3.48e-8 0.7956 0.31607 1.5587 0.878679 2.1213C1.44129 13.6839 2.20435 14 3 14l9.5 0c0.3978 0 0.7794 -0.158 1.0607 -0.4393S14 12.8978 14 12.5Z"
        />
        <path
          fill={isActive ? '#ffffff' : '#2859c5'}
          d="m12.3388 3.78258 -2.1213 -2.12132c-0.28129 -0.2813 -0.66282 -0.43934 -1.06064 -0.43934 -0.39783 0 -0.77936 0.15804 -1.06067 0.43934L0.87868 8.87878C0.316071 9.44139 3.793e-7 10.2045 0 11.0001c4.215e-7 0.394 0.0775974 0.7841 0.228361 1.1481 0.150764 0.3639 0.371743 0.6946 0.650319 0.9732 0.56261 0.5626 1.32567 0.8787 2.12132 0.8787s1.55871 -0.3161 2.12132 -0.8787l7.21748 -7.2175c0.2813 -0.2813 0.4394 -0.66283 0.4394 -1.06066 0 -0.39782 -0.1581 -0.77935 -0.4394 -1.06066Z"
        />
        <path
          id="Union_3"
          fill={isActive ? 'rgba(255, 255, 255, 0.65)' : '#8fbffa'}
          d="M4.5 0h-3C1.10218 0 0.720644 0.158035 0.43934 0.43934 0.158035 0.720644 0 1.10218 0 1.5V11c0 0.7956 0.31607 1.5587 0.87868 2.1213 0.27858 0.2786 0.60929 0.4996 0.97327 0.6503C2.21593 13.9224 2.60603 14 3 14c0.79565 0 1.55871 -0.3161 2.12132 -0.8787C5.68393 12.5587 6 11.7956 6 11V1.5c0 -0.39783 -0.15804 -0.779356 -0.43934 -1.06066C5.27936 0.158035 4.89782 0 4.5 0Z"
        />
        <path
          id="Union_4"
          fill={isActive ? '#ffffff' : '#2859c5'}
          fillRule="evenodd"
          d="M1.39548 3.37451c-0.34518 0 -0.625003 0.27982 -0.625003 0.625s0.279823 0.625 0.625003 0.625h3.20904c0.34518 0 0.625 -0.27982 0.625 -0.625s-0.27982 -0.625 -0.625 -0.625H1.39548Zm0 4.50049c-0.34518 0 -0.625003 0.27982 -0.625003 0.625s0.279823 0.625 0.625003 0.625h3.20904c0.34518 0 0.625 -0.27982 0.625 -0.625s-0.27982 -0.625 -0.625 -0.625H1.39548Z"
          clipRule="evenodd"
        />
      </g>
    </svg>
  );
}

// ============================================================================
// STREAMLINE MINGCUTE INSPECT FILL ICON
// ============================================================================
function InspectMingcuteIcon({ className, isActive, ...props }: React.SVGProps<SVGSVGElement> & { isActive?: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      id="Inspect-Fill--Streamline-Mingcute-Fill"
      className={className || 'h-4 w-4'}
      fill="none"
      {...props}
    >
      <g fill="none" fillRule="nonzero">
        <path
          fill={isActive ? '#ffffff' : '#3074FE'}
          d="M7.074 7.074a0.6666666666666666 0.6666666666666666 0 0 1 0.74 -0.13866666666666666l5.892666666666667 2.5926666666666662a0.6666666666666666 0.6666666666666666 0 0 1 -0.09333333333333334 1.2533333333333332l-1.8579999999999999 0.5066666666666666a0.6666666666666666 0.6666666666666666 0 0 0 -0.46733333333333327 0.46799999999999997l-0.5066666666666666 1.8573333333333333a0.6666666666666666 0.6666666666666666 0 0 1 -1.2533333333333332 0.09333333333333334l-2.5933333333333333 -5.893333333333333a0.6666666666666666 0.6666666666666666 0 0 1 0.1393333333333333 -0.7393333333333333ZM11.333333333333332 2a2 2 0 0 1 2 2v3.9066666666666667l-4.982666666666667 -2.1919999999999997a2 2 0 0 0 -2.636 2.636L7.907333333333334 13.333333333333332H4a2 2 0 0 1 -2 -2V4a2 2 0 0 1 2 -2h7.333333333333333Zm1.7466666666666666 10.308666666666666a2.009333333333333 2.009333333333333 0 0 1 -0.7713333333333333 0.7713333333333333l0.16533333333333333 -0.6066666666666667 0.606 -0.16466666666666666Z"
        />
      </g>
    </svg>
  );
}

// ============================================================================
// ISOLATED ERROR BOUNDARY FOR EXPERIMENTAL DRAFTS
// ============================================================================

interface ErrorBoundaryProps {
  children: ReactNode;
  resetKey: number;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class LabErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Lab Draft Runtime Error:', error, errorInfo);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false, error: null });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex max-w-md flex-col items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center backdrop-blur-md">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20 text-red-500 text-lg">
            ⚠️
          </div>
          <h3 className="mt-3 text-sm font-semibold text-red-600 dark:text-red-400">
            Draft Runtime Error
          </h3>
          <p className="mt-1 font-mono text-xs text-neutral-600 dark:text-neutral-400">
            {this.state.error?.message || 'Something went wrong rendering this draft.'}
          </p>
          <p className="mt-3 text-[11px] text-neutral-500">
            Fix the code in your draft file or click <strong>Reset</strong> in the floating pill.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

// ============================================================================
// WORKBENCH COMPONENT
// ============================================================================

type CanvasBg = 'plain' | 'dots' | 'grid' | 'oled';
type ViewportSize = 'fluid' | 'desktop' | 'tablet' | 'mobile';
type LayoutMode = 'centered' | 'fullscreen';

export function LabWorkbench() {
  const { theme, setTheme } = useTheme();
  const [activeDraftId, setActiveDraftId] = useState<string>(LAB_DRAFTS[0]?.id || '');
  const [canvasBg, setCanvasBg] = useState<CanvasBg>('plain');
  const [viewport, setViewport] = useState<ViewportSize>('fluid');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('centered');
  const [guidesConfig, setGuidesConfig] = useState<GuidesState>(DEFAULT_GUIDES_STATE);
  const [isGuidesPopoverOpen, setIsGuidesPopoverOpen] = useState(false);
  const [isInspectorActive, setIsInspectorActive] = useState<boolean>(false);
  const [resetKey, setResetKey] = useState<number>(0);

  // Dropdown states
  const [isComponentDropdownOpen, setIsComponentDropdownOpen] = useState(false);
  const [isLayoutModeDropdownOpen, setIsLayoutModeDropdownOpen] = useState(false);
  const [isViewportDropdownOpen, setIsViewportDropdownOpen] = useState(false);
  const [isBgDropdownOpen, setIsBgDropdownOpen] = useState(false);

  const closeAllDropdowns = () => {
    setIsComponentDropdownOpen(false);
    setIsGuidesPopoverOpen(false);
    setIsLayoutModeDropdownOpen(false);
    setIsViewportDropdownOpen(false);
    setIsBgDropdownOpen(false);
  };

  const getActiveViewportIcon = () => {
    switch (viewport) {
      case 'desktop':
        return <Monitor className="h-4 w-4 fill-emerald-500/20 text-emerald-500" />;
      case 'tablet':
        return <Tablet className="h-4 w-4 fill-emerald-500/20 text-emerald-500" />;
      case 'mobile':
        return <Smartphone className="h-4 w-4 fill-emerald-500/20 text-emerald-500" />;
      case 'fluid':
      default:
        return <Maximize2 className="h-4 w-4 fill-emerald-500/20 text-emerald-500" />;
    }
  };

  // Native Color Eyedropper / Color Picker
  const [pickedColor, setPickedColor] = useState<string | null>(null);

  const handleOpenEyedropper = async () => {
    if (typeof window !== 'undefined' && 'EyeDropper' in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        if (result?.sRGBHex) {
          const hex = result.sRGBHex.toUpperCase();
          await navigator.clipboard.writeText(hex);
          setPickedColor(hex);
          setTimeout(() => setPickedColor(null), 2500);
        }
      } catch {
        // Cancelled
      }
    } else {
      alert('Native EyeDropper API is supported in Chrome, Edge, and Arc.');
    }
  };

  // Custom Smooth Container Width Resizing
  const [customWidth, setCustomWidth] = useState<number | null>(null);
  const [isResizingContainer, setIsResizingContainer] = useState<'left' | 'right' | null>(null);
  const resizeContainerStartRef = useRef<{ mouseX: number; initialWidth: number }>({
    mouseX: 0,
    initialWidth: 0,
  });

  const handleStartResizeContainer = (direction: 'left' | 'right', e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizingContainer(direction);
    const currentW = stageRef.current ? stageRef.current.offsetWidth : 600;
    resizeContainerStartRef.current = {
      mouseX: e.clientX,
      initialWidth: currentW,
    };
  };

  React.useEffect(() => {
    if (!isResizingContainer) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - resizeContainerStartRef.current.mouseX;
      const factor = isResizingContainer === 'right' ? 2 : -2;
      const newWidth = Math.max(
        320,
        Math.min(1600, resizeContainerStartRef.current.initialWidth + deltaX * factor)
      );
      setCustomWidth(Math.round(newWidth));
    };

    const handleMouseUp = () => {
      setIsResizingContainer(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingContainer]);

  // Modals
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  const [isNewDraftModalOpen, setIsNewDraftModalOpen] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const activeDraft = LAB_DRAFTS.find((d) => d.id === activeDraftId) || LAB_DRAFTS[0];

  // Close open dropdowns when clicking outside
  React.useEffect(() => {
    if (
      !isComponentDropdownOpen &&
      !isGuidesPopoverOpen &&
      !isLayoutModeDropdownOpen &&
      !isViewportDropdownOpen &&
      !isBgDropdownOpen
    ) {
      return;
    }

    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (dockRef.current && dockRef.current.contains(target)) return;
      if (dropdownRef.current && dropdownRef.current.contains(target)) return;
      closeAllDropdowns();
    };

    window.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('touchstart', handleOutsideClick, { passive: true });
    return () => {
      window.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [
    isComponentDropdownOpen,
    isGuidesPopoverOpen,
    isLayoutModeDropdownOpen,
    isViewportDropdownOpen,
    isBgDropdownOpen,
  ]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const getViewportWidth = () => {
    switch (viewport) {
      case 'mobile':
        return 'w-full max-w-[390px]';
      case 'tablet':
        return 'w-full max-w-[768px]';
      case 'desktop':
        return 'w-full max-w-[1080px]';
      case 'fluid':
      default:
        return 'w-full';
    }
  };

  const getBgStyle = () => {
    switch (canvasBg) {
      case 'dots':
        return 'bg-neutral-100 dark:bg-neutral-900 bg-[radial-gradient(rgba(0,0,0,0.12)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:16px_16px]';
      case 'grid':
        return 'bg-neutral-100 dark:bg-neutral-900 bg-[linear-gradient(to_right,rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.06)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px]';
      case 'oled':
        return 'bg-[#09090b] text-neutral-100';
      case 'plain':
      default:
        return 'bg-neutral-100 dark:bg-neutral-900';
    }
  };

  const ActiveComponent = activeDraft?.component;

  return (
    <div className="relative flex min-h-screen flex-col bg-neutral-100 font-sans text-neutral-900 transition-colors duration-200 dark:bg-neutral-900 dark:text-neutral-100">
      {/* 1. SLIM BRAND TOPBAR */}
      <header className="z-30 flex h-12 w-full items-center justify-between px-3 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="group flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span className="hidden sm:inline">Back</span>
          </Link>

          <span className="h-3.5 w-px bg-neutral-300 dark:bg-neutral-800" />

          <div className="flex items-center gap-1.5">
            <Image
              src="/logo/shitlogo1.svg"
              alt="ShitUI Logo"
              width={18}
              height={18}
              className="rounded"
            />
            <span className="font-semibold self-end tracking-tight text-xs text-neutral-900 dark:text-white">
              ShitUI <span className="bg-[#3074fe] px-2 sm:px-3 py-0.5 sm:py-1 text-white shadow-pill-glow rounded-lg font-medium tracking-wide text-xs">Lab</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <a
            href={`/lab/plain?id=${activeDraftId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full border border-neutral-200/80 bg-white/80 px-2 sm:px-2.5 py-2 text-xs font-medium text-neutral-700 shadow-sm transition-all hover:bg-white dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 select-none"
            title="Open isolated component in a new tab without any workbench tools"
          >
            <ExternalLink className="h-3 w-3 text-neutral-500" />
            <span className="hidden sm:inline">Plain View</span>
          </a>

          <button
            onClick={() => setIsNewDraftModalOpen(true)}
            className="inline-flex items-center gap-1 rounded-full border border-neutral-200/80 bg-white/80 px-2 sm:px-2.5 py-2 text-xs font-medium text-neutral-700 shadow-sm  transition-all hover:bg-white dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            <Plus className="h-3 w-3 text-primary" />
            <span className="hidden sm:inline">New Draft</span>
          </button>

          <button
            onClick={() => setIsPromoteModalOpen(true)}
            className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 sm:px-3 py-2 text-xs font-medium text-white shadow-pill-glow transition-all hover:opacity-95 active:scale-95"
          >
            <Sparkles className="h-3 w-3" />
            <span className="hidden sm:inline">Promote</span>
          </button>
        </div>
      </header>

      {/* 2. FLOATING CONTROL PILL IN BOTTOM (Brand Design Language, Subtle Shadow Behind, shadow-pill-glow on active) */}
      <div
        ref={dockRef}
        className="fixed bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 z-40 select-none pointer-events-auto pb-[env(safe-area-inset-bottom)]"
      >
        <motion.div
          initial={{ y: 20, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          className="flex items-center gap-0.5 sm:gap-1 rounded-full border border-black/5 bg-white/92 px-2 sm:px-2.5 py-1.5 shadow-[0_12px_36px_-6px_rgba(0,0,0,0.12),0_4px_12px_-2px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-2xl dark:border-white/10 dark:bg-neutral-900/92 dark:shadow-[0_16px_45px_-6px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.08)]"
        >
          {/* COMPONENT SELECTOR BUTTON */}
          <LabTooltip content={`Draft: ${activeDraft?.name}`} side="top">
            <button
              onClick={() => {
                const next = !isComponentDropdownOpen;
                closeAllDropdowns();
                setIsComponentDropdownOpen(next);
              }}
              className={cn(
                'flex h-7.5 sm:h-8 items-center gap-0.5 sm:gap-1 rounded-full px-1.5 sm:px-2 text-xs font-medium transition-all select-none shrink-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none',
                isComponentDropdownOpen
                  ? 'bg-primary text-white shadow-pill-glow font-medium'
                  : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
              )}
            >
              <Box className={cn('h-3.5 w-3.5 sm:h-4 sm:w-4', isComponentDropdownOpen ? 'fill-white/20 text-white' : 'fill-primary/20 text-primary')} />
              <ChevronUp className={cn('h-3 w-3 transition-transform duration-150', isComponentDropdownOpen ? 'rotate-180 text-white' : 'text-neutral-400')} />
            </button>
          </LabTooltip>

          <span className="h-4 w-px bg-neutral-200/80 dark:bg-neutral-800/80 shrink-0" />

          {/* FIGMA-STYLE LAYOUT GUIDES BUTTON */}
          <LabTooltip content="Layout Guides" side="top">
            <button
              onClick={() => {
                const next = !isGuidesPopoverOpen;
                closeAllDropdowns();
                setIsGuidesPopoverOpen(next);
              }}
              className={cn(
                'flex h-7.5 sm:h-8 items-center gap-0.5 sm:gap-1 rounded-full px-1.5 sm:px-2 text-xs font-medium transition-all select-none shrink-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none',
                (guidesConfig.mode !== 'none' || isGuidesPopoverOpen)
                  ? 'bg-primary text-white shadow-pill-glow font-medium'
                  : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
              )}
            >
              <Ruler className={cn('h-3.5 w-3.5 sm:h-4 sm:w-4', (guidesConfig.mode !== 'none' || isGuidesPopoverOpen) ? 'fill-white/20 text-white' : 'fill-amber-500/20 text-amber-500')} />
              <ChevronUp className={cn('h-3 w-3 transition-transform duration-150', (guidesConfig.mode !== 'none' || isGuidesPopoverOpen) ? 'rotate-180 text-white' : 'text-neutral-400')} />
            </button>
          </LabTooltip>

          <span className="h-4 w-px bg-neutral-200/80 dark:bg-neutral-800/80 shrink-0" />

          {/* INSPECTOR TOOL */}
          <LabTooltip content={isInspectorActive ? 'Inspect Box Model (Active)' : 'Inspect Box Model'} side="top">
            <button
              onClick={() => setIsInspectorActive(!isInspectorActive)}
              className={cn(
                'flex h-7.5 w-7.5 sm:h-8 sm:w-8 items-center justify-center rounded-full transition-all select-none shrink-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none',
                isInspectorActive
                  ? 'bg-primary text-white shadow-pill-glow'
                  : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
              )}
            >
              <InspectMingcuteIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" isActive={isInspectorActive} />
            </button>
          </LabTooltip>

          {/* COLOR PICKER EYEDROPPER */}
          <LabTooltip content={pickedColor ? `Copied ${pickedColor}` : 'Eyedropper'} side="top">
            <button
              onClick={handleOpenEyedropper}
              className={cn(
                'flex h-7.5 w-7.5 sm:h-8 sm:w-8 items-center justify-center rounded-full transition-all select-none shrink-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none',
                pickedColor
                  ? 'bg-primary text-white shadow-pill-glow'
                  : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
              )}
            >
              <ColorSwatchesIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" isActive={Boolean(pickedColor)} />
            </button>
          </LabTooltip>

          <span className="h-4 w-px bg-neutral-200/80 dark:bg-neutral-800/80 shrink-0" />

          {/* FRAME LAYOUT MODE BUTTON */}
          <LabTooltip content={`Frame: ${layoutMode === 'centered' ? 'Center' : 'Full Page'}`} side="top">
            <button
              onClick={() => {
                const next = !isLayoutModeDropdownOpen;
                closeAllDropdowns();
                setIsLayoutModeDropdownOpen(next);
              }}
              className={cn(
                'flex h-7.5 sm:h-8 items-center gap-0.5 sm:gap-1 rounded-full px-1.5 sm:px-2 text-xs font-medium transition-all select-none shrink-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none',
                isLayoutModeDropdownOpen
                  ? 'bg-primary text-white shadow-pill-glow font-medium'
                  : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
              )}
            >
              <DuoLayoutGrid className={cn('h-3.5 w-3.5 sm:h-4 sm:w-4', isLayoutModeDropdownOpen ? 'text-white' : 'text-indigo-500')} />
              <ChevronUp className={cn('h-3 w-3 transition-transform duration-150', isLayoutModeDropdownOpen ? 'rotate-180 text-white' : 'text-neutral-400')} />
            </button>
          </LabTooltip>

          {/* VIEWPORT SIZER BUTTON */}
          <LabTooltip content={`Viewport: ${viewport}`} side="top">
            <button
              onClick={() => {
                const next = !isViewportDropdownOpen;
                closeAllDropdowns();
                setIsViewportDropdownOpen(next);
              }}
              className={cn(
                'flex h-7.5 sm:h-8 items-center gap-0.5 sm:gap-1 rounded-full px-1.5 sm:px-2 text-xs font-medium transition-all select-none shrink-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none',
                isViewportDropdownOpen
                  ? 'bg-primary text-white shadow-pill-glow font-medium'
                  : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
              )}
            >
              <span className={cn('flex items-center justify-center', isViewportDropdownOpen && '[&_svg]:text-white [&_svg]:fill-white/20')}>
                {getActiveViewportIcon()}
              </span>
              <ChevronUp className={cn('h-3 w-3 transition-transform duration-150', isViewportDropdownOpen ? 'rotate-180 text-white' : 'text-neutral-400')} />
            </button>
          </LabTooltip>

          <span className="h-4 w-px bg-neutral-200/80 dark:bg-neutral-800/80 shrink-0" />

          {/* CANVAS BACKGROUND BUTTON */}
          <LabTooltip content={`Canvas: ${canvasBg}`} side="top">
            <button
              onClick={() => {
                const next = !isBgDropdownOpen;
                closeAllDropdowns();
                setIsBgDropdownOpen(next);
              }}
              className={cn(
                'flex h-7.5 sm:h-8 items-center gap-0.5 sm:gap-1 rounded-full px-1.5 sm:px-2 text-xs font-medium transition-all select-none shrink-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none',
                isBgDropdownOpen
                  ? 'bg-primary text-white shadow-pill-glow font-medium'
                  : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
              )}
            >
              <DuoPaintBrush className={cn('h-3.5 w-3.5 sm:h-4 sm:w-4', isBgDropdownOpen ? 'text-white' : 'text-rose-500')} />
              <ChevronUp className={cn('h-3 w-3 transition-transform duration-150', isBgDropdownOpen ? 'rotate-180 text-white' : 'text-neutral-400')} />
            </button>
          </LabTooltip>

          <span className="h-4 w-px bg-neutral-200/80 dark:bg-neutral-800/80 shrink-0" />

          {/* ACTION TOOLS: PLAIN TAB, RESET & THEME */}
          <div className="flex items-center gap-0.5 shrink-0">
            <LabTooltip content="Open Plain Tab (No Tools)" side="top">
              <button
                onClick={() => window.open(`/lab/plain?id=${activeDraftId}`, '_blank')}
                className="flex h-7.5 w-7.5 sm:h-8 sm:w-8 items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 transition-all active:scale-95 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none"
                title="Open in Plain Tab"
              >
                <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-primary/10 text-neutral-600 dark:text-neutral-300" />
              </button>
            </LabTooltip>

            <LabTooltip content="Reset Springs" side="top">
              <button
                onClick={() => setResetKey((prev) => prev + 1)}
                className="flex h-7.5 w-7.5 sm:h-8 sm:w-8 items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 transition-all active:rotate-180 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none"
              >
                <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-neutral-500/20 text-neutral-600 dark:text-neutral-300" />
              </button>
            </LabTooltip>

            <LabTooltip content="Toggle Theme" side="top">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="flex h-7.5 w-7.5 sm:h-8 sm:w-8 items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 transition-all outline-none focus:outline-none focus:ring-0 focus-visible:outline-none"
              >
                {theme === 'dark' ? (
                  <Sun className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-amber-400/20 text-amber-500" />
                ) : (
                  <Moon className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-blue-400/20 text-blue-400" />
                )}
              </button>
            </LabTooltip>
          </div>
        </motion.div>

        {/* =========================================================================
            DROPDOWN OVERLAYS (OPEN CENTERED ABOVE THE DOCK, ZERO CLIPPING, NO CORNER CUTOFF)
           ========================================================================= */}
        <AnimatePresence>
          {isComponentDropdownOpen && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.12 }}
              className="fixed bottom-[calc(3.5rem+env(safe-area-inset-bottom,0px))] sm:bottom-[3.75rem] left-1/2 -translate-x-1/2 z-50 w-64 max-w-[calc(100vw-32px)] max-h-72 overflow-y-auto rounded-2xl border border-black/5 bg-white/95 p-1.5 shadow-[0_10px_28px_-4px_rgba(0,0,0,0.08),0_4px_10px_-2px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-2xl dark:border-white/10 dark:bg-neutral-900/95 dark:shadow-[0_12px_30px_-5px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.08)]"
            >
              <div className="px-2.5 py-1 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                Select Draft
              </div>
              {LAB_DRAFTS.map((draft) => {
                const isSelected = draft.id === activeDraftId;
                return (
                  <button
                    key={draft.id}
                    onClick={() => {
                      setActiveDraftId(draft.id);
                      setResetKey((prev) => prev + 1);
                      setIsComponentDropdownOpen(false);
                    }}
                    className={cn(
                      'flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs text-left transition-all',
                      isSelected
                        ? 'bg-primary text-white font-medium shadow-pill-glow'
                        : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                    )}
                  >
                    <span className="font-medium">{draft.name}</span>
                    <span className={cn('rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider', isSelected ? 'bg-white/20 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500')}>
                      {draft.category}
                    </span>
                  </button>
                );
              })}
            </motion.div>
          )}

          {isLayoutModeDropdownOpen && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.12 }}
              className="fixed bottom-[calc(3.5rem+env(safe-area-inset-bottom,0px))] sm:bottom-[3.75rem] left-1/2 -translate-x-1/2 z-50 w-44 max-w-[calc(100vw-32px)] rounded-2xl border border-black/5 bg-white/95 p-1.5 shadow-[0_10px_28px_-4px_rgba(0,0,0,0.08),0_4px_10px_-2px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-2xl dark:border-white/10 dark:bg-neutral-900/95 dark:shadow-[0_12px_30px_-5px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.08)]"
            >
              <div className="px-2.5 py-1 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                Layout Mode
              </div>
              <button
                onClick={() => {
                  setLayoutMode('centered');
                  setIsLayoutModeDropdownOpen(false);
                }}
                className={cn(
                  'flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs text-left transition-all',
                  layoutMode === 'centered'
                    ? 'bg-primary text-white font-medium shadow-pill-glow'
                    : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                )}
              >
                <DuoLayoutGrid className="h-3.5 w-3.5" />
                <span>Center</span>
              </button>
              <button
                onClick={() => {
                  setLayoutMode('fullscreen');
                  setIsLayoutModeDropdownOpen(false);
                }}
                className={cn(
                  'flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs text-left transition-all',
                  layoutMode === 'fullscreen'
                    ? 'bg-primary text-white font-medium shadow-pill-glow'
                    : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                )}
              >
                <Maximize2 className="h-3.5 w-3.5" />
                <span>Full Page</span>
              </button>
            </motion.div>
          )}

          {isViewportDropdownOpen && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.12 }}
              className="fixed bottom-[calc(3.5rem+env(safe-area-inset-bottom,0px))] sm:bottom-[3.75rem] left-1/2 -translate-x-1/2 z-50 w-48 max-w-[calc(100vw-32px)] rounded-2xl border border-black/5 bg-white/95 p-1.5 shadow-[0_10px_28px_-4px_rgba(0,0,0,0.08),0_4px_10px_-2px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-2xl dark:border-white/10 dark:bg-neutral-900/95 dark:shadow-[0_12px_30px_-5px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.08)]"
            >
              <div className="px-2.5 py-1 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                Viewport Size
              </div>
              <button
                onClick={() => {
                  setViewport('fluid');
                  setCustomWidth(null);
                  setIsViewportDropdownOpen(false);
                }}
                className={cn(
                  'flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs text-left transition-all',
                  viewport === 'fluid' && !customWidth
                    ? 'bg-primary text-white font-medium shadow-pill-glow'
                    : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                )}
              >
                <span className="flex items-center gap-2">
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span>Fluid</span>
                </span>
                <span className="font-mono text-[9px] opacity-70">100%</span>
              </button>
              <button
                onClick={() => {
                  setViewport('desktop');
                  setCustomWidth(null);
                  setIsViewportDropdownOpen(false);
                }}
                className={cn(
                  'flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs text-left transition-all',
                  viewport === 'desktop' && !customWidth
                    ? 'bg-primary text-white font-medium shadow-pill-glow'
                    : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                )}
              >
                <span className="flex items-center gap-2">
                  <Monitor className="h-3.5 w-3.5" />
                  <span>Desktop</span>
                </span>
                <span className="font-mono text-[9px] opacity-70">1080px</span>
              </button>
              <button
                onClick={() => {
                  setViewport('tablet');
                  setCustomWidth(null);
                  setIsViewportDropdownOpen(false);
                }}
                className={cn(
                  'flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs text-left transition-all',
                  viewport === 'tablet' && !customWidth
                    ? 'bg-primary text-white font-medium shadow-pill-glow'
                    : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                )}
              >
                <span className="flex items-center gap-2">
                  <Tablet className="h-3.5 w-3.5" />
                  <span>Tablet</span>
                </span>
                <span className="font-mono text-[9px] opacity-70">768px</span>
              </button>
              <button
                onClick={() => {
                  setViewport('mobile');
                  setCustomWidth(null);
                  setIsViewportDropdownOpen(false);
                }}
                className={cn(
                  'flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs text-left transition-all',
                  viewport === 'mobile' && !customWidth
                    ? 'bg-primary text-white font-medium shadow-pill-glow'
                    : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                )}
              >
                <span className="flex items-center gap-2">
                  <Smartphone className="h-3.5 w-3.5" />
                  <span>Mobile</span>
                </span>
                <span className="font-mono text-[9px] opacity-70">390px</span>
              </button>
            </motion.div>
          )}

          {isBgDropdownOpen && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.12 }}
              className="fixed bottom-[calc(3.5rem+env(safe-area-inset-bottom,0px))] sm:bottom-[3.75rem] left-1/2 -translate-x-1/2 z-50 w-44 max-w-[calc(100vw-32px)] rounded-2xl border border-black/5 bg-white/95 p-1.5 shadow-[0_10px_28px_-4px_rgba(0,0,0,0.08),0_4px_10px_-2px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-2xl dark:border-white/10 dark:bg-neutral-900/95 dark:shadow-[0_12px_30px_-5px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.08)]"
            >
              <div className="px-2.5 py-1 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                Background
              </div>
              {(['plain', 'dots', 'grid', 'oled'] as CanvasBg[]).map((bgKey) => (
                <button
                  key={bgKey}
                  onClick={() => {
                    setCanvasBg(bgKey);
                    setIsBgDropdownOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs text-left capitalize transition-all',
                    canvasBg === bgKey
                      ? 'bg-primary text-white font-medium shadow-pill-glow'
                      : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                  )}
                >
                  <span>{bgKey}</span>
                  {canvasBg === bgKey && <Check className="h-3 w-3 text-white" />}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Custom Layout Grid Config Popover opening centered upward */}
        <GuidesConfigPopover
          isOpen={isGuidesPopoverOpen}
          onClose={() => setIsGuidesPopoverOpen(false)}
          config={guidesConfig}
          onChange={setGuidesConfig}
        />
      </div>

      {/* 3. MAIN LIVE CANVAS STAGE */}
      <main
        className={cn(
          'relative flex flex-1 w-full transition-colors duration-200 overflow-x-hidden',
          getBgStyle(),
          layoutMode === 'centered'
            ? 'items-center justify-center p-3 sm:p-6 md:p-12 pb-24 sm:pb-28'
            : 'items-start justify-center p-0 pb-20 sm:pb-24'
        )}
      >
        {/* Layout Measurement Guide Layer (Page Scope) */}
        {guidesConfig.target === 'page' && <LabGuides config={guidesConfig} />}

        {/* Viewport Container Frame */}
        <div
          ref={stageRef}
          style={{ width: customWidth ? `${customWidth}px` : undefined }}
          className={cn(
            'relative mx-auto w-full transition-all duration-300',
            !customWidth && getViewportWidth(),
            layoutMode === 'centered'
              ? 'flex min-h-[360px] items-center justify-center'
              : 'min-h-screen',
            viewport === 'mobile' &&
              'my-8 rounded-[44px] border-8 border-neutral-300/80 bg-background p-3 sm:p-6 shadow-2xl dark:border-neutral-800'
          )}
        >
          {/* Smooth Container Resize Handles */}
          {viewport !== 'mobile' && layoutMode !== 'fullscreen' && (viewport !== 'fluid' || customWidth !== null) && (
            <>
              <div
                onMouseDown={(e) => handleStartResizeContainer('left', e)}
                onDoubleClick={() => setCustomWidth(null)}
                title="Drag to resize component width (Double-click to reset)"
                className="group absolute -left-3 top-1/2 -translate-y-1/2 flex h-14 w-6 items-center justify-center cursor-ew-resize select-none z-30"
              >
                <div className="h-8 w-1 rounded-full bg-neutral-300/80 dark:bg-neutral-700/80 transition-all group-hover:h-12 group-hover:w-1.5 group-hover:bg-primary" />
              </div>
              <div
                onMouseDown={(e) => handleStartResizeContainer('right', e)}
                onDoubleClick={() => setCustomWidth(null)}
                title="Drag to resize component width (Double-click to reset)"
                className="group absolute -right-3 top-1/2 -translate-y-1/2 flex h-14 w-6 items-center justify-center cursor-ew-resize select-none z-30"
              >
                <div className="h-8 w-1 rounded-full bg-neutral-300/80 dark:bg-neutral-700/80 transition-all group-hover:h-12 group-hover:w-1.5 group-hover:bg-primary" />
              </div>
            </>
          )}

          {isResizingContainer && (
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 rounded-full bg-neutral-900 dark:bg-white px-2.5 py-0.5 text-[10px] font-mono font-medium text-white dark:text-neutral-900 shadow-md pointer-events-none z-40">
              {customWidth}px
            </div>
          )}

          {/* Layout Measurement Guide Layer (Component Scope) */}
          {guidesConfig.target === 'component' && <LabGuides config={guidesConfig} />}
          {/* Mobile Notch Bezel */}
          {viewport === 'mobile' && (
            <div className="absolute top-2 left-1/2 h-4 w-28 -translate-x-1/2 rounded-full bg-neutral-300 dark:bg-neutral-800 z-40" />
          )}

          {/* Component Boundary */}
          <LabErrorBoundary resetKey={resetKey}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeDraft?.id}-${resetKey}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className={cn(
                  'w-full',
                  layoutMode === 'centered' && 'flex items-center justify-center'
                )}
              >
                {ActiveComponent ? (
                  <ActiveComponent />
                ) : (
                  <div className="text-center font-mono text-xs text-neutral-400">
                    No component selected.
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </LabErrorBoundary>
        </div>

        {/* Inspector Hover Measurement Layer (Matching Image 1, 2 & 3) */}
        <LabInspector enabled={isInspectorActive} containerRef={stageRef} />

        {/* Paste & Drop Reference Image Overlay & Mini Corner Tray */}
        <LabReferenceOverlay containerRef={stageRef} />
      </main>

      {/* Global Eyedropper Copied Toast */}
      <AnimatePresence>
        {pickedColor && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-neutral-900 px-3.5 py-1.5 font-mono text-xs font-medium text-white shadow-xl dark:bg-white dark:text-neutral-900 pointer-events-none"
          >
            <span
              className="h-3 w-3 rounded-full border border-white/20 shadow-xs"
              style={{ backgroundColor: pickedColor }}
            />
            <span>Copied {pickedColor}</span>
            <Check className="h-3.5 w-3.5 text-emerald-400 dark:text-emerald-600" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. MODALS (NEW DRAFT & PROMOTE) */}
      <AnimatePresence>
        {isNewDraftModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-950"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Create New Component Draft
                  </h3>
                </div>
                <button
                  onClick={() => setIsNewDraftModalOpen(false)}
                  className="rounded-lg p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs text-neutral-600 dark:text-neutral-400">
                <p>
                  You can create a new component right inside{' '}
                  <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
                    components/lab/drafts/
                  </code>{' '}
                  without risking any errors in the live library.
                </p>

                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-900/50">
                  <p className="font-semibold text-neutral-900 dark:text-white mb-1">
                    Quick CLI Scaffold:
                  </p>
                  <div className="flex items-center justify-between rounded-lg bg-white p-2 font-mono text-[11px] dark:bg-neutral-950">
                    <span>pnpm lab:new my-cool-button</span>
                    <button
                      onClick={() => handleCopy('pnpm lab:new my-cool-button', 'new-cmd')}
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      {copiedCmd === 'new-cmd' ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-900/50">
                  <p className="font-semibold text-neutral-900 dark:text-white mb-1">
                    Or manual 2-step setup:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 pl-1">
                    <li>
                      Create{' '}
                      <code className="text-neutral-900 dark:text-neutral-100">
                        components/lab/drafts/MyComponent.tsx
                      </code>
                    </li>
                    <li>
                      Register it in{' '}
                      <code className="text-neutral-900 dark:text-neutral-100">
                        components/lab/registry.ts
                      </code>
                    </li>
                  </ol>
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  onClick={() => setIsNewDraftModalOpen(false)}
                  className="rounded-lg bg-neutral-900 px-4 py-2 text-xs font-medium text-white dark:bg-white dark:text-neutral-900"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPromoteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-950"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Promote Draft to Official Library
                  </h3>
                </div>
                <button
                  onClick={() => setIsPromoteModalOpen(false)}
                  className="rounded-lg p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs text-neutral-600 dark:text-neutral-400">
                <p>
                  Satisfied with <strong>{activeDraft?.name}</strong>? You can promote it
                  into the official ShitUI library with a single command:
                </p>

                <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 p-3 font-mono text-[12px] text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white">
                  <span>pnpm lab:promote {activeDraft?.id}</span>
                  <button
                    onClick={() =>
                      handleCopy(`pnpm lab:promote ${activeDraft?.id}`, 'promote-cmd')
                    }
                    className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs text-primary hover:bg-primary/20"
                  >
                    {copiedCmd === 'promote-cmd' ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-900/50">
                  <p className="font-semibold text-neutral-900 dark:text-white mb-1">
                    What promotion does automatically:
                  </p>
                  <ul className="list-disc list-inside space-y-1 pl-1">
                    <li>
                      Moves source file to{' '}
                      <code className="text-neutral-900 dark:text-white">components/shitui/</code>
                    </li>
                    <li>
                      Creates documentation page in{' '}
                      <code className="text-neutral-900 dark:text-white">content/docs/components/</code>
                    </li>
                    <li>
                      Prepares shadcn CLI registry entries
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  onClick={() => setIsPromoteModalOpen(false)}
                  className="rounded-lg bg-neutral-900 px-4 py-2 text-xs font-medium text-white dark:bg-white dark:text-neutral-900"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LabWorkbench;
