import { useState, type FormEvent } from "react";

import { FORM_ENDPOINT } from "@/lib/site";

type State = { submitting: boolean; succeeded: boolean };

/*
  Sends a form to FormSubmit, which emails it to contact@aevrinlabs.com as a
  table, with Reply set to the address in the `email` field. Fields named
  with a leading underscore are instructions to FormSubmit, not content:
  _subject sets the subject line, and _honey is a hidden field only bots fill
  in, so a filled one is thanked and quietly dropped.
*/
export function useSiteForm() {
  const [state, setState] = useState<State>({ submitting: false, succeeded: false });
  const [failed, setFailed] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fields = Object.fromEntries(new FormData(event.currentTarget).entries()) as Record<string, string>;

    if (fields._honey) {
      setState({ submitting: false, succeeded: true });
      return;
    }

    setFailed(false);
    setState({ submitting: true, succeeded: false });
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...fields, _template: "table", _captcha: "false" }),
      });
      const reply = (await res.json().catch(() => ({}))) as { success?: boolean | string };
      const ok = res.ok && (reply.success === true || reply.success === "true");
      setState({ submitting: false, succeeded: ok });
      setFailed(!ok);
    } catch {
      setState({ submitting: false, succeeded: false });
      setFailed(true);
    }
  };

  const reset = () => {
    setState({ submitting: false, succeeded: false });
    setFailed(false);
  };

  return { state, handleSubmit, reset, failed };
}
