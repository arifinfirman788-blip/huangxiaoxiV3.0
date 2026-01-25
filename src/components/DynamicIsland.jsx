import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Car, Utensils, Camera, Bell, X, ChevronRight, Navigation, Clock } from 'lucide-react';

const PROACTIVE_MESSAGES = [
  { type: 'scenic', title: '当季推荐', message: '平坝樱花节盛大开幕🌸', icon: Camera, color: 'text-pink-500', bgColor: 'bg-pink-500/20' },
  { type: 'hotel', title: '限时特惠', message: '希尔顿酒店今晚5折🏨', icon: Bell, color: 'text-indigo-500', bgColor: 'bg-indigo-500/20' },
  { type: 'food', title: '美食打卡', message: '排队王：老凯俚酸汤鱼🍲', icon: Utensils, color: 'text-orange-500', bgColor: 'bg-orange-500/20' },
];

const DynamicIsland = ({ trip }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [notification, setNotification] = useState(null);
  const [activeNode, setActiveNode] = useState(null);
  const [marketingMsg, setMarketingMsg] = useState(null);

  // Marketing Loop when no trip
  useEffect(() => {
    if (!trip?.itinerary) {
      let index = 0;
      
      const showMarketing = () => {
        if (isExpanded) return;
        const msg = PROACTIVE_MESSAGES[index % PROACTIVE_MESSAGES.length];
        setMarketingMsg(msg);
        
        // Trigger notification
        setNotification({
          type: 'marketing',
          title: msg.title,
          message: msg.message,
          icon: msg.icon,
          color: msg.color,
          bgColor: msg.bgColor
        });

        // Dismiss notification after 4s
        setTimeout(() => {
          setNotification(null);
        }, 4000);

        index++;
      };

      // Show first one after 2s
      const initialTimer = setTimeout(showMarketing, 2000);
      
      // Then every 10s
      const interval = setInterval(showMarketing, 10000);

      return () => {
        clearTimeout(initialTimer);
        clearInterval(interval);
      };
    }
  }, [trip, isExpanded]);

  // Simulate finding the current active node from the trip
  useEffect(() => {
    if (trip?.itinerary) {
      const allNodes = trip.itinerary.flatMap(day => day.timeline);
      
      if (allNodes.length === 0) return;

      let currentIndex = 0;

      // Initial set
      const updateNode = (index) => {
        const node = allNodes[index % allNodes.length];
        setActiveNode(node);
        
        // Trigger notification
        setNotification({
          type: 'update',
          title: '行程推进中',
          message: `即将前往：${node.title}`,
          icon: Bell
        });
        
        // Auto dismiss notification after 3s
        setTimeout(() => {
          setNotification(null);
        }, 3000);
      };

      // Start with the first node
      updateNode(currentIndex);

      // Rotate every 8 seconds to demonstrate different scenes
      const interval = setInterval(() => {
        if (!isExpanded) { // Only rotate if not expanded by user
            currentIndex++;
            updateNode(currentIndex);
        }
      }, 8000);

      return () => clearInterval(interval);
    }
  }, [trip, isExpanded]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const containerVariants = {
    idle: { 
      width: '160px', 
      height: '32px', 
      borderRadius: '20px',
      x: '-50%' 
    },
    expanded: { 
      width: '340px', 
      height: '180px', 
      borderRadius: '32px',
      x: '-50%' 
    },
    notification: {
      width: '340px', 
      height: '80px', 
      borderRadius: '32px',
      x: '-50%' 
    }
  };

  // Helper to get icon based on node type
  const getIcon = (type) => {
    switch (type) {
      case 'flight': return Plane;
      case 'transport': return Car;
      case 'food': return Utensils;
      case 'scenic': return Camera;
      default: return Navigation;
    }
  };

  const CurrentIcon = activeNode ? getIcon(activeNode.type) : (marketingMsg?.icon || Bell);
  
  const NotificationIcon = notification?.icon;
  const MarketingIcon = marketingMsg?.icon;

  return (
    <motion.div
      className="absolute top-2 left-1/2 bg-black z-[100] text-white overflow-hidden shadow-2xl cursor-pointer"
      variants={containerVariants}
      initial="idle"
      animate={isExpanded ? "expanded" : "idle"}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onClick={toggleExpand}
    >
      <AnimatePresence mode="wait">
        {isExpanded ? (
          // EXPANDED STATE
          <motion.div
            key="expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full p-6 flex flex-col justify-between"
          >
            {activeNode ? (
              <>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                      <CurrentIcon size={20} className="text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Current Activity</p>
                      <h3 className="text-lg font-bold leading-none mt-1">{activeNode.title}</h3>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-black text-yellow-500">{activeNode.time}</span>
                    <span className="text-[10px] text-gray-400">预计时间</span>
                  </div>
                </div>

                <div className="bg-white/10 rounded-2xl p-3 flex items-center gap-3">
                  <div className="flex-1">
                     <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                       <motion.div 
                         className="h-full bg-yellow-500" 
                         initial={{ width: 0 }}
                         animate={{ width: '60%' }}
                       />
                     </div>
                     <div className="flex justify-between mt-1.5">
                       <span className="text-[10px] text-gray-400">距离目标 2.5km</span>
                       <span className="text-[10px] text-white font-bold">15 min</span>
                     </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                   <button className="flex-1 py-2 bg-white text-black rounded-xl text-xs font-bold flex items-center justify-center gap-1">
                     <Navigation size={12} /> 开始导航
                   </button>
                   <button className="flex-1 py-2 bg-white/20 text-white rounded-xl text-xs font-bold">
                     查看详情
                   </button>
                </div>
              </>
            ) : marketingMsg && MarketingIcon ? (
              // MARKETING EXPANDED STATE
              <>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${marketingMsg.bgColor} flex items-center justify-center`}>
                      <MarketingIcon size={20} className={marketingMsg.color} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">为你推荐</p>
                      <h3 className="text-lg font-bold leading-none mt-1">{marketingMsg.title}</h3>
                    </div>
                  </div>
                  <div className="px-2 py-1 bg-white/20 rounded-lg">
                    <span className="text-xs font-bold text-white">Ad</span>
                  </div>
                </div>

                <div className="bg-white/10 rounded-2xl p-4">
                   <p className="text-sm font-medium leading-relaxed">
                     {marketingMsg.message}
                   </p>
                   <p className="text-[10px] text-gray-400 mt-2">
                     根据您的偏好智能推荐，点击下方按钮立即查看详情。
                   </p>
                </div>
                
                <div className="flex gap-2">
                   <button className="flex-1 py-2 bg-white text-black rounded-xl text-xs font-bold flex items-center justify-center gap-1">
                     查看详情
                   </button>
                   <button className="flex-1 py-2 bg-white/20 text-white rounded-xl text-xs font-bold">
                     不感兴趣
                   </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
                <span className="text-sm font-bold text-gray-400">暂无进行中的行程</span>
                <p className="text-[10px] text-gray-500">请先规划或导入您的行程</p>
              </div>
            )}
          </motion.div>
        ) : (
          // IDLE STATE (Compact)
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full flex items-center justify-between px-3"
          >
            {activeNode ? (
              <>
                <div className="w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <CurrentIcon size={12} className="text-yellow-500" />
                </div>
                <div className="flex-1 mx-2 h-full flex items-center justify-center">
                  {/* Activity Waveform Simulation */}
                  <div className="flex gap-0.5 items-end h-3">
                     {[1,2,3,4,5].map(i => (
                       <motion.div 
                         key={i}
                         className="w-1 bg-yellow-500 rounded-full"
                         animate={{ height: [4, 12, 4] }}
                         transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                       />
                     ))}
                  </div>
                </div>
                <span className="text-[10px] font-bold text-yellow-500">{activeNode.time}</span>
              </>
            ) : marketingMsg && MarketingIcon ? (
               // Marketing Idle State
               <>
                 <div className={`w-5 h-5 rounded-full ${marketingMsg.bgColor} flex items-center justify-center`}>
                   <MarketingIcon size={12} className={marketingMsg.color} />
                 </div>
                 <div className="flex-1 mx-2 overflow-hidden">
                    <p className="text-[10px] font-bold text-white truncate text-center">{marketingMsg.title}</p>
                 </div>
                 <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
               </>
            ) : (
               // Empty State (Just a black pill)
               <div className="w-full h-full" />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

};

export default DynamicIsland;
