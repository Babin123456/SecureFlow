/**
 * @vitest-environment jsdom
 */
import "@testing-library/jest-dom/vitest";
import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AiHealthLoading from "./loading";

describe("AiHealthLoading Skeleton Component (#560)", () => {
  it("renders with aria-busy='true', testid, and accessible label", () => {
    render(<AiHealthLoading />);
    const container = screen.getByTestId("ai-health-loading");
    expect(container).toBeInTheDocument();
    expect(container).toHaveAttribute("aria-busy", "true");
    expect(container).toHaveAttribute("aria-label", "Loading AI health status");
  });

  it("exposes proper classes and structure on root container", () => {
    const { container } = render(<AiHealthLoading />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toBeInTheDocument();
    expect(root).toHaveClass("space-y-8", "animate-in", "fade-in", "duration-500");
  });

  it("renders page header skeleton placeholders and action buttons", () => {
    const { container } = render(<AiHealthLoading />);
    const header = container.querySelector(".flex.flex-col.md\\:flex-row");
    expect(header).toBeInTheDocument();

    const titleBlock = header?.querySelector("div");
    const titleSkeletons = titleBlock?.querySelectorAll(".animate-pulse");
    expect(titleSkeletons?.length).toBe(4);
    expect(titleSkeletons?.[0]).toHaveClass("h-4", "w-4", "rounded-full");
    expect(titleSkeletons?.[1]).toHaveClass("h-4", "w-40");
    expect(titleSkeletons?.[2]).toHaveClass("h-10", "w-72");
    expect(titleSkeletons?.[3]).toHaveClass("h-4", "w-96");

    const buttonBlock = header?.querySelectorAll(".flex.items-center.gap-3")[0];
    const buttonSkeletons = buttonBlock?.querySelectorAll(".animate-pulse");
    expect(buttonSkeletons?.length).toBe(2);
    expect(buttonSkeletons?.[0]).toHaveClass("h-9", "w-28", "rounded-md");
    expect(buttonSkeletons?.[1]).toHaveClass("h-9", "w-28", "rounded-md");
  });

  it("renders four stat cards in the overview grid", () => {
    const { container } = render(<AiHealthLoading />);
    const statGrid = container.querySelector(
      ".grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-4.gap-6",
    );
    expect(statGrid).toBeInTheDocument();

    const cards = statGrid?.querySelectorAll(".glass-card");
    expect(cards?.length).toBe(4);

    cards?.forEach((card) => {
      const skeletons = card.querySelectorAll(".animate-pulse");
      expect(skeletons.length).toBe(4);
      expect(skeletons[0]).toHaveClass("h-4", "w-24");
      expect(skeletons[1]).toHaveClass("h-5", "w-5", "rounded-full");
      expect(skeletons[2]).toHaveClass("h-10", "w-20");
      expect(skeletons[3]).toHaveClass("h-3", "w-32");
    });
  });

  it("renders three model status cards with telemetry rows", () => {
    const { container } = render(<AiHealthLoading />);
    const modelGrid = container.querySelector(
      ".grid.grid-cols-1.md\\:grid-cols-2.xl\\:grid-cols-3.gap-6",
    );
    expect(modelGrid).toBeInTheDocument();

    const cards = modelGrid?.querySelectorAll(".glass-card");
    expect(cards?.length).toBe(3);

    cards?.forEach((card) => {
      const headerSkeletons = card.querySelectorAll(".pb-3 .animate-pulse");
      expect(headerSkeletons.length).toBe(3);
      expect(headerSkeletons[0]).toHaveClass("h-5", "w-36");
      expect(headerSkeletons[1]).toHaveClass("h-3", "w-24");
      expect(headerSkeletons[2]).toHaveClass("h-6", "w-16", "rounded-full");

      const progressBar = card.querySelector(".h-2.w-full.rounded-full");
      expect(progressBar).toBeInTheDocument();
      expect(progressBar).toHaveClass("animate-pulse");
    });
  });

  it("renders telemetry chart and failover timeline skeletons in 3-column layout", () => {
    const { container } = render(<AiHealthLoading />);
    const bottomGrid = container.querySelector(".grid.grid-cols-1.lg\\:grid-cols-3.gap-6");
    expect(bottomGrid).toBeInTheDocument();

    const chartCard = bottomGrid?.querySelector(".lg\\:col-span-2.glass-card");
    expect(chartCard).toBeInTheDocument();
    const chartContentSkeleton = chartCard?.querySelector(".h-\\[280px\\].w-full.rounded-lg");
    expect(chartContentSkeleton).toBeInTheDocument();

    const timelineCard = bottomGrid?.querySelectorAll(".glass-card")[1];
    expect(timelineCard).toBeInTheDocument();
    const timelineItems = timelineCard?.querySelectorAll(".space-y-3 > div");
    expect(timelineItems?.length).toBe(4);
  });
});
