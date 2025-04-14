import { ReactNode } from "react";
import { UserProvider } from "./UserContext";
import { NavProvider } from "./navContext";

function AppProvider({ children }: { children: ReactNode }) {
  return (
    <NavProvider>
      <UserProvider>{children}</UserProvider>
    </NavProvider>
  );
}

export default AppProvider;