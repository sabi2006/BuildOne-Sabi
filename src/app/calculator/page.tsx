"use client";

import React, { useState } from 'react';
import { motion } from "framer-motion";
import { CalculatorProvider } from "@/components/calculator/CalculatorContext";
import CalculatorSettingsPanel from "@/components/calculator/CalculatorSettings";
import ResultDashboard from "@/components/calculator/ResultDashboard";
import StructurePreview3D from "@/components/calculator/StructurePreview3D";
import { VisualEstimator } from "@/components/calculator/VisualEstimator";
import { Calculator as CalculatorIcon, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { useCalculator } from "@/components/calculator/CalculatorContext";

function CalculatorContent() {
  const { activeTab, setActiveTab } = useCalculator();

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Page Header - Compact when in visual mode for maximum workspace */}
      <div className={cn(
        "bg-slate-900 text-white transition-all",
        activeTab === 'visual' ? "py-4 md:py-6" : "py-14 md:py-18"
      )}>
        <div className={cn(
          "mx-auto px-4 sm:px-6 lg:px-8 text-center",
          activeTab === 'visual' ? "w-full max-w-none" : "max-w-7xl"
        )}>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className={cn(
              "font-bold text-white tracking-tight",
              activeTab === 'visual' ? "text-2xl md:text-3xl mb-1.5" : "text-4xl md:text-5xl mb-4"
            )}>
              Brick & Structural Calculator
            </h1>
            <p className={cn(
              "text-slate-300 mx-auto",
              activeTab === 'visual' ? "text-xs md:text-sm max-w-2xl" : "text-lg max-w-2xl"
            )}>
              Estimate bricks, RCC columns, footings, slabs, mortar, plaster, and comprehensive construction costs.
            </p>
          </motion.div>
        </div>
      </div>

      <div className={cn(
        "w-full transition-all",
        activeTab === 'visual' ? "px-0 sm:px-1.5 lg:px-3 py-2 max-w-none" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      )}>
        <div className={cn("flex justify-center", activeTab === 'visual' ? "mb-2.5" : "mb-12")}>
          <div className="inline-flex bg-gray-200/90 rounded-lg p-1 shadow-xs border border-gray-300">
            <button
              onClick={() => setActiveTab('standard')}
              className={cn(
                "px-5 py-2 rounded-md text-xs sm:text-sm font-semibold transition-all flex items-center space-x-2 cursor-pointer",
                activeTab === 'standard' ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              )}
            >
              <CalculatorIcon className="w-4 h-4" />
              <span>Standard Calculator</span>
            </button>
            <button
              onClick={() => setActiveTab('visual')}
              className={cn(
                "px-5 py-2 rounded-md text-xs sm:text-sm font-semibold transition-all flex items-center space-x-2 cursor-pointer",
                activeTab === 'visual' ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              )}
            >
              <ImageIcon className="w-4 h-4 text-orange-500" />
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent font-bold">AI Visual Estimator</span>
            </button>
          </div>
        </div>

        {activeTab === 'standard' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2">
                <CalculatorSettingsPanel />
              </div>
              <div className="lg:col-span-1">
                <ResultDashboard />
              </div>
            </div>
            <div className="w-full mt-8">
              <StructurePreview3D />
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <VisualEstimator />
          </motion.div>
        )}

      </div>
    </div>
  );
}

export default function CalculatorPage() {
  return (
    <CalculatorProvider>
      <CalculatorContent />
    </CalculatorProvider>
  );
}
