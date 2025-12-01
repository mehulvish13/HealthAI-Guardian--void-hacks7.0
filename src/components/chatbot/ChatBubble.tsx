import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage, Role } from '@/types/chatbot';
import { Bot, User, Play, Pause, BookOpen, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

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
            .catch(err => {
              console.log("Auto-play prevented:", err);
              // Auto-play was prevented (common in browsers), user must click play
            });
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
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.error("Playback error:", err);
          setIsPlaying(false);
        });
      }
    }
  };

  return (
    <div className={cn("flex w-full mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500", 
      isModel ? 'justify-start' : 'justify-end'
    )}>
      <div className={cn("flex max-w-[90%] md:max-w-[75%] items-end gap-2",
        isModel ? 'flex-row' : 'flex-row-reverse'
      )}>
        
        {/* Avatar */}
        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
          isModel ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground'
        )}>
          {isModel ? <Bot size={18} /> : <User size={18} />}
        </div>

        {/* Bubble */}
        <div 
          className={cn(
            "relative px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed overflow-hidden",
            isModel 
              ? 'bg-card border border-border text-card-foreground rounded-bl-none' 
              : 'bg-primary text-primary-foreground rounded-br-none',
            (message.isError || message.isEmergency) && 'border-destructive bg-destructive/10 text-destructive'
          )}
        >
          {message.isEmergency && (
             <div className="flex items-center gap-2 mb-2 text-destructive font-bold border-b border-destructive/20 pb-2">
               <AlertTriangle size={16} />
               <span>Possible Emergency</span>
             </div>
          )}

          {message.content ? (
             <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown
                  components={{
                    // Prevent images from breaking layout
                    img: ({node, ...props}) => <img {...props} style={{ maxWidth: '100%', height: 'auto' }} />,
                    // Better code blocks
                    code: ({node, inline, ...props}) => (
                      inline 
                        ? <code className="px-1 py-0.5 rounded bg-muted text-xs" {...props} />
                        : <code className="block p-2 rounded bg-muted overflow-x-auto text-xs" {...props} />
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
             </div>
          ) : (
            <span className="italic opacity-80">Audio message</span>
          )}

          {/* Knowledge Snippets (Context Cards) */}
          {message.relatedTerms && message.relatedTerms.length > 0 && (
            <div className={cn("mt-3 pt-3 border-t", 
              isModel ? 'border-border' : 'border-primary-foreground/20'
            )}>
              <div className="flex items-center gap-1.5 mb-2 opacity-80">
                <BookOpen size={12} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Medical Context</span>
              </div>
              <div className="space-y-2">
                {message.relatedTerms.map((item, idx) => (
                  <div key={idx} className={cn("p-2 rounded-lg text-xs",
                    isModel ? 'bg-muted text-muted-foreground' : 'bg-primary-foreground/10 text-primary-foreground'
                  )}>
                    <span className="font-bold block mb-0.5">{item.term}</span>
                    <span className="opacity-90 leading-tight block mb-1">{item.definition}</span>
                    
                    {item.details && (
                      <div className="mt-2 pt-2 border-t border-dashed border-opacity-20 grid grid-cols-2 gap-2">
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
            <div className={cn("mt-3 flex items-center gap-2 pt-2 border-t",
              isModel ? 'border-border' : 'border-primary-foreground/20'
            )}>
              <button 
                onClick={togglePlayback}
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full transition-colors",
                  isModel 
                    ? 'bg-muted text-primary hover:bg-muted/80' 
                    : 'bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30'
                )}
              >
                {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
              </button>
              <div className="h-1 flex-1 bg-border rounded-full overflow-hidden mx-2">
                 <div className={cn("h-full w-2/3", 
                   isPlaying ? 'bg-primary animate-pulse' : 'bg-muted'
                 )}></div>
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
          
          <div className={cn("text-[10px] mt-1 text-right w-full",
            isModel ? 'text-muted-foreground' : 'text-primary-foreground/70',
            message.isEmergency && 'text-destructive'
          )}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};
