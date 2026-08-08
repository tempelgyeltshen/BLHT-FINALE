/**
 * Lightweight client-side analytics.
 *
 * Events are buffered in-memory and flushed to an optional analytics endpoint
 * (`VITE_ANALYTICS_ENDPOINT`). When no endpoint is configured the events are
 * logged to the console in development only, so calls are always safe no-ops
 * in production without a provider.
 */

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
  timestamp: string;
}

const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT as string | undefined;
const isDev = import.meta.env.DEV;

class AnalyticsService {
  private buffer: AnalyticsEvent[] = [];

  trackEvent(name: string, properties?: Record<string, unknown>): void {
    const event: AnalyticsEvent = {
      name,
      properties,
      timestamp: new Date().toISOString(),
    };
    this.buffer.push(event);

    if (isDev) {
      // eslint-disable-next-line no-console
      console.info(`[analytics] ${name}`, properties ?? {});
    }

    if (this.buffer.length >= 10) {
      void this.flush();
    }
  }

  trackPageView(path: string): void {
    this.trackEvent('page_view', { path });
  }

  getEvents(): AnalyticsEvent[] {
    return [...this.buffer];
  }

  async flush(): Promise<void> {
    const events = this.buffer.splice(0);
    if (events.length === 0) return;

    if (!endpoint) return;

    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events }),
        keepalive: true,
      });
    } catch {
      // Analytics must never break the app — drop the batch on failure.
      this.buffer = [...events, ...this.buffer];
    }
  }
}

export const analyticsService = new AnalyticsService();
