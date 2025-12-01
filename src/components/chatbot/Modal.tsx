import React from 'react';
import { X, FileText, ClipboardList, Utensils, Stethoscope } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  type: 'report' | 'mealPlan' | 'symptomCheck';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, content, type }) => {
  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    let filename = 'download.txt';
    if (type === 'report') filename = 'medical-report.txt';
    else if (type === 'mealPlan') filename = 'meal-plan.txt';
    else if (type === 'symptomCheck') filename = 'symptom-check.txt';
    a.download = filename;
    a.click();
  };

  const getIcon = () => {
    if (type === 'report') return <ClipboardList className="w-5 h-5" />;
    if (type === 'mealPlan') return <Utensils className="w-5 h-5" />;
    if (type === 'symptomCheck') return <Stethoscope className="w-5 h-5" />;
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getIcon()}
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4">
          <div className="prose prose-sm max-w-none dark:prose-invert p-6 bg-muted/30 rounded-lg">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </ScrollArea>
        
        <DialogFooter className="flex-row gap-2">
          <Button 
            onClick={handleDownload}
            variant="outline"
            className="gap-2"
          >
            <FileText className="w-4 h-4" /> Download
          </Button>
          <Button onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
