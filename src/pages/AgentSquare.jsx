import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { 
  ArrowLeft, Map as MapIcon, Layers, Video, Filter, 
  Search, MapPin, User, Building, Coffee, Car, 
  MessageCircle, Heart, Share2, MoreHorizontal,
  BadgeCheck, Sparkles, Play, Send, X, Loader2
} from 'lucide-react';

// Fix Leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// LazyVideo Component
const LazyVideo = ({ src, poster, isActive }) => {
  const videoRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible && videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {
          // Auto-play might be blocked
        });
      }
    } else if (videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
    }
  }, [isVisible]);

  return (
    <div ref={containerRef} className="absolute inset-0 bg-black">
      {/* Loading State / Poster */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${isLoaded ? 'opacity-0' : 'opacity-100'}`}>
         {poster && <img src={poster} alt="Video poster" className="w-full h-full object-cover" />}
         <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
         </div>
      </div>
      
      {/* Video Player */}
      {(isVisible || isLoaded) && (
        <video 
          ref={videoRef}
          src={src} 
          className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          loop
          muted
          playsInline
          onLoadedData={() => setIsLoaded(true)}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />
    </div>
  );
};

// Custom Marker Icons with Avatar and Floating Effect
const createAvatarIcon = (avatar, color, size = 48) => {
  return L.divIcon({
    className: 'custom-avatar-marker',
    html: `
      <div class="avatar-marker-container" style="width: ${size}px; height: ${size}px;">
        <img src="${avatar}" class="avatar-marker-img" style="border-color: ${color}; width: ${size - 4}px; height: ${size - 4}px;" />
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  });
};

const getAgentSize = (likes) => {
  let num = 0;
  if (typeof likes === 'string') {
    if (likes.includes('w')) {
      num = parseFloat(likes) * 10000;
    } else if (likes.includes('k')) {
      num = parseFloat(likes) * 1000;
    } else {
      num = parseFloat(likes);
    }
  } else {
    num = likes;
  }

  if (num >= 10000) return 64; // Huge
  if (num >= 8000) return 56;  // Large
  if (num >= 5000) return 48;  // Medium
  if (num >= 3000) return 40;  // Small
  return 36;                   // Tiny
};

const mockAgents = [
  {
    id: 1,
    name: "黄果树瀑布智能体",
    type: "scenic",
    isEnterprise: true,
    desc: "全天候景区导览",
    intro: "作为黄果树景区官方智能体，我接入了景区实时监控系统，能为您提供精准的瀑布水量预报、最佳观赏点推荐及客流避峰指南，助您捕捉最壮观的自然瞬间。",
    lat: 25.9906,
    lng: 105.6672,
    color: "#10b981", // green
    video: "https://videos.pexels.com/video-files/14456549/14456549-hd_1080_1920_30fps.mp4",
    likes: "1.2w",
    avatar: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=200&h=200&fit=crop",
    poster: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&h=1200&fit=crop"
  },
  {
    id: 2,
    name: "亚朵酒店管家",
    type: "hotel",
    isEnterprise: true,
    desc: "24h贴心服务",
    intro: "您的全天候私人管家，不仅可以一键调节客房环境，还能为您预约深夜食堂的暖心夜宵。连接社区文化，为您推荐周边最地道的城市漫步路线。",
    lat: 26.5786,
    lng: 106.7139,
    color: "#6366f1", // indigo
    video: "https://videos.pexels.com/video-files/7578552/7578552-uhd_2560_1440_30fps.mp4",
    likes: "8.5k",
    avatar: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=200&fit=crop"
  },
  {
    id: 3,
    name: "王阿姨辣子鸡",
    type: "food",
    isEnterprise: false,
    desc: "地道贵阳味",
    intro: "专注贵阳老味道三十年，每一锅辣子鸡都坚持手工炒制。我是王阿姨的数字分身，除了帮您预留位置，还能教您地道的吃法，甚至偷偷告诉您这道菜的独家秘方。",
    lat: 26.6470,
    lng: 106.6302,
    color: "#f97316", // orange
    video: "https://videos.pexels.com/video-files/5794186/5794186-uhd_2160_3840_25fps.mp4",
    likes: "2.3k",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop"
  },
  {
    id: 4,
    name: "金牌地陪小张",
    type: "scenic",
    isEnterprise: false,
    desc: "带你玩转贵州",
    intro: "土生土长的贵州通，不带您走马观花，只带您深入苗寨深处、探寻喀斯特秘境。根据您的体力和兴趣，实时调整行程，让每一次出发都成为独家记忆。",
    lat: 26.2500,
    lng: 105.9333,
    color: "#14b8a6", // teal
    video: "https://videos.pexels.com/video-files/12808165/12808165-hd_1080_1920_30fps.mp4",
    likes: "5.6k",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
  },
  {
    id: 5,
    name: "神州专车调度",
    type: "transport",
    isEnterprise: true,
    desc: "安全出行保障",
    intro: "依托神州专车智能调度系统，为您提供毫秒级的响应速度。无论是接送机还是跨城包车，我都将根据实时路况为您规划最优路线，确保行程安全、准时、舒适。",
    lat: 26.6000,
    lng: 106.7000,
    color: "#3b82f6", // blue
    video: "https://videos.pexels.com/video-files/10001617/10001617-hd_1080_1920_30fps.mp4",
    likes: "3.4k",
    avatar: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=200&h=200&fit=crop"
  }
];

const AgentSquare = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('map'); // map, social, video
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const filters = [
    { id: 'all', label: '全部' },
    { id: 'scenic', label: '景区' },
    { id: 'hotel', label: '酒店' },
    { id: 'food', label: '餐饮' },
    { id: 'transport', label: '交通' }
  ];

  const filteredAgents = useMemo(() => {
    if (activeFilter === 'all') return mockAgents;
    return mockAgents.filter(agent => agent.type === activeFilter);
  }, [activeFilter]);

  const handleAgentClick = (agent) => {
    // Navigate to ChatInterface with context
    // This matches the Home.jsx handleOpenChat logic but for specific agents
    // We pass the agent info as 'initialContext' to ChatInterface via route state
    
    // Construct context object similar to what Home.jsx passes
    const context = {
        name: agent.name,
        intro: agent.intro,
        type: agent.type, // Pass raw type for ChatInterface to determine styling
        fromSquare: true, // Flag to indicate direct entry from Agent Square
        desc: agent.name, // Use agent name as desc for ChatInterface compatibility (e.g. "看到您对【黄果树瀑布智能体】感兴趣")
        role: agent.type === 'scenic' ? '景区' : agent.type === 'hotel' ? '酒店' : agent.type === 'food' ? '餐饮' : '交通',
        color: agent.type === 'scenic' ? 'green' : agent.type === 'hotel' ? 'indigo' : agent.type === 'food' ? 'orange' : 'blue',
        avatar: agent.avatar,
        // Add specific services based on type to populate "I want to..." chips
        services: agent.type === 'scenic' ? ['购票', '导览'] : 
                 agent.type === 'hotel' ? ['订房', '咨询'] :
                 agent.type === 'food' ? ['订座', '排队'] : ['用车', '接机']
    };

    // We navigate to the root route '/' which renders the Home component
    navigate('/', { state: { openChatWith: context } });
  };

  const renderMapView = () => (
    <div className="flex flex-col h-full">
      {/* Map Area */}
      <div className="h-[45%] relative z-0">
        <MapContainer 
          center={[26.4, 106.4]} 
          zoom={8} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredAgents.map(agent => (
            <Marker 
              key={agent.id} 
              position={[agent.lat, agent.lng]}
              icon={createAvatarIcon(agent.avatar, agent.color, getAgentSize(agent.likes))}
              eventHandlers={{
                click: () => handleAgentClick(agent),
              }}
            >
              <Popup>
                <div className="p-1 cursor-pointer" onClick={() => handleAgentClick(agent)}>
                  <div className="font-bold text-sm">{agent.name}</div>
                  <div className="text-xs text-slate-500">{agent.desc}</div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        
        {/* Floating Filter */}
        <div className="absolute top-4 left-4 right-4 z-[1000] overflow-x-auto scrollbar-hide">
          <div className="flex gap-2">
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-md whitespace-nowrap transition-all ${
                  activeFilter === filter.id 
                    ? 'bg-cyan-500 text-white shadow-cyan-200' 
                    : 'bg-white/90 text-slate-600'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* List Area */}
      <div className="flex-1 bg-white -mt-4 rounded-t-[2rem] relative z-10 p-4 overflow-y-auto shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-6" />
        <h3 className="text-lg font-bold text-slate-800 mb-4 px-2">
          附近智能体 ({filteredAgents.length})
        </h3>
        <div className="space-y-4 pb-20">
          {filteredAgents.map(agent => (
            <div 
              key={agent.id}
              className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 active:scale-98 transition-transform cursor-pointer"
              onClick={() => handleAgentClick(agent)}
            >
              <div className="w-14 h-14 rounded-full relative shrink-0">
                <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover rounded-full" />
                {agent.isEnterprise && (
                  <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-0.5 rounded-full border-2 border-white">
                    <BadgeCheck size={10} />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-slate-800 truncate">{agent.name}</h4>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                    agent.isEnterprise ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {agent.isEnterprise ? '企业' : '个人'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate">{agent.intro}</p>
                <div className="flex gap-2 mt-2">
                   <span className="text-[10px] text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-100">
                     {agent.desc}
                   </span>
                </div>
              </div>
              <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-cyan-500 shadow-sm border border-slate-100">
                <MessageCircle size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSocialView = () => {
    // Only render top 3 cards for stack effect
    const stackAgents = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentCardIndex + i) % mockAgents.length;
      stackAgents.push({ ...mockAgents[index], offset: i });
    }

    const handleNext = () => {
      setCurrentCardIndex((prev) => (prev + 1) % mockAgents.length);
    };

    return (
      <div className="h-full bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden pb-24 pt-24">
        <div className="relative w-[320px] h-[460px]">
          <AnimatePresence mode="popLayout">
            {stackAgents.reverse().map((agent) => {
              const isTop = agent.offset === 0;
              return (
                <motion.div
                  key={`${agent.id}-${agent.offset}`} // Force re-render for stack position
                  className="absolute inset-0 bg-white rounded-3xl shadow-2xl overflow-hidden origin-bottom"
                  initial={{ scale: 0.9, y: 50, opacity: 0 }}
                  animate={{ 
                    scale: 1 - agent.offset * 0.1, 
                    y: agent.offset * 40,
                    opacity: 1 - agent.offset * 0.2,
                    zIndex: 100 - agent.offset,
                    rotate: isTop ? 0 : (agent.offset % 2 === 0 ? 3 : -3)
                  }}
                  exit={{ x: -300, opacity: 0, rotate: -20 }}
                  transition={{ type: "spring", damping: 20, stiffness: 100 }}
                  drag={isTop ? "x" : false}
                  dragConstraints={{ left: -100, right: 100 }}
                  onDragEnd={(e, { offset }) => {
                    if (Math.abs(offset.x) > 100) {
                      handleNext();
                    }
                  }}
                >
                  {/* Card Content */}
                  <div className="h-full flex flex-col">
                    {/* Image Area */}
                    <div className="h-[65%] relative">
                      <img src={agent.poster || agent.avatar} alt={agent.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white" />
                    </div>
                    
                    {/* Description Area */}
                    <div className="flex-1 px-6 bg-white overflow-hidden">
                      <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                        {agent.intro || agent.desc}
                      </p>
                    </div>
                    
                    {/* Info Area */}
                    <div className="h-20 px-6 bg-white flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img src={agent.avatar} alt="avatar" className="w-10 h-10 rounded-full border-2 border-white shadow-md object-cover" />
                          {agent.isEnterprise && (
                            <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-0.5 rounded-full border-2 border-white">
                              <BadgeCheck size={10} />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 text-sm">{agent.name}</h3>
                          <p className="text-[10px] text-slate-400 font-medium">10分钟前活跃</p>
                        </div>
                      </div>
                      <button className="text-slate-300 hover:text-slate-500 transition-colors">
                        <MoreHorizontal size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-10 mt-20">
           <button 
             className="w-14 h-14 bg-white rounded-full shadow-[0_10px_30px_rgba(255,100,100,0.2)] text-red-500 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
             onClick={handleNext}
           >
              <Heart size={24} fill="currentColor" className="text-red-500" />
           </button>
           <button 
             className="w-14 h-14 bg-white rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.1)] text-slate-800 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
             onClick={() => handleAgentClick(mockAgents[currentCardIndex % mockAgents.length])}
           >
              <MessageCircle size={24} />
           </button>
           <button 
             className="w-14 h-14 bg-white rounded-full shadow-[0_10px_30px_rgba(50,150,255,0.2)] text-cyan-500 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
           >
              <Send size={24} />
           </button>
        </div>
      </div>
    );
  };

  const renderVideoView = () => (
    <div className="h-full w-full bg-black snap-y snap-mandatory overflow-y-scroll scrollbar-hide">
      {mockAgents.map((agent, index) => (
        <div key={agent.id} className="h-full w-full relative snap-start flex items-center justify-center bg-slate-900 shrink-0">
          {/* Lazy Video Player */}
          <LazyVideo 
            src={agent.video} 
            poster={agent.poster || agent.avatar}
          />

          {/* Right Actions */}
          <div className="absolute right-4 bottom-32 flex flex-col gap-6 items-center z-20">
             <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center">
                   <Heart size={20} className="text-white" />
                </div>
                <span className="text-white text-xs font-bold shadow-black drop-shadow-md">{agent.likes}</span>
             </div>
             <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center">
                   <MessageCircle size={20} className="text-white" />
                </div>
                <span className="text-white text-xs font-bold shadow-black drop-shadow-md">452</span>
             </div>
             <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center">
                <Share2 size={20} className="text-white" />
             </div>
          </div>

          {/* Bottom Agent Card */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/50 to-transparent pt-20">
             {/* Description */}
             <div className="mb-4 px-1">
               <p className="text-white text-sm leading-relaxed line-clamp-3 drop-shadow-md opacity-90">
                 {agent.intro}
               </p>
             </div>

             <div 
               className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl flex items-center gap-3 cursor-pointer active:scale-95 transition-transform"
               onClick={() => handleAgentClick(agent)}
             >
                <div className="w-10 h-10 rounded-full border-2 border-white/30 overflow-hidden">
                   <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                   <h4 className="text-white font-bold text-sm truncate flex items-center gap-1">
                      @{agent.name}
                      {agent.isEnterprise && <BadgeCheck size={12} className="text-blue-400" />}
                   </h4>
                   <p className="text-white/70 text-xs truncate">{agent.desc}</p>
                </div>
                <button className="bg-cyan-500 text-white px-4 py-1.5 rounded-full text-xs font-bold">
                   咨询
                </button>
             </div>
             <div className="h-12" /> {/* Bottom safe area */}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="h-full w-full flex flex-col bg-white relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 px-4 py-4 pt-12 flex items-center justify-between pointer-events-none">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm pointer-events-auto"
        >
          <ArrowLeft size={20} className="text-slate-800" />
        </button>
        
        {/* View Switcher */}
        <div className="bg-white/80 backdrop-blur-md rounded-full p-1 flex shadow-lg pointer-events-auto">
          <button 
            onClick={() => setViewMode('map')}
            className={`p-2 rounded-full transition-all ${viewMode === 'map' ? 'bg-cyan-500 text-white' : 'text-slate-400'}`}
          >
            <MapIcon size={18} />
          </button>
          <button 
            onClick={() => setViewMode('social')}
            className={`p-2 rounded-full transition-all ${viewMode === 'social' ? 'bg-cyan-500 text-white' : 'text-slate-400'}`}
          >
            <Layers size={18} />
          </button>
          <button 
            onClick={() => setViewMode('video')}
            className={`p-2 rounded-full transition-all ${viewMode === 'video' ? 'bg-cyan-500 text-white' : 'text-slate-400'}`}
          >
            <Video size={18} />
          </button>
        </div>

        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'map' && renderMapView()}
        {viewMode === 'social' && renderSocialView()}
        {viewMode === 'video' && renderVideoView()}
      </div>
    </div>
  );
};

export default AgentSquare;