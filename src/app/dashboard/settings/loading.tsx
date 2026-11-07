import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

/**
 * Settings Route Loading Skeleton (#1596).
 *
 * `dashboard/settings/page.tsx` is an async server component that awaits
 * `auth()`, `getSlackWebhook()`, `getTeamsWebhook()`, and `getVoiceAlerts()`
 * before rendering. This skeleton preserves layout stability by mirroring
 * the header, Slack webhook card, Microsoft Teams webhook card, and Voice Alerts card.
 */
export default function SettingsLoading() {
  return (
    <div
      className="max-w-4xl space-y-8 animate-in fade-in duration-500"
      data-testid="settings-loading"
      role="status"
      aria-busy="true"
      aria-label="Loading security alert settings"
    >
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      <div className="grid gap-6">
        {/* Slack Webhook Card Skeleton */}
        <Card className="glass-card border-white/10" data-testid="slack-settings-skeleton">
          <CardHeader className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-6 w-48" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-80 max-w-full" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Skeleton className="h-9 w-28 rounded-md" />
              <Skeleton className="h-9 w-32 rounded-md" />
            </div>
          </CardContent>
        </Card>

        {/* Microsoft Teams Webhook Card Skeleton */}
        <Card className="glass-card border-white/10" data-testid="teams-settings-skeleton">
          <CardHeader className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-6 w-52" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-84 max-w-full" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Skeleton className="h-9 w-28 rounded-md" />
              <Skeleton className="h-9 w-32 rounded-md" />
            </div>
          </CardContent>
        </Card>

        {/* Voice Alerts Card Skeleton */}
        <Card className="glass-card border-white/10" data-testid="voice-settings-skeleton">
          <CardHeader className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-6 w-36" />
              </div>
              <Skeleton className="h-6 w-11 rounded-full" />
            </div>
            <Skeleton className="h-4 w-72 max-w-full" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5 space-y-2">
              <Skeleton className="h-3.5 w-64 max-w-full" />
              <Skeleton className="h-3 w-48 max-w-full" />
            </div>
            <div className="flex items-center justify-between pt-1">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
