import React from "react";

export default function WorkspaceLoading() {
  return (
    <div className="space-y-6 animate-pulse p-2">
      {/* Hero Band Skeleton */}
      <div className="h-32 bg-app-surface border border-app-border rounded-card p-6 flex items-center justify-between">
        <div className="space-y-3 w-1/2">
          <div className="h-4 bg-app-border/60 rounded w-28" />
          <div className="h-7 bg-app-border/80 rounded w-64" />
          <div className="h-5 bg-app-border/50 rounded w-48" />
        </div>
        <div className="w-16 h-16 rounded-full bg-app-border/70" />
      </div>

      {/* KPI Tiles Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-24 bg-app-surface border border-app-border rounded-card p-4 space-y-2"
          >
            <div className="h-3 bg-app-border/60 rounded w-16" />
            <div className="h-6 bg-app-border/80 rounded w-20" />
            <div className="h-3 bg-app-border/40 rounded w-12" />
          </div>
        ))}
      </div>

      {/* Main Content Skeleton (Two Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-96 bg-app-surface border border-app-border rounded-card p-6 space-y-4">
          <div className="h-5 bg-app-border/70 rounded w-40" />
          <div className="h-12 bg-app-border/40 rounded" />
          <div className="h-12 bg-app-border/40 rounded" />
          <div className="h-12 bg-app-border/40 rounded" />
          <div className="h-12 bg-app-border/40 rounded" />
        </div>

        <div className="h-96 bg-app-surface border border-app-border rounded-card p-6 space-y-4">
          <div className="h-5 bg-app-border/70 rounded w-36" />
          <div className="h-44 bg-app-border/40 rounded" />
          <div className="h-20 bg-app-border/50 rounded" />
        </div>
      </div>
    </div>
  );
}
