'use client';

import * as React from 'react';
import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface PreviewStageContextType {
  code: string;
  setCode: (code: string) => void;
  cliCommand: string;
  setCliCommand: (cmd: string) => void;
  componentName: string;
  setComponentName: (name: string) => void;
  isCodeOpen: boolean;
  setIsCodeOpen: (open: boolean) => void;
  toggleCode: () => void;
  isInfoOpen: boolean;
  setIsInfoOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleInfo: () => void;
}

const PreviewStageContext = createContext<PreviewStageContextType | null>(null);

export function PreviewStageProvider({ children }: { children: React.ReactNode }) {
  const [code, setCode] = useState<string>('');
  const [cliCommand, setCliCommand] = useState<string>('');
  const [componentName, setComponentName] = useState<string>('');
  const [isCodeOpen, setIsCodeOpen] = useState<boolean>(false);
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);

  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Synchronously reset to preview mode whenever the user navigates to a different component/page
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsInfoOpen(false);
    setIsCodeOpen(false);
  }



  const toggleCode = useCallback(() => {
    if (isInfoOpen) {
      setIsInfoOpen(false);
      setIsCodeOpen(true);
    } else {
      setIsCodeOpen((prev) => !prev);
    }
  }, [isInfoOpen]);

  const toggleInfo = useCallback(() => {
    setIsInfoOpen((prev) => {
      const next = !prev;
      if (next) {
        setIsCodeOpen(false);
      }
      return next;
    });
  }, []);

  return (
    <PreviewStageContext.Provider
      value={{
        code,
        setCode,
        cliCommand,
        setCliCommand,
        componentName,
        setComponentName,
        isCodeOpen,
        setIsCodeOpen,
        toggleCode,
        isInfoOpen,
        setIsInfoOpen,
        toggleInfo,
      }}
    >
      {children}
    </PreviewStageContext.Provider>
  );
}

export function usePreviewStage() {
  const context = useContext(PreviewStageContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      code: '',
      setCode: () => {},
      cliCommand: '',
      setCliCommand: () => {},
      componentName: '',
      setComponentName: () => {},
      isCodeOpen: false,
      setIsCodeOpen: () => {},
      toggleCode: () => {},
      isInfoOpen: false,
      setIsInfoOpen: () => {},
      toggleInfo: () => {},
    };
  }
  return context;
}

export const InDocContentContext = createContext<boolean>(false);
export const useInDocContent = () => useContext(InDocContentContext);

