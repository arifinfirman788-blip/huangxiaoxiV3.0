import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, User, ChevronDown, MessageCircle, Star, Coffee, Building, Landmark, Mic, Plus, Home as HomeIcon, Compass, UserCircle, X, Check, Bell, Languages, Volume2, ArrowUpRight, Plane, Clock, Sparkles, Camera, Car, Play, Calendar as CalendarIcon } from 'lucide-react';
import { categories } from '../data/agents';
import TuoSaiImage from '../image/托腮_1.png';
import FlipCountdown from '../components/FlipCountdown';
import ChatInterface from '../components/ChatInterface';
import { getPlaceholder } from '../utils/imageUtils';

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

const Home = ({ adoptedTrip, isAuthenticated, onUpdateTrip, toggleBottomNav }) => {
  const [activeRole, setActiveRole] = useState('黄小西');
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [tempStartDate, setTempStartDate] = useState('');
  const [forceUpdate, setForceUpdate] = useState(0); // Add forceUpdate state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const navigate = useNavigate();

  // Navigation wrapper to check auth
  const handleNav = (path) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: path } } });
    } else {
      navigate(path);
    }
  };

  const handleOpenChat = () => {
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
            className="w-full mb-8 h-[240px] grid grid-cols-9 gap-3"
          >
            {/* Left: Location-based Agents List (5/9 width) */}
            <div className="col-span-5 h-full">
               <AgentListWidget handleOpenChat={handleOpenChat} />
            </div>

            {/* Right: B-Side Promo Carousel (4/9 width) */}
            <div className="col-span-4 h-full">
               <PromoCarouselWidget />
            </div>
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
              onAdoptTrip={(trip) => {
                 onUpdateTrip(trip);
                 handleCloseChat();
              }}
           />
        )}
      </AnimatePresence>
    </div>
  );
};

const AgentListWidget = ({ handleOpenChat }) => (
  <div className="bg-white rounded-[2rem] p-4 shadow-lg border border-slate-100 h-full flex flex-col overflow-hidden">
    <div className="flex items-center justify-between mb-3 px-1 shrink-0">
      <div className="flex items-center gap-1.5">
        <div className="w-6 h-6 rounded-full bg-cyan-100 flex items-center justify-center">
          <MapPin size={12} className="text-cyan-600" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">附近智能体</h3>
      </div>
      <span className="text-[9px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-full">贵阳</span>
    </div>
    
    <div className="flex-1 overflow-y-auto scrollbar-hide space-y-3 pr-1">
      {[
        { 
          name: "黄果树·小向导", 
          role: "景区", 
          services: ["导览", "购票"],
          color: "purple", 
          avatar: getPlaceholder(100, 100, 'Guide')
        },
        { 
          name: "凯宾斯基·管家", 
          role: "酒店", 
          services: ["预订", "客房"],
          color: "indigo", 
          avatar: getPlaceholder(100, 100, 'Butler')
        },
        { 
          name: "老凯里·店长", 
          role: "餐饮", 
          services: ["排队", "点餐"],
          color: "orange", 
          avatar: getPlaceholder(100, 100, 'Chef')
        },
        { 
          name: "神州专车·调度", 
          role: "交通", 
          services: ["接机", "包车"],
          color: "green", 
          avatar: getPlaceholder(100, 100, 'Driver')
        }
      ].map((agent, i) => (
        <div 
          key={i} 
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 active:scale-95 transition-all cursor-pointer group"
          onClick={handleOpenChat}
        >
          <div className="relative shrink-0">
             <img src={agent.avatar} alt={agent.name} className="w-10 h-10 rounded-full border border-slate-100 object-cover" />
             <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-${agent.color}-100 border border-white flex items-center justify-center`}>
                <Sparkles size={8} className={`text-${agent.color}-600`} />
             </div>
          </div>
          <div className="flex-1 min-w-0">
             <div className="flex items-center gap-1.5 mb-0.5">
                <h4 className="font-bold text-slate-800 text-xs truncate">{agent.name}</h4>
             </div>
             <div className="flex gap-1">
                {agent.services.map((tag, idx) => (
                   <span key={idx} className="text-[9px] text-slate-400 bg-slate-50 px-1 py-0.5 rounded-md leading-none border border-slate-100 group-hover:bg-white group-hover:border-slate-200 transition-colors">
                      {tag}
                   </span>
                ))}
             </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const PromoCarouselWidget = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const promos = [
    { title: "景区联票特惠", desc: "立省 ¥50", color: "bg-orange-500", icon: Ticket },
    { title: "酒店连住礼遇", desc: "行政酒廊", color: "bg-indigo-500", icon: Hotel },
    { title: "特色美食套餐", desc: "8.8折起", color: "bg-red-500", icon: Utensils }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promos.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white rounded-[2rem] p-4 shadow-lg border border-slate-100 h-full flex flex-col relative overflow-hidden">
       <div className="flex items-center justify-between mb-3 px-1 relative z-10">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
             <Sparkles size={12} className="text-yellow-500" />
             特惠服务
          </h3>
       </div>
       
       <div className="flex-1 relative rounded-2xl overflow-hidden">
          <AnimatePresence mode="wait">
             <motion.div
               key={currentIndex}
               initial={{ opacity: 0, scale: 1.1 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 0.5 }}
               className={`absolute inset-0 ${promos[currentIndex].color} flex flex-col items-center justify-center text-white p-4 text-center`}
             >
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-2 backdrop-blur-sm">
                   {React.createElement(promos[currentIndex].icon, { size: 20, className: "text-white" })}
                </div>
                <h4 className="font-bold text-sm mb-1">{promos[currentIndex].title}</h4>
                <p className="text-xs opacity-90 font-medium bg-white/20 px-2 py-0.5 rounded-full">{promos[currentIndex].desc}</p>
             </motion.div>
          </AnimatePresence>
          
          {/* Indicators */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10">
             {promos.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-1 h-1 rounded-full transition-all ${i === currentIndex ? 'bg-white w-3' : 'bg-white/50'}`} 
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
