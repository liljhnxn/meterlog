"use client";

import React, { useState, useMemo } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { METER_LOG_ABI, MeterData } from "@/lib/contractAbi";
import { CONTRACT_ADDRESS } from "@/lib/wagmi";
import { formatNumber } from "@/lib/utils";
import { X, Loader2, Gauge, AlertCircle, CheckCircle, ArrowUpRight } from "lucide-react";

interface RecordReadingModalProps {
  meter: MeterData | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function RecordReadingModal({ meter, isOpen, onClose, onSuccess }: RecordReadingModalProps) {
  const { address } = useAccount();
  const [readingInput, setReadingInput] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

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

  const currentReading = meter ? Number(meter.latestReading) : 0;
  const isFirstReading = meter ? Number(meter.readingCount) === 0 : true;

  const parsedReading = parseFloat(readingInput);
  const isValidNumber = !isNaN(parsedReading) && parsedReading >= 0;

  const consumptionPreview = useMemo(() => {
    if (!isValidNumber) return null;
    if (isFirstReading) return "N/A (Initial Reading)";
    if (parsedReading < currentReading) {
      return null;
    }
    return parsedReading - currentReading;
  }, [parsedReading, isValidNumber, isFirstReading, currentReading]);

  if (!isOpen || !meter) return null;

  const isOwner = address && meter.owner.toLowerCase() === address.toLowerCase();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!isOwner) {
      setErrorMessage("Unauthorized: Only the meter owner can record a reading.");
      return;
    }

    if (!isValidNumber) {
      setErrorMessage("Please enter a valid non-negative reading in kWh.");
      return;
    }

    const roundedVal = Math.floor(parsedReading);

    if (!isFirstReading && roundedVal < currentReading) {
      setErrorMessage(`New reading cannot be lower than the previous reading (${currentReading} kWh).`);
      return;
    }

    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: METER_LOG_ABI,
        functionName: "recordReading",
        args: [BigInt(meter.id), BigInt(roundedVal)],
      } as any);
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to submit transaction.");
    }
  };

  const handleClose = () => {
    if (isSubmitting || isConfirming) return;
    setReadingInput("");
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
          <h3 className="text-lg font-bold text-charcoal-100 mb-2">Reading Recorded!</h3>
          <p className="text-sm text-charcoal-300 mb-6">
            Reading of <strong>{readingInput} kWh</strong> has been committed to Botchain Testnet for &quot;{meter.name}&quot;.
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
            <Gauge className="w-5 h-5 text-accent" />
            <div>
              <h3 className="text-base font-semibold text-charcoal-100">Submit Meter Reading</h3>
              <p className="text-xs text-charcoal-400">{meter.name} ({meter.location})</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting || isConfirming}
            className="text-charcoal-400 hover:text-charcoal-200 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current State Info */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-charcoal-900 border border-charcoal-700/80">
            <div>
              <span className="text-[11px] font-medium text-charcoal-400 uppercase tracking-wider block">
                Current Reading
              </span>
              <span className="text-lg font-bold font-mono text-charcoal-100">
                {isFirstReading ? "0 (None)" : `${formatNumber(meter.latestReading)} kWh`}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-medium text-charcoal-400 uppercase tracking-wider block">
                Total Readings
              </span>
              <span className="text-lg font-bold font-mono text-charcoal-100">
                {formatNumber(meter.readingCount)}
              </span>
            </div>
          </div>

          {!isOwner && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>You are not the owner of this meter. Only the owner ({meter.owner.slice(0, 8)}...) can submit readings.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-charcoal-300 mb-1">
                New Meter Reading (kWh) <span className="text-accent">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="1"
                  min={isFirstReading ? 0 : currentReading}
                  placeholder={isFirstReading ? "e.g. 1000" : `e.g. ${currentReading + 50}`}
                  value={readingInput}
                  onChange={(e) => setReadingInput(e.target.value)}
                  disabled={isSubmitting || isConfirming || !isOwner}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-charcoal-900 border border-charcoal-700 text-charcoal-100 text-sm focus:outline-none focus:border-accent transition-colors font-mono placeholder:text-charcoal-500"
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-medium text-charcoal-400">
                  kWh
                </span>
              </div>
            </div>

            {/* Calculated Consumption Preview */}
            {isValidNumber && (
              <div className="p-3 rounded-lg bg-charcoal-800/80 border border-charcoal-700 flex items-center justify-between text-xs">
                <span className="text-charcoal-400 flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5 text-accent" />
                  Calculated Consumption:
                </span>
                <span className="font-mono font-semibold text-accent-bright">
                  {typeof consumptionPreview === "number"
                    ? `+${formatNumber(consumptionPreview)} kWh`
                    : consumptionPreview || "—"}
                </span>
              </div>
            )}

            {isFirstReading && (
              <p className="text-[11px] text-charcoal-400 italic">
                * Note: This is the first reading for this meter. It establishes the baseline, so consumption will be shown as unavailable until the next reading.
              </p>
            )}

            {/* Errors */}
            {(errorMessage || submitError) && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage || submitError?.message?.slice(0, 160)}</span>
              </div>
            )}

            {isConfirming && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-charcoal-800 border border-charcoal-700 text-accent text-xs">
                <Loader2 className="w-4 h-4 animate-spin text-accent" />
                <span>Submitting reading to Botchain Testnet...</span>
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
                disabled={isSubmitting || isConfirming || !isOwner || !readingInput}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-accent text-charcoal-950 font-medium text-xs hover:bg-accent-hover transition-colors disabled:opacity-50"
              >
                {(isSubmitting || isConfirming) && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isSubmitting ? "Check Wallet..." : isConfirming ? "Broadcasting..." : "Submit Reading"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

