import React, { useState } from "react";
import { Wrench, Flame, Coins } from "lucide-react";
import { useWeb3 } from "../hooks/useWeb3.js";
import { API_CONFIG } from "../config/api.config.js";
import { toast } from "react-hot-toast";
import { BrowserProvider, Contract, type Eip1193Provider } from "ethers";
import AstroForgeAbi from "../config/AstroForgeToken.json";

export const SpaceportPanel: React.FC = () => {
  const { playerProfile, authToken, refreshProfile } = useWeb3();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!playerProfile) return null;

  /**
   * Clean server response parser
   */
  const handleServerResponse = async (res: Response) => {
    const contentType = res.headers.get("content-type");

    if (!res.ok) {
      if (contentType && contentType.includes("application/json")) {
        const errJson = await res.json();
        throw new Error(
          errJson.error || "Planetary terminal communication breakdown.",
        );
      }
      const errorText = await res.text();
      throw new Error(errorText || "Quantum request rejected by refinery.");
    }

    if (!contentType || !contentType.includes("application/json")) {
      throw new Error(
        "Telemetry corrupt: Expected data packet format mismatch.",
      );
    }

    return await res.json();
  };

  /**
   * Refuels the fleet state via off-chain server administration
   */
  const handleRefuel = async () => {
    if (!authToken) return;
    setIsProcessing(true);
    const loadToast = toast.loading("Refueling space station plasma cells...");

    try {
      const res = await fetch(API_CONFIG.endpoints.spaceport.refuel, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ fuelAmount: 100 - playerProfile.fuel }),
      });

      const result = await handleServerResponse(res);
      if (!result.success) throw new Error(result.error);

      await refreshProfile();
      toast.success("Plasma fuel reserves fully restored to 100%!", {
        id: loadToast,
      });
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Refuel failed.";
      toast.error(msg, { id: loadToast });
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Executes the on-chain Web3 Token Withdrawal Minting routine
   */
  const handleMintTokens = async () => {
    const ethereum = (window as Window & { ethereum?: Eip1193Provider })
      .ethereum;
    if (!ethereum || !authToken) {
      toast.error("Web3 control extension node not found.");
      return;
    }

    const withdrawAmount = playerProfile.ironOre;

    if (withdrawAmount < 100) {
      toast.error("Insufficient Iron Ore. Minimum 100 raw KG required.");
      return;
    }

    setIsProcessing(true);
    const loadToast = toast.loading(
      "Smelting raw iron ore into $ORE tokens...",
    );

    try {
      const response = await fetch(API_CONFIG.endpoints.web3.withdrawal, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ ironOreAmount: withdrawAmount }),
      });

      const voucherResult = await handleServerResponse(response);
      if (!voucherResult.success) throw new Error(voucherResult.error);

      const { recipient, rawAmountInWei, nonce, expiry, signature } =
        voucherResult.data;

      toast.loading("Broadcasting signature to the blockchain network...", {
        id: loadToast,
      });
      const provider = new BrowserProvider(ethereum);
      const signer = await provider.getSigner();

      const tokenContract = new Contract(
        API_CONFIG.contractAddress,
        AstroForgeAbi,
        signer,
      );

      const tx = await tokenContract.withdrawTokens(
        recipient,
        rawAmountInWei,
        nonce,
        expiry,
        signature,
      );

      toast.loading("Awaiting cryptographic block confirmation...", {
        id: loadToast,
      });
      await tx.wait();

      await refreshProfile();
      toast.success(
        `Success! Minted $ORE tokens into your decentralized ledger!`,
        { id: loadToast },
      );
    } catch (error: unknown) {
      console.error("[Mint Error Detail]:", error);

      const err = error as { code?: string; message?: string };
      const isUserReject =
        err.code === "ACTION_REJECTED" || err.message?.includes("rejected");

      if (isUserReject && authToken) {
        try {
          const rollbackRes = await fetch(API_CONFIG.endpoints.web3.cancel, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({ ironOreAmount: withdrawAmount }),
          });

          await handleServerResponse(rollbackRes);
          await refreshProfile();

          toast.error(
            "Smelting canceled. Resources safely returned to cargo hold.",
            { id: loadToast },
          );
          return;
        } catch (rollbackError) {
          console.error(
            "[Critical] Automatic rollback layer crashed:",
            rollbackError,
          );
        }
      }

      const msg =
        error instanceof Error ? error.message : "Web3 execution layer failed.";
      toast.error(msg, { id: loadToast });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section className="mt-8">
      <div className="mb-4">
        <h3 className="text-lg font-bold font-heading text-slate-700 dark:text-slate-200 flex items-center gap-2">
          <Wrench className="w-5 h-5 text-cosmic-accent" />
          SPACEPORT TERMINAL SERVICES
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Refuel */}
        <div className="p-6 rounded-2xl border border-gray-200 bg-white dark:border-cosmic-panel dark:bg-cosmic-station shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-heading font-bold text-sm text-cosmic-light-text dark:text-white mb-2">
              FLEET REFUEL STATION
            </h4>
            <p className="text-xs text-gray-400 dark:text-slate-400 leading-relaxed mb-6">
              Keep your automated mining operations running. Recharging reactors
              replenishes auxiliary energy logs.
            </p>
          </div>

          <button
            onClick={() => {
              void handleRefuel();
            }}
            disabled={isProcessing || playerProfile.fuel >= 100}
            className="w-full flex items-center justify-center gap-2 font-heading text-xs tracking-wider bg-cosmic-panel hover:bg-cosmic-panel/80 dark:bg-cosmic-panel dark:hover:bg-cosmic-panel/70 text-cosmic-accent py-3.5 px-4 rounded-xl font-bold border border-cosmic-accent/20 disabled:opacity-40 transition-all duration-200 cursor-pointer"
          >
            <Flame className="w-4 h-4" />
            {playerProfile.fuel >= 100
              ? "REACTOR CORE AT MAXIMUM"
              : "RECHARGE PLASMA CELLS"}
          </button>
        </div>

        {/* Smelter */}
        <div className="p-6 rounded-2xl border border-gray-200 bg-white dark:border-cosmic-panel dark:bg-cosmic-station shadow-sm flex flex-col justify-between hover:border-cosmic-primary/40 transition-colors duration-300">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-heading font-bold text-sm text-cosmic-light-text dark:text-white">
                QUANTUM ORE SMELTER
              </h4>
              <span className="text-[9px] bg-cosmic-primary/10 text-indigo-400 border border-cosmic-primary/20 px-2 py-0.5 rounded font-mono">
                RATIO 100:1
              </span>
            </div>
            <p className="text-xs text-gray-400 dark:text-slate-400 leading-relaxed mb-6">
              Bridge your raw off-chain resources into the permanent ledger.
              Convert accumulated Iron Ore payload directly into decentralized
              $ORE assets.
            </p>
          </div>

          <button
            onClick={() => {
              void handleMintTokens();
            }}
            disabled={isProcessing || playerProfile.ironOre < 100}
            className="w-full flex items-center justify-center gap-2 font-heading text-xs tracking-wider bg-linear-to-r from-cosmic-primary to-indigo-500 hover:opacity-90 text-white py-3.5 px-4 rounded-xl font-bold shadow-neon-primary disabled:from-gray-300 disabled:to-gray-400 dark:disabled:from-cosmic-panel dark:disabled:to-cosmic-panel dark:disabled:text-slate-500 disabled:opacity-40 disabled:shadow-none transition-all duration-200 cursor-pointer"
          >
            <Coins className="w-4 h-4" />
            {playerProfile.ironOre < 100
              ? "MINIMUM 100 KG REQUIRED"
              : "SMELT AND MINT $ORE TOKENS"}
          </button>
        </div>
      </div>
    </section>
  );
};
