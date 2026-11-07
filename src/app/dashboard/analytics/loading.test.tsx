/**
 * @vitest-environment jsdom
 */
import "@testing-library/jest-dom/vitest";
import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AnalyticsLoading from "./loading";

describe("AnalyticsLoading Skeleton (#560)", () => {
  it("renders with aria-busy='true' and an accessible label", () => {
    render(<AnalyticsLoading />);
    const container = screen.getByLabelText("Loading analytics overview");
    expect(container).toBeInTheDocument();
    expect(container).toHaveAttribute("aria-busy", "true");
  });

  it("exposes proper classes and structure on container", () => {
    const { container } = render(<AnalyticsLoading />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toBeInTheDocument();
    expect(root).toHaveClass("space-y-8", "animate-in", "fade-in", "duration-500");
  });

  it("renders page header skeleton placeholders", () => {
    const { container } = render(<AnalyticsLoading />);
    const header = container.querySelector("div.space-y-8 > div:first-child");
    expect(header).toBeInTheDocument();

    const skeletons = header?.querySelectorAll(".animate-pulse");
    expect(skeletons?.length).toBe(3);
    expect(skeletons?.[0]).toHaveClass("h-4", "w-40", "mb-2");
    expect(skeletons?.[1]).toHaveClass("h-10", "w-64", "mb-2");
    expect(skeletons?.[2]).toHaveClass("h-4", "w-96");
  });

  it("renders four metric cards in a responsive grid", () => {
    const { container } = render(<AnalyticsLoading />);
    const grid = container.querySelector(
      ".grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-4.gap-6",
    );
    expect(grid).toBeInTheDocument();

    const cards = grid?.querySelectorAll(".glass-card");
    expect(cards?.length).toBe(4);

    cards?.forEach((card) => {
      const skeletons = card.querySelectorAll(".animate-pulse");
      expect(skeletons.length).toBe(3);
      expect(skeletons[0]).toHaveClass("h-4", "w-24", "mb-4");
      expect(skeletons[1]).toHaveClass("h-12", "w-16", "mb-2");
      expect(skeletons[2]).toHaveClass("h-3", "w-20");
    });
  });

  it("renders chart card placeholders in a 3-column layout", () => {
    const { container } = render(<AnalyticsLoading />);
    const chartGrid = container.querySelector(".grid.grid-cols-1.lg\\:grid-cols-3.gap-6");
    expect(chartGrid).toBeInTheDocument();

    const primaryChartCard = chartGrid?.querySelector(".lg\\:col-span-2.glass-card");
    expect(primaryChartCard).toBeInTheDocument();
    const primaryChartSkeleton = primaryChartCard?.querySelector(
      ".h-\\[300px\\].w-full.rounded-lg",
    );
    expect(primaryChartSkeleton).toBeInTheDocument();

    const secondaryChartCard = chartGrid?.querySelectorAll(".glass-card")[1];
    expect(secondaryChartCard).toBeInTheDocument();
    const secondaryChartSkeleton = secondaryChartCard?.querySelector(
      ".h-\\[300px\\].w-full.rounded-lg",
    );
    expect(secondaryChartSkeleton).toBeInTheDocument();
  });

  it("renders wide bottom analytics card skeleton", () => {
    const { container } = render(<AnalyticsLoading />);
    const cards = container.querySelectorAll(".glass-card");
    const bottomCard = cards[cards.length - 1];
    expect(bottomCard).toBeInTheDocument();

    const titleSkeleton = bottomCard.querySelector(".h-5.w-40");
    expect(titleSkeleton).toBeInTheDocument();

    const contentSkeleton = bottomCard.querySelector(".h-\\[200px\\].w-full.rounded-lg");
    expect(contentSkeleton).toBeInTheDocument();
  });
});
