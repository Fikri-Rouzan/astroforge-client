export interface Ship {
  id: number;
  playerWallet: string;
  shipName: string;
  miningRatePerSecond: number;
  maxCargo: number;
  status: string;
  lastLaunchTime?: string;
}

export interface PlayerProfile {
  walletAddress: string;
  ironOre: number;
  platinum: number;
  fuel: number;
  nonce: number;
  ships?: Ship[];
}

export interface AuthState {
  walletAddress: string | null;
  authToken: string | null;
  playerProfile: PlayerProfile | null;
}

export interface Web3ContextType {
  walletAddress: string | null;
  authToken: string | null;
  playerProfile: PlayerProfile | null;
  isLoading: boolean;
  isProfileLoading: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  refreshProfile: () => Promise<void>;
}
