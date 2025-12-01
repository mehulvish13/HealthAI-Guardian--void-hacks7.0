import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Square, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
      // Check if mediaDevices API is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Your browser doesn't support audio recording. Please use Chrome, Edge, or Firefox.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Check for supported MIME types
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') 
        ? 'audio/webm' 
        : MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : 'audio/wav';
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType }); 
        if (audioBlob.size > 0) {
          onSendMessage('', audioBlob);
        } else {
          alert('Recording was too short. Please try again.');
        }
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.onerror = (error) => {
        console.error("MediaRecorder error:", error);
        alert('Recording error occurred. Please try again.');
        stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error("Error accessing microphone:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('Permission denied') || errorMessage.includes('NotAllowedError')) {
        alert("Microphone access denied. Please allow microphone permissions in your browser settings.");
      } else if (errorMessage.includes('NotFoundError')) {
        alert("No microphone found. Please connect a microphone and try again.");
      } else {
        alert(`Could not access microphone: ${errorMessage}`);
      }
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
    <div className="bg-card border-t border-border p-4 relative z-20">
      {/* Typing Indicator */}
      {isTyping && !isRecording && (
        <div className="absolute bottom-full left-6 mb-2 bg-card text-primary text-xs font-medium px-4 py-2 rounded-2xl rounded-bl-none border border-border shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom-2">
           <div className="flex space-x-1">
             <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
             <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
             <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
           </div>
           <span>Typing...</span>
        </div>
      )}

      <div className="relative flex items-center gap-2">
        
        {isRecording ? (
          <div className="flex-1 bg-destructive/10 border border-destructive/20 rounded-full h-12 flex items-center justify-between px-4 animate-pulse">
            <div className="flex items-center gap-2 text-destructive">
              <div className="w-3 h-3 bg-destructive rounded-full animate-ping"></div>
              <span className="font-medium text-sm">Recording {formatTime(recordingTime)}</span>
            </div>
            <Button 
              onClick={stopRecording}
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full text-destructive hover:bg-destructive/10"
            >
              <Square size={18} fill="currentColor" />
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSendText} className="flex-1 flex gap-2">
             <Button
              type="button"
              onClick={startRecording}
              disabled={isLoading}
              size="icon"
              variant="outline"
              className="rounded-full"
              title="Record voice message"
            >
              <Mic size={20} />
            </Button>
            
            <Input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              placeholder="Type your health question..."
              className="flex-1 rounded-full"
              disabled={isLoading}
            />

            <Button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              size="icon"
              className="rounded-full"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </Button>
          </form>
        )}
      </div>
      <p className="text-center text-[10px] text-muted-foreground mt-2">
        MediBot can make mistakes. Please consult a professional for medical advice.
      </p>
    </div>
  );
};
