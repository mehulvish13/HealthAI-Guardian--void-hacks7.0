import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Header, LANGUAGES } from './components/Header';
import { ChatBubble } from './components/ChatBubble';
import { InputControls } from './components/InputControls';
import { SmartTools } from './components/SmartTools';
import { NearbyMap } from './components/NearbyMap';
import { Modal } from './components/Modal';
import { ChatMessage, LoadingState, Role, Language } from './types';
import { sendToGemini, textToSpeech, generateSpecializedContent } from './services/gemini';
import { blobToBase64 } from './utils/audio';
import { getDefinitions, detectEmergency } from './data/medicalKnowledge';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: Role.MODEL,
      content: "Hello. I'm MediBot, your AI health assistant. I can listen to your concerns or read text. How can I help you today?",
      timestamp: Date.now()
    }
  ]);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [selectedLang, setSelectedLang] = useState<Language>(LANGUAGES[0]);
  
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
        content: "🚨 **EMERGENCY DETECTED:** Please call emergency services immediately (911 in US, 112 in EU) or go to the nearest hospital. I cannot assist with life-threatening emergencies.",
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
      
      const responseText = await sendToGemini(text, base64Audio, history, selectedLang.name);

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
      const errorMsg: ChatMessage = {
        id: Date.now().toString(),
        role: Role.MODEL,
        content: "I apologize, but I encountered an error processing your request. Please try again.",
        timestamp: Date.now(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoadingState(LoadingState.IDLE);
    }
  }, [messages, isAudioEnabled, selectedLang]);

  const handleGenerateTools = async (type: 'report' | 'mealPlan' | 'symptomCheck') => {
    setLoadingState(LoadingState.GENERATING);
    try {
      const history = messages.map(m => ({ role: m.role, parts: [{ text: m.content }] }));
      const content = await generateSpecializedContent(type, history, selectedLang.name);
      
      setModalType(type);
      setModalContent(content);
      setModalOpen(true);
    } catch (error) {
      console.error("Generation Error:", error);
      alert("Failed to generate content. Please try again.");
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
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-white shadow-xl overflow-hidden md:rounded-xl md:my-4 md:h-[calc(100vh-2rem)] border border-slate-200">
      <Header 
        isAudioEnabled={isAudioEnabled} 
        toggleAudio={() => setIsAudioEnabled(!isAudioEnabled)}
        selectedLang={selectedLang}
        onLangChange={setSelectedLang}
      />
      
      <main className="flex-1 overflow-y-auto pt-4 space-y-6 scrollbar-hide bg-slate-50">
        
        {/* Helper Tools */}
        <SmartTools 
          onGenerateReport={() => handleGenerateTools('report')}
          onGenerateMealPlan={() => handleGenerateTools('mealPlan')}
          onCheckSymptoms={() => handleGenerateTools('symptomCheck')}
          isDisabled={loadingState !== LoadingState.IDLE || messages.length < 2}
        />
        
        {/* Nearby Map Section */}
        <NearbyMap />

        <div className="px-4 pb-4 space-y-6">
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
          
          {loadingState !== LoadingState.IDLE && (
            <div className="flex justify-start animate-pulse">
              <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none py-3 px-4 shadow-sm flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-xs text-slate-400 font-medium ml-2">
                    {loadingState === LoadingState.THINKING ? 'Analyzing symptoms...' : 
                     loadingState === LoadingState.SPEAKING ? 'Synthesizing speech...' : 
                     loadingState === LoadingState.GENERATING ? 'Generating analysis...' : 'Processing...'}
                  </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

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