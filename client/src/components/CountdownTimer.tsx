import { useState, useEffect } from "react";
import { getTimeRemaining } from "@/lib/utils";

interface CountdownTimerProps {
  targetDate: Date;
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(targetDate));
  
  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getTimeRemaining(targetDate);
      setTimeRemaining(remaining);
      
      if (remaining.total <= 0) {
        clearInterval(interval);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [targetDate]);
  
  // Calculate percentage for the countdown ring
  const totalDays = Math.ceil((targetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const remainingPercentage = timeRemaining.days / totalDays;
  const strokeDashoffset = 440 - (440 * remainingPercentage);
  
  return (
    <div className="relative">
      <svg className="w-full" height="40" viewBox="0 0 440 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="18" stroke="#6C3CB4" strokeOpacity="0.3" strokeWidth="2" />
        <circle 
          cx="20" 
          cy="20" 
          r="18" 
          stroke="#1BFFFF" 
          strokeWidth="2" 
          style={{
            strokeDasharray: 440,
            strokeDashoffset: strokeDashoffset
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-rajdhani font-bold text-[#1BFFFF]">
          {timeRemaining.days}d:{timeRemaining.hours}h
        </span>
      </div>
    </div>
  );
}
