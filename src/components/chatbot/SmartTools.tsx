import React from 'react';
import { ClipboardList, Utensils, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  const tooltipText = isDisabled ? "Chat with MediBot first to unlock Smart Tools" : "";

  return (
    <div className="px-4 py-2 grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              onClick={onGenerateReport}
              disabled={isDisabled}
              variant="outline"
              className="flex items-center justify-center gap-2 h-auto py-3"
            >
              <ClipboardList className="w-5 h-5" />
              <span className="font-medium text-sm">Symptom Report</span>
            </Button>
          </TooltipTrigger>
          {isDisabled && <TooltipContent>{tooltipText}</TooltipContent>}
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              onClick={onCheckSymptoms}
              disabled={isDisabled}
              variant="outline"
              className="flex items-center justify-center gap-2 h-auto py-3"
            >
              <Stethoscope className="w-5 h-5" />
              <span className="font-medium text-sm">Symptom Checker</span>
            </Button>
          </TooltipTrigger>
          {isDisabled && <TooltipContent>{tooltipText}</TooltipContent>}
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              onClick={onGenerateMealPlan}
              disabled={isDisabled}
              variant="outline"
              className="flex items-center justify-center gap-2 h-auto py-3"
            >
              <Utensils className="w-5 h-5" />
              <span className="font-medium text-sm">Meal Planner</span>
            </Button>
          </TooltipTrigger>
          {isDisabled && <TooltipContent>{tooltipText}</TooltipContent>}
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
