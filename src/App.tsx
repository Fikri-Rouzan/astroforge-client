import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Toaster } from "react-hot-toast";
import { Navbar } from "./components/Navbar.js";
import { LandingPage } from "./pages/LandingPage.js";
import { DashboardPage } from "./pages/DashboardPage.js";
import { useWeb3 } from "./hooks/useWeb3.js";

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const { walletAddress, playerProfile } = useWeb3();
  const isAuthenticated = !!walletAddress && !!playerProfile;

  return (
    <BrowserRouter>
      <div
        className={`${
          darkMode
            ? "dark bg-cosmic-void text-slate-100"
            : "bg-cosmic-light-bg text-cosmic-light-text"
        } min-h-screen transition-colors duration-300 font-body flex flex-col`}
      >
        {/* Dynamic toast feedback overlay container */}
        <Toaster
          position="top-center"
          toastOptions={{
            className: darkMode
              ? "!bg-cosmic-station !text-slate-100 !border !border-cosmic-panel !font-body !text-sm"
              : "!font-body !text-sm",
            duration: 4000,
          }}
        />

        {/* Navigation bar */}
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

        <Routes>
          {/* Public landing page */}
          <Route
            path="/"
            element={
              !isAuthenticated ? (
                <LandingPage />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />

          {/* Protected game dashboard */}
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? <DashboardPage /> : <Navigate to="/" replace />
            }
          />

          {/* Route for handling 404 errors */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
