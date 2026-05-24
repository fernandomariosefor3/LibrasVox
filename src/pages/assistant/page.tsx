import { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '@/components/feature/Navbar';
import { SEOHead } from '@/components/feature/SEOHead';
import { pageSEO, SITE_URL, generateWebPageSchema, generateCourseSchema } from '@/lib/seo';
import { assistantModes, getModeById, type ModeId } from '@/mocks/assistantModes';
import { useGeminiChat } from '@/hooks/useGeminiChat';
import ModeSwitcher from './components/ModeSwitcher';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import WelcomeScreen from './components/WelcomeScreen';
import ChatHistoryPanel from './components/ChatHistoryPanel';
import InterpreterGuide from '@/components/feature/InterpreterGuide';

// Assistant page — Gemini 4-mode chat
type ModeMessages = Record<ModeId, ReturnType<typeof useGeminiChat>['messages']>;

function ModeChat({ modeId, onCountChange }: { modeId: ModeId; onCountChange: (count: number) => void }) {
  const mode = getModeById(modeId);
  const { messages, isLoading, sendMessage, clearChat, hasApiKey } = useGeminiChat(modeId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(false);
    const t = setTimeout(() => setFadeIn(true), 60);
    return () => clearTimeout(t);
  }, [modeId]);

  useEffect(() => {
    onCountChange(messages.length);
  }, [messages.length, onCountChange]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={`flex flex-col h-full transition-opacity duration-300 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      {/* Chat area */}
      <div ref={chatAreaRef} className="flex-1 overflow-y-auto px-4 md:px-6 py-4">
        {messages.length === 0 ? (
          <WelcomeScreen mode={mode} onSuggestion={sendMessage} hasApiKey={hasApiKey} />
        ) : (
          <div className="max-w-3xl mx-auto">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} mode={mode} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div className={`border-t ${mode.borderColor} bg-white px-4 md:px-6 py-4`}>
        <div className="max-w-3xl mx-auto">
          <ChatInput
            mode={mode}
            onSend={sendMessage}
            isLoading={isLoading}
            disabled={false}
          />
        </div>
      </div>
    </div>
  );
}

export default function AssistantPage() {
  const [activeMode, setActiveMode] = useState<ModeId>('tutor');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messageCounts, setMessageCounts] = useState<Record<ModeId, number>>({
    tutor: 0,
    translator: 0,
    practice: 0,
    culture: 0,
  });
  const [clearKeys, setClearKeys] = useState<Record<ModeId, number>>({
    tutor: 0,
    translator: 0,
    practice: 0,
    culture: 0,
  });

  const currentMode = getModeById(activeMode);

  const handleModeChange = (mode: ModeId) => {
    setActiveMode(mode);
    setSidebarOpen(false);
  };

  const handleClearChat = () => {
    setClearKeys((prev) => ({ ...prev, [activeMode]: prev[activeMode] + 1 }));
    setMessageCounts((prev) => ({ ...prev, [activeMode]: 0 }));
  };

  const handleCountChange = useCallback(
    (count: number) => {
      setMessageCounts((prev) => ({ ...prev, [activeMode]: count }));
    },
    [activeMode],
  );

  const seo = pageSEO.assistant;
  const canonical = `${SITE_URL}/assistant`;
  
  const schema = [
    generateWebPageSchema(seo.title, seo.description, canonical),
    generateCourseSchema('Assistente IA para Libras', 'Assistente virtual com IA Gemini especializado em Libras com 4 modos de interação', canonical),
  ];

  return (
    <>
      <SEOHead
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        canonical={canonical}
        ogTitle={seo.title}
        ogDescription={seo.description}
        ogType="website"
        ogUrl={canonical}
        schema={schema}
      />
      <div className="flex flex-col h-screen bg-white">
        <Navbar />

        <div className="flex flex-1 overflow-hidden pt-16" data-guide="chat">
          {/* Sidebar — desktop */}
          <div className="hidden md:flex">
            <ChatHistoryPanel
              activeMode={activeMode}
              onModeChange={handleModeChange}
              messageCounts={messageCounts}
              onClearChat={handleClearChat}
              currentMode={currentMode}
            />
          </div>

          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setSidebarOpen(false)}
              />
              <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl flex flex-col">
                <div className="p-4 flex items-center justify-between border-b border-slate-100">
                  <span className="font-semibold text-slate-900">Modos IA</span>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    <i className="ri-close-line text-xl"></i>
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-3">
                  <ModeSwitcher activeMode={activeMode} onModeChange={handleModeChange} />
                </div>
              </div>
            </div>
          )}

          {/* Main chat area */}
          <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
            {/* Chat header */}
            <div
              className={`flex-shrink-0 flex items-center gap-3 px-4 md:px-6 py-3 border-b ${currentMode.borderColor} ${currentMode.bgColor} transition-all duration-300`}
            >
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-white/60 rounded-lg cursor-pointer"
              >
                <i className="ri-menu-line text-lg"></i>
              </button>
              <div
                className={`w-9 h-9 flex items-center justify-center ${currentMode.bgColor} border ${currentMode.borderColor} rounded-xl transition-all duration-300`}
              >
                <i className={`${currentMode.icon} ${currentMode.color} text-lg`}></i>
              </div>
              <div className="flex-1 min-w-0">
                <h2
                  className={`text-base font-bold ${currentMode.color} transition-colors duration-300`}
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                >
                  {currentMode.welcomeTitle}
                </h2>
                <p className="text-xs text-slate-500 truncate">{currentMode.description}</p>
              </div>
              {/* Mode quick switcher — desktop */}
              <div className="hidden md:flex items-center gap-1">
                {assistantModes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setActiveMode(mode.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                      activeMode === mode.id
                        ? `${mode.bgColor} ${mode.color} border ${mode.borderColor} shadow-sm`
                        : 'text-slate-500 hover:bg-white/70 border border-transparent hover:border-slate-200'
                    }`}
                  >
                    <i className={`${mode.icon} text-sm`}></i>
                    {mode.label}
                  </button>
                ))}
              </div>
              {messageCounts[activeMode] > 0 && (
                <button
                  onClick={handleClearChat}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 cursor-pointer hover:scale-110"
                  title="Limpar conversa"
                >
                  <i className="ri-delete-bin-line text-base"></i>
                </button>
              )}
            </div>

            {/* Chat content — keyed per mode + clearKey to reset */}
            <div className="flex-1 overflow-hidden" data-guide="header">
              <ModeChat
                key={`${activeMode}-${clearKeys[activeMode]}`}
                modeId={activeMode}
                onCountChange={handleCountChange}
              />
            </div>
          </div>
        </div>
      </div>
      <InterpreterGuide />
    </>
  );
}