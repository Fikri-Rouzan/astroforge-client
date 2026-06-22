import React, { useState } from "react";
import { Wrench } from "lucide-react";
import { useWeb3 } from "../hooks/useWeb3.js";
import { API_CONFIG } from "../config/api.config.js";
import { toast } from "react-hot-toast";
import { BrowserProvider, Contract, type Eip1193Provider } from "ethers";
import { RefuelStation } from "../wrappers/RefuelStation.js";
import { OreSmelter } from "../wrappers/OreSmelter.js";
import AstroForgeAbi from "../config/AstroForgeToken.json";

export const SpaceportPanel: React.FC = () => {
  const { playerProfile, authToken, refreshProfile } = useWeb3();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!playerProfile) return null;

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
    return await res.json();
  };

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
      await handleServerResponse(res);
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
        } catch (rErr) {
          console.error(rErr);
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

      {/* Render children */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RefuelStation
          playerProfile={playerProfile}
          isProcessing={isProcessing}
          onRefuel={handleRefuel}
        />
        <OreSmelter
          playerProfile={playerProfile}
          isProcessing={isProcessing}
          onMint={handleMintTokens}
        />
      </div>
    </section>
  );
};
