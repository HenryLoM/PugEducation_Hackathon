import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Copy, Edit3, Trash2, RotateCcw, Save, Upload, X, Home } from 'lucide-react';
import { usePet } from '../contexts/PetContext';

// @ts-ignore: Импорт из JS-файла без типов
import { handleAiResponse } from '../ai';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatPageProps {
  onBackToHome?: () => void;
}

export default function ChatPage({ onBackToHome }: ChatPageProps) {
  const { pet, addXP, updateMood } = usePet();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const [chatTitle, setChatTitle] = useState('Разговор с мопсом');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 🚀 Отправка сообщения
const handleSendMessage = async () => {
  if (!inputValue.trim() || isLoading) return;

  const userMessage: Message = {
    id: Date.now(),
    role: "user",
    content: inputValue.trim(),
    timestamp: new Date(),
  };

  setMessages(prev => [...prev, userMessage]);
  setInputValue("");
  setIsLoading(true);

  try {
    const aiContent = await handleAiResponse(userMessage.content);
    setMessages(prev => [
      ...prev,
      { id: Date.now() + 1, role: "assistant", content: aiContent, timestamp: new Date() }
    ]);
    // 🎁 Награда за диалог
    addXP(5);
    updateMood(3);
  } catch (error) {
    console.error("Ошибка AI:", error);
    setMessages(prev => [
      ...prev,
      { id: Date.now() + 1, role: "assistant", content: "(Мопс не ответил... 🐾)", timestamp: new Date() }
    ]);
  } finally {
    setIsLoading(false);
  }
};

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // --- Остальные функции (копия, редактирование, перегенерация, сохранение, загрузка) оставляем ---
  const copyMessage = (content: string) => navigator.clipboard.writeText(content);
  const deleteMessage = (id: number) => setMessages(prev => prev.filter(msg => msg.id !== id));
  const startEditing = (id: number, content: string) => { setEditingId(id); setEditingText(content); };
  const saveEdit = () => {
    if (editingId && editingText.trim()) {
      setMessages(prev => prev.map(msg => msg.id === editingId ? { ...msg, content: editingText.trim() } : msg));
    }
    setEditingId(null);
    setEditingText('');
  };
  const cancelEdit = () => { setEditingId(null); setEditingText(''); };

  const regenerateResponse = async (messageId: number) => {
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) return;
    const userMessage = messages[messageIndex - 1];
    if (!userMessage || userMessage.role !== 'user') return;

    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    setIsLoading(true);

    try {
      const aiContent = await handleAiResponse(userMessage.content);
      setMessages(prev => [
        ...prev,
        { id: Date.now(), role: 'assistant', content: aiContent, timestamp: new Date() }
      ]);
    } catch (err) {
      console.error("Ошибка при перегенерации:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => { setMessages([]); setChatTitle('Разговор с мопсом'); };

  const saveChat = () => {
    const chatData = messages.map(msg => `[${msg.role === 'user' ? 'Ты' : 'Мопс'}:] ${msg.content}`).join('\n');
    const blob = new Blob([chatData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${chatTitle}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadChat = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const lines = content.split('\n').filter(Boolean);
      let id = Date.now();
      const loaded: Message[] = lines.map(line => {
        if (line.startsWith('[Ты:]')) return { id: id++, role: 'user', content: line.replace('[Ты:]', '').trim(), timestamp: new Date() };
        if (line.startsWith('[Мопс:]')) return { id: id++, role: 'assistant', content: line.replace('[Мопс:]', '').trim(), timestamp: new Date() };
        return null;
      }).filter(Boolean) as Message[];
      setMessages(loaded);
      setChatTitle(file.name.replace(/\.txt$/i, ''));
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto h-screen flex flex-col bg-gray-50">
      {/* ---- Хедер ---- */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {onBackToHome && (
              <button onClick={onBackToHome} className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg">
                <Home className="w-5 h-5" />
              </button>
            )}
            <input
              type="text"
              value={chatTitle}
              onChange={(e) => setChatTitle(e.target.value)}
              className="text-xl font-bold text-gray-800 bg-transparent border-none outline-none"
            />
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={saveChat} className="p-2 hover:bg-gray-100 rounded-lg"><Save className="w-5 h-5" /></button>
            <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-gray-100 rounded-lg"><Upload className="w-5 h-5" /></button>
            <button onClick={clearChat} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-5 h-5" /></button>
          </div>
        </div>
        <input ref={fileInputRef} type="file" accept=".txt" onChange={loadChat} className="hidden" />
      </div>

      {/* ---- Сообщения ---- */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🐕</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Привет! Я {pet.name}!</h3>
            <p className="text-gray-500">Начни разговор — и я отвечу тебе</p>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 shadow-sm'}`}>
              <div className="flex items-start space-x-2 mb-2">
                {msg.role === 'assistant' ? <Bot className="w-5 h-5 text-green-500" /> : <User className="w-5 h-5 text-blue-200" />}
                <span className="font-semibold text-sm">{msg.role === 'user' ? 'Ты' : pet.name}</span>
              </div>
              {editingId === msg.id ? (
                <div>
                  <textarea value={editingText} onChange={(e) => setEditingText(e.target.value)} className="w-full p-2 border rounded-lg" />
                  <div className="flex space-x-2 mt-2">
                    <button onClick={saveEdit} className="px-2 py-1 bg-green-500 text-white rounded">✓</button>
                    <button onClick={cancelEdit} className="px-2 py-1 bg-gray-500 text-white rounded">✗</button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <div className="flex space-x-1 mt-2 text-xs opacity-70">
                    <button onClick={() => copyMessage(msg.content)}><Copy className="w-3 h-3" /></button>
                    <button onClick={() => startEditing(msg.id, msg.content)}><Edit3 className="w-3 h-3" /></button>
                    {msg.role === 'assistant' && <button onClick={() => regenerateResponse(msg.id)}><RotateCcw className="w-3 h-3" /></button>}
                    <button onClick={() => deleteMessage(msg.id)}><X className="w-3 h-3 text-red-600" /></button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* ---- Ввод ---- */}
      <div className="bg-white border-t p-4">
        <div className="flex items-end space-x-3">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Напиши сообщение ${pet.name}у...`}
            className="flex-1 p-3 border rounded-2xl resize-none"
            rows={1}
          />
          <button onClick={handleSendMessage} disabled={!inputValue.trim() || isLoading} className="p-3 bg-blue-500 text-white rounded-2xl">
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500 text-center">
          Общение с питомцем дает +5 XP и поднимает его настроение 🎁
        </div>
      </div>
    </div>
  );
}
