import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { stubFormSubmit } from "@/test/helpers";
import { useSiteForm } from "./use-site-form";

function Form({ bot = false }: { bot?: boolean }) {
  const { state, handleSubmit, reset, failed } = useSiteForm();
  if (state.succeeded) {
    return (
      <button type="button" onClick={reset}>
        Sent
      </button>
    );
  }
  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="_subject" value="Test" />
      <input name="email" defaultValue="maya@example.com" />
      <input name="_honey" defaultValue={bot ? "spam" : ""} />
      <button type="submit">{state.submitting ? "Sending" : "Send"}</button>
      {failed && <p role="alert">Not sent</p>}
    </form>
  );
}

describe("useSiteForm", () => {
  it("emails the fields to contact@aevrinlabs.com as a table, with no captcha", async () => {
    const { sent } = stubFormSubmit();
    render(<Form />);
    await userEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(await screen.findByRole("button", { name: "Sent" })).toBeInTheDocument();
    expect(sent[0].url).toBe("https://formsubmit.co/ajax/contact@aevrinlabs.com");
    expect(sent[0].body).toMatchObject({ _subject: "Test", email: "maya@example.com", _template: "table", _captcha: "false" });
  });

  it("thanks a bot that fills the hidden field, and sends nothing", async () => {
    const { fetch } = stubFormSubmit();
    render(<Form bot />);
    await userEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(await screen.findByRole("button", { name: "Sent" })).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("reports a failure when the network is down", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("Failed to fetch"));
    render(<Form />);
    await userEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Not sent");
  });

  it("starts over after reset", async () => {
    stubFormSubmit();
    render(<Form />);
    await userEvent.click(screen.getByRole("button", { name: "Send" }));
    await userEvent.click(await screen.findByRole("button", { name: "Sent" }));
    expect(screen.getByRole("button", { name: "Send" })).toBeInTheDocument();
  });
});
