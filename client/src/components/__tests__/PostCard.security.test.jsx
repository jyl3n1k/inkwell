import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";
import { PostCard } from "../PostCard";

test("renders malicious post content as inert text, never HTML", () => {
  const body = '<script>window.__xss = true;</script><img src=x onerror="window.__xss=true">';
  const { container } = render(<PostCard post={{ id: "1", title: "<b>Test</b>", body }} />);
  expect(screen.getByText(body)).toBeInTheDocument();
  expect(screen.getByText("<b>Test</b>")).toBeInTheDocument();
  expect(container.querySelector("script, img, b")).toBeNull();
  expect(window.__xss).toBeUndefined();
});
