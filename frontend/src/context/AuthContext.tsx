import { createContext, useContext, useState, ReactNode } from "react";

type AuthView = "login" | "register";

interface AuthContextType {
  view: AuthView;
  setView: (view: AuthView) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [view, setView] = useState<AuthView>("login");

  return (
    <AuthContext.Provider value={{ view, setView }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthView = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthView must be used within AuthProvider");
  return context;
};