import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, test, vi } from "vitest";
import { PostEditor } from "../PostEditor";

afterEach(() => {
  vi.unstubAllGlobals();
});

test("shows the API error anchored to the form when publishing fails", async () => {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: false,
    json: async () => ({ error: { message: "Title is required." } }),
  });
  vi.stubGlobal("fetch", fetchMock);

  const user = userEvent.setup();
  render(<PostEditor />, { wrapper: MemoryRouter });
  await user.type(screen.getByLabelText(/body/i), "Some content");
  await user.click(screen.getByRole("button", { name: /publish/i }));

  const alert = await screen.findByRole("alert");
  expect(alert).toHaveTextContent("Title is required.");
  expect(screen.getByLabelText(/title/i)).toHaveAttribute(
    "aria-describedby", alert.id,
  );
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(fetchMock).toHaveBeenCalledWith(
    "/api/posts",
    expect.objectContaining({
      method: "POST",
      body: JSON.stringify({ title: "", body: "Some content" }),
    }),
  );
});
