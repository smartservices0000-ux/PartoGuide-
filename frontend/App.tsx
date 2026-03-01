
import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Loader2, Trash2 } from 'lucide-react';
import Header from './components/Header';
import ChatMessage from './components/ChatMessage';
import Disclaimer from './components/Disclaimer';
import { Message } from './types';
import { analyzePartograph } from './services/geminiService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      text: 'Merhaba! Ben PartoAnaliz AI. Doğum sürecini takip etmek için bir partograf fotoğrafı yükleyebilir veya analiz etmemi istediğiniz verileri paylaşabilirsiniz. Nasıl yardımcı olabilirim?',
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!inputText.trim() && !selectedImage) || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText || (selectedImage ? "Bu partografı analiz eder misin?" : ""),
      image: selectedImage || undefined,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    const currentImage = selectedImage;
    
    setInputText('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      let responseText = "";
      if (currentImage) {
        responseText = await analyzePartograph(currentImage, currentInput || "Lütfen bu partografı analiz et.");
      } else {
        responseText = "Lütfen analiz etmem için bir partograf görüntüsü yükleyin. Eğer verileri manuel girmek isterseniz, dilatasyon, iniş ve fetal kalp hızı gibi detayları belirtin.";
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Üzgünüm, analiz sırasında bir hata oluştu. Lütfen görüntünün net olduğundan emin olun ve tekrar deneyin.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("Tüm sohbet geçmişini silmek istediğinize emin misiniz?")) {
      setMessages([{
        id: '1',
        role: 'model',
        text: 'Sohbet temizlendi. Yeni bir partograf analizi için hazırım.',
        timestamp: new Date(),
      }]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <Header />
      
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <Disclaimer />
          
          <div className="space-y-2">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-6 animate-pulse">
                <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  <span className="text-sm text-slate-500 font-medium">Partograf analiz ediliyor...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 p-4">
        <div className="max-w-4xl mx-auto">
          {selectedImage && (
            <div className="mb-3 relative inline-block">
              <img 
                src={selectedImage} 
                alt="Önizleme" 
                className="h-20 w-20 object-cover rounded-lg border-2 border-blue-500 shadow-md" 
              />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
          
          <form onSubmit={handleSendMessage} className="flex items-end gap-2">
            <div className="flex-1 bg-slate-100 rounded-2xl p-2 flex items-end gap-2 border border-slate-200 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-all">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-white rounded-xl transition-all"
                title="Resim Yükle"
              >
                <ImageIcon size={22} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
              />
              
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Bir mesaj yazın veya partograf yükleyin..."
                className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-2 text-sm max-h-32 min-h-[40px]"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
            </div>
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={clearChat}
                className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                title="Sohbeti Temizle"
              >
                <Trash2 size={22} />
              </button>
              <button
                type="submit"
                disabled={(!inputText.trim() && !selectedImage) || isLoading}
                className="p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-200 transition-all"
              >
                {isLoading ? <Loader2 size={22} className="animate-spin" /> : <Send size={22} />}
              </button>
            </div>
          </form>
          <p className="text-[10px] text-center text-slate-400 mt-3">
            PartoAnaliz AI v1.0 - WHO & T.C. Sağlık Bakanlığı Rehberleri ile güçlendirilmiştir.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
