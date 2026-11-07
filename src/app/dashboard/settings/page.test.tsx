/**
 * @vitest-environment jsdom
 */
import "@testing-library/jest-dom/vitest";
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import SettingsPage from "./page";
import SettingsLoading from "./loading";
import * as authModule from "@/auth";
import * as settingsActions from "@/lib/actions/settings";

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  }),
}));

vi.mock("@/lib/actions/settings", () => ({
  getSlackWebhook: vi.fn(),
  getTeamsWebhook: vi.fn(),
  getVoiceAlerts: vi.fn(),
}));

vi.mock("./settings-client", () => ({
  default: ({ initialWebhookUrl, initialTeamsWebhookUrl, initialVoiceAlertsEnabled }: any) => (
    <div data-testid="settings-client-mock">
      <span data-testid="slack-url">{initialWebhookUrl || "empty-slack"}</span>
      <span data-testid="teams-url">{initialTeamsWebhookUrl || "empty-teams"}</span>
      <span data-testid="voice-enabled">
        {initialVoiceAlertsEnabled ? "voice-on" : "voice-off"}
      </span>
    </div>
  ),
}));

describe("SettingsPage Server Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects unauthenticated users to signin page", async () => {
    vi.mocked(authModule.auth).mockResolvedValueOnce(null as any);

    await expect(SettingsPage()).rejects.toThrow("NEXT_REDIRECT:/api/auth/signin");
  });

  it("redirects users missing user id in session", async () => {
    vi.mocked(authModule.auth).mockResolvedValueOnce({
      user: { name: "No ID" },
    } as any);

    await expect(SettingsPage()).rejects.toThrow("NEXT_REDIRECT:/api/auth/signin");
  });

  it("fetches webhook configs and voice alert preference on render", async () => {
    vi.mocked(authModule.auth).mockResolvedValueOnce({
      user: { id: "user-settings-1", email: "secops@secureflow.io" },
    } as any);

    vi.mocked(settingsActions.getSlackWebhook).mockResolvedValueOnce(
      "https://hooks.slack.com/services/T00/B00/X00",
    );
    vi.mocked(settingsActions.getTeamsWebhook).mockResolvedValueOnce(
      "https://outlook.office.com/webhook/test-teams",
    );
    vi.mocked(settingsActions.getVoiceAlerts).mockResolvedValueOnce(true);

    const jsx = await SettingsPage();
    render(jsx);

    expect(screen.getByTestId("settings-client-mock")).toBeInTheDocument();
    expect(screen.getByTestId("slack-url")).toHaveTextContent(
      "https://hooks.slack.com/services/T00/B00/X00",
    );
    expect(screen.getByTestId("teams-url")).toHaveTextContent(
      "https://outlook.office.com/webhook/test-teams",
    );
    expect(screen.getByTestId("voice-enabled")).toHaveTextContent("voice-on");
  });

  it("handles null webhook URLs and disabled voice alerts appropriately", async () => {
    vi.mocked(authModule.auth).mockResolvedValueOnce({
      user: { id: "user-settings-2", email: "admin@secureflow.io" },
    } as any);

    vi.mocked(settingsActions.getSlackWebhook).mockResolvedValueOnce(null);
    vi.mocked(settingsActions.getTeamsWebhook).mockResolvedValueOnce(null);
    vi.mocked(settingsActions.getVoiceAlerts).mockResolvedValueOnce(false);

    const jsx = await SettingsPage();
    render(jsx);

    expect(screen.getByTestId("settings-client-mock")).toBeInTheDocument();
    expect(screen.getByTestId("slack-url")).toHaveTextContent("empty-slack");
    expect(screen.getByTestId("teams-url")).toHaveTextContent("empty-teams");
    expect(screen.getByTestId("voice-enabled")).toHaveTextContent("voice-off");
  });

  it("handles partial webhook states where only Teams or only Slack is configured", async () => {
    vi.mocked(authModule.auth).mockResolvedValueOnce({
      user: { id: "user-settings-teams-only", email: "teams@secureflow.io" },
    } as any);

    vi.mocked(settingsActions.getSlackWebhook).mockResolvedValueOnce(null);
    vi.mocked(settingsActions.getTeamsWebhook).mockResolvedValueOnce(
      "https://outlook.office.com/webhook/test-teams-only",
    );
    vi.mocked(settingsActions.getVoiceAlerts).mockResolvedValueOnce(true);

    const jsx = await SettingsPage();
    render(jsx);

    expect(screen.getByTestId("slack-url")).toHaveTextContent("empty-slack");
    expect(screen.getByTestId("teams-url")).toHaveTextContent(
      "https://outlook.office.com/webhook/test-teams-only",
    );
    expect(screen.getByTestId("voice-enabled")).toHaveTextContent("voice-on");
  });

  it("handles whitespace or empty string webhook responses cleanly", async () => {
    vi.mocked(authModule.auth).mockResolvedValueOnce({
      user: { id: "user-settings-whitespace", email: "whitespace@secureflow.io" },
    } as any);

    vi.mocked(settingsActions.getSlackWebhook).mockResolvedValueOnce("");
    vi.mocked(settingsActions.getTeamsWebhook).mockResolvedValueOnce("");
    vi.mocked(settingsActions.getVoiceAlerts).mockResolvedValueOnce(false);

    const jsx = await SettingsPage();
    render(jsx);

    expect(screen.getByTestId("slack-url")).toHaveTextContent("empty-slack");
    expect(screen.getByTestId("teams-url")).toHaveTextContent("empty-teams");
    expect(screen.getByTestId("voice-enabled")).toHaveTextContent("voice-off");
  });

  it("propagates unexpected action rejection to the error boundary", async () => {
    vi.mocked(authModule.auth).mockResolvedValueOnce({
      user: { id: "user-settings-3", email: "audit@secureflow.io" },
    } as any);

    vi.mocked(settingsActions.getSlackWebhook).mockRejectedValueOnce(
      new Error("Database transaction failed"),
    );
    vi.mocked(settingsActions.getTeamsWebhook).mockResolvedValueOnce(null);
    vi.mocked(settingsActions.getVoiceAlerts).mockResolvedValueOnce(false);

    await expect(SettingsPage()).rejects.toThrow("Database transaction failed");
  });
});

describe("SettingsLoading Skeleton Component", () => {
  it("renders with accessibility attributes for screen readers", () => {
    render(<SettingsLoading />);
    const root = screen.getByTestId("settings-loading");
    expect(root).toBeInTheDocument();
    expect(root).toHaveAttribute("role", "status");
    expect(root).toHaveAttribute("aria-busy", "true");
    expect(root).toHaveAttribute("aria-label", "Loading security alert settings");
  });

  it("renders Slack webhook card skeleton with action buttons", () => {
    render(<SettingsLoading />);
    const slackCard = screen.getByTestId("slack-settings-skeleton");
    expect(slackCard).toBeInTheDocument();

    const buttons = slackCard.querySelectorAll(".pt-2 .animate-pulse");
    expect(buttons.length).toBe(2);
  });

  it("renders Teams webhook card skeleton with action buttons", () => {
    render(<SettingsLoading />);
    const teamsCard = screen.getByTestId("teams-settings-skeleton");
    expect(teamsCard).toBeInTheDocument();

    const buttons = teamsCard.querySelectorAll(".pt-2 .animate-pulse");
    expect(buttons.length).toBe(2);
  });

  it("renders Voice alerts switch and info block skeleton", () => {
    render(<SettingsLoading />);
    const voiceCard = screen.getByTestId("voice-settings-skeleton");
    expect(voiceCard).toBeInTheDocument();

    const switchSkeleton = voiceCard.querySelector(".rounded-full");
    expect(switchSkeleton).toBeInTheDocument();
  });

  it("contains sufficient pulse skeleton elements across all 3 setting cards", () => {
    const { container } = render(<SettingsLoading />);
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThanOrEqual(16);
  });

  it("ensures all input placeholder skeletons have appropriate height and width styling", () => {
    const { container } = render(<SettingsLoading />);
    const inputs = container.querySelectorAll(".h-10.w-full");
    expect(inputs.length).toBe(2);
    inputs.forEach((input) => {
      expect(input).toHaveClass("animate-pulse", "rounded-md");
    });
  });

  it("matches visual card container classes and structure across rerenders", () => {
    const { unmount, container: first } = render(<SettingsLoading />);
    expect(first.querySelectorAll(".glass-card").length).toBe(3);
    unmount();
    const { container: second } = render(<SettingsLoading />);
    expect(second.querySelectorAll(".glass-card").length).toBe(3);
  });

  it("verifies heading skeleton block dimensions", () => {
    const { container } = render(<SettingsLoading />);
    const heading = container.querySelector(".space-y-2");
    expect(heading).toBeInTheDocument();
    expect(heading?.querySelectorAll(".animate-pulse").length).toBe(2);
  });

  it("verifies all three settings cards maintain distinct test IDs", () => {
    render(<SettingsLoading />);
    expect(screen.getByTestId("slack-settings-skeleton")).toBeInTheDocument();
    expect(screen.getByTestId("teams-settings-skeleton")).toBeInTheDocument();
    expect(screen.getByTestId("voice-settings-skeleton")).toBeInTheDocument();
  });

  it("ensures all action buttons in cards have valid height classes", () => {
    const { container } = render(<SettingsLoading />);
    const actionButtons = container.querySelectorAll(".h-9.w-28, .h-9.w-32, .h-8.w-24");
    expect(actionButtons.length).toBe(5);
    actionButtons.forEach((btn) => {
      expect(btn).toHaveClass("animate-pulse", "rounded-md");
    });
  });

  it("ensures card header icons render with expected pulse styling", () => {
    const { container } = render(<SettingsLoading />);
    const icons = container.querySelectorAll(".h-5.w-5.rounded");
    expect(icons.length).toBe(3);
    icons.forEach((icon) => {
      expect(icon).toHaveClass("animate-pulse");
    });
  });

  it("renders with proper responsive container wrapper", () => {
    const { container } = render(<SettingsLoading />);
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass("max-w-4xl", "space-y-8");
  });

  it("simulates fast re-renders to confirm absence of memory leaks or DOM retention", () => {
    for (let i = 0; i < 5; i++) {
      const { unmount } = render(<SettingsLoading />);
      unmount();
    }
  });

  it("handles empty webhook responses when initial database query returns undefined", async () => {
    vi.mocked(authModule.auth).mockResolvedValueOnce({
      user: { id: "user-settings-undef", email: "undef@secureflow.io" },
    } as any);

    vi.mocked(settingsActions.getSlackWebhook).mockResolvedValueOnce(undefined as any);
    vi.mocked(settingsActions.getTeamsWebhook).mockResolvedValueOnce(undefined as any);
    vi.mocked(settingsActions.getVoiceAlerts).mockResolvedValueOnce(false);

    const jsx = await SettingsPage();
    render(jsx);

    expect(screen.getByTestId("slack-url")).toHaveTextContent("empty-slack");
    expect(screen.getByTestId("teams-url")).toHaveTextContent("empty-teams");
    expect(screen.getByTestId("voice-enabled")).toHaveTextContent("voice-off");
  });

  it("verifies card header title text skeletons have expected width bounds", () => {
    const { container } = render(<SettingsLoading />);
    const titles = container.querySelectorAll(".h-6.w-48, .h-6.w-52, .h-6.w-36");
    expect(titles.length).toBe(3);
    titles.forEach((title) => {
      expect(title).toHaveClass("animate-pulse");
    });
  });

  it("verifies badge pill placeholder skeletons in webhook cards", () => {
    const { container } = render(<SettingsLoading />);
    const badges = container.querySelectorAll(".h-5.w-16.rounded-full");
    expect(badges.length).toBe(2);
    badges.forEach((badge) => {
      expect(badge).toHaveClass("animate-pulse");
    });
  });

  it("verifies input label skeletons in both Slack and Teams cards", () => {
    const { container } = render(<SettingsLoading />);
    const labels = container.querySelectorAll(".h-4.w-28, .h-4.w-32");
    expect(labels.length).toBe(2);
    labels.forEach((label) => {
      expect(label).toHaveClass("animate-pulse");
    });
  });

  it("ensures sub-description skeletons render within every settings card", () => {
    const { container } = render(<SettingsLoading />);
    const descriptions = container.querySelectorAll(".h-4.w-80, .h-4.w-84, .h-4.w-72");
    expect(descriptions.length).toBe(3);
    descriptions.forEach((desc) => {
      expect(desc).toHaveClass("animate-pulse");
    });
  });
});
