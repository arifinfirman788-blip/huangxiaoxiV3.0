import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Map, ShoppingBag, User, Plus, X, Users, Link, ScanLine, Sparkles, FileText, Image, Upload, Check, Loader2, Plane, Utensils, Bed, Flag, MapPin, Calendar, Clock, ChevronDown, ChevronUp, ArrowLeft, AlertTriangle, Trash2, File } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPlaceholder } from '../utils/imageUtils';

const BottomNav = ({ onAdoptTrip, isAuthenticated, hasTrip }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [guideStep, setGuideStep] = useState(0); // 0: none, 1: click plus, 2: click import, 3: paste link, 4: confirm, 5: finish

  const isActive = (path) => location.pathname === path;

  // Guide Logic
  useEffect(() => {
     if (location.pathname === '/trip' && !hasTrip && guideStep === 0) {
        // Trigger guide when on trip page with no trip
        setGuideStep(1);
     }
  }, [location.pathname, hasTrip, guideStep]);

  // Auth check helper
  const handleNav = (path) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: path } } });
    } else {
      navigate(path);
    }
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
     setIsMenuOpen(!isMenuOpen);
     if (guideStep === 1) setGuideStep(2);
  };

  const handleCreateTrip = () => {
    if (!isAuthenticated) {
        setIsMenuOpen(false);
        navigate('/login', { state: { from: { pathname: '/chat-planning' } } });
        return;
    }
    setIsMenuOpen(false);
    navigate('/chat-planning');
  };

  const handleImportTrip = () => {
    if (!isAuthenticated) {
        setIsMenuOpen(false);
        navigate('/login'); // Modal state is not preserved easily, so just login first
        return;
    }
    setIsMenuOpen(false);
    setIsImportModalOpen(true);
    if (guideStep === 2) setGuideStep(3);
  };

  return (
    <>
      {/* Guide Overlay - Full Screen Mask for Step 1 */}
      <AnimatePresence>
         {guideStep === 1 && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-black/80 z-[35] pointer-events-auto"
               onClick={() => {
                 // Optional: Allow clicking background to skip? Better not for forced guide.
               }}
            />
         )}
      </AnimatePresence>

      {/* Guide Tooltip */}
      <AnimatePresence>
         {guideStep > 0 && (
            <div className="absolute inset-0 z-[60] pointer-events-none">
               {/* Step 1: Point to Plus Button */}
               {guideStep === 1 && (
                  <motion.div 
                     initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                     className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-cyan-500 text-white px-6 py-3 rounded-xl shadow-xl flex flex-col items-center gap-2 pointer-events-auto"
                  >
                     <div className="text-base font-bold flex items-center gap-2">
                       <Sparkles size={18} className="text-yellow-300" />
                       点击这里开启行程
                     </div>
                     <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-cyan-500 absolute -bottom-2" />
                  </motion.div>
               )}
            </div>
         )}
      </AnimatePresence>

      <div className={`absolute bottom-6 left-4 right-4 z-40 transition-all duration-300 ${guideStep === 1 ? 'scale-105' : ''}`}>
        <div className={`backdrop-blur-xl border shadow-2xl rounded-2xl px-2 py-3 flex justify-around items-center relative overflow-hidden ${guideStep === 1 ? 'bg-transparent border-white/20' : 'bg-white/80 border-white/50'}`}>
          
          {/* Inner Overlay for Guide Step 1 to dim other icons */}
          {guideStep === 1 && (
            <div className="absolute inset-0 bg-black/60 z-10" />
          )}

          <NavIcon 
            icon={Home} 
            label="首页" 
            active={isActive('/')} 
            onClick={() => {
              navigate('/');
              setIsMenuOpen(false);
            }} 
            className="relative z-0"
          />
          <NavIcon 
            icon={Map} 
            label="行程" 
            active={isActive('/trip')} 
            onClick={() => handleNav('/trip')} 
            className="relative z-0"
          />
          
          {/* Central Plus Button */}
          <div className="relative z-20">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleMenu}
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(6,182,212,0.4)] border-4 transition-all duration-300 relative ${isMenuOpen ? 'bg-slate-800 text-white border-slate-50' : 'bg-gradient-to-br from-cyan-400 to-blue-500 text-white border-white/20'} ${guideStep === 1 ? 'ring-8 ring-cyan-400/30 animate-pulse scale-110' : ''}`}
              style={{
                boxShadow: isMenuOpen ? '0 10px 25px -5px rgba(15, 23, 42, 0.5)' : '0 10px 25px -5px rgba(6, 182, 212, 0.5), inset 0 2px 5px rgba(255,255,255,0.3)',
              }}
            >
              <motion.div
                animate={{ rotate: isMenuOpen ? 45 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Plus size={28} strokeWidth={2.5} className="drop-shadow-md" />
              </motion.div>
            </motion.button>
          </div>

          <NavIcon 
            icon={ShoppingBag} 
            label="优选" 
            active={isActive('/shop')} 
            onClick={() => {
              navigate('/shop');
              setIsMenuOpen(false);
            }} 
            className="relative z-0"
          />
          <NavIcon 
            icon={User} 
            label="我的" 
            active={isActive('/profile')} 
            onClick={() => handleNav('/profile')} 
            className="relative z-0"
          />
        </div>
      </div>

      {/* Full Screen Overlay Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 z-30 flex flex-col justify-end pb-32 px-6 backdrop-blur-md ${guideStep === 2 ? 'bg-slate-900/90' : 'bg-slate-900/60'}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
               {/* Guide Step 2 Overlay */}
               {guideStep === 2 && (
                  <motion.div 
                     initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                     className="absolute bottom-[100px] left-10 z-[70] bg-white text-slate-900 px-4 py-2 rounded-xl shadow-lg font-bold text-sm flex items-center gap-2"
                  >
                     <ArrowLeft className="rotate-180 text-cyan-500" size={16} /> 第二步：选择导入行程
                  </motion.div>
               )}

              <MenuOption 
                title="创建新行程" 
                subtitle="召唤智能行程规划师，为您定制规划"
                icon={Sparkles}
                gradient="bg-gradient-to-r from-violet-500 to-fuchsia-600"
                textColor="text-white"
                subtitleColor="text-white/80"
                delay={0.1}
                onClick={handleCreateTrip}
                disabled={guideStep === 2}
              />
              <MenuOption 
                title="智能导入地点/行程" 
                subtitle="粘贴链接、文本、上传图片进行识别"
                icon={Link}
                delay={0.2}
                onClick={handleImportTrip}
                isHighlight={guideStep === 2}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ImportModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
        guideStep={guideStep}
        setGuideStep={setGuideStep}
        onConfirm={(data) => {
          setIsImportModalOpen(false);
          setGuideStep(5); // Finish
          setTimeout(() => setGuideStep(0), 3000); // Auto hide finish msg
          // Adopt trip immediately
          if (onAdoptTrip) {
            onAdoptTrip(data);
          }
          // Navigate to Trip page to show the result
          navigate('/trip');
        }}
      />
      
      {/* Finish Guide Message */}
      <AnimatePresence>
         {guideStep === 5 && (
            <motion.div
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0 }}
               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-2xl shadow-2xl z-[80] text-center w-[80%]"
            >
               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles size={32} className="text-green-500" />
               </div>
               <h3 className="text-xl font-bold text-slate-800 mb-2">太棒了！</h3>
               <p className="text-slate-500 text-sm">您的行程已成功导入，黄小西已为您准备好所有服务，旅途愉快！</p>
            </motion.div>
         )}
      </AnimatePresence>
    </>
  );
};

const ImportModal = ({ isOpen, onClose, onConfirm, guideStep, setGuideStep }) => {
  const [inputText, setInputText] = useState('');
  const [files, setFiles] = useState([]);
  const [isParsing, setIsParsing] = useState(false);
  const [step, setStep] = useState('input'); // input, resolving, result
  const [parsedResult, setParsedResult] = useState(null);
  const [conflicts, setConflicts] = useState([]);
  const [missingInfo, setMissingInfo] = useState([]);
  const [activeDay, setActiveDay] = useState(1);

  // Guide Step 3: Auto-fill for demo
  useEffect(() => {
     if (isOpen && guideStep === 3) {
        const timer = setTimeout(() => {
           setInputText("我在小红书发现了一个超棒的贵州攻略！\n【两天一夜】黄果树瀑布保姆级攻略！\nDay1: 上午直奔大瀑布，下午去天星桥，住景区附近。\nDay2: 睡个懒觉去青岩古镇吃猪蹄，下午送机回家~");
           setFiles([
             { name: '机票行程单.pdf', type: 'pdf', size: '245 KB' },
             { name: '酒店预订确认.jpg', type: 'image', size: '1.2 MB' }
           ]);
        }, 1000);
        return () => clearTimeout(timer);
     }
  }, [isOpen, guideStep]);

  const handleParse = () => {
    if (!inputText && files.length === 0) return;
    
    setIsParsing(true);
    // Simulate parsing delay
    setTimeout(() => {
      setIsParsing(false);
      
      // Mock Conflicts and Missing Info
      const mockConflicts = [
        {
          id: 'c1',
          title: '住宿地点冲突',
          desc: 'Day 1 晚上的住宿地点识别到冲突信息',
          options: [
            { id: 'o1', label: '攻略提取', value: '黄果树景区附近客栈', source: 'text' },
            { id: 'o2', label: '预订确认单', value: '贵阳希尔顿酒店', source: 'file' }
          ],
          selected: null
        }
      ];

      const mockMissing = [
        {
          id: 'm1',
          title: 'Day 1 晚餐缺失',
          desc: '未识别到 Day 1 晚餐安排',
          placeholder: '请输入餐厅名称或“自理”',
          value: ''
        }
      ];

      setConflicts(mockConflicts);
      setMissingInfo(mockMissing);
      setStep('resolving');
      
      if (guideStep === 3) setGuideStep(4);
    }, 1500);
  };

  const handleResolve = () => {
    // Generate final result based on resolution
    const accommodation = conflicts[0]?.selected === 'o2' ? '贵阳希尔顿酒店' : '黄果树景区附近客栈';
    
    setParsedResult({
        title: "识别到的行程：黄果树瀑布2日游",
        days: 2,
        date: "05.01-05.02",
        rating: "9.8",
        distance: "120km",
        status: "upcoming",
        image: getPlaceholder(800, 400, 'Imported Trip'),
        itinerary: [
          {
            date: "05.01",
            dayLabel: "Day 1",
            tag: "自然奇观",
            weather: { temp: "20°C", desc: "晴" }, 
            highlights: "黄果树瀑布 — 陡坡塘 — 天星桥",
            tips: "建议穿着舒适的运动鞋，注意防晒。",
            timeline: [
              {
                id: 'p-1',
                time: '09:00',
                title: '黄果树大瀑布',
                type: 'scenic',
                status: 'planned',
                image: getPlaceholder(400, 300, 'Waterfall'),
                details: { name: '黄果树大瀑布', desc: '亚洲第一大瀑布' }
              },
              {
                id: 'p-2',
                time: '14:00',
                title: '天星桥景区',
                type: 'scenic',
                status: 'planned',
                image: getPlaceholder(400, 300, 'Scenic Spot'),
                details: { name: '天星桥', desc: '风刀水剑刻就的万倾盆景' }
              },
              {
                id: 'p-stay',
                time: '20:00',
                title: '入住酒店',
                type: 'hotel',
                status: 'planned',
                details: { name: accommodation, desc: '已确认入住' }
              }
            ]
          },
          {
            date: "05.02",
            dayLabel: "Day 2",
            tag: "返程",
            weather: { temp: "22°C", desc: "多云" },
            highlights: "青岩古镇 — 送机",
            tips: "预留充足时间前往机场。",
            timeline: [
              {
                id: 'p-3',
                time: '10:00',
                title: '青岩古镇',
                type: 'scenic',
                status: 'planned',
                image: getPlaceholder(400, 300, 'Ancient Town'),
                details: { name: '青岩古镇', desc: '四大古镇之一' }
              },
              {
                id: 'p-4',
                time: '15:00',
                title: '送机服务',
                type: 'transport',
                status: 'planned',
                details: { name: '前往机场', desc: '结束愉快旅程' }
              }
            ]
          }
        ]
      });
      setStep('result');
  };

  const resetModal = () => {
    setParsedResult(null);
    setStep('input');
    setInputText('');
    setFiles([]);
    setConflicts([]);
    setMissingInfo([]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute inset-0 z-50 pointer-events-none flex flex-col justify-end">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
            onClick={onClose}
          />
          
          {/* Modal Content - Mobile Bottom Sheet Style */}
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.2 }}
            onDragEnd={(e, { offset, velocity }) => {
              if (offset.y > 100 || velocity.y > 500) {
                onClose();
              }
            }}
            className={`bg-white w-full rounded-t-[2rem] pointer-events-auto relative overflow-hidden flex flex-col transition-all duration-500 ease-in-out shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)] z-50 ${step !== 'input' ? 'h-[85vh]' : 'h-auto pb-8'}`}
          >
            {/* Drag Handle */}
            <div className="w-full flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing bg-white z-10" onClick={(e) => e.stopPropagation()}>
               <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
            </div>

            {step === 'input' && (
              <div className="p-6 pt-2 pb-10">
                <h2 className="text-xl font-bold text-slate-800 mb-2">智能导入行程</h2>
                <p className="text-xs text-slate-500 mb-6">支持粘贴文本/链接，或上传图片/文件，黄小西将为您自动整合规划</p>
                
                {/* Content Area */}
                <div className="space-y-4 mb-6">
                    {/* Text Area */}
                    <div className="relative">
                        <textarea 
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          placeholder="在此粘贴您的行程文本、攻略链接、笔记内容..."
                          className="w-full h-32 bg-slate-50 rounded-2xl p-4 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 resize-none border border-slate-100"
                        />
                        <div className="absolute bottom-3 right-3 text-slate-400">
                           <FileText size={16} />
                        </div>
                    </div>

                    {/* File List */}
                    {files.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
                            {files.map((file, i) => (
                                <div key={i} className="flex-shrink-0 bg-blue-50 border border-blue-100 rounded-xl p-2 pr-3 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-blue-500">
                                        {file.type === 'image' ? <Image size={16} /> : <File size={16} />}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-700 line-clamp-1 max-w-[100px]">{file.name}</p>
                                        <p className="text-[10px] text-slate-400">{file.size}</p>
                                    </div>
                                    <button onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="text-slate-400 hover:text-red-500">
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Upload Area */}
                    <div className="w-full h-24 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50 gap-2 text-slate-400 active:bg-slate-100 transition-colors cursor-pointer"
                         onClick={() => {
                             // Simulate file upload
                             const newFile = Math.random() > 0.5 
                                ? { name: `IMG_${Math.floor(Math.random()*1000)}.jpg`, type: 'image', size: '1.2 MB' }
                                : { name: `行程单_${Math.floor(Math.random()*1000)}.pdf`, type: 'pdf', size: '500 KB' };
                             setFiles([...files, newFile]);
                         }}
                    >
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <Upload size={16} />
                        点击或拖拽上传多模态文件
                      </div>
                      <p className="text-[10px]">支持图片、PDF、Word、聊天记录截图等</p>
                    </div>
                </div>

                {/* Action Button */}
                <button 
                  onClick={handleParse}
                  disabled={isParsing || (!inputText && files.length === 0)}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isParsing ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> 正在智能识别多模态信息...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} className="text-yellow-400" /> 开始识别与整合
                    </>
                  )}
                </button>
              </div>
            )}

            {step === 'resolving' && (
              <div className="flex flex-col h-full">
                 <div className="p-6 pb-2">
                    <h2 className="text-xl font-bold text-slate-800 mb-1">需您确认的信息</h2>
                    <p className="text-xs text-slate-500">识别到部分信息冲突或缺失，请确认以生成完美行程</p>
                 </div>
                 
                 <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                    {/* Conflicts */}
                    {conflicts.map((conflict, idx) => (
                        <div key={conflict.id} className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                           <div className="flex items-start gap-3 mb-3">
                              <div className="bg-orange-100 p-2 rounded-full text-orange-500 mt-0.5">
                                 <AlertTriangle size={18} />
                              </div>
                              <div>
                                 <h3 className="font-bold text-slate-800 text-sm">{conflict.title}</h3>
                                 <p className="text-xs text-slate-500">{conflict.desc}</p>
                              </div>
                           </div>
                           <div className="space-y-2 pl-11">
                              {conflict.options.map(option => (
                                 <div 
                                    key={option.id}
                                    onClick={() => {
                                       const newConflicts = [...conflicts];
                                       newConflicts[idx].selected = option.id;
                                       setConflicts(newConflicts);
                                    }}
                                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${conflict.selected === option.id ? 'bg-white border-orange-500 shadow-sm' : 'bg-white/50 border-transparent hover:bg-white'}`}
                                 >
                                    <div>
                                       <p className="text-xs font-bold text-slate-800">{option.value}</p>
                                       <p className="text-[10px] text-slate-400">来源: {option.source === 'text' ? '文本攻略' : '上传文件'}</p>
                                    </div>
                                    {conflict.selected === option.id && <Check size={16} className="text-orange-500" />}
                                 </div>
                              ))}
                           </div>
                        </div>
                    ))}

                    {/* Missing Info */}
                    {missingInfo.map((missing, idx) => (
                        <div key={missing.id} className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                           <div className="flex items-start gap-3 mb-3">
                              <div className="bg-blue-100 p-2 rounded-full text-blue-500 mt-0.5">
                                 <Sparkles size={18} />
                              </div>
                              <div>
                                 <h3 className="font-bold text-slate-800 text-sm">{missing.title}</h3>
                                 <p className="text-xs text-slate-500">{missing.desc}</p>
                              </div>
                           </div>
                           <div className="pl-11">
                              <input 
                                 type="text" 
                                 placeholder={missing.placeholder}
                                 value={missing.value}
                                 onChange={(e) => {
                                    const newMissing = [...missingInfo];
                                    newMissing[idx].value = e.target.value;
                                    setMissingInfo(newMissing);
                                 }}
                                 className="w-full bg-white border border-blue-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                              />
                           </div>
                        </div>
                    ))}
                 </div>

                 <div className="p-6 pt-4 border-t border-slate-100 bg-white">
                  <button 
                    onClick={handleResolve}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
                  >
                    确认并生成最终行程
                  </button>
                </div>
              </div>
            )}

            {step === 'result' && parsedResult && (
              <div className="flex flex-col h-full">
                {/* Result Header */}
                <div className="p-6 pb-0">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-800">确认行程信息</h2>
                    <button onClick={resetModal} className="text-xs text-slate-400 font-bold">重新识别</button>
                  </div>
                  
                  <div className="mb-4">
                    <input 
                      type="text" 
                      value={parsedResult.title}
                      onChange={(e) => setParsedResult({...parsedResult, title: e.target.value})}
                      className="w-full bg-slate-50 p-3 rounded-xl text-lg font-bold text-slate-800 border-none focus:ring-2 focus:ring-cyan-500/20"
                    />
                  </div>

                  {/* Days Tabs */}
                  <div className="flex border-b border-slate-100 mb-4">
                    {parsedResult.itinerary.map((day, idx) => {
                      const dayNum = idx + 1;
                      return (
                        <button
                          key={dayNum}
                          onClick={() => setActiveDay(dayNum)}
                          className={`flex-1 py-3 text-sm font-bold transition-colors relative ${activeDay === dayNum ? 'text-cyan-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                          DAY {dayNum}
                          {activeDay === dayNum && (
                            <motion.div 
                              layoutId="activeDayTab"
                              className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Detailed Itinerary List */}
                <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
                  {parsedResult.itinerary.map((day, idx) => (
                    activeDay === idx + 1 && (
                      <div key={idx} className="space-y-6 relative">
                         {/* Day Info */}
                         <div className="flex items-center gap-2 mb-4">
                           <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{day.date}</span>
                           <span className="text-xs font-bold text-slate-500">{day.tag}</span>
                           <div className="flex items-center gap-1 ml-auto text-xs text-slate-500">
                             <span>{day.weather.desc}</span>
                             <span>{day.weather.temp}</span>
                           </div>
                         </div>

                        <div className="absolute top-8 bottom-0 left-[7px] w-0.5 bg-slate-100" />
                        {day.timeline.map((item) => (
                          <TimelineItem 
                            key={item.id}
                            time={item.time}
                            icon={
                              item.type === 'flight' || item.type === 'transport' ? <Plane size={14} className="text-white" /> :
                              item.type === 'food' ? <Utensils size={14} className="text-white" /> :
                              item.type === 'hotel' ? <Bed size={14} className="text-white" /> :
                              <Flag size={14} className="text-white" />
                            }
                            iconBg={
                              item.type === 'flight' || item.type === 'transport' ? "bg-blue-500" :
                              item.type === 'food' ? "bg-orange-400" :
                              item.type === 'hotel' ? "bg-purple-500" :
                              "bg-green-500"
                            }
                            title={item.title}
                          >
                            <div className="mt-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
                               {item.details.desc || item.details.name}
                               {item.image && (
                                  <div className="mt-2 w-full h-24 rounded-lg overflow-hidden">
                                     <img src={item.image} alt="" className="w-full h-full object-cover" />
                                  </div>
                               )}
                            </div>
                          </TimelineItem>
                        ))}
                      </div>
                    )
                  ))}
                </div>

                {/* Confirm Button */}
                <div className="p-6 pt-4 border-t border-slate-100 bg-white">
                  <button 
                    onClick={() => onConfirm(parsedResult)}
                    className="w-full py-4 bg-green-500 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-200 active:scale-95 transition-transform"
                  >
                    <Check size={16} /> 确认并生成行程
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const TimelineItem = ({ time, icon, iconBg, title, children }) => (
  <div className="relative pl-8">
    <div className={`absolute left-0 top-0 w-4 h-4 rounded-full ${iconBg} flex items-center justify-center shadow-sm z-10`}>
      {icon}
    </div>
    <div className="flex items-center gap-2 mb-1">
      <span className="text-xs font-bold text-slate-800">{time}</span>
      <span className="px-1.5 py-0.5 bg-cyan-50 text-cyan-600 text-[10px] font-bold rounded-md">{title}</span>
    </div>
    {children}
  </div>
);

const MenuOption = ({ title, subtitle, icon: Icon, gradient = "bg-white", textColor = "text-slate-800", subtitleColor = "text-slate-500", delay, onClick, isHighlight, disabled }) => (
  <motion.button
    initial={{ y: 50, opacity: 0, scale: 0.9 }}
    animate={{ y: 0, opacity: 1, scale: 1 }}
    exit={{ y: 50, opacity: 0, scale: 0.9 }}
    transition={{ delay, type: "spring", stiffness: 300, damping: 25 }}
    whileTap={{ scale: disabled ? 1 : 0.98 }}
    onClick={!disabled ? onClick : undefined}
    className={`w-full p-5 rounded-3xl shadow-lg text-left flex items-center justify-between ${gradient} ${isHighlight ? 'ring-4 ring-cyan-400/50 animate-pulse relative z-50' : ''} ${disabled ? 'opacity-30 grayscale cursor-not-allowed' : ''}`}
  >
    <div>
      <h3 className={`text-lg font-bold mb-1 ${textColor}`}>{title}</h3>
      <p className={`text-xs ${subtitleColor}`}>{subtitle}</p>
    </div>
    {Icon && (
      <div className={`p-2 rounded-full ${textColor === 'text-white' ? 'bg-white/20' : 'bg-slate-100'}`}>
        <Icon size={24} className={textColor === 'text-white' ? 'text-white' : 'text-slate-600'} />
      </div>
    )}
  </motion.button>
);

const NavIcon = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-16 gap-1 transition-all duration-300 ${active ? 'text-cyan-600 scale-105' : 'text-slate-400 hover:text-slate-600'}`}
  >
    <div className={`p-1.5 rounded-xl transition-colors ${active ? 'bg-cyan-50' : 'bg-transparent'}`}>
      <Icon size={24} strokeWidth={active ? 2.5 : 2} />
    </div>
    <span className={`text-[10px] font-medium ${active ? 'text-cyan-600' : 'text-slate-400'}`}>
      {label}
    </span>
  </button>
);

export default BottomNav;
