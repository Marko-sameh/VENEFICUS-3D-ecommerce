'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import FloatingMessage from '@/components/ui/FloatingMessage';

const FloatingMessageContext = createContext();

export const FloatingMessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  const addMessage = useCallback((message) => {
    const id = Date.now() + Math.random();
    const newMessage = { ...message, id };
    
    setMessages(prev => [...prev, newMessage]);
    
    return id;
  }, []);

  const removeMessage = useCallback((id) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  }, []);

  const toast = useCallback(({ title, description, variant = 'default' }) => {
    const type = variant === 'destructive' ? 'error' : variant === 'default' ? 'success' : variant;
    
    return addMessage({
      type,
      title,
      description,
      timestamp: new Date().toISOString()
    });
  }, [addMessage]);

  return (
    <FloatingMessageContext.Provider value={{ addMessage, removeMessage, toast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {messages.map((message) => (
          <FloatingMessage
            key={message.id}
            message={message}
            onClose={() => removeMessage(message.id)}
          />
        ))}
      </div>
    </FloatingMessageContext.Provider>
  );
};

export const useFloatingMessage = () => {
  const context = useContext(FloatingMessageContext);
  if (!context) {
    throw new Error('useFloatingMessage must be used within FloatingMessageProvider');
  }
  return context;
};

// Compatibility hook for existing toast usage
export const useToast = () => {
  const { toast } = useFloatingMessage();
  return { toast };
};