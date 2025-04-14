import { AuthProvider } from "@/context/AuthContext";
import Authentification from "@/pages/Authentification";
import Landing from "@/pages/Landing";
import Main from "@/pages/Main";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function Router() {
    return (
      <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={
              <AuthProvider>
                <Authentification />
              </AuthProvider>} />
            <Route path="/main" element={<Main />} />
          </Routes>
        </BrowserRouter>
      </>
    );
  };
  
  export default Router;