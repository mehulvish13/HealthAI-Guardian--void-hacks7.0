import React from 'react';
import { ClipboardList, Utensils, Stethoscope } from 'lucide-react';

interface SmartToolsProps {
  onGenerateReport: () => void;
  onGenerateMealPlan: () => void;
  onCheckSymptoms: () => void;
  isDisabled: boolean;
}

export const SmartTools: React.FC<SmartToolsProps> = ({ 
  onGenerateReport, 
  onGenerateMealPlan, 
  onCheckSymptoms,
  isDisabled 
}) => {
  return (
    <div className="px-4 py-2 grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
      <button 
        onClick={onGenerateReport}
        disabled={isDisabled}
        className="flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 p-3 rounded-xl transition-all border border-indigo-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
      >
        <ClipboardList className="w-5 h-5" />
        <span className="font-medium text-sm">Symptom Report</span>
      </button>

      <button 
        onClick={onCheckSymptoms}
        disabled={isDisabled}
        className="flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 p-3 rounded-xl transition-all border border-rose-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
      >
        <Stethoscope className="w-5 h-5" />
        <span className="font-medium text-sm">Symptom Checker</span>
      </button>

      <button 
        onClick={onGenerateMealPlan}
        disabled={isDisabled}
        className="flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 p-3 rounded-xl transition-all border border-emerald-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
      >
        <Utensils className="w-5 h-5" />
        <span className="font-medium text-sm">Meal Planner</span>
      </button>
    </div>
  );
};