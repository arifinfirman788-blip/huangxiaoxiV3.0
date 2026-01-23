import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FlipCard = ({ number, label }) => {
  const [prevNumber, setPrevNumber] = useState(number);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (number !== prevNumber) {
      setIsFlipping(true);
      const timer = setTimeout(() => {
        setIsFlipping(false);
        setPrevNumber(number);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [number, prevNumber]);

  return (
    <div className="flex flex-col items-center mx-1">
      <div className="relative w-10 h-12 md:w-12 md:h-14 bg-slate-800 rounded-lg shadow-md overflow-hidden text-white text-xl md:text-2xl font-bold font-mono">
        {/* Top Half (Current) */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-slate-700/50 border-b border-black/20 z-10 overflow-hidden flex justify-center items-end pb-[1px]">
          <span className="translate-y-1/2">{number < 10 ? `0${number}` : number}</span>
        </div>

        {/* Bottom Half (Previous - Background) */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-slate-800 flex justify-center items-start pt-[1px] overflow-hidden">
           <span className="-translate-y-1/2">{number < 10 ? `0${number}` : number}</span>
        </div>
        
        {/* Animated Flip Card */}
        <AnimatePresence mode="popLayout">
           {isFlipping && (
             <motion.div
               key={prevNumber}
               initial={{ rotateX: 0 }}
               animate={{ rotateX: -180 }}
               transition={{ duration: 0.6, ease: "easeInOut" }}
               className="absolute top-0 left-0 right-0 h-full z-20"
               style={{ transformStyle: 'preserve-3d', perspective: '300px' }}
             >
                {/* Front Face (Old Top) */}
                <div 
                  className="absolute inset-0 h-1/2 bg-slate-700/50 border-b border-black/20 backface-hidden flex justify-center items-end pb-[1px] overflow-hidden"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                   <span className="translate-y-1/2 text-white">{prevNumber < 10 ? `0${prevNumber}` : prevNumber}</span>
                </div>
                {/* Back Face (New Bottom) */}
                <div 
                   className="absolute inset-0 top-1/2 h-1/2 bg-slate-800 backface-hidden flex justify-center items-start pt-[1px] overflow-hidden"
                   style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}
                >
                   <span className="-translate-y-1/2 text-white">{number < 10 ? `0${number}` : number}</span>
                </div>
             </motion.div>
           )}
        </AnimatePresence>
      </div>
      <span className="text-[10px] text-slate-500 font-medium mt-1 uppercase tracking-wider">{label}</span>
    </div>
  );
};

const FlipCountdown = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex items-center justify-center p-2 bg-slate-100/50 rounded-xl backdrop-blur-sm">
      <FlipCard number={timeLeft.days} label="天" />
      <span className="text-xl font-bold text-slate-400 mb-4">:</span>
      <FlipCard number={timeLeft.hours} label="时" />
      <span className="text-xl font-bold text-slate-400 mb-4">:</span>
      <FlipCard number={timeLeft.minutes} label="分" />
      <span className="text-xl font-bold text-slate-400 mb-4">:</span>
      <FlipCard number={timeLeft.seconds} label="秒" />
    </div>
  );
};

export default FlipCountdown;
