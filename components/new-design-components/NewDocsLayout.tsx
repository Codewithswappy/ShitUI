'use client';

import * as React from 'react';
import { DocsSidebar, SidebarSection } from './DocsSidebar';
import { DocsHeader } from './DocsHeader';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { usePathname } from 'next/navigation';
import { PreviewStageProvider } from './preview-context';
import { StageCliButton } from './StageCliButton';
import { DocRightPanel } from './DocRightPanel';
import { DocSponsors } from './DocSponsors';

export interface NewDocsLayoutProps {
  sidebar: SidebarSection[];
  children?: React.ReactNode;
  /** When true, renders a clean blank canvas. Default: false */
  blank?: boolean;
  /** Sidebar line/curve style: 'full' (continuous line) or 'floating' (localized indicator). Default: 'full' */
  sidebarVariant?: 'full' | 'floating';
  className?: string;
}

import { usePreviewStage } from './preview-context';
import { IconX } from '@tabler/icons-react';

export function NewDocsLayout(props: NewDocsLayoutProps) {
  return (
    <PreviewStageProvider>
      <NewDocsLayoutInner {...props} />
    </PreviewStageProvider>
  );
}

function NewDocsLayoutInner({
  sidebar,
  children,
  blank = false,
  sidebarVariant = 'floating',
  className,
}: NewDocsLayoutProps) {
  // Sidebar open by default on desktop, matching Sketch 1
  const [isOpen, setIsOpen] = React.useState(true);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const { isInfoOpen, setIsInfoOpen, setIsCodeOpen } = usePreviewStage();
  const pathname = usePathname();

  // A page is a component page only if it is under /docs/components (or legacy component categories)
  const isComponentPage =
    pathname.startsWith('/docs/components') ||
    pathname.startsWith('/docs/3d-elements') ||
    pathname.startsWith('/docs/text-animation') ||
    pathname.startsWith('/docs/interactive-background') ||
    pathname.startsWith('/docs/sections');
  const isDocPage = !isComponentPage;
  // Always preserve center stage alignment so closing the sidebar does not cause the preview to take the remaining width
  const shouldPreserveCenter = true;

  // Close mobile drawer on route change
  React.useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Close mobile drawer on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock body scroll when mobile sheet is open
  React.useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const handleToggleSidebar = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsMobileOpen((prev) => !prev);
    } else {
      setIsOpen((prev) => !prev);
    }
  };

  return (
    <div
      className={cn(
        'flex h-screen w-full flex-col overflow-hidden bg-background text-foreground select-none',
        className
      )}
    >
      {/* 1. Top Header */}
      <DocsHeader
        isSidebarOpen={isOpen || isMobileOpen}
        onToggleSidebar={handleToggleSidebar}
      />

      {/* 2. Main 3-Column Workspace Panel Container */}
      <div className="relative flex flex-1 w-full overflow-hidden">
        {/* Left Panel: Collapsible Sidebar */}
        <motion.aside
          initial={false}
          animate={{
            width: isOpen ? 264 : shouldPreserveCenter ? 264 : 0,
          }}
          transition={{
            type: 'spring',
            stiffness: 340,
            damping: 32,
            mass: 0.9,
          }}
          className="hidden lg:block shrink-0 h-full overflow-hidden z-30 border-0 shadow-none bg-transparent rounded-none"
        >
          <div className="w-[264px] h-full flex flex-col overflow-hidden px-2.5 py-3 select-none">
            {/* Top Navigation Links (scrollable, with smooth bottom fade mask when scrolling) */}
            <div
              className={cn(
                'flex-1 min-h-0 overflow-y-auto scrollbar-thin transition-opacity duration-200',
                isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              )}
              style={{
                maskImage: 'linear-gradient(to bottom, black calc(100% - 24px), transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black calc(100% - 24px), transparent 100%)',
              }}
            >
              <DocsSidebar
                sections={sidebar}
                isOpen={isOpen}
                variant={sidebarVariant}
                animatedSteps={true}
                onLinkClick={() => {
                  setIsInfoOpen(false);
                  setIsCodeOpen(false);
                }}
              />
              {/* Extra spacing at bottom of navigation so last section scrolls cleanly into full view */}
              <div className="h-6 w-full shrink-0" aria-hidden="true" />
            </div>
          </div>
        </motion.aside>

        {/* Center Panel: Component Preview Stage */}
        <main
          className="relative z-20 flex flex-1 h-full min-w-0 overflow-hidden border-0 shadow-none bg-transparent rounded-none transition-all duration-300"
        >
          {!blank ? (
            <div className="relative flex h-full w-full items-center justify-center overflow-auto">
              {children}
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground/60">
              Select a component from the sidebar
            </div>
          )}
        </main>

        {/* Right Column: Upper Component Info + Lower Sponsor Card */}
        <aside
          data-slot="docs-right-panel"
          aria-label="Component details panel"
          className="relative z-10 hidden lg:flex w-80 shrink-0 h-full p-4 pl-3 flex-col justify-between overflow-hidden gap-3"
        >
          {/* Upper Section: Component Details (Title, Tags, Credits, Contact) */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <DocRightPanel />
          </div>

          {/* Lower Section: Sponsor Card pinned to bottom */}
          <div className="relative w-full shrink-0 pt-1">
            <DocSponsors className="w-full h-[200px] min-h-[200px]" />
          </div>
        </aside>
      </div>

      {/* Mobile & Tablet Bottom Sheet Drawer (< 1024px) */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-60 lg:hidden select-none">
            {/* Backdrop with smooth blur fade */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              onClick={() => setIsMobileOpen(false)}
              className="absolute inset-0 bg-black/55 dark:bg-black/75 backdrop-blur-xs"
            />

            {/* Bottom Sheet Drawer Modal */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{
                type: 'spring',
                damping: 32,
                stiffness: 340,
                mass: 0.82,
              }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0.04, bottom: 0.55 }}
              onDragEnd={(e, info) => {
                if (info.offset.y > 80 || info.velocity.y > 400) {
                  setIsMobileOpen(false);
                }
              }}
              className="absolute inset-x-0 bottom-0 h-[78vh] max-h-[720px] flex flex-col rounded-t-[26px] border-t border-border/70 bg-card/98 dark:bg-neutral-950/98 backdrop-blur-2xl shadow-2xl overflow-hidden will-change-transform"
            >
              {/* Drag Handle Bar at top */}
              <div className="flex w-full justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing">
                <div className="h-1.5 w-12 rounded-full bg-muted-foreground/25 hover:bg-muted-foreground/45 transition-colors" />
              </div>

              {/* Sheet Header Row - Clean Navigation Title & Close Button Only */}
              <div className="flex items-center justify-between px-5 py-2.5 shrink-0">
                <span className="text-sm font-semibold tracking-tight text-foreground">
                  Navigation
                </span>
                <button
                  type="button"
                  onClick={() => setIsMobileOpen(false)}
                  aria-label="Close navigation"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition-all cursor-pointer"
                >
                  <IconX className="h-4 w-4" />
                </button>
              </div>

              {/* Scrollable Navigation Sidebar Content */}
              <div className="flex-1 overflow-y-auto px-4 py-3 scrollbar-thin">
                <DocsSidebar
                  sections={sidebar}
                  isOpen={true}
                  variant={sidebarVariant}
                  animatedSteps={true}
                  onLinkClick={() => {
                    setIsMobileOpen(false);
                    setIsInfoOpen(false);
                    setIsCodeOpen(false);
                  }}
                />
                {/* Mobile Drawer Bottom Sponsor Card */}
                <div className="mt-4 mb-2 w-full">
                  <DocSponsors className="w-full h-[155px]" />
                </div>
                {/* Generous bottom padding for safe area */}
                <div className="h-16 w-full shrink-0" aria-hidden="true" />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default NewDocsLayout;
