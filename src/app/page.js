// SignIn.js
'use client'

import { useRouter } from 'next/navigation';
import React from 'react';
import { OrbCanvas } from "@/components/Orb";

export default function SignIn() {

  const router = useRouter();

  // Guest signin handler
  const handleGuestSignIn = () => {
    console.log("Guest sign-in clicked");
    router.push('/companion');
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-900 to-black relative overflow-hidden">
      <OrbCanvas />
      
      {/* Content overlay - bottom half */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 flex flex-col items-center justify-center p-8 w-full bg-gradient-to-t from-black to-transparent z-10">
        <div className="w-full max-w-md space-y-8">
          <h1 className="text-5xl font-extrabold text-white text-center mb-6 tracking-tight">
            Mental Health Companion
          </h1>
          
          {/* Guest Sign In Button */}
          <button
            onClick={handleGuestSignIn}
            className="w-full flex items-center justify-center bg-transparent text-white border-2 border-purple-500 py-4 px-8 rounded-full hover:bg-purple-500 hover:border-purple-600 transition-all duration-300 font-semibold text-lg cursor-pointer"
          >
            Continue as a guest
          </button>
          
          <p className="text-gray-300 text-base text-center">
            A safe space for your mental wellbeing
          </p>
        </div>
      </div>
    </div>
  );
}