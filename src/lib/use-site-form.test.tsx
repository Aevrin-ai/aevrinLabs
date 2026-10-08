import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { useSiteForm } from "./use-site-form";

// No form id set, as on a fresh checkout.
vi.mock("@/lib/site", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/site")>()),
  FORM_ID: "",
}));

function Form() {
  const { handleSubmit, failed } = useSiteForm();
  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Send</button>
      {failed && <p role="alert">Not sent</p>}
    </form>
  );
}

describe("useSiteForm without a form id", () => {
  it("renders instead of throwing", () => {
    render(<Form />);
    expect(screen.getByRole("button", { name: "Send" })).toBeInTheDocument();
  });

  it("reports a failure on submit and sends nothing", async () => {
    const fetch = vi.spyOn(globalThis, "fetch");
    render(<Form />);
    await userEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Not sent");
    expect(fetch).not.toHaveBeenCalled();
  });
});
