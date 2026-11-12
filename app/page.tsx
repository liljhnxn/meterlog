"use client";

import React, { useState, useMemo } from "react";
import { useAccount, useReadContract } from "wagmi";
import { Header } from "@/components/Header";
import { NetworkBanner } from "@/components/NetworkBanner";
import { SummaryCards } from "@/components/SummaryCards";
import { MeterList } from "@/components/MeterList";
import { RegisterMeterModal } from "@/components/RegisterMeterModal";
import { RecordReadingModal } from "@/components/RecordReadingModal";
import { EditMeterModal } from "@/components/EditMeterModal";
import { MeterDetailModal } from "@/components/MeterDetailModal";
import { METER_LOG_ABI, MeterData } from "@/lib/contractAbi";
import { CONTRACT_ADDRESS } from "@/lib/wagmi";
import { Shield, Zap, Plus, RefreshCw, ExternalLink } from "lucide-react";

export default function Home() {
  const { isConnected } = useAccount();

  // Modals state
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedMeterForDetail, setSelectedMeterForDetail] = useState<MeterData | null>(null);
  const [selectedMeterForRecord, setSelectedMeterForRecord] = useState<MeterData | null>(null);
  const [selectedMeterForEdit, setSelectedMeterForEdit] = useState<MeterData | null>(null);

  // Read all meters from smart contract
  const {
    data: allMetersRaw,
    isLoading: isLoadingMeters,
    refetch: refetchMeters,
    isRefetching,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: METER_LOG_ABI,
    functionName: "getAllMeters",
  });

  // Read global stats from smart contract
  const { data: globalStatsRaw, refetch: refetchStats } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: METER_LOG_ABI,
    functionName: "getGlobalStats",
  });

  const meters = (allMetersRaw as MeterData[]) || [];

  // Computed summary metrics
  const totalMeters = meters.length;
  const totalReadings = globalStatsRaw
    ? Number(globalStatsRaw[1])
    : meters.reduce((acc, m) => acc + Number(m.readingCount), 0);
  const totalConsumption = globalStatsRaw
    ? Number(globalStatsRaw[2])
    : meters.reduce((acc, m) => acc + Number(m.totalConsumption), 0);

  // Find latest meter reading value across all registered meters
  const latestReading = useMemo(() => {
    if (meters.length === 0) return 0;
    let max = 0;
    for (const m of meters) {
      const val = Number(m.latestReading);
      if (val > max) max = val;
    }
    return max;
  }, [meters]);

  const handleRefresh = () => {
    refetchMeters();
    refetchStats();
  };

  const handleSuccessAction = () => {
    handleRefresh();
  };

  return (
    <div className="min-h-screen flex flex-col bg-charcoal-900 text-charcoal-100">
      {/* Top Header */}
      <Header onOpenRegister={() => setIsRegisterOpen(true)} />

      {/* Network mismatch warning banner */}
      <NetworkBanner />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome / Dashboard Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-charcoal-800 pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-charcoal-100">
              Electricity Meter Ledger
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-400 mt-1">
              Verifiable, tamper-proof tracking of electricity meter readings and consumption on Botchain.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleRefresh}
              disabled={isRefetching}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-charcoal-800 border border-charcoal-700 hover:border-charcoal-600 text-xs text-charcoal-300 hover:text-charcoal-100 transition-colors disabled:opacity-50"
              title="Refresh blockchain data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefetching ? "animate-spin text-accent" : ""}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={() => setIsRegisterOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-charcoal-950 font-medium text-xs hover:bg-accent-hover transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Meter</span>
            </button>
          </div>
        </div>

        {/* Summary Metric Cards */}
        <SummaryCards
          totalMeters={totalMeters}
          totalReadings={totalReadings}
          latestReading={latestReading}
          totalConsumption={totalConsumption}
          isLoading={isLoadingMeters}
        />

        {/* Meters List Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent" />
              <h2 className="text-base font-semibold text-charcoal-100">Registered Meters</h2>
            </div>
            <div className="text-xs text-charcoal-400">
              Contract:{" "}
              <a
                href={`https://scan.botchain.ai/address/${CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-accent hover:underline inline-flex items-center gap-1"
              >
                {CONTRACT_ADDRESS ? `${CONTRACT_ADDRESS.slice(0, 6)}...${CONTRACT_ADDRESS.slice(-4)}` : "Not Configured"}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <MeterList
            meters={meters}
            isLoading={isLoadingMeters}
            onSelectMeter={(meter) => setSelectedMeterForDetail(meter)}
            onOpenRecord={(meter) => setSelectedMeterForRecord(meter)}
            onOpenEdit={(meter) => setSelectedMeterForEdit(meter)}
            onOpenRegister={() => setIsRegisterOpen(true)}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-charcoal-800 bg-charcoal-950/60 py-6 text-xs text-charcoal-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-accent" />
            <span>MeterLog • Verified On-Chain Ledger</span>
          </div>

          <div className="flex items-center gap-6 font-mono text-[11px] text-charcoal-400">
            <span>Network: Botchain Mainnet</span>
            <span>Chain ID: 677</span>
            <a
              href="https://scan.botchain.ai"
              target="_blank"
              rel="noreferrer"
              className="text-accent hover:underline flex items-center gap-1"
            >
              <span>BotchainScan Explorer</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <RegisterMeterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={handleSuccessAction}
      />

      <RecordReadingModal
        meter={selectedMeterForRecord}
        isOpen={Boolean(selectedMeterForRecord)}
        onClose={() => setSelectedMeterForRecord(null)}
        onSuccess={handleSuccessAction}
      />

      <EditMeterModal
        meter={selectedMeterForEdit}
        isOpen={Boolean(selectedMeterForEdit)}
        onClose={() => setSelectedMeterForEdit(null)}
        onSuccess={handleSuccessAction}
      />

      <MeterDetailModal
        meter={selectedMeterForDetail}
        isOpen={Boolean(selectedMeterForDetail)}
        onClose={() => setSelectedMeterForDetail(null)}
        onOpenRecord={(meter) => {
          setSelectedMeterForDetail(null);
          setSelectedMeterForRecord(meter);
        }}
        onOpenEdit={(meter) => {
          setSelectedMeterForDetail(null);
          setSelectedMeterForEdit(meter);
        }}
      />
    </div>
  );
}

