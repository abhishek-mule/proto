import React, { useState } from 'react';
import { X, Send, Bot, User, Lightbulb, Cloud, TrendingUp } from 'lucide-react';

interface AIAssistantProps {
  onClose: () => void;
}

const AIAssistant = ({ onClose }: AIAssistantProps) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hello! I'm your AI Farm Assistant. I can help you with crop management, weather insights, market trends, and best practices. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const quickQuestions = [
    { icon: Cloud, text: "Weather forecast for my crops", category: "weather" },
    { icon: TrendingUp, text: "Current market prices", category: "market" },
    { icon: Lightbulb, text: "Pest prevention tips", category: "tips" }
  ];

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    const aiResponse = {
      id: messages.length + 2,
      type: 'ai',
      content: generateAIResponse(inputValue),
      timestamp: new Date()
    };

    setMessages([...messages, userMessage, aiResponse]);
    setInputValue('');
  };

  const generateAIResponse = (question: string): string => {
    // Simple AI response simulation
    if (question.toLowerCase().includes('weather')) {
      return "Based on current forecasts, expect mild temperatures (22-28°C) with 60% chance of rain this week. Perfect conditions for your tomatoes! Consider covering sensitive crops during the rain on Wednesday.";
    } else if (question.toLowerCase().includes('price') || question.toLowerCase().includes('market')) {
      return "Current market analysis shows organic tomatoes trading at $4.20-$4.80/kg, up 8% from last month. Demand is high due to seasonal trends. Your current pricing of $4.50/kg is competitive.";
    } else if (question.toLowerCase().includes('pest')) {
      return "For natural pest prevention: 1) Encourage beneficial insects with marigold companion planting 2) Use neem oil spray weekly 3) Monitor for early signs of aphids. Your organic certification requires avoiding synthetic pesticides.";
    }
    return "I'd be happy to help you with that! Could you provide more specific details about your question? I can assist with crop management, weather insights, market analysis, and farming best practices.";
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">AI Farm Assistant</h2>
              <p className="text-sm text-green-600">Online • Ready to help</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex space-x-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' 
                    ? 'bg-blue-600' 
                    : 'bg-gradient-to-r from-green-500 to-green-600'
                }`}>
                  {message.type === 'user' ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-white" />
                  )}
                </div>
                <div className={`rounded-2xl p-4 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-2 ${
                    message.type === 'user' ? 'text-blue-200' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Questions */}
        <div className="p-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {quickQuestions.map((question, index) => {
              const Icon = question.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question.text)}
                  className="flex items-center space-x-2 p-2 text-xs text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Icon className="h-3 w-3" />
                  <span className="truncate">{question.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about weather, market prices, or farming tips..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;