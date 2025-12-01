import React from 'react';
import { X, FileText, ClipboardList, Utensils, Stethoscope } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  type: 'report' | 'mealPlan' | 'symptomCheck';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, content, type }) => {
  if (!isOpen) return null;

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

  const getHeaderStyles = () => {
    if (type === 'report') return 'bg-indigo-50 text-indigo-800';
    if (type === 'mealPlan') return 'bg-emerald-50 text-emerald-800';
    if (type === 'symptomCheck') return 'bg-rose-50 text-rose-800';
    return 'bg-slate-50 text-slate-800';
  };

  const getIcon = () => {
    if (type === 'report') return <ClipboardList className="w-5 h-5" />;
    if (type === 'mealPlan') return <Utensils className="w-5 h-5" />;
    if (type === 'symptomCheck') return <Stethoscope className="w-5 h-5" />;
    return null;
  };

  const getDownloadButtonStyles = () => {
    if (type === 'report') return 'text-indigo-600 hover:bg-indigo-50 border border-indigo-100';
    if (type === 'mealPlan') return 'text-emerald-600 hover:bg-emerald-50 border border-emerald-100';
    if (type === 'symptomCheck') return 'text-rose-600 hover:bg-rose-50 border border-rose-100';
    return 'text-slate-600 hover:bg-slate-50 border border-slate-100';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in-up">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between ${getHeaderStyles()}`}>
          <h2 className="text-lg font-bold flex items-center gap-2">
            {getIcon()}
            {title}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-full transition-colors">
            <X className="w-5 h-5 opacity-70" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto bg-slate-50 flex-1">
          <div className="prose prose-sm max-w-none prose-headings:text-slate-800 prose-p:text-slate-600 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t bg-white flex justify-end gap-3">
          <button 
            onClick={handleDownload}
            className={`px-4 py-2 font-medium rounded-lg flex items-center gap-2 transition-colors ${getDownloadButtonStyles()}`}
          >
            <FileText className="w-4 h-4" /> Download
          </button>
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 shadow-lg shadow-slate-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};