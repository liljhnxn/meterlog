"use client";

import React from "react";
import { Gauge, Activity, Zap, TrendingUp } from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface SummaryCardsProps {
  totalMeters: number;
  totalReadings: number;
  latestReading: number;
  totalConsumption: number;
  isLoading?: boolean;
}

export function SummaryCards({
  totalMeters,
  totalReadings,
  latestReading,
  totalConsumption,
  isLoading,
}: SummaryCardsProps) {
  const cards = [
    {
      title: "Registered Meters",
      value: formatNumber(totalMeters),
      subtext: "Tracked on Botchain",
      icon: Gauge,
      accent: "text-accent",
      borderGlow: "border-charcoal-700 hover:border-accent/40",
    },
    {
      title: "Readings Submitted",
      value: formatNumber(totalReadings),
      subtext: "Immutable logs",
      icon: Activity,
      accent: "text-emerald-400",
      borderGlow: "border-charcoal-700 hover:border-emerald-500/40",
    },
    {
      title: "Latest Meter Reading",
      value: `${formatNumber(latestReading)} kWh`,
      subtext: "Most recent entry",
      icon: Zap,
      accent: "text-accent-bright",
      borderGlow: "border-charcoal-700 hover:border-accent-bright/40",
    },
    {
      title: "Total Consumption",
      value: `${formatNumber(totalConsumption)} kWh`,
      subtext: "Calculated across meters",
      icon: TrendingUp,
      accent: "text-teal-400",
      borderGlow: "border-charcoal-700 hover:border-teal-500/40",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`bg-charcoal-850 rounded-xl p-5 border ${card.borderGlow} transition-all duration-200 shadow-sm flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-charcoal-400 uppercase tracking-wider">
                {card.title}
              </span>
              <div className="w-8 h-8 rounded-lg bg-charcoal-800 border border-charcoal-700 flex items-center justify-center">
                <Icon className={`w-4 h-4 ${card.accent}`} />
              </div>
            </div>
            <div className="mt-4">
              {isLoading ? (
                <div className="h-8 w-24 bg-charcoal-800 animate-pulse rounded" />
              ) : (
                <div className="text-2xl font-bold tracking-tight text-charcoal-100 font-mono">
                  {card.value}
                </div>
              )}
              <div className="text-xs text-charcoal-400 mt-1">{card.subtext}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

