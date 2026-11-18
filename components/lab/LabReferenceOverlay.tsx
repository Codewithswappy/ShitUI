'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  Unlock,
  X,
  Layers,
  Maximize2,
  Plus,
  ImageIcon,
  Trash2,
  Check,
} from 'lucide-react';
import { LabTooltip } from './LabTooltip';
import { cn } from '@/lib/utils';

export interface ReferenceImageItem {
  id: string;
  name: string;
  url: string;
  naturalWidth: number;
  naturalHeight: number;
  width: number;
  height: number;
  x: number;
  y: number;
  opacity: number;
  locked: boolean;
  blendDiff: boolean;
}

interface LabReferenceOverlayProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

// ============================================================================
// EXTRACT IMAGE URL FROM DRAG & DROP / CLIPBOARD DATA
// (Handles Pinterest, Google Images, web tabs, and linked <img> elements)
// ============================================================================
function extractImageUrlFromDataTransfer(dataTransfer: DataTransfer): string | null {
  // 1. Try HTML first (Pinterest, Google Images, websites wrap images in <a> tags)
  const html = dataTransfer.getData('text/html');
  if (html) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const img = doc.querySelector('img');
      if (img && img.src && !img.src.startsWith('data:image/svg')) {
        let src = img.src;
        // Pinterest: upgrade small thumbnail variants (236x/474x/564x) to sharp 736x
        if (src.includes('pinimg.com')) {
          src = src.replace(/\/(236x|474x|564x)\//, '/736x/');
        }
        return src;
      }
    } catch {
      // ignore DOMParser error
    }
  }

  // 2. Try URI-list (standard for drag & drop URLs)
  const uriList = dataTransfer.getData('text/uri-list');
  if (uriList) {
    const lines = uriList
      .split(/[\r\n]+/)
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('#'));
    const imgLine = lines.find(
      (l) =>
        /\.(jpeg|jpg|png|gif|webp|svg)(\?.*)?$/i.test(l) ||
        l.includes('pinimg.com') ||
        l.includes('unsplash.com') ||
        l.includes('googleusercontent.com')
    );
    if (imgLine) return imgLine;
    if (lines[0]?.startsWith('http')) return lines[0];
  }

  // 3. Try standard URL or text/plain
  const rawUrl = dataTransfer.getData('URL') || dataTransfer.getData('text/plain');
  if (rawUrl) {
    const trimmed = rawUrl.trim();
    if (
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://') ||
      trimmed.startsWith('data:image/')
    ) {
      return trimmed;
    }
  }

  return null;
}

export function LabReferenceOverlay({ containerRef }: LabReferenceOverlayProps) {
  const [images, setImages] = useState<ReferenceImageItem[]>([]);
  // Multiple images placed on canvas simultaneously (at least 3 or more)
  const [placedImageIds, setPlacedImageIds] = useState<string[]>([]);
  const [focusedImageId, setFocusedImageId] = useState<string | null>(null);

  const [isDraggingCanvasImg, setIsDraggingCanvasImg] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isMiniAreaOpen, setIsMiniAreaOpen] = useState(false);
  const [isOverDropTarget, setIsOverDropTarget] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDraggingMiniAreaRef = useRef(false);
  const miniAreaRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const draggingImageIdRef = useRef<string | null>(null);
  const resizingImageIdRef = useRef<string | null>(null);

  // Persistent URL registry so object URLs are never destroyed on re-renders
  const createdUrlsRef = useRef<Set<string>>(new Set());

  const dragStartRef = useRef<{ mouseX: number; mouseY: number; initialX: number; initialY: number }>({
    mouseX: 0,
    mouseY: 0,
    initialX: 0,
    initialY: 0,
  });

  const resizeStartRef = useRef<{ mouseX: number; initialWidth: number; initialHeight: number }>({
    mouseX: 0,
    initialWidth: 0,
    initialHeight: 0,
  });

  const focusedImage = images.find((img) => img.id === focusedImageId) || null;

  // Shared Reference Image Creator
  const createReferenceItem = useCallback(
    (url: string, name: string, naturalW: number, naturalH: number) => {
      const ratio = naturalW / naturalH;
      const targetW = Math.min(naturalW, 460);
      const targetH = targetW / ratio;

      const containerRect = containerRef.current?.getBoundingClientRect();
      // Stagger new images by placed count so multiple images don't completely overlap
      const offset = (placedImageIds.length % 6) * 32;
      const initialX = containerRect
        ? containerRect.left + (containerRect.width - targetW) / 2 + offset
        : (window.innerWidth - targetW) / 2 + offset;
      const initialY = (containerRect ? containerRect.top + 30 : 140) + offset;

      const newId = `ref_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const newItem: ReferenceImageItem = {
        id: newId,
        name,
        url,
        naturalWidth: naturalW,
        naturalHeight: naturalH,
        width: Math.round(targetW),
        height: Math.round(targetH),
        x: Math.max(20, Math.round(initialX)),
        y: Math.max(80, Math.round(initialY)),
        opacity: 0.5,
        locked: false,
        blendDiff: false,
      };

      setImages((prev) => [...prev, newItem]);
      setPlacedImageIds((prev) => [...prev, newId]);
      setFocusedImageId(newId);
    },
    [containerRef, placedImageIds.length]
  );

  // ============================================================================
  // 1. ADD IMAGE HELPERS (FILE, WEB URL, PASTE, DROP)
  // ============================================================================
  const addImageFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) return;

      const url = URL.createObjectURL(file);
      createdUrlsRef.current.add(url);

      const img = new Image();
      img.onload = () => {
        const naturalW = img.naturalWidth || 400;
        const naturalH = img.naturalHeight || 300;
        const name = file.name ? file.name.replace(/\.[^/.]+$/, '') : `Mockup ${images.length + 1}`;
        createReferenceItem(url, name, naturalW, naturalH);
      };
      img.src = url;
    },
    [createReferenceItem, images.length]
  );

  const addImageFromUrl = useCallback(
    (imageUrl: string, nameHint?: string) => {
      const img = new Image();
      img.onload = () => {
        const naturalW = img.naturalWidth || 400;
        const naturalH = img.naturalHeight || 300;
        const name = nameHint || `Web Image ${images.length + 1}`;
        createReferenceItem(imageUrl, name, naturalW, naturalH);
      };
      img.onerror = () => {
        console.warn('Failed to load image from URL:', imageUrl);
      };
      img.src = imageUrl;
    },
    [createReferenceItem, images.length]
  );

  // ============================================================================
  // 2. GLOBAL PASTE & DROP LISTENERS (LOCAL FILES + WEB SITES LIKE PINTEREST)
  // ============================================================================
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      const cd = e.clipboardData;
      if (!cd) return;

      // 1. Check direct image in clipboard (copied file, screenshot, "Copy Image")
      if (cd.items && cd.items.length > 0) {
        for (let i = 0; i < cd.items.length; i++) {
          if (cd.items[i].type.startsWith('image/')) {
            const file = cd.items[i].getAsFile();
            if (file) {
              e.preventDefault();
              addImageFile(file);
              return;
            }
          }
        }
      }

      // 2. Check copied image URL or HTML snippet (e.g. "Copy Image Address")
      const webUrl = extractImageUrlFromDataTransfer(cd);
      if (webUrl) {
        e.preventDefault();
        addImageFromUrl(webUrl, 'Pasted Web Image');
      }
    };

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'copy';
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const dt = e.dataTransfer;
      if (!dt) return;

      // 1. Check direct file drop (from local desktop or file explorer)
      if (dt.files && dt.files.length > 0) {
        for (let i = 0; i < dt.files.length; i++) {
          if (dt.files[i].type.startsWith('image/')) {
            addImageFile(dt.files[i]);
            return;
          }
        }
      }

      // 2. Check items for files
      if (dt.items && dt.items.length > 0) {
        for (let i = 0; i < dt.items.length; i++) {
          if (dt.items[i].kind === 'file' && dt.items[i].type.startsWith('image/')) {
            const file = dt.items[i].getAsFile();
            if (file) {
              addImageFile(file);
              return;
            }
          }
        }
      }

      // 3. Check web image drop (Pinterest, Google Images, Web tabs, etc.)
      const webUrl = extractImageUrlFromDataTransfer(dt);
      if (webUrl) {
        addImageFromUrl(webUrl, 'Pinterest / Web Mockup');
      }
    };

    window.addEventListener('paste', handlePaste);
    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('paste', handlePaste);
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('drop', handleDrop);
    };
  }, [addImageFile, addImageFromUrl]);

  // Clean up object URLs ONLY when component completely unmounts
  useEffect(() => {
    const urls = createdUrlsRef.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  // ============================================================================
  // 3. CANVAS IMAGE DRAG & RESIZE (WITH DROP-TO-MINI-AREA SUPPORT)
  // ============================================================================
  const startDrag = (e: React.MouseEvent, img: ReferenceImageItem) => {
    e.stopPropagation();
    if (img.locked) return;
    setFocusedImageId(img.id);
    draggingImageIdRef.current = img.id;
    setIsDraggingCanvasImg(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      initialX: img.x,
      initialY: img.y,
    };
  };

  const startResize = (e: React.MouseEvent, img: ReferenceImageItem) => {
    if (img.locked) return;
    e.stopPropagation();
    setFocusedImageId(img.id);
    resizingImageIdRef.current = img.id;
    setIsResizing(true);
    resizeStartRef.current = {
      mouseX: e.clientX,
      initialWidth: img.width,
      initialHeight: img.height,
    };
  };

  useEffect(() => {
    if (!isDraggingCanvasImg && !isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const draggingId = draggingImageIdRef.current;
      const resizingId = resizingImageIdRef.current;

      if (isDraggingCanvasImg && draggingId) {
        const deltaX = e.clientX - dragStartRef.current.mouseX;
        const deltaY = e.clientY - dragStartRef.current.mouseY;
        const newX = dragStartRef.current.initialX + deltaX;
        const newY = dragStartRef.current.initialY + deltaY;

        setImages((prev) =>
          prev.map((item) =>
            item.id === draggingId
              ? {
                  ...item,
                  x: newX,
                  y: newY,
                }
              : item
          )
        );

        // Check if cursor is hovering over the mini stack area
        const miniRect = miniAreaRef.current?.getBoundingClientRect();
        if (miniRect) {
          const isOver =
            e.clientX >= miniRect.left - 20 &&
            e.clientX <= miniRect.right + 20 &&
            e.clientY >= miniRect.top - 20 &&
            e.clientY <= miniRect.bottom + 20;
          setIsOverDropTarget(isOver);
        }
      } else if (isResizing && resizingId) {
        const itemToResize = images.find((img) => img.id === resizingId);
        if (!itemToResize) return;

        const deltaX = e.clientX - resizeStartRef.current.mouseX;
        const ratio = itemToResize.naturalWidth / (itemToResize.naturalHeight || 1);
        const newW = Math.max(120, resizeStartRef.current.initialWidth + deltaX);
        const newH = newW / ratio;

        setImages((prev) =>
          prev.map((item) =>
            item.id === resizingId
              ? {
                  ...item,
                  width: Math.round(newW),
                  height: Math.round(newH),
                }
              : item
          )
        );
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      const draggingId = draggingImageIdRef.current;
      if (isDraggingCanvasImg && draggingId) {
        const miniRect = miniAreaRef.current?.getBoundingClientRect();
        if (miniRect) {
          const isOver =
            e.clientX >= miniRect.left - 20 &&
            e.clientX <= miniRect.right + 20 &&
            e.clientY >= miniRect.top - 20 &&
            e.clientY <= miniRect.bottom + 20;
          if (isOver) {
            // Drop directly into mini area (dismiss this mockup from canvas)
            setPlacedImageIds((prev) => prev.filter((id) => id !== draggingId));
            if (focusedImageId === draggingId) {
              setFocusedImageId(null);
            }
          }
        }
      }
      draggingImageIdRef.current = null;
      resizingImageIdRef.current = null;
      setIsDraggingCanvasImg(false);
      setIsResizing(false);
      setIsOverDropTarget(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingCanvasImg, isResizing, focusedImageId, images]);

  // ============================================================================
  // 4. IMAGE STATE MODIFIERS
  // ============================================================================
  const updateFocusedImage = (updates: Partial<ReferenceImageItem>) => {
    if (!focusedImageId) return;
    setImages((prev) =>
      prev.map((img) => (img.id === focusedImageId ? { ...img, ...updates } : img))
    );
  };

  const removeImage = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const item = images.find((img) => img.id === id);
    if (item?.url) {
      URL.revokeObjectURL(item.url);
      createdUrlsRef.current.delete(item.url);
    }

    setImages((prev) => prev.filter((img) => img.id !== id));
    setPlacedImageIds((prev) => prev.filter((placedId) => placedId !== id));
    if (focusedImageId === id) {
      const remaining = placedImageIds.filter((placedId) => placedId !== id);
      setFocusedImageId(remaining.length > 0 ? remaining[remaining.length - 1] : null);
    }
  };

  // Toggle mockup placement on canvas: Allows taking out 3+ images at a time!
  const handleToggleFromGallery = (id: string) => {
    if (placedImageIds.includes(id)) {
      setPlacedImageIds((prev) => prev.filter((placedId) => placedId !== id));
      if (focusedImageId === id) {
        const remaining = placedImageIds.filter((placedId) => placedId !== id);
        setFocusedImageId(remaining.length > 0 ? remaining[remaining.length - 1] : null);
      }
    } else {
      setPlacedImageIds((prev) => [...prev, id]);
      setFocusedImageId(id);
    }
  };

  // Deselect image (remove border, resize handle, header, and toolbar) when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // If clicked inside an image element, don't deselect
      if (target.closest('[data-reference-image="true"]')) {
        return;
      }
      // If clicked inside the floating reference toolbar pill, don't deselect
      if (toolbarRef.current && toolbarRef.current.contains(target)) {
        return;
      }
      // If clicked inside the mini area / mockup gallery, don't deselect
      if (miniAreaRef.current && miniAreaRef.current.contains(target)) {
        return;
      }

      setFocusedImageId(null);
      setIsMiniAreaOpen(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setFocusedImageId(null);
        setIsMiniAreaOpen(false);
      }
    };

    window.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('touchstart', handleOutsideClick, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('touchstart', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Prepare images for the stacked deck (most recent on top)
  const stackImages = [...images].reverse();
  const card1 = stackImages[0];
  const card2 = stackImages[1];
  const card3 = stackImages[2];
  const card4 = stackImages[3];

  const placedImages = images.filter((img) => placedImageIds.includes(img.id));

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = e.target.files;
          if (files) {
            Array.from(files).forEach((file) => addImageFile(file));
          }
          e.target.value = '';
        }}
      />

      {/* =======================================================================
          A. FLOATING CANVAS REFERENCES (SUPPORTS 3+ IMAGES SIMULTANEOUSLY)
         ======================================================================= */}
      <AnimatePresence>
        {placedImages.map((img) => {
          const isFocused = img.id === focusedImageId;
          return (
            <div
              key={img.id}
              data-reference-image="true"
              style={{
                position: 'fixed',
                left: img.x,
                top: img.y,
                width: img.width,
                height: img.height,
                zIndex: isFocused ? 43 : 42,
                opacity: img.opacity,
                mixBlendMode: img.blendDiff ? 'difference' : 'normal',
                pointerEvents: img.locked ? 'none' : 'auto',
              }}
              onMouseDown={(e) => startDrag(e, img)}
              className={cn(
                'group select-none transition-shadow',
                img.locked
                  ? 'cursor-default'
                  : 'cursor-grab active:cursor-grabbing',
                isFocused && !img.locked && 'shadow-md'
              )}
            >
              <img
                src={img.url}
                alt={img.name}
                draggable={false}
                className="h-full w-full object-contain pointer-events-none rounded-xl"
              />

              {/* Show border, resize handle, and tag header ONLY when selected! */}
              {!img.locked && isFocused && (
                <>
                  <div className="absolute inset-0 rounded-xl border-2 border-primary/80 pointer-events-none" />

                  {/* Resize Handle (Bottom-Right Corner on Focused Image ONLY) */}
                  <div
                    onMouseDown={(e) => startResize(e, img)}
                    className="absolute -bottom-2 -right-2 flex h-5 w-5 cursor-nwse-resize items-center justify-center rounded-full bg-primary text-white shadow-md transition-transform hover:scale-125 active:scale-110 z-50 pointer-events-auto"
                  >
                    <Maximize2 className="h-2.5 w-2.5 rotate-90" />
                  </div>

                  {/* Reference Tag Header (ONLY when selected) */}
                  <div className="absolute -top-6 left-1 flex items-center gap-1.5 rounded-full bg-primary px-2 py-0.5 text-[9px] font-mono font-medium text-white shadow-xs backdrop-blur-md pointer-events-none">
                    <span className="truncate max-w-[120px]">{img.name}</span>
                    <span className="opacity-75">
                      ({Math.round(img.width)}×{Math.round(img.height)})
                    </span>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </AnimatePresence>

      {/* =======================================================================
          B. CLEAN FLOATING REFERENCE TOOLBAR PILL (ACTIVE/FOCUSED IMAGE CONTROLS)
          ONLY SHOWS WHEN AN IMAGE IS CURRENTLY SELECTED!
         ======================================================================= */}
      <AnimatePresence>
        {focusedImage && placedImageIds.includes(focusedImage.id) && (
          <div
            ref={toolbarRef}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            className="fixed bottom-[calc(3.5rem+env(safe-area-inset-bottom,0px))] sm:bottom-[3.75rem] left-1/2 -translate-x-1/2 z-50 pointer-events-auto max-w-[calc(100vw-20px)]"
          >
            <motion.div
              initial={{ y: 12, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 12, opacity: 0, scale: 0.96 }}
              className="flex items-center gap-0.5 sm:gap-1.5 rounded-full border border-black/5 bg-white/95 px-1.5 sm:px-2.5 py-1 sm:py-1.5 shadow-[0_10px_28px_-4px_rgba(0,0,0,0.08),0_4px_10px_-2px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-2xl dark:border-white/10 dark:bg-neutral-900/95 dark:shadow-[0_12px_30px_-5px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.08)] text-xs font-sans select-none overflow-x-auto no-scrollbar"
            >

              {/* Opacity Presets */}
              <div className="flex items-center gap-0.5 rounded-full bg-neutral-100 p-0.5 dark:bg-neutral-800">
                {[0.25, 0.5, 0.75, 1].map((op) => (
                  <LabTooltip key={op} content={`${Math.round(op * 100)}% Opacity`}>
                    <button
                      type="button"
                      onClick={() => updateFocusedImage({ opacity: op })}
                      className={cn(
                        'h-6 sm:h-7 rounded-full px-1.5 sm:px-2 text-[9.5px] sm:text-[10.5px] font-mono font-medium transition-all outline-none focus:outline-none focus:ring-0 focus-visible:outline-none',
                        focusedImage.opacity === op
                          ? 'bg-primary text-white shadow-pill-glow font-semibold'
                          : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                      )}
                    >
                      {Math.round(op * 100)}%
                    </button>
                  </LabTooltip>
                ))}
              </div>

              <span className="h-3.5 w-px bg-neutral-200/80 dark:bg-neutral-800 shrink-0" />

              {/* Ghost / Lock Mode Toggle */}
              <LabTooltip
                content={focusedImage.locked ? 'Unlock Interaction' : 'Ghost (Click-through)'}
              >
                <button
                  type="button"
                  onClick={() => updateFocusedImage({ locked: !focusedImage.locked })}
                  className={cn(
                    'flex h-6.5 sm:h-7.5 items-center gap-1 rounded-full px-2 sm:px-2.5 text-[10.5px] sm:text-xs font-medium transition-all outline-none focus:outline-none focus:ring-0 focus-visible:outline-none shrink-0',
                    focusedImage.locked
                      ? 'bg-primary text-white shadow-pill-glow font-semibold'
                      : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
                  )}
                >
                  {focusedImage.locked ? (
                    <>
                      <Lock className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                      <span>Ghost</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      <span>Unlock</span>
                    </>
                  )}
                </button>
              </LabTooltip>

              {/* Difference Blend Mode */}
              <LabTooltip content="Difference Blend">
                <button
                  type="button"
                  onClick={() => updateFocusedImage({ blendDiff: !focusedImage.blendDiff })}
                  className={cn(
                    'flex h-6.5 sm:h-7.5 items-center gap-1 rounded-full px-2 sm:px-2.5 text-[10.5px] sm:text-xs font-medium transition-all outline-none focus:outline-none focus:ring-0 focus-visible:outline-none shrink-0',
                    focusedImage.blendDiff
                      ? 'bg-primary text-white shadow-pill-glow font-semibold'
                      : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
                  )}
                >
                  <Layers className={cn('h-2.5 w-2.5 sm:h-3 sm:w-3', focusedImage.blendDiff && 'text-white')} />
                  <span>Diff</span>
                </button>
              </LabTooltip>

              <span className="h-3.5 w-px bg-neutral-200/80 dark:bg-neutral-800 shrink-0" />

              {/* Dismiss from Canvas */}
              <LabTooltip content="Dismiss to Mini Area">
                <button
                  type="button"
                  onClick={() => {
                    const dismissId = focusedImage.id;
                    setPlacedImageIds((prev) => prev.filter((id) => id !== dismissId));
                    const remaining = placedImageIds.filter((id) => id !== dismissId);
                    setFocusedImageId(remaining.length > 0 ? remaining[remaining.length - 1] : null);
                  }}
                  className="flex h-6.5 w-6.5 sm:h-7.5 sm:w-7.5 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 transition-colors outline-none focus:outline-none focus:ring-0 focus-visible:outline-none shrink-0"
                >
                  <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </button>
              </LabTooltip>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =======================================================================
          C. MINI AREA IN CORNER (MATCHING USER'S IMAGE 3 & IMAGE 6)
          Only rendered when there is at least one pasted/dropped image!
         ======================================================================= */}
      <AnimatePresence>
        {images.length > 0 && (
          <motion.div
            ref={miniAreaRef}
            key="mini-area-wrapper"
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ duration: 0.2 }}
            drag
            dragMomentum={false}
            dragElastic={0}
            onDragStart={() => {
              isDraggingMiniAreaRef.current = true;
            }}
            onDragEnd={() => {
              setTimeout(() => {
                isDraggingMiniAreaRef.current = false;
              }, 100);
            }}
            style={{ position: 'fixed', right: 14, top: 46, zIndex: 45 }}
            className="select-none pointer-events-auto cursor-grab active:cursor-grabbing"
          >
            <AnimatePresence mode="wait">
              {!isMiniAreaOpen ? (
                /* ================================================================
                   COLLAPSED STATE: Stacked photo deck container (Image 6 & Image 3)
                   ================================================================ */
                <motion.div
                  key="collapsed-mini-area"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <LabTooltip content="Mockup Gallery (Drag to move)" side="left">
                    <div
                      onClick={() => {
                        if (isDraggingMiniAreaRef.current) return;
                        setIsMiniAreaOpen(true);
                      }}
                      className={cn(
                        'group relative flex h-20 w-20 items-center justify-center  bg-neutral-200 dark:bg-neutral-800 border-0 shadow-sm  transition-all hover:scale-105 active:scale-95 cursor-pointer p-2',
                        isOverDropTarget && 'ring-4 ring-primary/30 scale-110'
                      )}
                    >
                      {/* STACKED ROTATED PHOTOS (Matching Image 6 & Image 3) */}
                      <div className="relative flex h-11 w-11 items-center justify-center">
                        {/* Card 4 (Deepest Back) */}
                        {card4 && (
                          <div className="absolute inset-0 -rotate-18 scale-85 rounded-xl overflow-hidden border border-white bg-neutral-200 shadow-2xs dark:border-neutral-750 dark:bg-neutral-800 transition-transform">
                            <img
                              src={card4.url}
                              alt={card4.name}
                              className="h-full w-full object-cover opacity-60"
                            />
                          </div>
                        )}

                        {/* Card 3 (Back) */}
                        {card3 && (
                          <div className="absolute inset-0 rotate-12 scale-90 rounded-xl overflow-hidden border border-white bg-neutral-200 shadow-2xs dark:border-neutral-750 dark:bg-neutral-800 transition-transform">
                            <img
                              src={card3.url}
                              alt={card3.name}
                              className="h-full w-full object-cover opacity-70"
                            />
                          </div>
                        )}

                        {/* Card 2 (Middle) */}
                        {card2 && (
                          <div className="absolute inset-0 -rotate-8 scale-95 rounded-xl overflow-hidden border border-white bg-neutral-200 shadow-xs dark:border-neutral-750 dark:bg-neutral-800 transition-transform">
                            <img
                              src={card2.url}
                              alt={card2.name}
                              className="h-full w-full object-cover opacity-85"
                            />
                          </div>
                        )}

                        {/* Card 1 (Top / Front) */}
                        {card1 && (
                          <div className="relative h-full w-full rotate-2 rounded-xl overflow-hidden border border-white bg-white shadow-sm dark:border-neutral-750 dark:bg-neutral-900 transition-transform">
                            <img
                              src={card1.url}
                              alt={card1.name}
                              className="h-full w-full object-cover"
                            />

                            {/* Active Indicator Dot */}
                            {placedImageIds.length > 0 && (
                              <span className="absolute bottom-1 right-1 h-2 w-2 rounded-full bg-primary ring-1 ring-white dark:ring-neutral-900" />
                            )}
                          </div>
                        )}
                      </div>

                      {/* Count Badge on Top Right */}
                      <div className="absolute -top-1 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary font-mono text-[10px] font-medium text-white ring-1 ring-white dark:ring-neutral-900">
                        {images.length}
                      </div>

                      {/* Drop Highlight overlay when dragging canvas image over stack */}
                      {isOverDropTarget && (
                        <div className="absolute inset-1 flex items-center justify-center rounded-full bg-primary/80 text-[10px] font-medium text-white shadow-lg backdrop-blur-xs">
                          Drop
                        </div>
                      )}
                    </div>
                  </LabTooltip>
                </motion.div>
              ) : (
                /* ================================================================
                   EXPANDED STATE: The mini area itself opens into the gallery card!
                   bg-neutral-100 in light, bg-neutral-900 in dark, no border, subtle shadow
                   ================================================================ */
                <motion.div
                  key="expanded-mini-area"
                  initial={{ scale: 0.88, opacity: 0, y: -6, originX: 1, originY: 0 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.88, opacity: 0, y: -6 }}
                  transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                  className="w-80 max-w-[calc(100vw-28px)] rounded-[30px] bg-neutral-100 p-3 sm:p-4 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.12),0_4px_16px_-4px_rgba(0,0,0,0.06),inset_0_1px_2px_rgba(255,255,255,0.8)] dark:bg-neutral-900 dark:shadow-[0_25px_60px_-10px_rgba(0,0,0,0.65),inset_0_1px_1px_rgba(255,255,255,0.08)] border-0 z-50 select-none"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-200/60 dark:border-neutral-800">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-primary" />
                      <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                        Mockup Gallery
                      </span>
                      <span className="rounded-full bg-neutral-200/80 px-2 py-0.5 font-mono text-[10px] font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                        {images.length}
                      </span>
                      {placedImageIds.length > 0 && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[9.5px] font-semibold text-primary">
                          {placedImageIds.length} on canvas
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Add Image Button */}
                      <LabTooltip content="Add Mockup">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-200/80 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </LabTooltip>

                      {/* Collapse Gallery back to Mini Area Stack */}
                      <button
                        type="button"
                        onClick={() => setIsMiniAreaOpen(false)}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-200/80 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Grid of Mockups with Extra Padding & Inner Shadows (NO CUTOFF!) */}
                  {images.length === 0 ? (
                    <div className="py-8 text-center text-xs text-neutral-400 dark:text-neutral-500">
                      <p>No mockups added yet.</p>
                      <p className="mt-1 text-[11px] text-neutral-400/80">
                        Press <span className="font-mono text-primary">Ctrl+V</span> or drop images to begin
                      </p>
                    </div>
                  ) : (
                    <div className="mt-3 grid grid-cols-2 gap-3 max-h-72 overflow-y-auto p-1 pb-3 pr-1">
                      {images.map((item) => {
                        const isPlaced = placedImageIds.includes(item.id);
                        const isFocused = item.id === focusedImageId;
                        return (
                          <div
                            key={item.id}
                            onClick={() => handleToggleFromGallery(item.id)}
                            className={cn(
                              'group relative flex flex-col rounded-2xl p-2 transition-all cursor-pointer border-0',
                              isPlaced
                                ? 'bg-white dark:bg-neutral-800 ring-2 ring-primary shadow-sm'
                                : 'bg-neutral-200/50 dark:bg-neutral-800/80 border shadow-[inset_0_1px_1.5px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.03)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.04),0_2px_6px_rgba(0,0,0,0.3)] hover:bg-neutral-200/70 dark:hover:bg-neutral-800 hover:shadow-xs'
                            )}
                          >
                            {/* Properly Aligned & Fit Thumbnail Container with Inner Shadow */}
                            <div className="relative flex w-full items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-900/90 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] p-1 overflow-hidden">
                              <img
                                src={item.url}
                                alt={item.name}
                                className="max-h-full max-w-full object-cover pointer-events-none"
                              />

                              {/* Active On Canvas Indicator Badge */}
                              {isPlaced && (
                                <div className="absolute top-1.5 left-1.5 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[8.5px] font-medium text-white shadow-xs">
                                  <Check className="h-2.5 w-2.5" />
                                  <span>Active</span>
                                </div>
                              )}

                              {/* Delete on Hover */}
                              <button
                                type="button"
                                onClick={(e) => removeImage(item.id, e)}
                                title="Delete image"
                                className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500"
                              >
                                <Trash2 className="h-2.5 w-2.5" />
                              </button>
                            </div>

                            {/* Title & Dimension */}
                            <div className="mt-2 flex items-center justify-between px-1">
                              <span className="truncate text-[10.5px] font-medium text-neutral-800 dark:text-neutral-200">
                                {item.name}
                              </span>
                              <span className="font-mono text-[9px] text-neutral-400">
                                {item.naturalWidth}×{item.naturalHeight}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="mt-2 text-center text-[10.5px] text-neutral-400 dark:text-neutral-500">
                    Click mockups to place multiple (3+) on canvas
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default LabReferenceOverlay;
