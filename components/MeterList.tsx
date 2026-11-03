"use client";

import React, { useState, useMemo } from "react";
import { useAccount } from "wagmi";
import { MeterData } from "@/lib/contractAbi";
import { formatDate, formatNumber, shortenAddress } from "@/lib/utils";
import {
  Gauge,
  Search,
  Filter,
  ArrowUpRight,
  Plus,
  Edit2,
  Calendar,
  MapPin,
  ShieldCheck,
  ChevronRight,
  Inbox,
} from "lucide-react";

interface MeterListProps {
  meters: MeterData[];
  isLoading: boolean;
  onSelectMeter: (meter: MeterData) => void;
  onOpenRecord: (meter: MeterData) => void;
  onOpenEdit: (meter: MeterData) => void;
  onOpenRegister: () => void;
}

export function MeterList({
  meters,
  isLoading,
  onSelectMeter,
  onOpenRecord,
  onOpenEdit,
  onOpenRegister,
}: MeterListProps) {
  const { address, isConnected } = useAccount();
  const [searchQuery, setSearchQuery] = useState("");
  const [tabFilter, setTabFilter] = useState<"all" | "mine">("all");

  const filteredMeters = useMemo(() => {
    return meters.filter((meter) => {
      const matchesSearch =
        meter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meter.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meter.id.toString().includes(searchQuery);

      if (!matchesSearch) return false;

      if (tabFilter === "mine") {
        if (!address) return false;
        return meter.owner.toLowerCase() === address.toLowerCase();
      }

      return true;
    });
  }, [meters, searchQuery, tabFilter, address]);

  const myMetersCount = useMemo(() => {
    if (!address) return 0;
    return meters.filter((m) => m.owner.toLowerCase() === address.toLowerCase()).length;
  }, [meters, address]);

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Tabs */}
          <div className="flex rounded-lg bg-charcoal-850 p-1 border border-charcoal-700">
            <button
              onClick={() => setTabFilter("all")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                tabFilter === "all"
                  ? "bg-charcoal-700 text-charcoal-100 shadow-sm"
                  : "text-charcoal-400 hover:text-charcoal-200"
              }`}
            >
              All Meters ({meters.length})
            </button>
            <button
              onClick={() => setTabFilter("mine")}
              disabled={!isConnected}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50 ${
                tabFilter === "mine"
                  ? "bg-charcoal-700 text-charcoal-100 shadow-sm"
                  : "text-charcoal-400 hover:text-charcoal-200"
              }`}
            >
              <span>My Meters</span>
              {isConnected && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-charcoal-800 text-accent font-mono">
                  {myMetersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, location or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-charcoal-850 border border-charcoal-700 text-xs text-charcoal-100 focus:outline-none focus:border-accent transition-colors placeholder:text-charcoal-500"
          />
        </div>
      </div>

      {/* Meter List Table / Cards */}
      {isLoading ? (
        <div className="bg-charcoal-850 rounded-xl border border-charcoal-700 divide-y divide-charcoal-750 p-6 space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="animate-pulse space-y-2">
              <div className="h-4 bg-charcoal-800 rounded w-1/4" />
              <div className="h-3 bg-charcoal-800 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredMeters.length === 0 ? (
        <div className="bg-charcoal-850 rounded-xl border border-charcoal-700 p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-charcoal-800 border border-charcoal-700 flex items-center justify-center mx-auto text-charcoal-400 mb-3">
            <Inbox className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-charcoal-200 mb-1">
            {tabFilter === "mine" && !isConnected
              ? "Connect Wallet to View Your Meters"
              : meters.length === 0
              ? "No Electricity Meters Registered"
              : "No Meters Match Your Filter"}
          </h4>
          <p className="text-xs text-charcoal-400 max-w-sm mx-auto mb-5">
            {meters.length === 0
              ? "Get started by registering your first electricity meter to track kWh readings and consumption."
              : "Try adjusting your search query or switch tabs to see all registered meters."}
          </p>
          {meters.length === 0 && (
            <button
              onClick={onOpenRegister}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-charcoal-950 font-medium text-xs hover:bg-accent-hover transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register First Meter</span>
            </button>
          )}
        </div>
      ) : (
        <div className="bg-charcoal-850 rounded-xl border border-charcoal-700 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-charcoal-900 text-charcoal-400 uppercase font-mono text-[10px] border-b border-charcoal-700">
                <tr>
                  <th className="px-5 py-3">Meter Info</th>
                  <th className="px-5 py-3">Location</th>
                  <th className="px-5 py-3">Latest Reading</th>
                  <th className="px-5 py-3">Total Consumption</th>
                  <th className="px-5 py-3">Last Updated</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-800 text-charcoal-200">
                {filteredMeters.map((meter) => {
                  const isOwner =
                    address && meter.owner.toLowerCase() === address.toLowerCase();

                  return (
                    <tr
                      key={meter.id.toString()}
                      className="hover:bg-charcoal-800/50 transition-colors cursor-pointer group"
                      onClick={() => onSelectMeter(meter)}
                    >
                      {/* Name & ID */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-charcoal-100 group-hover:text-accent transition-colors">
                            {meter.name}
                          </span>
                          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-charcoal-800 border border-charcoal-700 text-charcoal-400">
                            #{meter.id.toString()}
                          </span>
                          {isOwner && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/15 border border-accent/30 text-accent font-medium">
                              Mine
                            </span>
                          )}
                        </div>
                        {meter.description && (
                          <div className="text-[11px] text-charcoal-400 line-clamp-1 mt-0.5 max-w-xs">
                            {meter.description}
                          </div>
                        )}
                      </td>

                      {/* Location */}
                      <td className="px-5 py-3.5 text-charcoal-300">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-charcoal-500 shrink-0" />
                          <span className="truncate max-w-[150px]">{meter.location}</span>
                        </div>
                      </td>

                      {/* Latest Reading */}
                      <td className="px-5 py-3.5 font-mono">
                        {Number(meter.readingCount) === 0 ? (
                          <span className="text-charcoal-500 italic">No readings</span>
                        ) : (
                          <div>
                            <span className="font-semibold text-charcoal-100">
                              {formatNumber(meter.latestReading)}
                            </span>
                            <span className="text-[10px] text-charcoal-400 ml-1">kWh</span>
                          </div>
                        )}
                      </td>

                      {/* Total Consumption */}
                      <td className="px-5 py-3.5 font-mono">
                        <span className="text-accent-bright font-semibold">
                          {formatNumber(meter.totalConsumption)}
                        </span>
                        <span className="text-[10px] text-charcoal-400 ml-1">kWh</span>
                      </td>

                      {/* Last Updated */}
                      <td className="px-5 py-3.5 text-charcoal-400 font-sans">
                        {formatDate(meter.lastUpdated)}
                      </td>

                      {/* Actions */}
                      <td
                        className="px-5 py-3.5 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          {isOwner && (
                            <button
                              onClick={() => onOpenRecord(meter)}
                              title="Submit New Reading"
                              className="px-2.5 py-1.5 rounded-lg bg-accent/15 border border-accent/30 text-accent hover:bg-accent hover:text-charcoal-950 font-medium text-xs transition-colors flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Log</span>
                            </button>
                          )}
                          <button
                            onClick={() => onSelectMeter(meter)}
                            className="px-2.5 py-1.5 rounded-lg bg-charcoal-800 border border-charcoal-700 text-charcoal-300 hover:text-charcoal-100 hover:bg-charcoal-700 text-xs transition-colors flex items-center gap-1"
                          >
                            <span>History</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

