'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

const AUTH_STORAGE_KEY = 'shitui_lab_founder_unlocked';

interface LabAuthGateProps {
  children: React.ReactNode;
}

export function LabAuthGate({ children }: LabAuthGateProps) {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [hasCheckedStorage, setHasCheckedStorage] = useState<boolean>(false);
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [shake, setShake] = useState<number>(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    try {
      const stored =
        localStorage.getItem(AUTH_STORAGE_KEY) ||
        sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (stored === 'true') {
        setIsUnlocked(true);
      }
    } catch {
      // Ignore storage errors
    } finally {
      setHasCheckedStorage(true);
    }
  }, []);

  useEffect(() => {
    if (hasCheckedStorage && !isUnlocked) {
      // Focus first input box
      inputRefs.current[0]?.focus();
    }
  }, [hasCheckedStorage, isUnlocked]);

  const verifyPin = async (pinToTest: string) => {
    setIsVerifying(true);
    setError(false);

    try {
      const res = await fetch('/api/lab/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinToTest }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        try {
          localStorage.setItem(AUTH_STORAGE_KEY, 'true');
          sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
        } catch {}
        setIsUnlocked(true);
      } else {
        handleError();
      }
    } catch {
      handleError();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleError = () => {
    setError(true);
    setShake((prev) => prev + 1);
    setTimeout(() => {
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }, 300);
  };

  const handleChange = (index: number, val: string) => {
    if (isVerifying) return;
    setError(false);

    // Allow only numeric input
    const cleaned = val.replace(/\D/g, '');
    if (!cleaned) {
      const next = [...digits];
      next[index] = '';
      setDigits(next);
      return;
    }

    // If pasted full PIN
    if (cleaned.length > 1) {
      const pasteDigits = cleaned.slice(0, 6).split('');
      const next = ['', '', '', '', '', ''];
      pasteDigits.forEach((d, i) => {
        if (i < 6) next[i] = d;
      });
      setDigits(next);
      if (pasteDigits.length === 6) {
        verifyPin(next.join(''));
      } else {
        inputRefs.current[Math.min(pasteDigits.length, 5)]?.focus();
      }
      return;
    }

    const next = [...digits];
    next[index] = cleaned[0];
    setDigits(next);

    // If filled last digit, verify
    if (index === 5) {
      const fullPin = next.join('');
      if (fullPin.length === 6) {
        verifyPin(fullPin);
      }
    } else {
      // Auto advance to next input
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isVerifying) return;

    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  if (!hasCheckedStorage) {
    // Avoid flash while reading local storage
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-100 dark:bg-neutral-950">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-neutral-100/90 p-4 transition-colors duration-200 dark:bg-neutral-950 select-none">
      {/* Background ambient radial glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-[120px] dark:bg-primary/15" />

      <motion.div
        key={shake}
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={
          shake > 0
            ? { x: [-10, 10, -7, 7, -3, 3, 0], opacity: 1, scale: 1, y: 0 }
            : { opacity: 1, scale: 1, y: 0 }
        }
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-[340px] rounded-[30px] border border-black/5 bg-neutral-100 p-6 text-center shadow-[0_20px_50px_-10px_rgba(0,0,0,0.12),0_4px_16px_-4px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-2xl dark:border-white/10 dark:bg-neutral-900/95 dark:shadow-[0_25px_60px_-10px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.08)]"
      >
        <h2 className="text-base font-semibold tracking-tight text-neutral-900 dark:text-white">
          Lab Access
        </h2>
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
          only founder can access the lab
        </p>

        {/* 6-Digit PIN input boxes */}
        <div className="my-5 flex items-center justify-center gap-1.5 sm:gap-2">
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
              type="password"
              inputMode="numeric"
              maxLength={1}
              disabled={isVerifying}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className={`h-11 w-10 rounded-xl border text-center font-mono text-base font-semibold transition-all duration-150 outline-none select-none sm:w-11 ${
                error
                  ? 'border-red-500/80 bg-red-500/5 text-red-500 ring-2 ring-red-500/20 dark:border-red-500 dark:bg-red-500/10'
                  : digit
                  ? 'border-primary bg-primary/5 text-primary ring-2 ring-primary/20 dark:border-primary dark:bg-primary/10'
                  : 'border-neutral-200/90 bg-neutral-50/80 text-neutral-800 hover:border-neutral-300 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 dark:border-neutral-800 dark:bg-neutral-800/80 dark:text-white dark:hover:border-neutral-700 dark:focus:border-primary dark:focus:bg-neutral-800'
              } ${isVerifying ? 'opacity-60 cursor-wait' : ''}`}
            />
          ))}
        </div>

        {/* Status / Hint */}
        {isVerifying ? (
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-primary">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Verifying code...</span>
          </div>
        ) : error ? (
          <p className="text-[11px] font-medium text-red-500 animate-pulse">
            Incorrect PIN. Try again.
          </p>
        ) : (
          <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
            Enter 6-digit founder code
          </p>
        )}
      </motion.div>
    </div>
  );
}

export default LabAuthGate;
