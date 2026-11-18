'use client';

import React from 'react';

export type GuideType = 'none' | 'columns' | 'rows' | 'grid';
export type GuideTarget = 'page' | 'component';

export interface ColumnConfig {
  count: number | 'auto';
  type: 'stretch' | 'center' | 'left' | 'right';
  width: number | 'auto';
  margin: number;
  offset: number;
  gutter: number;
  opacity: number;
}

export interface RowConfig {
  count: number | 'auto';
  type: 'stretch' | 'top' | 'bottom' | 'center';
  height: number | 'auto';
  margin: number;
  offset: number;
  gutter: number;
  opacity: number;
}

export interface GridConfig {
  size: number;
  opacity: number;
}

export interface GuidesState {
  mode: GuideType;
  target: GuideTarget;
  columns: ColumnConfig;
  rows: RowConfig;
  grid: GridConfig;
}

export const DEFAULT_GUIDES_STATE: GuidesState = {
  mode: 'none',
  target: 'component',
  columns: {
    count: 12,
    type: 'stretch',
    width: 'auto',
    margin: 16,
    offset: 0,
    gutter: 16,
    opacity: 12,
  },
  rows: {
    count: 'auto',
    type: 'top',
    height: 16,
    margin: 0,
    offset: 0,
    gutter: 8,
    opacity: 12,
  },
  grid: {
    size: 10,
    opacity: 12,
  },
};

interface LabGuidesProps {
  config: GuidesState;
}

export function LabGuides({ config }: LabGuidesProps) {
  const { mode, target, columns, rows, grid } = config;

  if (mode === 'none') return null;

  const colorBase = '244, 63, 94'; // rose tint (Figma standard)

  return (
    <div
      data-lab-guide="true"
      className={
        target === 'page'
          ? 'pointer-events-none fixed inset-0 z-30 overflow-hidden select-none'
          : 'pointer-events-none absolute inset-0 z-30 overflow-hidden select-none rounded-[inherit]'
      }
    >
      {/* 1. COLUMNS GUIDE */}
      {mode === 'columns' && (
        <div
          className="h-full w-full flex"
          style={{
            paddingLeft: columns.type === 'stretch' ? `${columns.margin}px` : undefined,
            paddingRight: columns.type === 'stretch' ? `${columns.margin}px` : undefined,
            marginLeft: columns.type === 'left' ? `${columns.offset}px` : undefined,
            marginRight: columns.type === 'right' ? `${columns.offset}px` : undefined,
            justifyContent:
              columns.type === 'center'
                ? 'center'
                : columns.type === 'right'
                ? 'flex-end'
                : 'flex-start',
            gap: `${columns.gutter}px`,
          }}
        >
          {columns.count !== 'auto'
            ? Array.from({ length: Number(columns.count) }).map((_, i) => (
                <div
                  key={i}
                  className="h-full flex flex-col justify-between transition-all"
                  style={{
                    backgroundColor: `rgba(${colorBase}, ${columns.opacity / 100})`,
                    borderLeft: `1px solid rgba(${colorBase}, ${(columns.opacity * 1.5) / 100})`,
                    borderRight: `1px solid rgba(${colorBase}, ${(columns.opacity * 1.5) / 100})`,
                    width: columns.width !== 'auto' ? `${columns.width}px` : undefined,
                    flex: columns.type === 'stretch' ? 1 : 'none',
                  }}
                >
                  <span
                    className="p-1 font-mono text-[9px] font-medium"
                    style={{ color: `rgba(${colorBase}, 0.8)` }}
                  >
                    {i + 1}
                  </span>
                </div>
              ))
            : (
                <div
                  className="h-full w-full"
                  style={{
                    backgroundImage: `linear-gradient(to right, rgba(${colorBase}, ${columns.opacity / 100}) ${columns.width === 'auto' ? 60 : columns.width}px, transparent ${columns.width === 'auto' ? 60 : columns.width}px, transparent ${Number(columns.width === 'auto' ? 60 : columns.width) + columns.gutter}px)`,
                    backgroundSize: `${Number(columns.width === 'auto' ? 60 : columns.width) + columns.gutter}px 100%`,
                  }}
                />
              )}
        </div>
      )}

      {/* 2. ROWS GUIDE */}
      {mode === 'rows' && (
        <div
          className="h-full w-full flex flex-col"
          style={{
            paddingTop: rows.type === 'stretch' ? `${rows.margin}px` : undefined,
            paddingBottom: rows.type === 'stretch' ? `${rows.margin}px` : undefined,
            marginTop: rows.type === 'top' ? `${rows.offset}px` : undefined,
            marginBottom: rows.type === 'bottom' ? `${rows.offset}px` : undefined,
            justifyContent:
              rows.type === 'center'
                ? 'center'
                : rows.type === 'bottom'
                ? 'flex-end'
                : 'flex-start',
            gap: `${rows.gutter}px`,
          }}
        >
          {rows.count !== 'auto'
            ? Array.from({ length: Number(rows.count) }).map((_, i) => (
                <div
                  key={i}
                  className="w-full transition-all"
                  style={{
                    backgroundColor: `rgba(${colorBase}, ${rows.opacity / 100})`,
                    borderTop: `1px solid rgba(${colorBase}, ${(rows.opacity * 1.5) / 100})`,
                    borderBottom: `1px solid rgba(${colorBase}, ${(rows.opacity * 1.5) / 100})`,
                    height: rows.height !== 'auto' ? `${rows.height}px` : undefined,
                    flex: rows.type === 'stretch' ? 1 : 'none',
                  }}
                />
              ))
            : (
                <div
                  className="h-full w-full"
                  style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(${colorBase}, ${rows.opacity / 100}) ${rows.height}px, transparent ${rows.height}px, transparent ${Number(rows.height) + rows.gutter}px)`,
                    backgroundSize: `100% ${Number(rows.height) + rows.gutter}px`,
                  }}
                />
              )}
        </div>
      )}

      {/* 3. GRID GUIDE */}
      {mode === 'grid' && (
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(${colorBase}, ${grid.opacity / 100}) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(${colorBase}, ${grid.opacity / 100}) 1px, transparent 1px)
            `,
            backgroundSize: `${grid.size}px ${grid.size}px`,
          }}
        />
      )}
    </div>
  );
}

export default LabGuides;
