import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Square, Loader2 } from 'lucide-react';

interface InputControlsProps {
  onSendMessage: (text: string, audioBlob?: Blob) => void;
  isLoading: boolean;
}

export const InputControls: React.FC<InputControlsProps> = ({ onSendMessage, isLoading }) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const typingTimeoutRef = useRef<number | null>(null);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' }); 
        // Send audio message
        onSendMessage('', audioBlob);
        
        // Stop all tracks to release mic
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setInputText(text);

    if (text.trim().length > 0) {
      setIsTyping(true);
      
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current);
      }
      
      // Auto-hide after 2 seconds of inactivity
      typingTimeoutRef.current = window.setTimeout(() => {
        setIsTyping(false);
      }, 2000);
    } else {
      setIsTyping(false);
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleSendText = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || isLoading) return;
    
    // Clear typing indicator immediately upon sending
    setIsTyping(false);
    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current);
    }

    onSendMessage(inputText);
    setInputText('');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white border-t border-slate-200 p-4 relative z-20">
      {/* Typing Indicator */}
      {isTyping && !isRecording && (
        <div className="absolute bottom-full left-6 mb-2 bg-white text-teal-600 text-xs font-medium px-4 py-2 rounded-2xl rounded-bl-none border border-slate-200 shadow-lg flex items-center gap-2 animate-fade-in-up">
           <div className="flex space-x-1">
             <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
             <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
             <div className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
           </div>
           <span>Typing...</span>
        </div>
      )}

      <div className="relative flex items-center gap-2">
        
        {isRecording ? (
          <div className="flex-1 bg-red-50 border border-red-100 rounded-full h-12 flex items-center justify-between px-4 animate-pulse">
            <div className="flex items-center gap-2 text-red-600">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
              <span className="font-medium text-sm">Recording {formatTime(recordingTime)}</span>
            </div>
            <button 
              onClick={stopRecording}
              className="p-2 bg-white text-red-600 rounded-full hover:bg-red-100 transition shadow-sm"
            >
              <Square size={18} fill="currentColor" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSendText} className="flex-1 flex gap-2">
             <button
              type="button"
              onClick={startRecording}
              disabled={isLoading}
              className="p-3 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Record voice message"
            >
              <Mic size={20} />
            </button>
            
            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              placeholder="Type your health question..."
              className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-full focus:ring-2 focus:ring-teal-500 focus:border-transparent block w-full px-4 outline-none disabled:opacity-50"
              disabled={isLoading}
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-3 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-teal-200"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </form>
        )}
      </div>
      <p className="text-center text-[10px] text-slate-400 mt-2">
        MediBot can make mistakes. Please consult a professional for medical advice.
      </p>
    </div>
  );
};