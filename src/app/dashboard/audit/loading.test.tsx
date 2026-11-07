/**
 * @vitest-environment jsdom
 */
import "@testing-library/jest-dom/vitest";
import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AuditLoading from "./loading";

describe("AuditLoading Skeleton (#560)", () => {
  it("renders with aria-busy='true' and an accessible label", () => {
    render(<AuditLoading />);
    const container = screen.getByLabelText("Loading audit logs");
    expect(container).toBeInTheDocument();
    expect(container).toHaveAttribute("aria-busy", "true");
  });

  it("exposes the correct structure on container element", () => {
    const { container } = render(<AuditLoading />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toBeInTheDocument();
    expect(root).toHaveClass("space-y-8");
  });

  it("renders header skeleton placeholders for page title and subtitle", () => {
    const { container } = render(<AuditLoading />);
    const header = container.querySelector(".space-y-2");
    expect(header).toBeInTheDocument();

    const skeletons = header?.querySelectorAll(".animate-pulse");
    expect(skeletons?.length).toBe(2);
    expect(skeletons?.[0]).toHaveClass("h-9", "w-48");
    expect(skeletons?.[1]).toHaveClass("h-4", "w-full", "max-w-xl");
  });

  it("renders two summary stat tiles in a responsive grid", () => {
    const { container } = render(<AuditLoading />);
    const grid = container.querySelector(".grid.grid-cols-1.gap-6.md\\:grid-cols-2");
    expect(grid).toBeInTheDocument();

    const cards = grid?.querySelectorAll(".flex.items-center.gap-4.rounded-xl");
    expect(cards?.length).toBe(2);

    cards?.forEach((card) => {
      const iconSkeleton = card.querySelector(".h-10.w-10.rounded-lg");
      expect(iconSkeleton).toBeInTheDocument();
      expect(iconSkeleton).toHaveClass("animate-pulse");

      const textSkeletons = card.querySelectorAll(".flex-1 .animate-pulse");
      expect(textSkeletons.length).toBe(2);
      expect(textSkeletons[0]).toHaveClass("h-3", "w-28");
      expect(textSkeletons[1]).toHaveClass("h-5", "w-20");
    });
  });

  it("renders audit log table skeleton with filter controls and 8 placeholder rows", () => {
    const { container } = render(<AuditLoading />);
    const tablePanel = container.querySelector(".glass-card.rounded-xl.p-6");
    expect(tablePanel).toBeInTheDocument();

    const filterControls = tablePanel?.querySelector(".mb-6.flex.flex-wrap.gap-3");
    expect(filterControls).toBeInTheDocument();
    const filterSkeletons = filterControls?.querySelectorAll(".animate-pulse");
    expect(filterSkeletons?.length).toBe(3);
    expect(filterSkeletons?.[0]).toHaveClass("h-9", "w-56");
    expect(filterSkeletons?.[1]).toHaveClass("h-9", "w-36");
    expect(filterSkeletons?.[2]).toHaveClass("h-9", "w-36");

    const rowContainer = tablePanel?.querySelector(".space-y-3");
    expect(rowContainer).toBeInTheDocument();
    const rows = rowContainer?.querySelectorAll(".animate-pulse");
    expect(rows?.length).toBe(8);
    rows?.forEach((row) => {
      expect(row).toHaveClass("h-10", "w-full");
    });
  });
});
