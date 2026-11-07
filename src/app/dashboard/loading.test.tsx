/**
 * @vitest-environment jsdom
 */
import "@testing-library/jest-dom/vitest";
import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DashboardLoading from "./loading";

describe("DashboardLoading Skeleton (#560)", () => {
  it("renders with aria-busy='true' and an accessible label", () => {
    render(<DashboardLoading />);
    const container = screen.getByLabelText("Loading dashboard");
    expect(container).toBeInTheDocument();
    expect(container).toHaveAttribute("aria-busy", "true");
  });

  it("exposes the correct structure and class names on root", () => {
    const { container } = render(<DashboardLoading />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toBeInTheDocument();
    expect(root).toHaveAttribute("aria-label", "Loading dashboard");
    expect(root).toHaveClass("space-y-8");
  });

  it("renders header skeleton placeholders for title and subtitle", () => {
    const { container } = render(<DashboardLoading />);
    const header = container.querySelector(".space-y-2");
    expect(header).toBeInTheDocument();

    const skeletons = header?.querySelectorAll(".animate-pulse");
    expect(skeletons?.length).toBe(2);
    expect(skeletons?.[0]).toHaveClass("h-9", "w-64");
    expect(skeletons?.[1]).toHaveClass("h-4", "w-96", "max-w-full");
  });

  it("renders three stat card skeletons in a responsive grid", () => {
    const { container } = render(<DashboardLoading />);
    const grid = container.querySelector(".grid.grid-cols-1.gap-6.md\\:grid-cols-3");
    expect(grid).toBeInTheDocument();

    const cards = grid?.querySelectorAll(".glass-card.rounded-xl.p-6");
    expect(cards?.length).toBe(3);

    cards?.forEach((card) => {
      const iconSkeleton = card.querySelector(".h-10.w-10.rounded-lg");
      expect(iconSkeleton).toBeInTheDocument();
      expect(iconSkeleton).toHaveClass("animate-pulse");

      const textSkeletons = card.querySelectorAll(".flex-1 .animate-pulse");
      expect(textSkeletons.length).toBe(2);
      expect(textSkeletons[0]).toHaveClass("h-3", "w-24");
      expect(textSkeletons[1]).toHaveClass("h-6", "w-16");
    });
  });

  it("renders wide panel skeleton with placeholder title and 5 list item rows", () => {
    const { container } = render(<DashboardLoading />);
    const widePanel = container.querySelectorAll(".glass-card.rounded-xl.p-6")[3];
    expect(widePanel).toBeInTheDocument();

    const titleSkeleton = widePanel?.querySelector(".mb-6.h-5.w-40");
    expect(titleSkeleton).toBeInTheDocument();
    expect(titleSkeleton).toHaveClass("animate-pulse");

    const rowContainer = widePanel?.querySelector(".space-y-4");
    expect(rowContainer).toBeInTheDocument();

    const rowSkeletons = rowContainer?.querySelectorAll(".animate-pulse");
    expect(rowSkeletons?.length).toBe(5);
    rowSkeletons?.forEach((row) => {
      expect(row).toHaveClass("h-12", "w-full");
    });
  });
});
