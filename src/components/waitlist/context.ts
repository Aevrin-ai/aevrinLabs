import { createContext, useContext } from "react";

// Lets any button on any page open the one waitlist dialog.
export const WaitlistContext = createContext<{ openWaitlist: () => void }>({ openWaitlist: () => {} });

export function useWaitlist() {
  return useContext(WaitlistContext);
}
