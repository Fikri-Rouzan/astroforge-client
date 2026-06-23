import React from "react";
import { Navigate } from "react-router";
import { useWeb3 } from "../hooks/useWeb3.js";
import { LoadingOverlay } from "./LoadingOverlay.js";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { walletAddress, authToken, isProfileLoading, playerProfile } =
    useWeb3();

  // Block all redirections while background fetch calls are actively executing
  if (isProfileLoading) {
    return <LoadingOverlay />;
  }

  // If initial load completed and data fields remain empty, trigger auth rejection redirect
  if (!walletAddress || !authToken || !playerProfile) {
    return <Navigate to="/" replace />;
  }

  // Allow access to inner children elements if verification checks clear perfectly
  return children;
};
