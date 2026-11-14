"use client";

import React, { useState } from 'react';
import { ImageUpload } from './ImageUpload';
import { AIAnalysisResults } from './AIAnalysisResults';
import { BuildingEditor } from './BuildingEditor';
import { VisualEstimatorResults } from './VisualEstimatorResults';
import { cn } from '@/lib/utils';

export function VisualEstimator() {
  const [step, setStep] = useState(1);
  const [aiDetails] = useState<any>({
    buildingType: 'Two-floor House',
    visibleFloors: 2,
    mainEntrance: 1,
    visibleWindows: 6,
    hasBalcony: true,
    roofStyle: 'Flat Terrace',
    hasCompoundWall: false,
  });

  const handleGenerate = () => {
    setStep(2);
  };

  return (
    <div className="w-full max-w-none px-0 sm:px-1 py-1">
      {/* Sub-navigation Tabs */}
      <div className="flex bg-slate-100 rounded-lg p-1 mb-2.5 shadow-2xs border border-slate-200">
        <button
          onClick={() => setStep(1)}
          className={cn(
            "flex-1 py-2 text-xs sm:text-sm font-bold rounded-md text-center transition-all cursor-pointer",
            step === 1 ? "bg-white text-orange-600 shadow-xs" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
          )}
        >
          Step 1: Interactive 2D Plan & Structural Editor
        </button>
        <button
          onClick={() => setStep(2)}
          className={cn(
            "flex-1 py-2 text-xs sm:text-sm font-bold rounded-md text-center transition-all cursor-pointer",
            step === 2 ? "bg-white text-orange-600 shadow-xs" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
          )}
        >
          Step 2: 3D Visualization & Comprehensive AI Estimate
        </button>
      </div>

      {/* Content */}
      <div className="w-full bg-white shadow-xs rounded-lg sm:rounded-xl p-1.5 sm:p-2.5 lg:p-3 border border-slate-200/90">
        {step === 1 && <BuildingEditor initialDetails={aiDetails} onGenerate={handleGenerate} />}
        {step === 2 && <VisualEstimatorResults onBack={() => setStep(1)} />}
      </div>
    </div>
  );
}
