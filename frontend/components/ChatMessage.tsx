
import React from 'react';
import { Message } from '../types';
import { User, Bot, Clock } from 'lucide-react';
import { clsx } from 'clsx';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.role === 'model';

  return (
    <div className={clsx(
      "flex w-full mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300",
      isBot ? "justify-start" : "justify-end"
    )}>
      <div className={clsx(
        "flex max-w-[85%] sm:max-w-[75%]",
        isBot ? "flex-row" : "flex-row-reverse"
      )}>
        <div className={clsx(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1",
          isBot ? "bg-blue-100 text-blue-600 mr-3" : "bg-slate-200 text-slate-600 ml-3"
        )}>
          {isBot ? <Bot size={18} /> : <User size={18} />}
        </div>
        
        <div className="flex flex-col">
          <div className={clsx(
            "px-4 py-3 rounded-2xl shadow-sm",
            isBot 
              ? "bg-white border border-slate-100 text-slate-800 rounded-tl-none" 
              : "bg-blue-600 text-white rounded-tr-none"
          )}>
            {message.image && (
              <div className="mb-3 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                <img src={message.image} alt="Yüklenen Partograf" className="max-h-64 w-auto object-contain mx-auto" />
              </div>
            )}
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {message.text}
            </div>
          </div>
          
          <div className={clsx(
            "flex items-center mt-1 text-[10px] text-slate-400",
            isBot ? "justify-start" : "justify-end"
          )}>
            <Clock size={10} className="mr-1" />
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
