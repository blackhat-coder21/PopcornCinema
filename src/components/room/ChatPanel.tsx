import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile } from 'lucide-react';
import { ChatMessage, User } from '../../types';
import { Avatar } from '../ui/Avatar';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatPanelProps {
  messages: ChatMessage[];
  currentUser: User;
  onSendMessage: (content: string) => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  currentUser,
  onSendMessage,
}) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new messages come in
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() !== '') {
      onSendMessage(message);
      setMessage('');
    }
  };
  
  // Simple emoji picker
  const emojis = ['😀', '😂', '😍', '🔥', '👍', '❤️', '🎬', '🍿', '😮', '🤔'];
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const addEmoji = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-dark-100 rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-gray-100 dark:bg-dark-200 border-b border-gray-200 dark:border-gray-800">
        <h3 className="font-semibold text-gray-800 dark:text-white">Chat</h3>
      </div>
      
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${
                msg.userId === currentUser.id ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.userId === currentUser.id
                    ? 'bg-primary-500 text-white rounded-tr-none'
                    : msg.isSystemMessage
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 italic'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none'
                }`}
              >
                {msg.userId !== currentUser.id && !msg.isSystemMessage && (
                  <div className="flex items-center mb-1">
                    <Avatar
                      src={msg.avatar}
                      alt={msg.username}
                      size="sm"
                      className="mr-2"
                    />
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {msg.username}
                    </span>
                  </div>
                )}
                <p className="text-sm">{msg.content}</p>
                <span className="text-xs opacity-70 mt-1 block text-right">
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </AnimatePresence>
      </div>
      
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="relative flex items-center">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="absolute left-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <Smile size={20} />
          </button>
          
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="input pl-10 pr-10 py-2 w-full"
          />
          
          <button
            type="submit"
            disabled={message.trim() === ''}
            className="absolute right-3 text-primary-500 disabled:text-gray-400 hover:text-primary-600"
          >
            <Send size={20} />
          </button>
        </div>
        
        {/* Emoji Picker */}
        {showEmojiPicker && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-14 left-4 bg-white dark:bg-dark-200 p-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10"
          >
            <div className="flex flex-wrap gap-2">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => addEmoji(emoji)}
                  className="text-xl hover:bg-gray-100 dark:hover:bg-dark-100 p-1 rounded"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </form>
    </div>
  );
};