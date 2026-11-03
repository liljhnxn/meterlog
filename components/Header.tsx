"use client";

import React, { useState } from "react";
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from "wagmi";
import { shortenAddress } from "@/lib/utils";
import { botchainTestnet } from "@/lib/botchain";
import { Zap, Wallet, AlertTriangle, CheckCircle2, ChevronDown, Copy, Check, LogOut, ArrowRightLeft } from "lucide-react";

interface HeaderProps {
  onOpenRegister: () => void;
}

export function Header({ onOpenRegister }: HeaderProps) {
  const { address, isConnected, isConnecting } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const [copied, setCopied] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isCorrectNetwork = chainId === botchainTestnet.id;

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleConnect = () => {
    // Prefer MetaMask / Injected
    const connector = connectors[0];
    if (connector) {
      connect({ connector });
    }
  };

  return (
    <header className="border-b border-charcoal-700 bg-charcoal-900/90 backdrop-blur sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
            <Zap className="w-5 h-5 text-accent" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-charcoal-100">MeterLog</span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-charcoal-800 border border-charcoal-700 text-charcoal-300">
                v1.0
              </span>
            </div>
            <p className="text-xs text-charcoal-400">On-chain Electricity Reading Ledger</p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {isConnected && (
            <>
              {/* Network Pill */}
              {isCorrectNetwork ? (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-charcoal-800 border border-charcoal-700 text-xs text-charcoal-200">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span>Botchain Testnet</span>
                </div>
              ) : (
                <button
                  onClick={() => switchChain({ chainId: botchainTestnet.id })}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs hover:bg-amber-500/20 transition-colors"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Switch Network (968)</span>
                </button>
              )}

              {/* Register Meter Button */}
              <button
                onClick={onOpenRegister}
                className="hidden md:inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-accent text-charcoal-950 font-medium text-xs sm:text-sm hover:bg-accent-hover active:scale-[0.98] transition-all shadow-sm"
              >
                + Register Meter
              </button>
            </>
          )}

          {/* Wallet Button */}
          {isConnected ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-charcoal-800 border border-charcoal-700 hover:border-charcoal-600 text-xs sm:text-sm text-charcoal-100 transition-colors"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                <span className="font-mono">{shortenAddress(address)}</span>
                <ChevronDown className="w-3.5 h-3.5 text-charcoal-400" />
              </button>

              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-charcoal-850 border border-charcoal-700 p-2 shadow-xl z-50">
                    <div className="px-3 py-2 border-b border-charcoal-700 text-xs text-charcoal-400">
                      Connected Wallet
                      <div className="font-mono text-charcoal-200 text-sm mt-0.5 truncate">
                        {address}
                      </div>
                    </div>
                    <button
                      onClick={handleCopy}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-charcoal-200 hover:bg-charcoal-800 rounded-lg transition-colors mt-1"
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-accent" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-charcoal-400" />
                      )}
                      <span>{copied ? "Address Copied" : "Copy Address"}</span>
                    </button>
                    {!isCorrectNetwork && (
                      <button
                        onClick={() => {
                          switchChain({ chainId: botchainTestnet.id });
                          setDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                        <span>Switch to Botchain</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        disconnect();
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Disconnect Wallet</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-charcoal-950 font-medium text-xs sm:text-sm hover:bg-accent-hover active:scale-[0.98] transition-all disabled:opacity-50"
            >
              <Wallet className="w-4 h-4" />
              <span>{isConnecting ? "Connecting..." : "Connect MetaMask"}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

