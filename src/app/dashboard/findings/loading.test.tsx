/**
 * @vitest-environment jsdom
 */
import "@testing-library/jest-dom/vitest";
import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FindingsLoading from "./loading";

describe("FindingsLoading Skeleton (#560)", () => {
  it("renders with aria-busy='true' and an accessible label", () => {
    render(<FindingsLoading />);
    const container = screen.getByLabelText("Loading security findings");
    expect(container).toBeInTheDocument();
    expect(container).toHaveAttribute("aria-busy", "true");
  });

  it("exposes the correct structure on container element", () => {
    const { container } = render(<FindingsLoading />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toBeInTheDocument();
    expect(root).toHaveClass("w-full", "space-y-8");
  });

  it("renders page header skeleton placeholders for badge, title, and description", () => {
    const { container } = render(<FindingsLoading />);
    const header = container.querySelector(".space-y-2");
    expect(header).toBeInTheDocument();

    const skeletons = header?.querySelectorAll(".animate-pulse");
    expect(skeletons?.length).toBe(3);
    expect(skeletons?.[0]).toHaveClass("h-4", "w-32");
    expect(skeletons?.[1]).toHaveClass("h-10", "w-72");
    expect(skeletons?.[2]).toHaveClass("h-4", "w-full", "max-w-2xl");
  });

  it("renders three severity metric cards in a responsive grid", () => {
    const { container } = render(<FindingsLoading />);
    const grid = container.querySelector(".grid.grid-cols-1.gap-6.md\\:grid-cols-3");
    expect(grid).toBeInTheDocument();

    const cards = grid?.querySelectorAll(".glass-card.rounded-xl.p-6");
    expect(cards?.length).toBe(3);

    cards?.forEach((card) => {
      const skeletons = card.querySelectorAll(".animate-pulse");
      expect(skeletons.length).toBe(3);
      expect(skeletons[0]).toHaveClass("mb-4", "h-8", "w-8", "rounded-lg");
      expect(skeletons[1]).toHaveClass("mb-2", "h-8", "w-16");
      expect(skeletons[2]).toHaveClass("h-3", "w-28");
    });
  });

  it("renders finding list card container with toolbar placeholders and 6 placeholder finding rows", () => {
    const { container } = render(<FindingsLoading />);
    const listPanel = container.querySelectorAll(".glass-card.rounded-xl")[3];
    expect(listPanel).toBeInTheDocument();

    const topBar = listPanel?.querySelector(".flex.items-center.justify-between.p-6");
    expect(topBar).toBeInTheDocument();
    const topBarSkeletons = topBar?.querySelectorAll(".animate-pulse");
    expect(topBarSkeletons?.length).toBe(2);
    expect(topBarSkeletons?.[0]).toHaveClass("h-5", "w-36");
    expect(topBarSkeletons?.[1]).toHaveClass("h-6", "w-24", "rounded-full");

    const rowContainer = listPanel?.querySelector(".min-h-\\[520px\\].space-y-4");
    expect(rowContainer).toBeInTheDocument();
    const rows = rowContainer?.querySelectorAll(".animate-pulse");
    expect(rows?.length).toBe(6);
    rows?.forEach((row) => {
      expect(row).toHaveClass("h-16", "w-full", "rounded-lg");
    });
  });
});
