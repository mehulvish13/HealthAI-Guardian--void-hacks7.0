import React, { useState } from 'react';
import { HeartPulse, Volume2, VolumeX, Languages, ChevronDown } from 'lucide-react';
import { Language } from '../types';

export const LANGUAGES: Language[] = [
  { code: 'en-US', name: 'English', voiceLang: 'en' },
  { code: 'es-ES', name: 'Español', voiceLang: 'es' },
  { code: 'fr-FR', name: 'Français', voiceLang: 'fr' },
  { code: 'de-DE', name: 'Deutsch', voiceLang: 'de' },
  { code: 'hi-IN', name: 'हिन्दी', voiceLang: 'hi' },
  { code: 'ja-JP', name: '日本語', voiceLang: 'ja' },
];

interface HeaderProps {
  isAudioEnabled: boolean;
  toggleAudio: () => void;
  selectedLang: Language;
  onLangChange: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({ isAudioEnabled, toggleAudio, selectedLang, onLangChange }) => {
  const [isLangOpen, setIsLangOpen] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-4 flex items-center justify-between z-30 relative">
      <div className="flex items-center gap-3">
        <div className="bg-teal-50 p-2 rounded-lg">
          <HeartPulse className="w-6 h-6 text-teal-600" />
        </div>
        <div>
          <h1 className="font-bold text-xl text-slate-800 tracking-tight">MediBot</h1>
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             <p className="text-xs text-slate-500 font-medium">Online Health Assistant</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Language Selector */}
        <div className="relative">
          <button 
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-sm font-medium text-slate-700 transition-colors"
          >
            <Languages className="w-4 h-4" />
            <span className="hidden md:inline">{selectedLang.name}</span>
            <ChevronDown className="w-3 h-3 opacity-50" />
          </button>
          
          {isLangOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsLangOpen(false)}></div>
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden py-1">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onLangChange(lang);
                      setIsLangOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-sm text-left hover:bg-teal-50 hover:text-teal-700 transition-colors ${selectedLang.code === lang.code ? "bg-teal-50 text-teal-700 font-bold" : "text-slate-600"}`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <button 
          onClick={toggleAudio}
          className={`p-2 rounded-full transition-colors duration-200 ${isAudioEnabled ? 'bg-teal-50 text-teal-600 hover:bg-teal-100' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
          title={isAudioEnabled ? "Mute responses" : "Enable voice responses"}
        >
          {isAudioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
};
