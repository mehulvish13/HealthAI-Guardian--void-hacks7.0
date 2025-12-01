import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage, Role } from '../types';
import { Bot, User, Play, Pause, BookOpen, AlertTriangle } from 'lucide-react';

interface ChatBubbleProps {
  message: ChatMessage;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isModel = message.role === Role.MODEL;
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Auto-play model audio if available when message arrives
    if (isModel && message.audioUrl) {
      const audio = audioRef.current;
      if (audio) {
         const playPromise = audio.play();
         if (playPromise !== undefined) {
            playPromise
            .then(() => setIsPlaying(true))
            .catch(err => console.log("Auto-play prevented:", err));
         }
      }
    }
  }, [message.audioUrl, isModel]);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  return (
    <div className={`flex w-full ${isModel ? 'justify-start' : 'justify-end'} mb-4 animate-fade-in-up`}>
      <div className={`flex max-w-[90%] md:max-w-[75%] ${isModel ? 'flex-row' : 'flex-row-reverse'} items-end gap-2`}>
        
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isModel ? 'bg-teal-100 text-teal-600' : 'bg-slate-200 text-slate-600'}`}>
          {isModel ? <Bot size={18} /> : <User size={18} />}
        </div>

        {/* Bubble */}
        <div 
          className={`relative px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed overflow-hidden
            ${isModel 
              ? 'bg-white border border-slate-100 text-slate-700 rounded-bl-none' 
              : 'bg-teal-600 text-white rounded-br-none'
            }
            ${message.isError || message.isEmergency ? 'border-red-200 bg-red-50 text-red-900' : ''}
          `}
        >
          {message.isEmergency && (
             <div className="flex items-center gap-2 mb-2 text-red-600 font-bold border-b border-red-200 pb-2">
               <AlertTriangle size={16} />
               <span>Possible Emergency</span>
             </div>
          )}

          {message.content ? (
             <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown>{message.content}</ReactMarkdown>
             </div>
          ) : (
            <span className="italic opacity-80">Audio message</span>
          )}

          {/* Knowledge Snippets (Context Cards) */}
          {message.relatedTerms && message.relatedTerms.length > 0 && (
            <div className={`mt-3 pt-3 border-t ${isModel ? 'border-slate-100' : 'border-teal-500/30'}`}>
              <div className="flex items-center gap-1.5 mb-2 opacity-80">
                <BookOpen size={12} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Medical Context</span>
              </div>
              <div className="space-y-2">
                {message.relatedTerms.map((item, idx) => (
                  <div key={idx} className={`p-2 rounded-lg text-xs ${isModel ? 'bg-slate-50 text-slate-600' : 'bg-teal-700/50 text-teal-50'}`}>
                    <span className="font-bold block mb-0.5">{item.term}</span>
                    <span className="opacity-90 leading-tight block mb-1">{item.definition}</span>
                    
                    {item.details && (
                      <div className="mt-2 pt-2 border-t border-dashed border-opacity-20 border-slate-400 grid grid-cols-2 gap-2">
                        {item.details.symptoms && (
                           <div>
                             <span className="font-semibold text-[10px] opacity-75">Symptoms:</span>
                             <p className="line-clamp-2">{item.details.symptoms.join(', ')}</p>
                           </div>
                        )}
                         {item.details.precautions && (
                           <div>
                             <span className="font-semibold text-[10px] opacity-75">Tips:</span>
                             <p className="line-clamp-2">{item.details.precautions.join(', ')}</p>
                           </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Audio Player Controls */}
          {message.audioUrl && (
            <div className={`mt-3 flex items-center gap-2 pt-2 border-t ${isModel ? 'border-slate-100' : 'border-teal-500/30'}`}>
              <button 
                onClick={togglePlayback}
                className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors 
                  ${isModel 
                    ? 'bg-slate-100 text-teal-600 hover:bg-slate-200' 
                    : 'bg-teal-500 text-white hover:bg-teal-400'
                  }`}
              >
                {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
              </button>
              <div className="h-1 flex-1 bg-gray-200 rounded-full overflow-hidden mx-2">
                 {/* Visual placeholder for waveform */}
                 <div className={`h-full ${isPlaying ? 'bg-teal-500 animate-pulse' : 'bg-gray-300'} w-2/3`}></div>
              </div>
              <audio 
                ref={audioRef} 
                src={message.audioUrl} 
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
            </div>
          )}
          
          <div className={`text-[10px] mt-1 text-right w-full ${isModel ? 'text-slate-400' : 'text-teal-200'} ${message.isEmergency ? 'text-red-400' : ''}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};
