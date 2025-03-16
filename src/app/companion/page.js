// CheckIn.js
'use client'

import React, { useState } from 'react';
import { OrbCanvas } from "@/components/Orb";
import { Send } from 'lucide-react';

export default function CheckIn() {
  // State for user input
  const [userInput, setUserInput] = useState('');
  
  // State for AI response
  const [response, setResponse] = useState('');
  
  // State for sentiment analysis
  const [sentiment, setSentiment] = useState(null);

  // Handle input submission
  const handleSubmit = async () => {
    if (!userInput.trim()) return;
    
    console.log("User input:", userInput);
    
    try {
      // Send user input to the chat endpoint
      const chatResponse = await fetch('https://iemhacks3-backend.onrender.com/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userInput }),
      });
      
      const chatData = await chatResponse.json();
      setResponse(chatData.response);

      // Send user input to the sentiment analysis endpoint
      const sentimentResponse = await fetch('https://iemhacks3-backend.onrender.com/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: userInput }),
      });
      
      const sentimentData = await sentimentResponse.json();
      setSentiment(sentimentData);

    } catch (error) {
      console.error("Error fetching data:", error);
      setResponse("An error occurred. Please try again later.");
    }
    
    // Clear input after submission
    setUserInput('');
  };
  
  // Handle keypress for Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };
  
  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-purple-900 to-black relative overflow-hidden">
      {/* Orb visualization section - top */}
      <div className="h-2/5 relative">
        {/* The OrbCanvas will fill its container */}
        <OrbCanvas />
        
        {/* Centered pulsing ring around where the orb should be */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-48 h-48 rounded-full border border-purple-400/30 animate-pulse"></div>
        </div>
      </div>
      
      {/* Response section - middle */}
      <div className="h-1/4 px-6 flex items-center justify-center">
        <div className="w-full max-w-md bg-black bg-opacity-40 p-6 rounded-xl border border-purple-500/30">
          <p className="text-purple-300 mb-2 font-medium">Response:</p>
          <p className="text-white">
            {response || "How are you feeling today? I'm here to listen and support you."}
          </p>
          {sentiment && (
            <div className="mt-4">
              <p className="text-purple-300 mb-1 font-medium">Sentiment Analysis:</p>
              <p className="text-white">
                Positive: {sentiment.pos * 100}%
                <br />
                Negative: {sentiment.neg * 100}%
                <br />
                Neutral: {sentiment.neu * 100}%
                <br />
                Compound: {sentiment.compound}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* User input section - bottom */}
      <div className="flex-grow px-6 flex items-end justify-center pb-12">
        <div className="w-full max-w-md flex">
          <input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="bg-black bg-opacity-40 text-white rounded-l-full py-4 px-5 flex-grow focus:outline-none border border-purple-500/50"
            placeholder="Share your thoughts..."
          />
          <button
            onClick={handleSubmit}
            className="bg-purple-700 hover:bg-purple-600 text-white rounded-r-full py-4 px-6 transition-all duration-300 flex items-center justify-center cursor-pointer"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}