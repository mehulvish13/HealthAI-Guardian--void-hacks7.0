import { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChatBubble } from '@/components/chatbot/ChatBubble';
import { InputControls } from '@/components/chatbot/InputControls';
import { SmartTools } from '@/components/chatbot/SmartTools';
import { Modal } from '@/components/chatbot/Modal';
import { ChatMessage, LoadingState, Role } from '@/types/chatbot';
import { sendToGemini, textToSpeech, generateSpecializedContent } from '@/services/gemini';
import { blobToBase64 } from '@/utils/audio';
import { getDefinitions, detectEmergency } from '@/data/index';


export default function ChatBot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: Role.MODEL,
      content: "Hello! I'm **MediBot**, your AI health assistant powered by Gemini. I can listen to your concerns (voice or text), provide health information, and help you understand medical terms. How can I help you today?",
      timestamp: Date.now()
    }
  ]);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'report' | 'mealPlan' | 'symptomCheck'>('report');
  const [modalContent, setModalContent] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loadingState]);

  const handleSendMessage = useCallback(async (text: string, audioBlob?: Blob) => {
    const userMsgId = Date.now().toString();
    
    // Check for emergencies immediately
    const isEmergency = detectEmergency(text);

    const userTerms = text ? getDefinitions(text) : [];

    const newUserMsg: ChatMessage = {
      id: userMsgId,
      role: Role.USER,
      content: text,
      timestamp: Date.now(),
      audioUrl: audioBlob ? URL.createObjectURL(audioBlob) : undefined,
      relatedTerms: userTerms,
      isEmergency
    };

    setMessages(prev => [...prev, newUserMsg]);

    if (isEmergency) {
      const emergencyMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        content: "🚨 **EMERGENCY DETECTED:** Please call emergency services immediately (911 in US, 112 in EU, or your local emergency number) or go to the nearest hospital. I cannot assist with life-threatening emergencies.",
        timestamp: Date.now(),
        isError: true
      };
      setMessages(prev => [...prev, emergencyMsg]);
      return;
    }

    setLoadingState(LoadingState.THINKING);

    try {
      let base64Audio: string | undefined;
      if (audioBlob) {
        base64Audio = await blobToBase64(audioBlob);
      }

      const history = messages.map(m => ({ role: m.role, parts: [{ text: m.content }] }));
      
      const responseText = await sendToGemini(text, base64Audio, history, "English");

      setLoadingState(LoadingState.SPEAKING);

      const responseTerms = getDefinitions(responseText);

      let audioResponseUrl: string | undefined;
      
      if (isAudioEnabled) {
        try {
          audioResponseUrl = await textToSpeech(responseText);
        } catch (ttsError) {
          console.error("TTS Error:", ttsError);
        }
      }

      const modelMsgId = (Date.now() + 2).toString();
      const newModelMsg: ChatMessage = {
        id: modelMsgId,
        role: Role.MODEL,
        content: responseText,
        timestamp: Date.now(),
        audioUrl: audioResponseUrl,
        relatedTerms: responseTerms
      };

      setMessages(prev => [...prev, newModelMsg]);
    } catch (error) {
      console.error("Interaction Error:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      const errorMsg: ChatMessage = {
        id: Date.now().toString(),
        role: Role.MODEL,
        content: `I apologize, but I encountered an error: **${errorMessage}**\n\nPlease ensure your Gemini API key is correctly configured in the \`.env\` file. Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).`,
        timestamp: Date.now(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoadingState(LoadingState.IDLE);
    }
  }, [messages, isAudioEnabled]);

  const handleGenerateTools = async (type: 'report' | 'mealPlan' | 'symptomCheck') => {
    console.log('Generating tool:', type);
    setLoadingState(LoadingState.GENERATING);
    
    // Add loading message to chat
    const loadingMsgId = Date.now().toString();
    const loadingMsg: ChatMessage = {
      id: loadingMsgId,
      role: Role.MODEL,
      content: `Generating your ${type === 'report' ? 'symptom report' : type === 'mealPlan' ? 'meal plan' : 'symptom analysis'}... This may take a moment.`,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, loadingMsg]);
    
    try {
      const history = messages.map(m => ({ role: m.role, parts: [{ text: m.content }] }));
      console.log('History:', history);
      const content = await generateSpecializedContent(type, history, "English");
      console.log('Generated content:', content);
      
      // Remove loading message
      setMessages(prev => prev.filter(m => m.id !== loadingMsgId));
      
      setModalType(type);
      setModalContent(content);
      setModalOpen(true);
    } catch (error) {
      console.error("Generation Error:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Remove loading message and add error message
      setMessages(prev => prev.filter(m => m.id !== loadingMsgId));
      
      const errorMsg: ChatMessage = {
        id: Date.now().toString(),
        role: Role.MODEL,
        content: `Failed to generate content: **${errorMessage}**\n\nPlease check your API key configuration in the .env file.`,
        timestamp: Date.now(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoadingState(LoadingState.IDLE);
    }
  };

  const getModalTitle = () => {
    switch (modalType) {
      case 'report': return 'Patient Symptom Report';
      case 'mealPlan': return 'Daily Meal Plan';
      case 'symptomCheck': return 'AI Symptom Checker';
      default: return 'Result';
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-w-4xl mx-auto">
      {/* Header */}
      <Card className="rounded-b-none p-4 border-b-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <Bot className="w-7 h-7 text-primary-foreground" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-card" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">MediBot AI</h2>
              <p className="text-xs text-success">Powered by Gemini • Online</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            title={isAudioEnabled ? "Disable voice responses" : "Enable voice responses"}
          >
            {isAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
        </div>
      </Card>

      {/* Smart Tools */}
      <Card className="rounded-none border-x border-b-0">
        {messages.length < 3 && (
          <div className="px-4 pt-2 pb-1">
            <p className="text-xs text-muted-foreground text-center">
              💡 <strong>Tip:</strong> Chat with MediBot about your symptoms to unlock Smart Tools (Report Generator, Symptom Checker, Meal Planner)
            </p>
          </div>
        )}
        {messages.length >= 3 && (
          <div className="px-4 pt-2 pb-1">
            <p className="text-xs text-amber-600 dark:text-amber-500 text-center">
              ⏱️ <strong>Free API Limits:</strong> Wait 15-30 seconds between requests if you see rate limit errors
            </p>
          </div>
        )}
        <SmartTools 
          onGenerateReport={() => handleGenerateTools('report')}
          onGenerateMealPlan={() => handleGenerateTools('mealPlan')}
          onCheckSymptoms={() => handleGenerateTools('symptomCheck')}
          isDisabled={loadingState !== LoadingState.IDLE || messages.length < 3}
        />
      </Card>

      {/* Messages */}
      <Card className="flex-1 rounded-t-none overflow-y-auto p-4 space-y-4 bg-muted/30">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        
        {loadingState !== LoadingState.IDLE && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-card border rounded-2xl rounded-tl-none py-3 px-4 shadow-sm flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-xs text-muted-foreground font-medium ml-2">
                  {loadingState === LoadingState.THINKING ? 'Analyzing symptoms...' : 
                   loadingState === LoadingState.SPEAKING ? 'Synthesizing speech...' : 
                   loadingState === LoadingState.GENERATING ? 'Generating analysis...' : 'Processing...'}
                </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </Card>

      <InputControls onSendMessage={handleSendMessage} isLoading={loadingState !== LoadingState.IDLE} />
      
      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        content={modalContent} 
        type={modalType}
        title={getModalTitle()}
      />
    </div>
  );
}
