import { createContext, useContext, useState, ReactNode } from "react";

type NavView = string;

interface NavContextType {
    Nav: NavView;
    setNav: (view: NavView) => void;
}

const NavContext = createContext<NavContextType | undefined>(undefined);

export const NavProvider = ({ children }: { children: ReactNode }) => {
  const [Nav, setNav] = useState<NavView>("Employer");

  return (
    <NavContext.Provider value={{ Nav, setNav }}>
      {children}
    </NavContext.Provider>
  );
};

export const useNavView = () => {
  const context = useContext(NavContext);
  if (!context) throw new Error("useAuthView must be used within AuthProvider");
  return context;
};