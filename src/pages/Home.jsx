import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, User, ChevronDown, MessageCircle, Star, Coffee, Building, Landmark, Mic, Plus, Home as HomeIcon, Compass, UserCircle, X, Check, Bell, Languages } from 'lucide-react';
import { categories } from '../data/agents';
import TuoSaiImage from '../image/托腮_1.png';

const iconMap = {
  Landmark: Landmark,
  Building: Building,
  Coffee: Coffee,
  User: User,
  Home: HomeIcon
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

const Home = () => {
  const [activeRole, setActiveRole] = useState('黄小西');
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const navigate = useNavigate();

  const roles = ['黄小西', '酒店助手', '景区向导', '美食专家', '政务助手'];

  return (
    <div className="h-full w-full relative">
      <div className="h-full w-full overflow-y-auto scrollbar-hide pb-24">
        <div className="px-6 pt-12 relative z-10">
          {/* Header */}
          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight leading-tight">你好, <br/>旅行者</h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 bg-white rounded-blob-2 shadow-sm border border-white/60 flex items-center justify-center text-slate-500 hover:text-cyan-600 transition-colors">
                 <Languages size={20} />
              </button>
              <div className="w-10 h-10 bg-white rounded-blob-2 shadow-sm border border-white/60 flex items-center justify-center overflow-hidden">
                <MessageCircle size={20} className="text-slate-700" />
              </div>
            </div>
          </header>

          {/* Hero / Chat Section */}
          <section className="mb-10">
            <div className="relative">
              {/* Character Image - Positioned behind content, slightly lower to be covered by container */}
              <div className="absolute -top-12 -right-4 w-32 h-32 pointer-events-none z-0">
                 <img src={TuoSaiImage} alt="Character" className="w-full h-full object-contain" />
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
                    <div className="bg-white rounded-[2rem] p-1.5 pr-1.5 shadow-lg flex items-center gap-2 border border-slate-100">
                      {/* Switch Role Button (Inside Input) */}
                      <div 
                        className="pl-2 pr-2 py-1.5 bg-slate-100 rounded-full flex items-center gap-1 cursor-pointer hover:bg-slate-200 transition-colors shrink-0"
                        onClick={() => setShowRoleSelector(true)}
                      >
                        <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-[10px] text-white font-bold">
                          {activeRole[0]}
                        </div>
                        <ChevronDown size={12} className="text-slate-500" />
                      </div>
  
                      <input 
                        type="text" 
                        placeholder="向 @智能体 提问..." 
                        className="bg-transparent outline-none w-full text-slate-700 placeholder-slate-400 text-xs py-2"
                      />
                      
                      <button className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center shrink-0 hover:scale-105 transition-transform shadow-md">
                        <Mic size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Entity Agents Categories (Masonry Style with Images) */}
          <section className="mb-24">
            <h3 className="text-lg font-bold text-slate-800 mb-4 px-1">服务智能体广场</h3>
            <div className="columns-2 gap-3 space-y-3">
              {Object.values(categories).map((cat, index) => (
                <AgentCategoryCard 
                  key={cat.id}
                  title={cat.name} 
                  subtitle={cat.description}
                  icon={iconMap[cat.icon]} 
                  image={cat.image}
                  index={index}
                  onClick={() => navigate(`/category/${cat.id}`)}
                />
              ))}
            </div>
          </section>
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
