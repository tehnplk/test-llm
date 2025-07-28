'use client';

import { useState, useEffect } from 'react';
import ChatInput from './components/ChatInput';
import ChatMessage from './components/ChatMessage';
import { MessageHistory } from './types/messageHistory';
import { saveMessageHistory, getMessageHistory } from './utils/sessionStorage';

interface Message {
  content: string;
  isUser: boolean;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messageHistory, setMessageHistory] = useState<MessageHistory>(getMessageHistory());

  const handleSendMessage = async (message: string) => {
    // Add user message
    const userMessage: Message = { content: message, isUser: true };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat/pydantic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          message_history: messageHistory,
          messages: messages.map(msg => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.content
          }))
        }),
      });

      const data = await response.json();
      console.log('API Response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get response from server');
      }

      const aiMessage: Message = { content: data.message, isUser: false };
      setMessages(prevMessages => [...prevMessages, aiMessage]);

      // Save message history from API response
      if (data.message_history) {
        setMessageHistory(data.message_history);
        saveMessageHistory(data.message_history);
      }
    } catch (error) {
      console.error('Error:', error);
      // Add error message to chat
      const errorMessage: Message = {
        content: 'Sorry, I encountered an error. Please try again.',
        isUser: false
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto max-w-4xl p-4">
      <div className="space-y-4">
        <div className="h-[600px] overflow-y-auto p-4 bg-white rounded-lg shadow">
          {messages.map((msg, index) => (
            <ChatMessage
              key={index}
              message={msg.content}
              isUser={msg.isUser}
              isTyping={false}
            />
          ))}
          {isLoading && (
            <ChatMessage
              message=""
              isUser={false}
              isTyping={true}
            />
          )}
        </div>
        <div className="sticky bottom-0 bg-white p-4 rounded-lg shadow">
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        </div>
      </div>
    </main>
  );
}