import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { renderPage, stubFormSubmit } from "@/test/helpers";
import ContactPage from "./contact";

async function send() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText(/^Name/), "Sam Lee");
  await user.type(screen.getByLabelText(/Work email/), "sam@example.com");
  await user.type(screen.getByLabelText(/Company/), "Example Co");
  await user.type(screen.getByLabelText(/Message/), "We use a lot of agents.");
  await user.click(screen.getByRole("button", { name: /Send message/ }));
}

describe("the contact page", () => {
  it("has one main heading and the four fields", () => {
    renderPage(<ContactPage />, { path: "/contact" });
    expect(screen.getByRole("heading", { level: 1, name: "Talk to us." })).toBeInTheDocument();
    expect(screen.getByLabelText(/^Name/)).toBeRequired();
    expect(screen.getByLabelText(/Work email/)).toHaveAttribute("type", "email");
    expect(screen.getByLabelText(/Company/)).not.toBeRequired();
    expect(screen.getByLabelText(/Message/)).toBeRequired();
  });

  it("sends the message, marked as from the contact form, and thanks the sender", async () => {
    const { sent } = stubFormSubmit();
    renderPage(<ContactPage />, { path: "/contact" });
    await send();
    expect(await screen.findByText("Thanks, we got it.")).toBeInTheDocument();
    expect(sent[0].url).toBe("https://formsubmit.co/ajax/contact@aevrinlabs.com");
    expect(sent[0].body).toMatchObject({ _subject: "Contact form", form: "contact", name: "Sam Lee", message: "We use a lot of agents." });
  });

  it("lets the sender write another message", async () => {
    stubFormSubmit();
    renderPage(<ContactPage />, { path: "/contact" });
    await send();
    await userEvent.click(await screen.findByRole("button", { name: "Send another" }));
    expect(screen.getByRole("button", { name: /Send message/ })).toBeInTheDocument();
  });

  it("shows an error, and keeps the form, when sending fails", async () => {
    stubFormSubmit({ ok: false });
    renderPage(<ContactPage />, { path: "/contact" });
    await send();
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("That did not send");
    expect(within(alert).getByRole("link", { name: "contact@aevrinlabs.com" })).toHaveAttribute("href", "mailto:contact@aevrinlabs.com");
    expect(screen.getByRole("button", { name: /Send message/ })).toBeInTheDocument();
  });

  it("opens the waitlist from the early access card", async () => {
    const { openWaitlist } = renderPage(<ContactPage />, { path: "/contact" });
    await userEvent.click(screen.getByRole("button", { name: "Join the waitlist" }));
    expect(openWaitlist).toHaveBeenCalledOnce();
  });
});
