'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ShowcaseComponent } from './showcase.config';

export type ShowcaseItem = ShowcaseComponent;

interface ShowcaseCardProps {
  item: ShowcaseComponent;
  index?: number;
  isHighlighted?: boolean;
}

export function ShowcaseCard({ item, index, isHighlighted }: ShowcaseCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isNearViewport, setIsNearViewport] = useState(false);
  const [isInViewport, setIsInViewport] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaybackStarted, setIsPlaybackStarted] = useState(false);
  const [posterError, setPosterError] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const { poster, video: videoSrc, width, height } = item.preview;
  const hasVideo = Boolean(videoSrc);

  // First 8 cards load eagerly (covering initial visible cards across all columns); only the first card gets high priority
  const isEager = typeof index === 'number' && index < 8;
  const isLcp = typeof index === 'number' && index === 0;

  // Dynamic contain-intrinsic-block-size per card based on real aspect ratio
  const intrinsicBlockSize = `auto ${Math.round(320 / (width / height))}px`;

  // Reload media when near viewport
  useEffect(() => {
    if (isNearViewport && videoRef.current) {
      videoRef.current.load();
    }
  }, [isNearViewport, videoSrc]);

  // 1. Detect prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // 2. IntersectionObserver (rootMargin ~200px)
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsNearViewport(true);
            setIsInViewport(true);
          } else {
            setIsInViewport(false);
          }
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 3. Play video when near/in viewport or hovered, pause when offscreen
  useEffect(() => {
    const video = videoRef.current;
    if (!video || prefersReducedMotion || !isNearViewport || videoError) return;

    if (isInViewport || isHovered) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay policy or video pending load
        });
      }
    } else {
      video.pause();
    }
  }, [isInViewport, isHovered, isNearViewport, prefersReducedMotion, videoError]);

  const [aspectRatio, setAspectRatio] = useState<string>(`${width} / ${height}`);

  useEffect(() => {
    setAspectRatio(`${width} / ${height}`);
  }, [width, height]);

  const hasValidPoster = Boolean(poster && !posterError);
  const hasValidVideo = Boolean(hasVideo && videoSrc && !videoError && !prefersReducedMotion);
  const showPlaceholder = !hasValidPoster && !hasValidVideo;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="w-full"
    >
      <Link
        href={`/docs/${item.slug}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          'group relative flex flex-col w-full h-full justify-center select-none cursor-pointer',
          // Uniform padding to perfectly frame the centered component video:
          'p-6 sm:p-5',
          // Exact same background, soft tactile inset glow, and border as the sponsor card:
          'bg-neutral-100 dark:bg-neutral-900',
          'shadow-[inset_0_1px_2px_rgba(255,255,255,0.75),inset_0_0_18px_rgba(255,255,255,0.35)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.16),inset_0_0_22px_rgba(255,255,255,0.05)]',
          // Visible border:
          'border border-black/10 dark:border-white/10',
          'rounded-2xl',
          isHighlighted && 'ring-2 ring-foreground/40'
        )}
      >
        {/* Centered Component Video Container - Zero shadow, zero border, zero effect on hover */}
        <div
          className="relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-transparent shadow-none border-0 ring-0 isolate"
          style={{
            aspectRatio,
          }}
        >
          {/* Missing or Failed Media Placeholder */}
          {showPlaceholder ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-200/60 dark:bg-neutral-950/80 p-4 text-center select-none">
              <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase opacity-75">
                Preview
              </span>
              <span className="mt-1 text-sm font-medium text-foreground/80">
                {item.name}
              </span>
            </div>
          ) : (
            <>
              {/* Poster image with object-cover and exact sizes */}
              {hasValidPoster && (
                <img
                  src={poster}
                  alt={item.name}
                  loading={isEager ? 'eager' : 'lazy'}
                  {...(isLcp ? { fetchPriority: 'high' } : {})}
                  decoding="async"
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                  width={width}
                  height={height}
                  onLoad={(e) => {
                    const img = e.currentTarget;
                    if (img.naturalWidth && img.naturalHeight) {
                      setAspectRatio(`${img.naturalWidth} / ${img.naturalHeight}`);
                    }
                  }}
                  onError={() => setPosterError(true)}
                  className="absolute inset-0 h-full w-full object-cover select-none"
                />
              )}

              {/* Video: stacked absolutely over poster with preload="none" */}
              {hasValidVideo && (
                <video
                  ref={videoRef}
                  poster={poster}
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="none"
                  onLoadedMetadata={(e) => {
                    const v = e.currentTarget;
                    if (v.videoWidth && v.videoHeight) {
                      setAspectRatio(`${v.videoWidth} / ${v.videoHeight}`);
                    }
                  }}
                  onPlaying={() => setIsPlaybackStarted(true)}
                  onTimeUpdate={() => setIsPlaybackStarted(true)}
                  onError={() => setVideoError(true)}
                  className={cn(
                    'absolute inset-0 h-full w-full object-cover transition-opacity duration-300',
                    isPlaybackStarted ? 'opacity-100' : 'opacity-0'
                  )}
                >
                  {isNearViewport && videoSrc && (
                    <source
                      src={videoSrc}
                      type={videoSrc.endsWith('.webm') ? 'video/webm' : 'video/mp4'}
                    />
                  )}
                </video>
              )}
            </>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
