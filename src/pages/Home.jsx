import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, User, ChevronDown, MessageCircle, Star, Coffee, Building, Landmark, Mic, Plus, Home as HomeIcon, Compass, UserCircle, X, Check, Bell, Languages, Volume2, ArrowUpRight, Plane, Clock, Sparkles, Camera, Car, Play, Calendar as CalendarIcon, Ticket, Hotel, Utensils, RefreshCcw, ArrowRight } from 'lucide-react';
import { categories } from '../data/agents';
import TuoSaiImage from '../image/托腮_1.png';
import FlipCountdown from '../components/FlipCountdown';
import ChatInterface from '../components/ChatInterface';
import { getPlaceholder } from '../utils/imageUtils';

// Import cropped avatars
import PeasantAvatar from '../image/avatars/peasant.png';
import KnightAvatar from '../image/avatars/knight.png';
import MageAvatar from '../image/avatars/mage.png';
import ThreeAgentsImage from '../image/fJOIb6mhE.jpeg';
import MuseumAvatar from '../image/bowuguan.png';
import WangAyiAvatar from '../image/wangayi.png';
import LiuDaGeAvatar from '../image/liudage.png';
import HotelAvatar from '../image/jiudian.png';
import GuideAvatar from '../image/daoyou.png';
import CarAvatar from '../image/zhuanche.png';
import ScenicAvatar from '../image/huangguoshu.png';

const iconMap = {
  Landmark: Landmark,
  Building: Building,
  Coffee: Coffee,
  User: User,
  Home: HomeIcon
};

const getAiReminder = (node) => {
  if (!node) return "今天天气不错，适合出去走走，记得带上好心情哦～";
  if (node.type === 'flight') return "航班出行请记得携带身份证，提前2小时到达机场安检～";
  if (node.type === 'hotel') return "抵达酒店后可以先休息一下，缓解旅途疲劳再出发～";
  if (node.type === 'food') return "当地美食虽好，也要注意饮食卫生，不要贪吃哦～";
  return "旅途中遇到美景记得拍照留念，记录下这美好的瞬间～";
};

const phrases = [
  "今天想去哪里探索？",
  "想吃地道的酸汤鱼？",
  "寻找苗寨的非遗体验？",
  "安排一次舒适的旅居？",
  "查询黄果树瀑布门票？"
];

const TypewriterText = () => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);

  useEffect(() => {
    const currentPhrase = phrases[loopNum % phrases.length];
    
    const tick = () => {
      setText(prev => isDeleting 
        ? prev.slice(0, -1) 
        : currentPhrase.slice(0, prev.length + 1)
      );
    };

    let timerDelay = isDeleting ? 50 : 150;

    if (!isDeleting && text === currentPhrase) {
      timerDelay = 2000;
    } else if (isDeleting && text === '') {
      timerDelay = 500;
    }

    const timer = setTimeout(() => {
      if (!isDeleting && text === currentPhrase) {
        setIsDeleting(true);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(prev => prev + 1);
      } else {
        tick();
      }
    }, timerDelay);

    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum]);

  return (
    <h2 className="text-2xl font-bold text-slate-800 mb-2 leading-tight h-16 flex items-center justify-center">
      <span>
        {text}
      </span>
      <motion.span 
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="inline-block w-0.5 h-6 bg-cyan-500 ml-1 align-middle"
      />
    </h2>
  );
};

const NewsMarquee = () => {
  const navigate = useNavigate();
  const news = [
    "贵州文旅优惠季开启，百家景区半价游",
    "黄果树瀑布迎来最佳观赏期，水量充沛",
    "遵义市发布低温凝冻黄色预警，请注意防范"
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % news.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <button 
      onClick={() => navigate('/news')}
      className="w-full bg-white/60 backdrop-blur-sm rounded-xl p-2 flex items-center gap-2 shadow-sm border border-white/60 mb-12 active:scale-98 transition-transform"
    >
      <div className="bg-orange-100 p-1 rounded-md">
        <Volume2 size={14} className="text-orange-500" />
      </div>
      <div className="flex-1 h-4 relative overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center"
          >
            <span className="text-xs text-slate-700 truncate font-medium">
              {news[index]}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="text-[10px] text-slate-400 flex items-center gap-0.5">
        更多
        <ChevronDown size={10} className="-rotate-90" />
      </div>
    </button>
  );
};

const Home = ({ adoptedTrip, isAuthenticated, onUpdateTrip, toggleBottomNav, onServiceSubmit, onConnectAgent, agentFeedback, merchantMessage, onUserMessage, isHumanMode }) => {
  const [activeRole, setActiveRole] = useState('黄小西');
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [tempStartDate, setTempStartDate] = useState('');
  const [forceUpdate, setForceUpdate] = useState(0); // Add forceUpdate state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialContext, setChatInitialContext] = useState(null);
  const [radarBatchIndex, setRadarBatchIndex] = useState(0);

  const navigate = useNavigate();
  const location = useLocation(); // Add useLocation hook

  // Check for openChatWith in location state on mount
  useEffect(() => {
    // Ensure we start at the top to prevent layout shifts
    window.scrollTo(0, 0);
    
    if (location.state?.openChatWith) {
        handleOpenChat(location.state.openChatWith);
        // Clear state to prevent reopening on refresh (optional but good practice)
        window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Radar Agent Batches for rotation
  const radarBatches = [
    [
      { img: ScenicAvatar, className: "top-8 right-12 w-8 h-8", delay: '0s' },
      { img: HotelAvatar, className: "bottom-20 left-10 w-6 h-6", delay: '1s' },
      { img: GuideAvatar, className: "top-16 left-1/2 w-7 h-7", delay: '2s' }
    ],
    [
      { img: WangAyiAvatar, className: "top-1/2 right-8 w-7 h-7", delay: '0.5s' },
      { img: CarAvatar, className: "bottom-12 right-1/3 w-6 h-6", delay: '1.5s' },
      { img: MuseumAvatar, className: "top-10 left-12 w-8 h-8", delay: '2.5s' }
    ],
    [
      { img: LiuDaGeAvatar, className: "bottom-8 right-12 w-7 h-7", delay: '0.8s' },
      { img: ScenicAvatar, className: "top-20 left-8 w-6 h-6", delay: '1.2s' },
      { img: HotelAvatar, className: "top-6 right-1/3 w-8 h-8", delay: '1.8s' }
    ]
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setRadarBatchIndex(prev => (prev + 1) % radarBatches.length);
    }, 4000); // Rotate every 4 seconds to match radar scan
    return () => clearInterval(timer);
  }, []);

  // Navigation wrapper to check auth
  const handleNav = (path) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: path } } });
    } else {
      navigate(path);
    }
  };

  const handleOpenChat = (context = null) => {
    setChatInitialContext(context);
    setIsChatOpen(true);
    if (toggleBottomNav) toggleBottomNav(false);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
    if (toggleBottomNav) toggleBottomNav(true);
  };

  const handleStartTrip = () => {
    if (!tempStartDate) return;
    const date = new Date(tempStartDate);
    if (date <= new Date()) {
        alert("请选择当前时间之后的时间");
        return;
    }
    onUpdateTrip({ startTime: date.toISOString() });
    setIsStartModalOpen(false);
  };

  const roles = ['黄小西', '酒店助手', '景区向导', '美食专家', '政务助手'];

  return (
    <div className="h-full w-full relative">
      <div className="h-full w-full overflow-y-auto scrollbar-hide pb-24">
        <div className="px-6 pt-12 relative z-10">
          {/* Header */}
          <header className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight leading-tight">你好, <br/>旅行者</h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 bg-white rounded-blob-2 shadow-sm border border-white/60 flex items-center justify-center text-slate-500 hover:text-cyan-600 transition-colors">
                 <Languages size={20} />
              </button>
              <button 
                onClick={() => handleNav('/message')}
                className="w-10 h-10 bg-white rounded-blob-2 shadow-sm border border-white/60 flex items-center justify-center overflow-hidden active:scale-95 transition-transform"
              >
                <MessageCircle size={20} className="text-slate-700" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" />
              </button>
            </div>
          </header>

          {/* News Marquee */}
          <NewsMarquee />



          {/* Typewriter Effect */}
          <div className="mb-8">

          {/* Hero / Chat Section */}
          <section className="mb-8 mt-24">
            <div className="relative">
              {/* Character Image - Positioned behind content, slightly lower to be covered by container */}
              <div className="absolute -top-16 -right-6 w-40 h-40 pointer-events-none z-0">
                 <img 
                   src={TuoSaiImage} 
                   alt="Character" 
                   className="w-full h-full object-contain drop-shadow-lg"
                 />
              </div>

              <motion.div 
                layoutId="chat-container"
                className="bg-white/40 backdrop-blur-xl border border-white/60 p-5 rounded-blob-1 shadow-float relative z-10 overflow-visible flex flex-col items-center text-center"
              >
                <TypewriterText />
                <p className="text-slate-500 text-xs mb-6">开启一段新的旅程或寻求帮助</p>
  
                <div className="w-full">
                  {/* Functional Agents as Capsule Buttons (Scrollable Row) - Now tightly coupled above input */}
                  <div className="w-full overflow-x-auto scrollbar-hide mb-3 -mx-2 px-2">
                    <div className="flex gap-2 min-w-max">
                      {[
                        { name: '行程规划', icon: MapPin },
                        { name: '帮我写游记', icon: HomeIcon },
                        { name: 'AI伴游', icon: User },
                      ].map((agent, index) => (
                        <motion.button 
                          key={index}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleOpenChat}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-slate-100 text-slate-600 whitespace-nowrap"
                        >
                          <agent.icon size={14} className="text-cyan-500" />
                          <span className="text-[10px] font-bold">{agent.name}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
  
                  {/* Integrated Chat Input Area */}
                  <div className="w-full relative">
                    <motion.div 
                         layoutId="input-container"
                         className="bg-white rounded-[2rem] p-3 pr-4 shadow-lg flex items-center gap-2 border border-slate-100 cursor-pointer hover:shadow-xl transition-shadow"
                         onClick={handleOpenChat}
                    >
                      <input 
                        type="text" 
                        placeholder="请输入您感兴趣的主题..." 
                        className="bg-transparent outline-none w-full text-slate-700 placeholder-slate-400 text-sm pl-2 cursor-pointer"
                        readOnly
                      />
                      
                      <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center shrink-0">
                        <ArrowUpRight size={18} />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Entity Agents Categories (Masonry Style with Images) - REMOVED per request */}
          {/* <section className="mb-24"> ... </section> */}
          </div>

          {/* Smart Notification Area (Moved) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full mb-8 h-[220px]"
          >
            {/* Full Width Agent Recommendation Widget */}
            <div className="h-full">
               <AgentListWidget handleOpenChat={handleOpenChat} />
            </div>
          </motion.div>

          {/* Agent Square Entry */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full mb-8"
          >
            <button
              onClick={() => navigate('/agent-square')}
              className="w-full bg-white rounded-[2rem] p-5 shadow-xl shadow-slate-100 border border-slate-100 relative overflow-hidden group active:scale-98 transition-transform h-56"
            >
              {/* Radar Background Effects */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-100">
                  {/* Faint Map Background */}
                  <div className="absolute inset-0 opacity-20" style={{ 
                      backgroundImage: 'url("https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600&auto=format&fit=crop")',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      filter: 'grayscale(100%) contrast(1.2)'
                  }} />
                  
                  {/* Radar Scan Animation - Enhanced Visibility */}
                  <div 
                    className="absolute w-[400px] h-[400px] rounded-full animate-spin" 
                    style={{ 
                        background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 270deg, rgba(34, 211, 238, 0.1) 300deg, rgba(34, 211, 238, 0.4) 360deg)',
                        animationDuration: '4s',
                        animationTimingFunction: 'linear'
                    }} 
                  />
              </div>

              {/* Floating Avatars on Radar - Dynamic Batch */}
              <AnimatePresence>
                {radarBatches[radarBatchIndex].map((agent, i) => (
                  <motion.div
                    key={`${radarBatchIndex}-${i}`}
                    initial={{ scale: 0.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.2, opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`absolute rounded-full border-2 border-white shadow-md overflow-hidden z-10 ${agent.className}`}
                  >
                    <div className="w-full h-full" style={{ animation: `avatar-float 3s ease-in-out infinite ${agent.delay}` }}>
                       <img src={agent.img} className="w-full h-full object-cover" alt="" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <div className="relative z-20 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start">
                    <div className="text-left">
                      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        智能体广场
                      </h3>
                      <p className="text-slate-400 text-xs">
                        发现身边有趣的智能体
                      </p>
                    </div>
                    <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-cyan-50 group-hover:text-cyan-500 transition-colors">
                      <ArrowRight size={16} />
                    </div>
                </div>

                <div className="mt-auto">
                  <div className="flex items-center gap-2 mb-2">
                     <span className="text-xs font-bold text-slate-800">附近热议</span>
                     <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  </div>
                  <div className="flex -space-x-2">
                     {[ScenicAvatar, HotelAvatar, GuideAvatar, WangAyiAvatar, CarAvatar].map((img, i) => (
                       <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 overflow-hidden shadow-sm">
                         <img src={img} className="w-full h-full object-cover" alt="" />
                       </div>
                     ))}
                     <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center text-[10px] font-bold text-slate-500 shadow-sm">
                       +99
                     </div>
                  </div>
                </div>
              </div>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Role Selector Action Sheet - Fixed to Viewport */}
      <AnimatePresence>
        {showRoleSelector && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={() => setShowRoleSelector(false)}
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2rem] p-6 z-50 pb-10"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">切换对话智能体</h3>
                <button onClick={() => setShowRoleSelector(false)} className="p-2 bg-slate-100 rounded-full text-slate-500">
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-3">
                {roles.map((role) => (
                  <div 
                    key={role}
                    className={`flex items-center justify-between p-4 rounded-xl cursor-pointer ${activeRole === role ? 'bg-cyan-50 border border-cyan-100' : 'bg-slate-50 border border-slate-100'}`}
                    onClick={() => {
                      setActiveRole(role);
                      setShowRoleSelector(false);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${activeRole === role ? 'bg-cyan-500' : 'bg-slate-300'}`}>
                        {role[0]}
                      </div>
                      <span className={`font-medium ${activeRole === role ? 'text-cyan-700' : 'text-slate-700'}`}>{role}</span>
                    </div>
                    {activeRole === role && <Check size={20} className="text-cyan-500" />}
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* Start Trip Modal */}
      <AnimatePresence>
        {isStartModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsStartModalOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-sm rounded-[2rem] p-6 relative z-10 shadow-2xl"
            >
              <div className="text-center mb-6">
                 <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4 text-cyan-600">
                    <CalendarIcon size={32} />
                 </div>
                 <h2 className="text-xl font-bold text-slate-800">设置行程开始时间</h2>
                 <p className="text-sm text-slate-500 mt-2">请选择您的出发时间，我们将为您开启行程倒计时</p>
              </div>

              <div className="space-y-4 mb-8">
                 <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">选择日期与时间</label>
                    <input 
                      type="datetime-local" 
                      className="w-full bg-transparent text-lg font-bold text-slate-800 outline-none"
                      onChange={(e) => setTempStartDate(e.target.value)}
                    />
                 </div>
              </div>

              <div className="flex gap-3">
                 <button 
                   onClick={() => setIsStartModalOpen(false)}
                   className="flex-1 py-3.5 rounded-xl font-bold text-slate-500 bg-slate-100 active:scale-95 transition-transform"
                 >
                   取消
                 </button>
                 <button 
                   onClick={handleStartTrip}
                   disabled={!tempStartDate}
                   className="flex-1 py-3.5 rounded-xl font-bold text-white bg-cyan-500 shadow-lg shadow-cyan-200 active:scale-95 transition-transform disabled:opacity-50 disabled:shadow-none"
                 >
                   确认开启
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isChatOpen && (
           <ChatInterface 
              onClose={handleCloseChat}
              initialContext={chatInitialContext}
              onAdoptTrip={(trip) => {
                 onUpdateTrip(trip);
                 handleCloseChat();
              }}
              onServiceSubmit={onServiceSubmit}
              onConnectAgent={onConnectAgent}
              agentFeedback={agentFeedback}
              merchantMessage={merchantMessage}
              onUserMessage={onUserMessage}
              isHumanMode={isHumanMode}
           />
        )}
      </AnimatePresence>
    </div>
  );
};

const AgentListWidget = ({ handleOpenChat }) => {
  const [displayedAgents, setDisplayedAgents] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const allAgents = [
    { 
      name: "景区向导", 
      role: "景区", 
      services: ["导览", "购票"],
      color: "green", 
      avatar: ScenicAvatar,
      desc: "黄果树瀑布",
      type: "enterprise",
      intro: "作为黄果树景区的官方数字大使，我承载着传播喀斯特自然美学的使命。致力于为您提供最权威的景观解读与最贴心的游览指引，让世界看见贵州山水的波澜壮阔。"
    },
    { 
      name: "酒店管家", 
      role: "酒店", 
      services: ["订房", "导航"],
      color: "indigo", 
      avatar: HotelAvatar,
      desc: "亚朵酒店",
      type: "enterprise",
      intro: "传承亚朵“温暖、人文、邻里”的企业文化，我们不仅仅提供住宿，更致力于打造旅途中的精神休憩空间。以标准化的极致服务，为您呈现触手可及的温暖与关怀。"
    },
    { 
      name: "交通调度", 
      role: "交通", 
      services: ["接机", "包车"],
      color: "blue", 
      avatar: CarAvatar,
      desc: "小车小团",
      type: "enterprise",
      intro: "严格遵循企业级安全运营标准，我们的车队代表着行业标杆。以准时、专业、规范的服务流程，为您每一次的出行保驾护航，传递安全至上的企业价值观。"
    },
    {
      name: "金牌地陪",
      role: "地陪",
      services: ["包车", "定制"],
      color: "teal", 
      avatar: GuideAvatar,
      desc: "地陪小张",
      type: "personal",
      intro: "我是主理人小张，一个不爱走寻常路的贵州土著。拒绝千篇一律的打卡，我将用我的私人视角，带您深入那些只有本地人才知道的隐秘角落，体验最纯粹的在地生活。"
    },
    {
      name: "美食店长",
      role: "餐饮",
      services: ["排队", "点餐"],
      color: "orange", 
      avatar: WangAyiAvatar,
      desc: "王阿姨辣子鸡",
      type: "personal",
      intro: "我是王阿姨，这家店就是我的名片。三十年来，我坚持亲自选材、亲自掌勺，只为了守住记忆中的老味道。在这里，您吃到的每一口辣子鸡，都是我个人品牌的信誉保证。"
    },
    {
      name: "美食店长",
      role: "餐饮",
      services: ["排队", "点餐"],
      color: "orange", 
      avatar: LiuDaGeAvatar,
      desc: "刘大哥烤鱼",
      type: "personal",
      intro: "我是老刘，烤鱼不仅是我的生意，更是我的作品。从选鱼到炭火的把控，我都亲力亲为。欢迎来到我的美食江湖，感受我对烧烤艺术的独特理解与执着追求。"
    },
    {
      name: "展馆讲解",
      role: "展馆",
      services: ["预约", "讲解"],
      color: "purple", 
      avatar: MuseumAvatar,
      desc: "贵州省博物馆",
      type: "enterprise",
      intro: "肩负着守护与传承贵州历史文化的重任，作为官方智能讲解员，我将带您穿越时光长河，感受每一件文物背后的文明脉动，弘扬中华优秀传统文化。"
    }
  ];

  useEffect(() => {
    // Show current agent
    setDisplayedAgents([allAgents[currentIndex]]);
  }, [currentIndex]);

  const handleRefresh = (e) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev + 1) % allAgents.length);
    setRefreshKey(prev => prev + 1);
  };


  return (
  <div className="bg-white rounded-[2rem] p-4 shadow-lg border border-slate-100 h-full flex flex-col overflow-hidden">
    <div className="flex items-center justify-between mb-2 px-1 shrink-0">
      <div className="flex items-center gap-1">
        <div className="w-5 h-5 rounded-full bg-cyan-100 flex items-center justify-center">
          <MapPin size={10} className="text-cyan-600" />
        </div>
        <h3 className="text-xs font-bold text-slate-800">为您推荐</h3>
      </div>
      <button onClick={handleRefresh} className="flex items-center gap-0.5 text-[9px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-full hover:bg-slate-100 transition-colors whitespace-nowrap">
        <RefreshCcw size={8} />
        换
      </button>
    </div>
    
    <div className="flex-1 flex items-center justify-center px-1">
      <AnimatePresence mode="wait">
        <motion.div
          key={refreshKey}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full"
        >
          {displayedAgents.map((agent, i) => (
            <div 
              key={i} 
              className="flex items-center h-full cursor-pointer group relative overflow-visible gap-3"
              onClick={() => handleOpenChat(agent)}
            >
              {/* Large Avatar - Left Side */}
              <div className="w-[120px] h-full relative flex items-center justify-center rounded-xl overflow-hidden shrink-0 py-1">
                 <img 
                    src={agent.avatar} 
                    alt={agent.name} 
                    className="w-full h-full object-cover rounded-xl transition-transform group-hover:scale-105 duration-500" 
                    style={{ 
                      objectPosition: agent.objectPosition || 'center top',
                      transform: agent.scale ? `scale(${agent.scale})` : undefined
                    }}
                 />
                 {/* Decorative Overlay Gradient */}
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/10 opacity-80 rounded-xl pointer-events-none" />
              </div>

              {/* Info Section - Right Side */}
              <div className="flex-1 flex flex-col items-start justify-center gap-1.5 relative z-20 h-full py-1">
                 <div className="text-left w-full">
                    <div className="flex items-center gap-2 mb-0.5">
                       <h4 className="font-bold text-slate-800 text-lg truncate leading-tight">{agent.desc}</h4>
                       <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold border whitespace-nowrap ${
                         agent.type === 'enterprise' 
                           ? 'bg-blue-50 text-blue-600 border-blue-100' 
                           : 'bg-orange-50 text-orange-600 border-orange-100'
                       }`}>
                         {agent.type === 'enterprise' ? '企业' : '个人'}
                       </span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium truncate flex items-center gap-1">
                      {agent.name}
                      <span className={`w-1.5 h-1.5 rounded-full bg-${agent.color}-500 inline-block`} />
                    </span>
                 </div>
                 
                 <div className="flex flex-wrap justify-start gap-1.5 w-full">
                    {agent.services.map((tag, idx) => (
                       <span key={idx} className="text-[10px] text-slate-500 bg-slate-50 px-2 py-1 rounded-lg leading-tight border border-slate-100 shadow-sm whitespace-nowrap">
                          {tag}
                       </span>
                    ))}
                 </div>
                 
                 <div className="mt-auto w-full pt-1">
                    <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                      {agent.intro || `我是您的专属${agent.role}助手，随时为您提供专业的服务与建议。`}
                    </p>
                  </div>
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>

    {/* Footer Link */}
    <div className="mt-2 pt-2 border-t border-slate-50 shrink-0">
      <button className="w-full py-1.5 rounded-xl bg-gradient-to-r from-slate-50 to-white border border-slate-100 hover:border-cyan-100 hover:from-cyan-50 hover:to-white flex items-center justify-center gap-1 group transition-all duration-300 shadow-sm active:scale-95">
        <span className="text-[10px] font-bold text-slate-500 group-hover:text-cyan-600 transition-colors">前往智能体广场</span>
        <ArrowRight size={10} className="text-slate-300 group-hover:text-cyan-500 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  </div>
  );
};

const PromoCarouselWidget = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const promos = [
    { 
      title: "亚朵酒店·早餐券", 
      desc: "住客专享 ¥38", 
      image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=800&auto=format&fit=crop",
      tag: "限时抢"
    },
    { 
      title: "老凯里·酸汤鱼", 
      desc: "100元代金券", 
      image: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?q=80&w=800&auto=format&fit=crop",
      tag: "8.5折"
    },
    { 
      title: "黄果树·VIP通道", 
      desc: "免排队入园", 
      image: "https://images.unsplash.com/photo-1433838552652-f9a46b332c40?q=80&w=800&auto=format&fit=crop",
      tag: "热门"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promos.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white rounded-[2rem] p-3 shadow-lg border border-slate-100 h-full flex flex-col relative overflow-hidden">
       <div className="flex items-center justify-between mb-1.5 px-1 relative z-10 shrink-0">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1">
             <Sparkles size={10} className="text-yellow-500" />
             特惠服务
          </h3>
       </div>
       
       <div className="flex-1 relative rounded-xl overflow-hidden min-h-0 group cursor-pointer">
          <AnimatePresence mode="wait">
             <motion.div
               key={currentIndex}
               initial={{ opacity: 0, scale: 1.1 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 0.5 }}
               className="absolute inset-0"
             >
                <img 
                  src={promos[currentIndex].image} 
                  alt={promos[currentIndex].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                   <div className="flex items-start justify-between mb-0.5">
                      <h4 className="font-bold text-xs leading-tight shadow-sm">{promos[currentIndex].title}</h4>
                      <span className="text-[8px] font-bold bg-yellow-500 text-yellow-950 px-1.5 py-0.5 rounded-full shadow-sm whitespace-nowrap shrink-0">
                        {promos[currentIndex].tag}
                      </span>
                   </div>
                   <p className="text-[9px] opacity-90 font-medium text-slate-200">{promos[currentIndex].desc}</p>
                </div>
             </motion.div>
          </AnimatePresence>
          
          {/* Indicators */}
          <div className="absolute top-2 right-2 flex gap-0.5 z-10">
             {promos.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-1 h-1 rounded-full transition-all shadow-sm ${i === currentIndex ? 'bg-white w-2.5' : 'bg-white/40'}`} 
                />
             ))}
          </div>
       </div>
    </div>
  );
};

const AgentCategoryCard = ({ title, subtitle, icon: Icon, image, index, onClick }) => {
  // Different shapes for masonry feel
  const shapes = [
    'rounded-tr-[3rem] rounded-bl-[2rem] rounded-tl-2xl rounded-br-xl', 
    'rounded-tl-[3rem] rounded-br-[2rem] rounded-tr-2xl rounded-bl-xl',
    'rounded-br-[3rem] rounded-tl-[2rem] rounded-tr-xl rounded-bl-2xl',
    'rounded-bl-[3rem] rounded-tr-[2rem] rounded-tl-xl rounded-br-2xl'
  ];
  
  const heightClass = index % 2 === 0 ? 'h-56' : 'h-48';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`relative overflow-hidden break-inside-avoid mb-4 flex flex-col justify-end group cursor-pointer shadow-sm transition-shadow ${shapes[index % 4]} ${heightClass}`}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>
      
      <div className="relative z-10 p-5 text-white">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
            <Icon size={14} />
          </div>
          <span className="text-[10px] font-medium bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/30">
            {index + 12} Agents
          </span>
        </div>
        <h4 className="text-lg font-bold leading-tight mb-0.5">{title}</h4>
        <p className="text-[10px] text-white/80 line-clamp-1">{subtitle}</p>
      </div>
    </motion.div>
  );
};

export default Home;
