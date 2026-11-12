"use client";

import React from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { botchainMainnet } from "@/lib/botchain";
import { AlertTriangle, ArrowRight } from "lucide-react";

export function NetworkBanner() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  if (!isConnected || chainId === botchainMainnet.id) {
    return null;
  }

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-3 text-amber-300 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            You are connected to an unsupported network (Chain ID: {chainId}). MeterLog operates on <strong>Botchain Mainnet</strong> (Chain ID: 677).
          </span>
        </div>
        <button
          onClick={() => switchChain({ chainId: botchainMainnet.id })}
          disabled={isPending}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-500 text-charcoal-950 font-medium hover:bg-amber-400 transition-colors disabled:opacity-50 text-xs"
        >
          <span>{isPending ? "Switching..." : "Switch to Botchain Mainnet"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
