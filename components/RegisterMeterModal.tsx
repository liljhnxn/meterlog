"use client";

import React, { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { METER_LOG_ABI } from "@/lib/contractAbi";
import { CONTRACT_ADDRESS } from "@/lib/wagmi";
import { X, Loader2, PlusCircle, AlertCircle, CheckCircle } from "lucide-react";

interface RegisterMeterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function RegisterMeterModal({ isOpen, onClose, onSuccess }: RegisterMeterModalProps) {
  const { isConnected } = useAccount();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    data: hash,
    writeContract,
    isPending: isSubmitting,
    error: submitError,
    reset,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage("Please enter a meter name.");
      return;
    }
    if (!location.trim()) {
      setErrorMessage("Please enter the meter location.");
      return;
    }

    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: METER_LOG_ABI,
        functionName: "registerMeter",
        args: [name.trim(), location.trim(), description.trim()],
      } as any);
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to submit transaction.");
    }
  };

  const handleClose = () => {
    if (isSubmitting || isConfirming) return;
    setName("");
    setLocation("");
    setDescription("");
    setErrorMessage("");
    reset();
    onClose();
  };

  if (isConfirmed) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div className="bg-charcoal-850 border border-charcoal-700 rounded-2xl w-full max-w-md p-6 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="w-12 h-12 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center mx-auto text-accent mb-4">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-charcoal-100 mb-2">Meter Registered!</h3>
          <p className="text-sm text-charcoal-300 mb-6">
            The electricity meter &quot;{name}&quot; has been recorded on Botchain Testnet.
          </p>
          <button
            onClick={() => {
              handleClose();
              onSuccess();
            }}
            className="w-full py-2.5 rounded-lg bg-accent text-charcoal-950 font-semibold text-sm hover:bg-accent-hover transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-charcoal-850 border border-charcoal-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-charcoal-700 bg-charcoal-900">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-accent" />
            <h3 className="text-base font-semibold text-charcoal-100">Register New Meter</h3>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting || isConfirming}
            className="text-charcoal-400 hover:text-charcoal-200 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-charcoal-300 mb-1">
              Meter Name <span className="text-accent">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Hostel Room 12, Unit 4B"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting || isConfirming}
              className="w-full px-3.5 py-2.5 rounded-lg bg-charcoal-900 border border-charcoal-700 text-charcoal-100 text-sm focus:outline-none focus:border-accent transition-colors placeholder:text-charcoal-500"
              maxLength={80}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-charcoal-300 mb-1">
              Location <span className="text-accent">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Block A, 2nd Floor, Main Building"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={isSubmitting || isConfirming}
              className="w-full px-3.5 py-2.5 rounded-lg bg-charcoal-900 border border-charcoal-700 text-charcoal-100 text-sm focus:outline-none focus:border-accent transition-colors placeholder:text-charcoal-500"
              maxLength={120}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-charcoal-300 mb-1">
              Description <span className="text-charcoal-500">(Optional)</span>
            </label>
            <textarea
              placeholder="e.g. Single occupant student room with dedicated circuit breaker"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting || isConfirming}
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-lg bg-charcoal-900 border border-charcoal-700 text-charcoal-100 text-sm focus:outline-none focus:border-accent transition-colors placeholder:text-charcoal-500 resize-none"
              maxLength={240}
            />
          </div>

          {/* Validation or contract error */}
          {(errorMessage || submitError) && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage || submitError?.message?.slice(0, 160)}</span>
            </div>
          )}

          {/* Transaction status */}
          {isConfirming && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-charcoal-800 border border-charcoal-700 text-accent text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-accent" />
              <span>Confirming on Botchain Testnet...</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting || isConfirming}
              className="px-4 py-2 rounded-lg bg-charcoal-800 border border-charcoal-700 text-xs text-charcoal-300 hover:text-charcoal-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isConfirming || !isConnected}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-accent text-charcoal-950 font-medium text-xs hover:bg-accent-hover transition-colors disabled:opacity-50"
            >
              {(isSubmitting || isConfirming) && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isSubmitting ? "Check Wallet..." : isConfirming ? "Broadcasting..." : "Register Meter"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

