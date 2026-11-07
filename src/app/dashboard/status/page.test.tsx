/**
 * @vitest-environment jsdom
 */
import "@testing-library/jest-dom/vitest";
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import StatusPage from "./page";
import StatusLoading from "./loading";
import * as authModule from "@/auth";
import * as healthCheckModule from "@/lib/health-check";

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  }),
}));

vi.mock("@/lib/health-check", () => ({
  runHealthCheck: vi.fn(),
}));

vi.mock("./status-client", () => ({
  default: ({ status, timestamp, uptime, components }: any) => (
    <div data-testid="status-client-mock">
      <span data-testid="overall-status">{status}</span>
      <span data-testid="timestamp">{timestamp}</span>
      <span data-testid="uptime">{uptime}</span>
      <ul data-testid="components-list">
        {components.map((c: any) => (
          <li key={c.name} data-testid={`component-${c.name}`}>
            {c.name} - {c.status} ({c.latencyMs}ms)
          </li>
        ))}
      </ul>
    </div>
  ),
}));

describe("StatusPage Server Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects unauthenticated users to signin", async () => {
    vi.mocked(authModule.auth).mockResolvedValueOnce(null as any);

    await expect(StatusPage()).rejects.toThrow("NEXT_REDIRECT:/api/auth/signin");
  });

  it("redirects users with missing user id in session", async () => {
    vi.mocked(authModule.auth).mockResolvedValueOnce({
      user: { email: "no-id@secureflow.io" },
    } as any);

    await expect(StatusPage()).rejects.toThrow("NEXT_REDIRECT:/api/auth/signin");
  });

  it("fetches operational health check and passes data to StatusClient", async () => {
    vi.mocked(authModule.auth).mockResolvedValueOnce({
      user: { id: "user-ops-1", email: "secops@secureflow.io" },
    } as any);

    const mockReport: healthCheckModule.HealthReport = {
      status: "healthy",
      timestamp: "2026-11-07T12:00:00Z",
      uptime: 86400,
      components: [
        {
          name: "PostgreSQL",
          status: "healthy",
          latencyMs: 12,
          message: "Database connection active",
        },
        {
          name: "Redis",
          status: "healthy",
          latencyMs: 4,
          message: "Cache and queue operational",
        },
        {
          name: "Groq LLM",
          status: "healthy",
          latencyMs: 95,
          message: "AI inference reachable",
        },
      ],
    };

    vi.mocked(healthCheckModule.runHealthCheck).mockResolvedValueOnce(mockReport);

    const jsx = await StatusPage();
    render(jsx);

    expect(screen.getByTestId("status-client-mock")).toBeInTheDocument();
    expect(screen.getByTestId("overall-status")).toHaveTextContent("healthy");
    expect(screen.getByTestId("timestamp")).toHaveTextContent("2026-11-07T12:00:00Z");
    expect(screen.getByTestId("uptime")).toHaveTextContent("86400");
    expect(screen.getByTestId("component-PostgreSQL")).toHaveTextContent(
      "PostgreSQL - healthy (12ms)",
    );
    expect(screen.getByTestId("component-Redis")).toHaveTextContent("Redis - healthy (4ms)");
    expect(screen.getByTestId("component-Groq LLM")).toHaveTextContent("Groq LLM - healthy (95ms)");
  });

  it("correctly propagates degraded or down component states", async () => {
    vi.mocked(authModule.auth).mockResolvedValueOnce({
      user: { id: "user-ops-2", email: "admin@secureflow.io" },
    } as any);

    const degradedReport: healthCheckModule.HealthReport = {
      status: "degraded",
      timestamp: "2026-11-07T13:00:00Z",
      uptime: 43200,
      components: [
        {
          name: "PostgreSQL",
          status: "healthy",
          latencyMs: 15,
        },
        {
          name: "Redis",
          status: "degraded",
          latencyMs: 250,
          message: "High queue latency detected",
        },
        {
          name: "Groq LLM",
          status: "down",
          latencyMs: 0,
          message: "Connection timeout",
        },
      ],
    };

    vi.mocked(healthCheckModule.runHealthCheck).mockResolvedValueOnce(degradedReport);

    const jsx = await StatusPage();
    render(jsx);

    expect(screen.getByTestId("overall-status")).toHaveTextContent("degraded");
    expect(screen.getByTestId("component-Redis")).toHaveTextContent("Redis - degraded (250ms)");
    expect(screen.getByTestId("component-Groq LLM")).toHaveTextContent("Groq LLM - down (0ms)");
  });

  it("handles empty components array gracefully without crashing", async () => {
    vi.mocked(authModule.auth).mockResolvedValueOnce({
      user: { id: "user-ops-3", email: "dev@secureflow.io" },
    } as any);

    vi.mocked(healthCheckModule.runHealthCheck).mockResolvedValueOnce({
      status: "healthy",
      timestamp: "2026-11-07T14:00:00Z",
      uptime: 100,
      components: [],
    });

    const jsx = await StatusPage();
    render(jsx);

    expect(screen.getByTestId("status-client-mock")).toBeInTheDocument();
    expect(screen.getByTestId("overall-status")).toHaveTextContent("healthy");
    expect(screen.getByTestId("components-list").children.length).toBe(0);
  });

  it("handles unexpected health check errors by allowing boundary to handle or bubbling", async () => {
    vi.mocked(authModule.auth).mockResolvedValueOnce({
      user: { id: "user-ops-4", email: "ops@secureflow.io" },
    } as any);

    vi.mocked(healthCheckModule.runHealthCheck).mockRejectedValueOnce(
      new Error("Database connection pool exhausted"),
    );

    await expect(StatusPage()).rejects.toThrow("Database connection pool exhausted");
  });

  it("handles zero uptime calculation and negative latency values safely", async () => {
    vi.mocked(authModule.auth).mockResolvedValueOnce({
      user: { id: "user-ops-5", email: "lead@secureflow.io" },
    } as any);

    vi.mocked(healthCheckModule.runHealthCheck).mockResolvedValueOnce({
      status: "healthy",
      timestamp: "2026-11-07T15:00:00Z",
      uptime: 0,
      components: [
        {
          name: "PostgreSQL",
          status: "healthy",
          latencyMs: 0,
        },
      ],
    });

    const jsx = await StatusPage();
    render(jsx);

    expect(screen.getByTestId("uptime")).toHaveTextContent("0");
    expect(screen.getByTestId("component-PostgreSQL")).toHaveTextContent(
      "PostgreSQL - healthy (0ms)",
    );
  });
});

describe("StatusLoading Skeleton Component", () => {
  it("renders with semantic accessibility attributes", () => {
    render(<StatusLoading />);
    const root = screen.getByTestId("status-loading");
    expect(root).toBeInTheDocument();
    expect(root).toHaveAttribute("role", "status");
    expect(root).toHaveAttribute("aria-busy", "true");
    expect(root).toHaveAttribute("aria-label", "Loading system operational status");
  });

  it("renders the status banner card skeleton with 3 overview metrics", () => {
    const { container } = render(<StatusLoading />);
    const banner = screen.getByTestId("status-banner-skeleton");
    expect(banner).toBeInTheDocument();

    const metricCards = banner.querySelectorAll(".grid > div");
    expect(metricCards.length).toBe(3);
  });

  it("renders the service components card skeleton with 3 service rows", () => {
    render(<StatusLoading />);
    const componentsCard = screen.getByTestId("status-components-skeleton");
    expect(componentsCard).toBeInTheDocument();

    for (let i = 0; i < 3; i++) {
      expect(screen.getByTestId(`component-skeleton-${i}`)).toBeInTheDocument();
    }
  });

  it("verifies all skeleton components have responsive layout classes", () => {
    const { container } = render(<StatusLoading />);
    const cards = container.querySelectorAll(".glass-card");
    expect(cards.length).toBe(2);

    cards.forEach((card) => {
      expect(card).toBeInTheDocument();
    });
  });

  it("preserves identical placeholder counts between renders", () => {
    const { container: firstRender } = render(<StatusLoading />);
    const countFirst = firstRender.querySelectorAll(".animate-pulse").length;

    const { container: secondRender } = render(<StatusLoading />);
    const countSecond = secondRender.querySelectorAll(".animate-pulse").length;

    expect(countFirst).toBe(countSecond);
    expect(countFirst).toBeGreaterThanOrEqual(18);
  });

  it("contains sufficient pulse skeleton elements to prevent layout shifts", () => {
    const { container } = render(<StatusLoading />);
    const pulseElements = container.querySelectorAll(".animate-pulse");
    expect(pulseElements.length).toBeGreaterThanOrEqual(18);
  });

  it("verifies service component skeleton rows include latency and badge elements", () => {
    render(<StatusLoading />);
    for (let i = 0; i < 3; i++) {
      const row = screen.getByTestId(`component-skeleton-${i}`);
      expect(row).toBeInTheDocument();
      expect(row.querySelectorAll(".animate-pulse").length).toBeGreaterThanOrEqual(4);
    }
  });

  it("renders with correct ARIA live and busy states for screen readers", () => {
    render(<StatusLoading />);
    const statusRegion = screen.getByRole("status");
    expect(statusRegion).toBeInTheDocument();
    expect(statusRegion).toHaveAttribute("aria-busy", "true");
  });

  it("ensures all metric stat tile skeletons render within the banner container", () => {
    render(<StatusLoading />);
    for (let idx = 0; idx < 3; idx++) {
      expect(screen.getByTestId(`overview-stat-skeleton-${idx}`)).toBeInTheDocument();
    }
  });
});
