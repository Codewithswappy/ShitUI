'use client';

import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'motion/react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark, vs } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { usePreviewStage } from './preview-context';
import { StageCliButton } from './StageCliButton';

const cleanTheme = (theme: any) => {
  const newTheme = { ...theme };
  Object.keys(newTheme).forEach((key) => {
    if (newTheme[key]?.background) delete newTheme[key].background;
    if (newTheme[key]?.backgroundColor) delete newTheme[key].backgroundColor;
  });
  return newTheme;
};

const vsClean = cleanTheme(vs);
const materialDarkClean = cleanTheme(materialDark);


// Pencil Scale duo-stroke icon for Code
function PencilScaleIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        opacity="0.28"
        d="M12 18L16 18M12 10H16M12 6L15 6M12 14L15 14M15.2 22H17.8C18.9201 22 19.4802 22 19.908 21.782C20.2843 21.5903 20.5903 21.2843 20.782 20.908C21 20.4802 21 19.9201 21 18.8V5.2C21 4.0799 21 3.51984 20.782 3.09202C20.5903 2.7157 20.2843 2.40973 19.908 2.21799C19.4802 2 18.9201 2 17.8 2L15.2 2C14.0799 2 13.5198 2 13.092 2.21799C12.7157 2.40973 12.4097 2.71569 12.218 3.09202C12 3.51984 12 4.0799 12 5.2L12 18.8C12 19.9201 12 20.4802 12.218 20.908C12.4097 21.2843 12.7157 21.5903 13.092 21.782C13.5198 22 14.0799 22 15.2 22ZM5.28218 1.5L6.98047 3.19288C7.22303 3.43466 7.34431 3.55555 7.43092 3.69686C7.50772 3.82215 7.56422 3.95884 7.59834 4.10192C7.63683 4.26329 7.63646 4.43491 7.6357 4.77814L7.60026 20.9487C7.60017 20.9879 7.60013 21.0075 7.59966 21.0248C7.58242 21.6632 7.13559 22.2109 6.51328 22.3565C6.49635 22.3605 6.47715 22.3645 6.43874 22.3725L6.38561 22.3835C5.6275 22.5412 4.84547 22.5388 4.08977 22.3763C3.45231 22.2393 2.99857 21.6759 3 21.0233L3.03566 4.7538C3.03639 4.42292 3.03675 4.25748 3.07339 4.1011C3.10588 3.96244 3.15929 3.82944 3.23179 3.7067C3.31354 3.56828 3.42785 3.44818 3.65648 3.20798L5.28218 1.5Z"
      />
      <path
        d="M12 18L16 18M12 10H16M12 6H15M12 14H15M7.5982 9L7.63593 4.77814C7.63669 4.43491 7.63706 4.26329 7.59857 4.10192C7.56445 3.95884 7.50795 3.82215 7.43115 3.69686C7.34454 3.55555 7.22326 3.43466 6.9807 3.19288L5.28241 1.5L3.65671 3.20798C3.42808 3.44818 3.31377 3.56828 3.23202 3.7067C3.15952 3.82944 3.10611 3.96244 3.07362 4.1011C3.03698 4.25748 3.03662 4.42292 3.0359 4.7538L2.99805 9.02514"
      />
    </svg>
  );
}

// Programming CLI icon provided by user
function CliProgrammingIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        opacity="0.28"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2 12c0-4.71405 0-7.07107 1.46447-8.53553C4.92893 2 7.28595 2 12 2c4.714 0 7.0711 0 8.5355 1.46447C22 4.92893 22 7.28595 22 12c0 4.714 0 7.0711 -1.4645 8.5355C19.0711 22 16.714 22 12 22c-4.71405 0 -7.07107 0 -8.53553 -1.4645C2 19.0711 2 16.714 2 12Z"
      />
      <path
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        d="M17 15h-5"
      />
      <path
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m7 10 0.2344 0.1953c1.28168 1.0681 1.92253 1.6021 1.92253 2.3047 0 0.7026 -0.64085 1.2366 -1.92253 2.3047L7 15"
      />
    </svg>
  );
}

// File default duo-stroke icon for Prompt
function FileDefaultIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        opacity="0.28"
        d="M13.6 22H10.4H10.4C8.15978 22 7.03968 22 6.18404 21.564C5.43139 21.1805 4.81947 20.5686 4.43597 19.816C4 18.9603 4 17.8402 4 15.6V8.4C4 6.15979 4 5.03969 4.43597 4.18404C4.81947 3.43139 5.43139 2.81947 6.18404 2.43597C7.03968 2 8.15979 2 10.4 2H12.349C13.3274 2 13.8166 2 14.2769 2.11052C14.6851 2.20851 15.0753 2.37013 15.4331 2.58944C15.8368 2.83681 16.1827 3.18271 16.8745 3.87451L16.8745 3.87452L18.1255 5.12548C18.8173 5.81729 19.1632 6.16319 19.4106 6.56686C19.6299 6.92475 19.7915 7.31493 19.8895 7.72307C20 8.18342 20 8.67261 20 9.65097V15.6C20 17.8402 20 18.9603 19.564 19.816C19.1805 20.5686 18.5686 21.1805 17.816 21.564C16.9603 22 15.8402 22 13.6 22H13.6Z"
      />
      <path
        d="M16.8745 3.87449L18.1255 5.12546C18.8173 5.81727 19.1632 6.16317 19.4106 6.56684C19.6299 6.92473 19.7915 7.3149 19.8895 7.72305C19.9111 7.81311 19.9285 7.90427 19.9425 7.99998L18.8 7.99998C17.1198 7.99998 16.2798 7.99998 15.638 7.673C15.0735 7.38538 14.6146 6.92643 14.327 6.36195C14 5.72021 14 4.88013 14 3.19998V2.0575C14.0957 2.07148 14.1869 2.08888 14.2769 2.1105C14.6851 2.20848 15.0753 2.3701 15.4331 2.58941C15.8368 2.83678 16.1827 3.18268 16.8745 3.87449L16.8745 3.87449Z"
      />
    </svg>
  );
}

// User-provided ChatGPT (OpenAI) SVG
function ChatGptIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      fillRule="evenodd"
      className={className}
    >
      <title>OpenAI (ChatGPT)</title>
      <path d="M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.947-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z" />
    </svg>
  );
}

// User-provided Claude SVG
function ClaudeIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={className}
    >
      <title>Claude</title>
      <path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z" />
    </svg>
  );
}

// User-provided v0 SVG
function V0Icon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      className={className}
      fill="currentColor"
    >
      <path
        clipRule="evenodd"
        fillRule="evenodd"
        d="M9.50321 5.5H13.2532C13.3123 5.5 13.3704 5.5041 13.4273 5.51203L9.51242 9.42692C9.50424 9.36912 9.5 9.31006 9.5 9.25L9.5 5.5L8 5.5L8 9.25C8 10.7688 9.23122 12 10.75 12H14.5V10.5L10.75 10.5C10.6899 10.5 10.6309 10.4958 10.5731 10.4876L14.4904 6.57028C14.4988 6.62897 14.5032 6.68897 14.5032 6.75V10.5H16.0032V6.75C16.0032 5.23122 14.772 4 13.2532 4H9.50321V5.5ZM0 5V5.00405L5.12525 11.5307C5.74119 12.3151 7.00106 11.8795 7.00106 10.8822V5H5.50106V9.58056L1.90404 5H0Z"
      />
    </svg>
  );
}

// Duo-stroke copy icon matching RareUI iconset
function CopyDefaultIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        opacity="0.28"
        d="M16.9018 16.9018C17.1375 16.8669 17.3474 16.8195 17.545 16.7553C19.0672 16.2607 20.2607 15.0673 20.7552 13.5451C21 12.7919 21 11.8613 21 10C21 8.13872 21 7.20808 20.7552 6.45492C20.2607 4.93273 19.0672 3.73931 17.545 3.24472C16.7919 3 15.8612 3 14 3C12.1387 3 11.208 3 10.4549 3.24472C8.93268 3.73931 7.73926 4.93273 7.24468 6.45492C7.18045 6.65258 7.13308 6.86246 7.09814 7.09819"
      />
      <path
        d="M3 14C3 12.1387 3 11.2081 3.24472 10.4549C3.73931 8.93273 4.93273 7.73931 6.45492 7.24472C7.20808 7 8.13872 7 10 7C11.8613 7 12.7919 7 13.5451 7.24472C15.0673 7.73931 16.2607 8.93273 16.7553 10.4549C17 11.2081 17 12.1387 17 14C17 15.8613 17 16.7919 16.7553 17.5451C16.2607 19.0673 15.0673 20.2607 13.5451 20.7553C12.7919 21 11.8613 21 10 21C8.13872 21 7.20808 21 6.45492 20.7553C4.93273 20.2607 3.73931 19.0673 3.24472 17.5451C3 16.7919 3 15.8613 3 14Z"
      />
    </svg>
  );
}

// Minimal modern external arrow icon
function ExternalArrowIcon({ className = 'h-3 w-3' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.5 8.5L8.5 3.5M8.5 3.5H4.5M8.5 3.5V7.5" />
    </svg>
  );
}

export interface FloatingPreviewPillProps {
  isCodeOpen?: boolean;
  onToggleCode?: () => void;
  code?: string;
  className?: string;
}

export function FloatingPreviewPill({
  isCodeOpen: propIsCodeOpen,
  onToggleCode: propOnToggleCode,
  code: propCode,
  className,
}: FloatingPreviewPillProps) {
  const pathname = usePathname();
  const isDocPage =
    pathname === '/docs' ||
    pathname.startsWith('/docs/installation') ||
    pathname.startsWith('/docs/introduction') ||
    pathname.startsWith('/docs/getting-started');

  if (isDocPage) return null;

  const context = usePreviewStage();
  const isCodeOpenRaw = propIsCodeOpen !== undefined ? propIsCodeOpen : context.isCodeOpen;
  const isCodeOpen = isCodeOpenRaw && !context.isInfoOpen;
  const onToggleCode = () => {
    if (context.isInfoOpen) {
      context.setIsInfoOpen(false);
      context.setIsCodeOpen(true);
    } else if (propOnToggleCode) {
      propOnToggleCode();
    } else {
      context.toggleCode();
    }
  };
  const code = propCode !== undefined ? propCode : context.code;

  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsPromptOpen(false);
      }
    };
    if (isPromptOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPromptOpen]);

  const togglePrompt = () => {
    setIsPromptOpen((prev) => !prev);
  };

  // Dynamically compute the clean ShitUI component URL
  const getComponentUrl = () => {
    if (typeof window === 'undefined') return 'https://shitui.in';
    const href = window.location.href;
    if (href.includes('localhost') || href.includes('127.0.0.1')) {
      const pathname = window.location.pathname;
      return `https://shitui.in${pathname && pathname !== '/' ? pathname : ''}`;
    }
    return href;
  };

  // Build high-quality AI prompt containing our component documentation link
  const buildPrompt = () => {
    const componentUrl = getComponentUrl();
    return `I'm exploring this component from the RareUI documentation:
${componentUrl}

Help me understand how to implement, customize, and use this component in my React, Tailwind CSS, and Framer Motion project.
Be ready to explain key concepts, guide props configuration, provide realistic examples, and help debug or extend it based on this component.`;
  };

  // Handle opening AI platform with prompt pre-filled in their chat input + copying to clipboard
  const handleOpenPlatform = async (platformId: 'chatgpt' | 'claude' | 'v0' | 'copy') => {
    setIsPromptOpen(false);
    const promptText = buildPrompt();

    // Copy to user clipboard automatically
    if (navigator?.clipboard) {
      try {
        await navigator.clipboard.writeText(promptText);
      } catch (err) {
        console.error('Failed to copy prompt to clipboard:', err);
      }
    }

    const encodedPrompt = encodeURIComponent(promptText);

    if (platformId === 'chatgpt') {
      const url = `https://chatgpt.com/?q=${encodedPrompt}`;
      setToastMessage('Opening ChatGPT with prompt...');
      if (typeof window !== 'undefined') {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    } else if (platformId === 'claude') {
      const url = `https://claude.ai/new?q=${encodedPrompt}`;
      setToastMessage('Opening Claude with prompt...');
      if (typeof window !== 'undefined') {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    } else if (platformId === 'v0') {
      const url = `https://v0.dev/chat?q=${encodedPrompt}`;
      setToastMessage('Opening v0 with prompt...');
      if (typeof window !== 'undefined') {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    } else if (platformId === 'copy') {
      setToastMessage('Prompt copied to clipboard!');
    }

    setTimeout(() => setToastMessage(null), 3000);
  };

  const platforms = [
    {
      id: 'chatgpt' as const,
      name: 'ChatGPT',
      icon: ChatGptIcon,
      color: 'text-[#10a37f]',
    },
    {
      id: 'claude' as const,
      name: 'Claude',
      icon: ClaudeIcon,
      color: 'text-[#D97757]',
    },
    {
      id: 'v0' as const,
      name: 'v0 by Vercel',
      icon: V0Icon,
      color: 'text-foreground',
    },
  ];

  // Motion variants for smooth, snappy step animations
  const menuVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.94,
      y: -6,
      filter: 'blur(3px)',
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        stiffness: 420,
        damping: 26,
        mass: 0.8,
        staggerChildren: 0.035,
        delayChildren: 0.02,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -4,
      filter: 'blur(2px)',
      transition: {
        duration: 0.12,
        ease: 'easeOut',
      },
    },
  };

  // Center-aligned motion variants for CLI dropdown
  const centerMenuVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.94,
      y: -6,
      x: '-50%',
      filter: 'blur(3px)',
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      x: '-50%',
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        stiffness: 420,
        damping: 26,
        mass: 0.8,
        staggerChildren: 0.035,
        delayChildren: 0.02,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -4,
      x: '-50%',
      filter: 'blur(2px)',
      transition: {
        duration: 0.12,
        ease: 'easeOut',
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -6, y: -2 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 480,
        damping: 26,
      },
    },
  };

  return (
    <div
      className={cn(
        'relative z-40 select-none flex items-center justify-between w-full min-h-[32px]',
        className
      )}
    >
      {/* Toast Feedback */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full right-0 mt-2 z-50 flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-border/80 bg-popover/95 px-3 py-1.5 text-xs font-medium text-foreground shadow-lg backdrop-blur-md"
          >
            <Check className="h-3.5 w-3.5 text-emerald-500" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── DESKTOP LEFT SIDE: CLI open with no background, only text and copy ─── */}
      <div className="hidden sm:flex items-center min-w-0">
        <StageCliButton mode="desktop-only" />
      </div>

      {/* ─── RIGHT SIDE ACTIONS: On mobile includes mobile CLI, Code, Prompt; on desktop includes Code, Prompt ─── */}
      <div className="flex items-center gap-2 ml-auto shrink-0">
        {/* On mobile only: Keep CLI button exactly as it is now */}
        <div className="flex sm:hidden items-center">
          <StageCliButton mode="mobile-only" />
        </div>

        {/* Pill 1: Code Pill */}
        <button
          type="button"
          onClick={onToggleCode}
        title={isCodeOpen ? 'Hide source code' : 'View source code'}
        aria-label={isCodeOpen ? 'Hide source code' : 'View source code'}
        aria-expanded={isCodeOpen}
        className={cn(
          'group inline-flex h-7 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium transition-all duration-200 cursor-pointer active:scale-95 border shadow-pill-inset',
          isCodeOpen
            ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 border-neutral-900 dark:border-white shadow-pill-inset '
            : 'border-border/70 bg-neutral-100 dark:bg-neutral-900/70 text-muted-foreground hover:text-foreground hover:border-border hover:bg-neutral-200/80 dark:hover:bg-neutral-800 shadow-pill-inset'
        )}
      >
        <PencilScaleIcon className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:scale-105" />
        <span className="text-[11px] font-medium tracking-tight">Code</span>
      </button>

      {/* Pill 2: Prompt Pill */}
      <div ref={dropdownRef} className={cn('relative', isPromptOpen && 'z-50')}>
        <button
          type="button"
          onClick={togglePrompt}
          title="Open prompt in AI studio"
          aria-label="Open prompt in AI studio"
          aria-expanded={isPromptOpen}
          className={cn(
            'group inline-flex h-7 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium transition-all duration-200 cursor-pointer active:scale-95 border shadow-pill-inset',
            isPromptOpen
              ? 'border-foreground/30 bg-neutral-200 dark:bg-neutral-800 text-foreground shadow-xs'
              : 'border-border/70 bg-neutral-100 dark:bg-neutral-900/70 text-muted-foreground hover:text-foreground hover:border-border hover:bg-neutral-200/80 dark:hover:bg-neutral-800 shadow-pill-inset'
          )}
        >
          <FileDefaultIcon className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:scale-105" />
          <span className="text-[11px] font-medium tracking-tight">Prompt</span>
          <motion.div
            animate={{ rotate: isPromptOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="shrink-0"
          >
            <ChevronDown className="h-3 w-3 opacity-60 transition-opacity group-hover:opacity-100" />
          </motion.div>
        </button>

        {/* Prompt Dropdown Menu with Snappy Step Animation */}
        <AnimatePresence>
          {isPromptOpen && (
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ transformOrigin: 'top right' }}
              className="absolute top-full right-0 mt-1 w-[156px] overflow-hidden rounded-xl border border-border/60 bg-popover/95 p-1 shadow-lg shadow-black/5 dark:shadow-black/30 backdrop-blur-xl z-50 ring-1 ring-black/5 dark:ring-white/10"
            >
              <div className="space-y-0.5">
                {platforms.map((p) => {
                  const Icon = p.icon;
                  return (
                    <motion.button
                      key={p.id}
                      variants={itemVariants}
                      type="button"
                      onClick={() => handleOpenPlatform(p.id)}
                      className="group/item flex w-full cursor-pointer items-center justify-between rounded-lg px-2 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted/70 active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={cn('h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover/item:scale-105', p.color)} />
                        <span className="text-[11px] font-medium tracking-tight">{p.name}</span>
                      </div>
                      <ExternalArrowIcon className="h-2.5 w-2.5 text-muted-foreground/40 transition-all duration-200 group-hover/item:text-muted-foreground group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5" />
                    </motion.button>
                  );
                })}

                <motion.div variants={itemVariants} className="my-0.5 border-t border-border/40" />

                <motion.div variants={itemVariants}>
                  <button
                    type="button"
                    onClick={() => handleOpenPlatform('copy')}
                    className="group/item flex w-full cursor-pointer items-center justify-between rounded-lg px-2 py-1 text-xs font-medium text-muted-foreground transition-all duration-150 hover:bg-muted/70 hover:text-foreground active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-2">
                      <CopyDefaultIcon className="h-3 w-3 shrink-0 text-muted-foreground/80 transition-transform duration-200 group-hover/item:scale-105 group-hover/item:text-foreground" />
                      <span className="text-[11px] font-medium tracking-tight">Copy prompt</span>
                    </div>
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  </div>
);
}

export default FloatingPreviewPill;
