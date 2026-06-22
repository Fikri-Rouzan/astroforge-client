import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { ethers, type Eip1193Provider } from "ethers";
import { API_CONFIG } from "../config/api.config.js";
import type {
  PlayerProfile,
  AuthState,
  Web3ContextType,
} from "../types/type.js";
import { toast } from "react-hot-toast";

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const storedToken = localStorage.getItem("astroforge_jwt");
    const storedWallet = localStorage.getItem("astroforge_wallet");
    return {
      walletAddress: storedWallet || null,
      authToken: storedToken || null,
      playerProfile: null,
    };
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const logoutCleanup = useCallback(() => {
    localStorage.removeItem("astroforge_jwt");
    localStorage.removeItem("astroforge_wallet");
    setAuthState({
      walletAddress: null,
      authToken: null,
      playerProfile: null,
    });
  }, []);

  /**
   * Fetches the authenticated player profile from the backend using the JWT token
   */
  const fetchPlayerProfile = useCallback(
    async (token: string, wallet: string) => {
      try {
        const response = await fetch(API_CONFIG.endpoints.player.profile, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();
        if (result.success) {
          const backendData = result.data;

          const formattedProfile: PlayerProfile = {
            walletAddress: backendData.walletAddress,
            ironOre: backendData.balances.ironOre,
            platinum: backendData.balances.platinum,
            fuel: backendData.balances.fuel,
            nonce: backendData.nonce,
            ships: backendData.hangar,
          };

          setAuthState({
            walletAddress: wallet,
            authToken: token,
            playerProfile: formattedProfile,
          });
        } else {
          logoutCleanup();
        }
      } catch (error) {
        console.error("[Web3Context] Failed to fetch player profile:", error);
        logoutCleanup();
      }
    },
    [logoutCleanup],
  );

  // Synchronize and load profile only if tokens exist but profile is not loaded yet
  useEffect(() => {
    if (
      authState.authToken &&
      authState.walletAddress &&
      !authState.playerProfile
    ) {
      const token = authState.authToken;
      const wallet = authState.walletAddress;

      // Deferring execution to the macro-task queue using setTimeout.
      const timer = setTimeout(() => {
        void fetchPlayerProfile(token, wallet);
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [
    authState.authToken,
    authState.walletAddress,
    authState.playerProfile,
    fetchPlayerProfile,
  ]);

  /**
   * Triggers the cryptographic SIWE authentication handshake
   */
  const connectWallet = async () => {
    const ethereum = (window as Window & { ethereum?: Eip1193Provider })
      .ethereum;
    if (!ethereum) {
      toast.error(
        "Web3 extension node not found. Please install Web3 wallet extension.",
      );
      return;
    }

    setIsLoading(true);
    // Trigger a loading state toast to enhance user experience
    const loadingToast = toast.loading("Synchronizing cosmic terminal link...");

    try {
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const challengeResponse = await fetch(
        API_CONFIG.endpoints.auth.challenge,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ walletAddress: address }),
        },
      );

      const challengeResult = await challengeResponse.json();
      if (!challengeResult.success) throw new Error(challengeResult.error);

      const { message, challengeToken } = challengeResult.data;

      const signature = await signer.signMessage(message);

      const loginResponse = await fetch(API_CONFIG.endpoints.auth.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: address,
          signature,
          challengeToken,
          message,
        }),
      });

      const loginResult = await loginResponse.json();
      if (!loginResult.success) throw new Error(loginResult.error);

      const { accessToken } = loginResult.data;
      localStorage.setItem("astroforge_jwt", accessToken);
      localStorage.setItem("astroforge_wallet", address);

      await fetchPlayerProfile(accessToken, address);

      // Display success pop-up upon verified signature verification
      toast.success("Command Link Secured. Welcome back, Commander!", {
        id: loadingToast,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown cryptographic error.";
      console.error("[Web3Context Auth Error]:", errorMessage);
      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    logoutCleanup();
    toast.success("Space station terminal session terminated.");
  };

  const refreshProfile = async () => {
    if (authState.authToken && authState.walletAddress) {
      await fetchPlayerProfile(authState.authToken, authState.walletAddress);
    }
  };

  return (
    <Web3Context.Provider
      value={{
        walletAddress: authState.walletAddress,
        authToken: authState.authToken,
        playerProfile: authState.playerProfile,
        isLoading,
        connectWallet,
        disconnectWallet,
        refreshProfile,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error(
      "useWeb3 must be utilized within a Web3Provider wrapper context.",
    );
  }
  return context;
};
