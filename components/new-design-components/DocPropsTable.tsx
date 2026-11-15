'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface PropItem {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export interface DocPropsTableProps {
  props?: PropItem[];
}

export function DocPropsTable({ props }: DocPropsTableProps) {
  if (!props || props.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <h2
        id="props"
        className="font-medium text-lg sm:text-xl tracking-tight text-foreground scroll-m-20"
      >
        Props
      </h2>

      <div className="overflow-hidden rounded-lg border border-border/60 bg-muted/15 dark:bg-neutral-900/25 shadow-pill-inset">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[560px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-border/40 bg-muted/30 dark:bg-neutral-900/40">
                <th className="w-[140px] px-3.5 py-2.5 font-medium text-muted-foreground tracking-wider uppercase text-[10px]">
                  Prop
                </th>
                <th className="w-[180px] px-3.5 py-2.5 font-medium text-muted-foreground tracking-wider uppercase text-[10px]">
                  Type
                </th>
                <th className="w-[110px] px-3.5 py-2.5 font-medium text-muted-foreground tracking-wider uppercase text-[10px]">
                  Default
                </th>
                <th className="px-3.5 py-2.5 font-medium text-muted-foreground tracking-wider uppercase text-[10px]">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {props.map((prop, index) => (
                <tr
                  key={index}
                  className="transition-colors hover:bg-muted/30 dark:hover:bg-neutral-900/40"
                >
                  <td className="px-3.5 py-3 align-middle font-mono font-semibold text-foreground text-xs">
                    {prop.name}
                  </td>
                  <td className="px-3.5 py-3 align-middle">
                    <code className="inline-flex items-center rounded-md border border-primary/20 bg-primary/8 px-1.5 py-0.5 font-mono text-[10px] font-medium text-primary">
                      {prop.type}
                    </code>
                  </td>
                  <td className="px-3.5 py-3 align-middle font-mono text-[10px] text-muted-foreground/80">
                    {prop.default || '-'}
                  </td>
                  <td className="px-3.5 py-3 align-middle text-[10px] text-muted-foreground leading-relaxed">
                    {prop.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default DocPropsTable;
