import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, User, ChevronDown, MessageCircle, Star, Coffee, Building, Landmark, Mic, Plus, Home as HomeIcon, Compass, UserCircle, X, Check, Bell, Languages, Volume2, ArrowUpRight, Plane, Clock, Sparkles, Camera, Car } from 'lucide-react';
import { categories } from '../data/agents';
import TuoSaiImage from '../image/托腮_1.png';

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

const Home = ({ adoptedTrip, isAuthenticated }) => {
  const [activeRole, setActiveRole] = useState('黄小西');
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const navigate = useNavigate();

  // Navigation wrapper to check auth
  const handleNav = (path) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: path } } });
    } else {
      navigate(path);
    }
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
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
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
                          onClick={() => handleNav('/chat-planning')}
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
                    <div className="bg-white rounded-[2rem] p-3 pr-4 shadow-lg flex items-center gap-2 border border-slate-100 cursor-pointer hover:shadow-xl transition-shadow"
                         onClick={() => handleNav('/chat-planning')}
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
                    </div>
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
            onClick={() => adoptedTrip && handleNav(`/trip/${adoptedTrip.id}`)}
            className="w-full bg-white/80 backdrop-blur-xl rounded-[1.5rem] p-4 mb-8 border border-white shadow-lg shadow-slate-200/50 min-h-[90px] flex flex-col justify-center relative overflow-hidden group cursor-pointer active:scale-98 transition-all"
          >
            {/* Decorative gradient blob */}
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-cyan-100/50 to-blue-100/50 blur-2xl rounded-full opacity-60 pointer-events-none" />

            {adoptedTrip ? (() => {
               // Flatten all timeline nodes from all days
               const allNodes = adoptedTrip.itinerary?.flatMap(day => day.timeline) || [];
               // Find next upcoming node
               const nextNode = allNodes.find(n => n.status === 'upcoming' || n.status === 'planned') || allNodes[0];
               
               return (
                 <>
                   <div className="relative z-10 w-full flex items-center gap-3">
                     {/* Left: Integrated AI Reminder */}
                     <div className="w-24 bg-orange-50/50 rounded-xl p-2 border border-orange-100/50 flex flex-col justify-center gap-1 shrink-0 h-full">
                        <div className="flex items-center gap-1 text-orange-600">
                           <Sparkles size={10} className="shrink-0" />
                           <span className="text-[10px] font-bold">黄小西</span>
                        </div>
                        <p className="text-[9px] text-slate-500 leading-tight line-clamp-2">
                          {getAiReminder(nextNode)}
                        </p>
                     </div>

                     {/* Right: Info */}
                     <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-0.5">
                          <h3 className="text-sm font-bold text-slate-800 line-clamp-1">{nextNode?.title}</h3>
                          <span className="text-[10px] font-bold text-cyan-600 bg-cyan-50/80 px-1.5 py-0.5 rounded-full border border-cyan-100/50 shadow-sm shrink-0">
                            {nextNode?.status === 'upcoming' ? '进行中' : '即将开始'}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-1 mb-1">
                          {nextNode?.type === 'flight' 
                            ? `${nextNode.details.flightNo} ${nextNode.details.status} · 预计${nextNode.details.arrTime}抵达`
                            : nextNode?.details?.name || '点击查看详情'}
                        </p>
                        
                        <div className="flex items-center gap-2">
                           <div className="flex items-center gap-1.5 text-slate-400">
                              {nextNode?.type === 'flight' ? <Plane size={12} /> : <Clock size={12} />}
                              <span className="text-[10px] font-bold">{nextNode?.time}</span>
                           </div>
                        </div>
                     </div>
                   </div>
                 </>
               );
            })() : (
              <div className="relative z-10 w-full">
                <div className="flex justify-between items-center mb-3 px-1">
                   <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                     <Sparkles size={14} className="text-cyan-500" />
                     为你推荐
                   </h3>
                   <span className="text-[10px] text-slate-400">基于您的偏好</span>
                </div>
                
                {/* Proactive Service Cards - Horizontal Scroll */}
                <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-5 px-5 pb-2">
                   {[
                     { 
                       title: "黄果树专属导游", 
                       desc: "带你避开人流，打卡最佳机位", 
                       tag: "景区服务", 
                       color: "text-purple-600", 
                       bg: "bg-purple-50",
                       icon: Camera
                     },
                     { 
                       title: "凯宾斯基·管家", 
                       desc: "今晚入住立享行政酒廊礼遇", 
                       tag: "酒店特惠", 
                       color: "text-indigo-600", 
                       bg: "bg-indigo-50",
                       icon: Building
                     },
                     { 
                       title: "出行调度中心", 
                       desc: "贵阳龙洞堡机场接机服务", 
                       tag: "出行无忧", 
                       color: "text-green-600", 
                       bg: "bg-green-50",
                       icon: Car
                     }
                   ].map((item, i) => {
                     const ItemIcon = item.icon;
                     return (
                       <motion.div
                         key={i}
                         initial={{ opacity: 0, x: 20 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ delay: i * 0.1 }}
                         onClick={() => handleNav('/chat-planning')}
                         className="min-w-[200px] bg-white rounded-xl p-3 border border-slate-100 shadow-sm active:scale-95 transition-transform cursor-pointer"
                       >
                          <div className="flex items-start justify-between mb-2">
                             <div className={`w-8 h-8 rounded-full ${item.bg} flex items-center justify-center`}>
                                <ItemIcon size={14} className={item.color} />
                             </div>
                             <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${item.bg} ${item.color}`}>
                               {item.tag}
                             </span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-800 mb-1">{item.title}</h4>
                          <p className="text-[10px] text-slate-400 leading-tight">{item.desc}</p>
                          <button className="mt-3 w-full py-1.5 rounded-lg bg-slate-900 text-white text-[10px] font-bold">
                             立即查看
                          </button>
                       </motion.div>
                     );
                   })}
                </div>
              </div>
            )}
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
