'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { DuoGithub } from './DuoIcons';

// Official GitHub Mark SVG
function GithubMarkIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

// User-provided Star with 3D depth, inner illumination glow, and zero stroke
function StickiesStarIcon({ className = 'h-4.5 w-4.5' }: { className?: string }) {
  const starPath =
    'M36.374634146341464 13.164878048780487c-1.8557341463414634 -0.8773097560975609 -3.814960975609756 -1.5164341463414635 -5.830975609756098 -1.9024390243902438 -1.5156731707317073 -0.2994439024390244 -3.0512268292682925 -0.4870243902439024 -4.594390243902438 -0.5612195121951219 -0.5317317073170732 -1.3505795121951218 -1.1677170731707316 -2.657697804878049 -1.9024390243902438 -3.909502682926829 -0.9762365853658536 -1.8038926829268294 -2.174582926829268 -3.478400487804878 -3.567073170731707 -4.984390243902439 -0.4355634146341463 -0.4086248780487805 -1.0103853658536586 -0.6360519512195122 -1.607560975609756 -0.6360519512195122 -0.5971756097560975 0 -1.1719975609756097 0.2274270731707317 -1.607560975609756 0.6360519512195122 -1.392490243902439 1.5198680487804876 -2.5907414634146337 3.206950975609756 -3.567073170731707 5.022439024390244 -0.7004780487804878 1.267690243902439 -1.3169634146341462 2.5800307317073172 -1.8453658536585364 3.9285270731707316 -1.4588853658536585 0.07904634146341462 -2.9092192682926825 0.27309512195121954 -4.3375609756097555 0.5802439024390244 -2.0158148780487806 0.37535121951219513 -3.9775148780487806 0.9983048780487805 -5.840487804878048 1.8548780487804877 -0.5137726829268293 0.2982073170731707 -0.8967184390243902 0.7786682926829268 -1.0729080731707317 1.3459756097560975 -0.17618963414634145 0.5673073170731707 -0.1327550487804878 1.1801780487804876 0.12169046341463413 1.716951219512195C1.7217739024390244 18.045775609756095 2.939154146341463 19.704036585365852 4.347073170731707 21.193170731707315c1.006009756097561 1.0729756097560974 2.0799270731707313 2.0801268292682926 3.215121951219512 3.0153658536585364 -0.43047439024390244 1.509680487804878 -0.7327624390243902 3.0529390243902434 -0.9036585365853658 4.613414634146341 -0.2544512195121951 2.0308536585365853 -0.2544512195121951 4.085487804878048 0 6.116341463414634 0.11150195121951219 0.5889 0.44294487804878047 1.1132121951219511 0.92703 1.466590243902439 0.48407560975609754 0.35328292682926826 1.0844948780487804 0.5091878048780487 1.6793114634146342 0.43584878048780484 2.0084048780487804 -0.3918073170731707 3.9605926829268294 -1.0308365853658537 5.811951219512195 -1.9024390243902438 1.3108756097560976 -0.624380487804878 2.581609756097561 -1.3296146341463413 3.8048780487804876 -2.111707317073171 1.220890243902439 0.7860878048780487 2.4919097560975607 1.4915121951219512 3.8048780487804876 2.111707317073171 1.8508829268292681 0.8728390243902439 3.8031658536585367 1.5119634146341463 5.811951219512195 1.9024390243902438 0.5947975609756097 0.0733390243902439 1.1952073170731707 -0.08256585365853658 1.6792829268292684 -0.43584878048780484 0.48407560975609754 -0.3533780487804878 0.8155756097560976 -0.877690243902439 0.9270585365853659 -1.466590243902439 0.2544512195121951 -2.0308536585365853 0.2544512195121951 -4.085487804878048 0 -6.116341463414634 -0.15695121951219512 -1.4934146341463415 -0.4304268292682927 -2.972370731707317 -0.8180487804878048 -4.423170731707317 1.244290243902439 -0.9773780487804878 2.399736585365854 -2.0628146341463416 3.4529268292682924 -3.243658536585366 1.4067585365853659 -1.4923682926829267 2.6268878048780486 -3.1500585365853655 3.6336585365853655 -4.936829268292683 0.25235853658536583 -0.5406731707317073 0.2895512195121951 -1.1570634146341463 0.10406341463414634 -1.7240853658536586 -0.18548780487804878 -0.5670219512195122 -0.5797682926829268 -1.0423463414634146 -1.1028439024390244 -1.329329268292683Z';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-0.5 -0.9878 40 40"
      className={className}
      fill="none"
    >
      <defs>
        {/* 3D Star Body Gradient */}
        <linearGradient id="star-3d-base" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#FFF78A" />
          <stop offset="35%" stopColor="#FFDC26" />
          <stop offset="75%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>

        {/* Glowing inside - bright radiant core */}
        <radialGradient id="star-3d-inner-glow" cx="48%" cy="40%" r="52%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#FFF570" stopOpacity="0.5" />
          <stop offset="80%" stopColor="#FFB703" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
        </radialGradient>

        {/* 3D bottom bevel/shadow curvature */}
        <linearGradient id="star-3d-bevel-shadow" x1="50%" y1="30%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#B45309" stopOpacity="0" />
          <stop offset="100%" stopColor="#92400E" stopOpacity="0.55" />
        </linearGradient>

        {/* Clip to exact star outline so all glow and depth remain STRICTLY INSIDE */}
        <clipPath id="star-3d-clip">
          <path d={starPath} />
        </clipPath>
      </defs>

      {/* Clipped star content (no stroke on icon, all glows inside) */}
      <g clipPath="url(#star-3d-clip)">
        {/* 1. Base 3D Gradient Fill */}
        <rect x="-1" y="-1" width="42" height="42" fill="url(#star-3d-base)" />

        {/* 2. Inner Glowing Core (shining from inside outwards) */}
        <rect x="-1" y="-1" width="42" height="42" fill="url(#star-3d-inner-glow)" />

        {/* 3. 3D Bottom Curved Depth Shadow */}
        <rect x="-1" y="-1" width="42" height="42" fill="url(#star-3d-bevel-shadow)" />

        {/* 4. Glossy 3D Specular Highlight Arc */}
        <path
          d="M20.470243902439023 5.555131463414634C21.38284390243902 6.8316585365853655 22.17273658536585 8.191607560975608 22.829268292682926 9.616829268292681"
          stroke="#ffffff"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeMiterlimit="10"
          opacity="0.95"
        />
      </g>
    </svg>
  );
}

export interface GitHubStarButtonProps {
  className?: string;
  size?: 'sm' | 'md';
}

export function GitHubStarButton({
  className,
  size = 'md',
}: GitHubStarButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [starCount, setStarCount] = useState<number | string>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('shitui_repo_stars');
      if (cached && cached !== '148') return Number(cached);
    }
    return 49;
  });

  useEffect(() => {
    // Clear out stale '148' cached in user's browser localStorage
    if (typeof window !== 'undefined' && localStorage.getItem('shitui_repo_stars') === '148') {
      localStorage.removeItem('shitui_repo_stars');
    }

    fetch('https://api.github.com/repos/Codewithswappy/ShitUI')
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.stargazers_count === 'number') {
          setStarCount(data.stargazers_count);
          try {
            localStorage.setItem('shitui_repo_stars', String(data.stargazers_count));
          } catch {
            // ignore
          }
        }
      })
      .catch(() => {});
  }, []);

  const formattedStars =
    typeof starCount === 'number'
      ? starCount >= 1000
        ? `${(starCount / 1000).toFixed(1)}k`
        : starCount
      : starCount;

  return (
    <a
      href="https://github.com/Codewithswappy/ShitUI"
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title="Star ShitUI on GitHub"
      aria-label={`Star ShitUI on GitHub (${formattedStars} stars)`}
      className={cn(
        'group relative inline-flex items-center gap-1.5 rounded-lg bg-[#3074fe] text-white shadow-pill-glow select-none cursor-pointer active:scale-95 transition-all duration-200 overflow-hidden shrink-0',
        size === 'sm' ? 'h-8 px-2.5 text-xs' : 'h-10 px-3.5 text-xs sm:text-sm font-medium',
        className
      )}
    >
      {/* Icon Swap Container with Liquid Bouncy Spring Animation */}
      <div className="relative flex h-4 w-4 shrink-0 items-center justify-center">
        {/* 1. GitHub Icon (Default state, exits on hover) */}
        <motion.div
          initial={{ scale: 1, rotate: 0, opacity: 1 }}
          animate={
            isHovered
              ? { scale: 0, rotate: 60, opacity: 0 }
              : { scale: 1, rotate: 0, opacity: 1 }
          }
          transition={{
            duration: 0.22,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <DuoGithub className="h-4 w-4 fill-white shrink-0" />
        </motion.div>

        {/* 2. Star Icon (Hidden by default in raw HTML, enters on hover with liquid bounce) */}
        <motion.div
          initial={{ scale: 0, rotate: -35, opacity: 0 }}
          style={{ opacity: 0, transform: 'scale(0)' }}
          animate={
            isHovered
              ? {
                  scale: [0, 1.48, 0.9, 1.15, 0.98, 1],
                  rotate: [-35, 16, -8, 3, 0],
                  opacity: 1,
                }
              : { scale: 0, rotate: -35, opacity: 0 }
          }
          transition={{
            duration: 0.5,
            ease: [0.34, 1.56, 0.64, 1],
          }}
          className={cn(
            'absolute inset-0 flex items-center justify-center pointer-events-none',
            !isHovered && 'opacity-0 scale-0 pointer-events-none'
          )}
        >
          <StickiesStarIcon className="h-4.5 w-4.5 shrink-0" />
        </motion.div>
      </div>

      {/* Star Count Number */}
      <motion.span
        animate={isHovered ? { scale: [1, 1.1, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
        className="font-semibold tracking-tight text-white leading-none font-sans"
      >
        {formattedStars}
      </motion.span>
    </a>
  );
}

export default GitHubStarButton;
