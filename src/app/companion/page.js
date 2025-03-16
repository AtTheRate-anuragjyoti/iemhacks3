// CheckIn.js
'use client'

import React, { useState, useEffect, useRef } from 'react';
import { OrbCanvas } from "@/components/Orb";
import { Send } from 'lucide-react';

export default function CheckIn() {
  // State for user input
  const [userInput, setUserInput] = useState('');
  const [response, setResponse] = useState('');
  const [sentiment, setSentiment] = useState(null);

  // Ref for response scroll container
  const responseRef = useRef(null);

  // Handle input submission
  const handleSubmit = async () => {
    if (!userInput.trim()) return;
    
    console.log("User input:", userInput);
    
    try {
      const chatResponse = await fetch('https://iemhacks3-backend.onrender.com/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput }),
      });
      const chatData = await chatResponse.json();
      setResponse(chatData.response);

      const sentimentResponse = await fetch('https://iemhacks3-backend.onrender.com/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: userInput }),
      });
      const sentimentData = await sentimentResponse.json();
      setSentiment(sentimentData);
      
      // Scroll to top when new response is received
      setTimeout(() => {
        if (responseRef.current) responseRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);

    } catch (error) {
      console.error("Error fetching data:", error);
      setResponse("An error occurred. Please try again later.");
    }
    
    setUserInput('');
  };

  // Handle Enter key submission
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  // Dynamic Orb size
  const orbSize = response.length > 100 ? "w-24 h-24" : "w-32 h-32";

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-purple-900 to-black relative overflow-hidden">
      
      {/* Orb Visualization - Top */}
      <div className="h-2/5 relative">
        <OrbCanvas />
      </div>

      {/* Response Section - Middle */}
      <div className="h-2/5 px-6 flex items-center justify-center">
        <div className="w-full max-w-md bg-black bg-opacity-40 p-6 rounded-xl border border-purple-500/30 relative">
          <p className="text-purple-300 mb-2 font-medium">Response:</p>

          {/* Smooth Scroll Container */}
          <div 
            className="max-h-48 overflow-y-auto no-scrollbar scroll-smooth relative pb-6"
            ref={responseRef}
          >
            <p className="text-white whitespace-pre-wrap">{response || "How are you feeling today? I'm here to listen and support you."}</p>

            {/* Sentiment Analysis at End of Response */}
            {sentiment && (
              <div className="mt-4 border-t border-purple-500 pt-4">
                <p className="text-purple-300 mb-1 font-medium">Sentiment Analysis:</p>
                <p className="text-white">
                  Positive: {sentiment.pos * 100}% <br />
                  Negative: {sentiment.neg * 100}% <br />
                  Neutral: {sentiment.neu * 100}% <br />
                  Compound: {sentiment.compound}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* User Input Section - Bottom */}
      <div className="h-1/5 px-6 flex items-end justify-center pb-5">
        <div className="w-full max-w-md flex">
          <input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="bg-black bg-opacity-40 text-white rounded-l-full py-3 px-4 flex-grow focus:outline-none border border-purple-500/50"
            placeholder="Share your thoughts..."
          />
          <button
            onClick={handleSubmit}
            className="bg-purple-700 hover:bg-purple-600 text-white rounded-r-full py-3 px-4 transition-all duration-300 flex items-center justify-center cursor-pointer"
          >
            <Send size={20} />
          </button>
        </div>
      </div>

    </div>
  );
}