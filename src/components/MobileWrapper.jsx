import React from 'react';
import DynamicIsland from './DynamicIsland';
import { motion, AnimatePresence } from 'framer-motion';

const MobileWrapper = ({ children, trip, isSplitView, secondaryContent }) => {
  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center p-4 sm:p-8 font-sans overflow-x-hidden">
      <div className="relative flex items-center gap-8 transition-all duration-700 ease-in-out" 
           style={{ transform: isSplitView ? 'translateX(0)' : 'translateX(0)' }}>
        
        {/* Primary Phone (Huang Xiaoxi) */}
        <motion.div 
          animate={{ 
            x: isSplitView ? -200 : 0, 
            scale: isSplitView ? 0.95 : 1 
          }}
          transition={{ type: "spring", damping: 25, stiffness: 120 }}
          className="relative w-full max-w-[375px] h-[812px] bg-slate-50 rounded-[3rem] shadow-2xl border-8 border-slate-900 overflow-hidden shrink-0 z-20"
        >
          {/* Dynamic Island (Replaces Notch) */}
          <DynamicIsland trip={trip} />
          
          {/* Status Bar Time (Mock) */}
          <div className="absolute top-3.5 left-8 text-slate-900 text-xs font-bold z-[110] pointer-events-none mix-blend-difference text-white">9:41</div>
          
          {/* Status Bar Icons (Mock) */}
          <div className="absolute top-3.5 right-8 flex gap-1 z-[110] pointer-events-none mix-blend-difference filter invert">
            <div className="w-4 h-3 bg-white rounded-sm"></div>
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>

          {/* Content Container - Ensure absolute positioning works relative to this */}
          <div className="w-full h-full overflow-hidden relative bg-slate-50">
            {children}
          </div>

          {/* Home Indicator */}
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-slate-900/20 rounded-full z-50"></div>
        </motion.div>

        {/* Secondary Phone (Agent B-Side) */}
        <AnimatePresence>
          {isSplitView && (
            <motion.div
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: -200, scale: 0.95 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 120, delay: 0.1 }}
              className="relative w-full max-w-[375px] h-[812px] bg-slate-50 rounded-[3rem] shadow-2xl border-8 border-slate-900 overflow-hidden shrink-0 z-10"
            >
               {/* Mock Notch for Secondary Phone */}
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-900 rounded-b-2xl z-50"></div>
               
               {/* Content */}
               <div className="w-full h-full relative">
                 {secondaryContent}
               </div>

               {/* Home Indicator */}
               <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-slate-900/20 rounded-full z-50"></div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default MobileWrapper;
