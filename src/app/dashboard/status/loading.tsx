import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

/**
 * System Status Skeleton (#1494 / #1595).
 *
 * `dashboard/status/page.tsx` is `force-dynamic` and awaits `runHealthCheck()`
 * (checking PostgreSQL, Redis, and Groq LLM) before rendering.
 * This loading skeleton mirrors the header, system status banner, overview
 * stat tiles, and component service rows to prevent layout shift.
 */
export default function StatusLoading() {
  return (
    <div
      className="space-y-8 animate-in fade-in duration-500"
      data-testid="status-loading"
      role="status"
      aria-busy="true"
      aria-label="Loading system operational status"
    >
      {/* Header section skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-9 w-44" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>
      </div>

      {/* Main Status Banner Card Skeleton */}
      <Card
        className="glass-card bg-primary/5 border-primary/20"
        data-testid="status-banner-skeleton"
      >
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="space-y-1.5">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-7 w-28 rounded-full" />
              <Skeleton className="h-2.5 w-2.5 rounded-full" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/5">
            {[0, 1, 2].map((idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg bg-black/40 border border-white/5 space-y-2"
                data-testid={`overview-stat-skeleton-${idx}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-3 w-10" />
                </div>
                <div className="flex items-baseline justify-between pt-1">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Service Components Card Skeleton */}
      <Card className="glass-card border-white/10" data-testid="status-components-skeleton">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3 w-60" />
            </div>
            <Skeleton className="h-4 w-20" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {[0, 1, 2].map((idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-5"
              data-testid={`component-skeleton-${idx}`}
            >
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-2.5 w-2.5 rounded-full" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
