import { useState, type FormEvent } from "react";
import { useForm } from "@formspree/react";

import { FORM_ID } from "@/lib/site";

/*
  Formspree's useForm, safe to render before a form id is set. Without an id
  Formspree throws while rendering, which would take the whole page down; here
  the form still shows, and sending it reports a failure instead.
*/
export function useSiteForm() {
  const [state, submit, reset] = useForm(FORM_ID || "unset");
  const [unset, setUnset] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (!FORM_ID) {
      event.preventDefault();
      setUnset(true);
      return;
    }
    return submit(event);
  };

  return { state, handleSubmit, reset, failed: unset || !!state.errors };
}
