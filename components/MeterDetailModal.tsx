"use client";

import React from "react";
import { useAccount, useReadContract } from "wagmi";
import { METER_LOG_ABI, MeterData, ReadingData } from "@/lib/contractAbi";
import { CONTRACT_ADDRESS } from "@/lib/wagmi";
import { formatDate, formatNumber, shortenAddress } from "@/lib/utils";
import {
  X,
  Gauge,
  Calendar,
  MapPin,
  User,
  History,
  Clock,
  Plus,
  Edit,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

interface MeterDetailModalProps {
  meter: MeterData | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenRecord: (meter: MeterData) => void;
  onOpenEdit: (meter: MeterData) => void;
}

export function MeterDetailModal({
  meter,
  isOpen,
  onClose,
  onOpenRecord,
  onOpenEdit,
}: MeterDetailModalProps) {
  const { address } = useAccount();

  const { data: readings, isLoading: isLoadingReadings, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: METER_LOG_ABI,
    functionName: "getMeterReadings",
    args: meter ? [BigInt(meter.id)] : undefined,
    query: {
      enabled: Boolean(meter && isOpen),
    },
  });

  if (!isOpen || !meter) return null;

  const isOwner = address && meter.owner.toLowerCase() === address.toLowerCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-charcoal-850 border border-charcoal-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-charcoal-700 bg-charcoal-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-charcoal-100">{meter.name}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-charcoal-800 border border-charcoal-700 text-charcoal-300">
                  ID #{meter.id.toString()}
                </span>
                {isOwner && (
                  <span className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded bg-accent/15 border border-accent/30 text-accent">
                    <ShieldCheck className="w-3 h-3" />
                    Owner
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-charcoal-400 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-charcoal-500" />
                <span>{meter.location}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-charcoal-400 hover:text-charcoal-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Description */}
          {meter.description && (
            <div className="p-3.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-xs text-charcoal-300 leading-relaxed">
              {meter.description}
            </div>
          )}

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-charcoal-900 border border-charcoal-700">
              <span className="text-[10px] uppercase font-medium text-charcoal-400 block mb-1">
                Current Reading
              </span>
              <span className="text-base font-bold font-mono text-charcoal-100">
                {Number(meter.readingCount) === 0 ? "—" : `${formatNumber(meter.latestReading)} kWh`}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-charcoal-900 border border-charcoal-700">
              <span className="text-[10px] uppercase font-medium text-charcoal-400 block mb-1">
                Total Consumption
              </span>
              <span className="text-base font-bold font-mono text-accent-bright">
                {formatNumber(meter.totalConsumption)} kWh
              </span>
            </div>

            <div className="p-3 rounded-xl bg-charcoal-900 border border-charcoal-700">
              <span className="text-[10px] uppercase font-medium text-charcoal-400 block mb-1">
                Total Readings
              </span>
              <span className="text-base font-bold font-mono text-charcoal-100">
                {formatNumber(meter.readingCount)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-charcoal-900 border border-charcoal-700">
              <span className="text-[10px] uppercase font-medium text-charcoal-400 block mb-1">
                Last Updated
              </span>
              <span className="text-xs font-mono text-charcoal-300">
                {formatDate(meter.lastUpdated)}
              </span>
            </div>
          </div>

          {/* Metadata details */}
          <div className="p-3 rounded-xl bg-charcoal-900 border border-charcoal-700 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-charcoal-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Owner Address
              </span>
              <span className="font-mono text-charcoal-200">{shortenAddress(meter.owner)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-charcoal-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Registered On
              </span>
              <span className="text-charcoal-200">{formatDate(meter.registrationDate)}</span>
            </div>
          </div>

          {/* Reading History */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-accent" />
                <h4 className="text-sm font-semibold text-charcoal-100">Reading History (Chronological)</h4>
              </div>
              <span className="text-xs text-charcoal-400">
                {readings ? `${(readings as ReadingData[]).length} entries` : "Loading..."}
              </span>
            </div>

            {isLoadingReadings ? (
              <div className="p-8 text-center text-xs text-charcoal-400 bg-charcoal-900 rounded-xl border border-charcoal-700">
                Loading reading history from blockchain...
              </div>
            ) : !readings || (readings as ReadingData[]).length === 0 ? (
              <div className="p-8 text-center bg-charcoal-900 rounded-xl border border-charcoal-700">
                <p className="text-xs text-charcoal-400 mb-2">No meter readings recorded yet.</p>
                {isOwner && (
                  <button
                    onClick={() => onOpenRecord(meter)}
                    className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Submit initial reading
                  </button>
                )}
              </div>
            ) : (
              <div className="border border-charcoal-700 rounded-xl overflow-hidden bg-charcoal-900">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-charcoal-800/80 text-charcoal-400 uppercase font-mono text-[10px] border-b border-charcoal-700">
                      <tr>
                        <th className="px-4 py-2.5">#</th>
                        <th className="px-4 py-2.5">Reading (kWh)</th>
                        <th className="px-4 py-2.5">Consumption</th>
                        <th className="px-4 py-2.5">Timestamp</th>
                        <th className="px-4 py-2.5">Logged By</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-charcoal-800 font-mono text-charcoal-200">
                      {(readings as ReadingData[]).map((entry, idx) => (
                        <tr key={idx} className="hover:bg-charcoal-800/40 transition-colors">
                          <td className="px-4 py-3 text-charcoal-400">#{idx + 1}</td>
                          <td className="px-4 py-3 font-semibold text-charcoal-100">
                            {formatNumber(entry.readingKwh)} kWh
                          </td>
                          <td className="px-4 py-3">
                            {entry.isInitial || idx === 0 ? (
                              <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-charcoal-800 text-charcoal-400 font-sans">
                                Initial Reading
                              </span>
                            ) : (
                              <span className="text-accent-bright font-semibold">
                                +{formatNumber(entry.consumption)} kWh
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-charcoal-400 font-sans">
                            {formatDate(entry.timestamp)}
                          </td>
                          <td className="px-4 py-3 text-charcoal-400">
                            {shortenAddress(entry.recordedBy)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 px-6 border-t border-charcoal-700 bg-charcoal-900 flex items-center justify-between shrink-0">
          <div className="text-xs text-charcoal-400">
            {isOwner ? "You are the verified owner of this meter." : "Public on-chain view."}
          </div>
          <div className="flex items-center gap-2">
            {isOwner && (
              <>
                <button
                  onClick={() => onOpenEdit(meter)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-charcoal-800 border border-charcoal-700 text-xs text-charcoal-200 hover:text-charcoal-100 hover:bg-charcoal-700 transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Info</span>
                </button>
                <button
                  onClick={() => onOpenRecord(meter)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-charcoal-950 font-medium text-xs hover:bg-accent-hover transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Submit Reading</span>
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-charcoal-800 border border-charcoal-700 text-xs text-charcoal-300 hover:text-charcoal-100 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

