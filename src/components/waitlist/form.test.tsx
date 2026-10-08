import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { renderPage, stubFormSubmit } from "@/test/helpers";
import WaitlistForm from "./form";

async function fillIn() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText(/Full name/), "Maya Ross");
  await user.type(screen.getByLabelText(/Company/), "Example Co");
  await user.type(screen.getByLabelText(/Work email/), "maya@example.com");
  await user.selectOptions(screen.getByLabelText(/What do you want to see first/), "Live guardrails");
  await user.click(screen.getByRole("button", { name: /Join the waitlist/ }));
}

describe("the waitlist form", () => {
  it("asks for a name and a work email, and nothing else is required", () => {
    renderPage(<WaitlistForm onDone={() => {}} />);
    expect(screen.getByLabelText(/Full name/)).toBeRequired();
    expect(screen.getByLabelText(/Work email/)).toBeRequired();
    expect(screen.getByLabelText(/Company/)).not.toBeRequired();
    expect(screen.getByLabelText(/What do you want to see first/)).not.toBeRequired();
  });

  it("offers each capability, and all of them, as a first interest", () => {
    renderPage(<WaitlistForm onDone={() => {}} />);
    const options = screen.getAllByRole("option").map((o) => o.textContent);
    expect(options).toEqual([
      "Choose one",
      "Agent inventory",
      "Risk scores",
      "Identities and access",
      "Live guardrails",
      "Audit trail",
      "Usage and spend",
      "All of it",
    ]);
  });

  it("emails the signup to contact@aevrinlabs.com, marked as a waitlist signup", async () => {
    const { sent } = stubFormSubmit();
    renderPage(<WaitlistForm onDone={() => {}} />);
    await fillIn();
    expect(await screen.findByText("You are on the list.")).toBeInTheDocument();
    expect(sent).toHaveLength(1);
    expect(sent[0].url).toBe("https://formsubmit.co/ajax/contact@aevrinlabs.com");
    expect(sent[0].body).toMatchObject({
      _subject: "Waitlist signup",
      form: "waitlist",
      name: "Maya Ross",
      company: "Example Co",
      email: "maya@example.com",
      interest: "Live guardrails",
    });
  });

  it("closes from the thank-you message", async () => {
    stubFormSubmit();
    const onDone = vi.fn();
    renderPage(<WaitlistForm onDone={onDone} />);
    await fillIn();
    await userEvent.click(await screen.findByRole("button", { name: "Close" }));
    expect(onDone).toHaveBeenCalledOnce();
  });

  it("says so when the signup does not go through", async () => {
    stubFormSubmit({ ok: false });
    renderPage(<WaitlistForm onDone={() => {}} />);
    await fillIn();
    expect(await screen.findByRole("alert")).toHaveTextContent("That did not send");
    expect(screen.queryByText("You are on the list.")).not.toBeInTheDocument();
  });
});
