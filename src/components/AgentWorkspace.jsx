import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, MoreHorizontal, Battery, Signal, Wifi, 
  Check, AlertTriangle, User, MapPin, ChevronRight, 
  Store, Calendar, MessageSquare, Phone, ShieldCheck, 
  Home, Bell, Clock, CheckCircle, XCircle, Zap,
  TrendingUp, Users, Activity
} from 'lucide-react';

const AgentWorkspace = ({ agent, data, chatHistory, onClose, onFeedback, onMerchantReply, isHumanMode, onToggleHumanMode }) => {
  const [activeRequest, setActiveRequest] = useState(null);
  const [aiInsight, setAiInsight] = useState(null);
  const [processingState, setProcessingState] = useState('idle'); // idle, analyzing, ready, completed
  const hasInitialized = useRef(false);
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, messages
  // const [isHumanMode, setIsHumanMode] = useState(false); // Managed by parent
  const [merchantInput, setMerchantInput] = useState('');
  const chatScrollRef = useRef(null);

  // Auto scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
        chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatHistory, activeTab]);

  const hasUnread = chatHistory && chatHistory.length > 0;

  // Initialize incoming request
  useEffect(() => {
    if (hasInitialized.current) return;
    if (data) {
        hasInitialized.current = true;
        // Switch to dashboard if data comes in
        setActiveTab('dashboard');
    // ... rest of initialization
      // Simulate receiving a request from Huang Xiaoxi
      setTimeout(() => {
        setActiveRequest({
          id: Date.now(),
          source: '黄小西智能体',
          userType: '游客',
          priority: 'high',
          content: data,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        
        // Start AI Analysis
        setProcessingState('analyzing');
        analyzeRequest(data);
      }, 600);
    }
  }, [data]);

  const analyzeRequest = (requestData) => {
    setTimeout(() => {
      let insight = {
        type: 'success',
        title: '资源充足',
        description: '当前请求的服务资源充足，可直接接单。',
        actionSuggestion: '立即接单'
      };

      // Mock AI Logic based on context
      if (agent?.name?.includes('景区') || agent?.services?.includes('购票')) {
         // Simulate inventory check
         insight = {
            type: 'warning',
            title: '库存预警',
            description: 'AI检测：当前时段门票库存仅剩 5%。',
            actionSuggestion: '推荐下午场次'
         };
      } else if (agent?.name?.includes('酒店') || requestData?.['房型']) {
         insight = {
            type: 'danger',
            title: '房源紧张',
            description: 'AI检测：用户请求的“海景房”今日已满房。',
            actionSuggestion: '推荐山景房+赠送早餐'
         };
      }

      setAiInsight(insight);
      setProcessingState('ready');
    }, 2000);
  };

  const handleAction = (action) => {
    setProcessingState('completed');
    
    // Notify the main app (Huang Xiaoxi) of the result
    if (onFeedback) {
        let feedbackText = '';
        if (action === 'accept') {
            feedbackText = `【${agent?.name}】已接单。我们将尽快为您安排服务，请留意短信通知。`;
        } else if (action === 'ai_suggest') {
            feedbackText = `【${agent?.name}】反馈：${aiInsight?.actionSuggestion || '建议调整行程'}。`;
        } else {
            feedbackText = `【${agent?.name}】暂时无法接单，建议更换其他服务商。`;
        }
        
        onFeedback({
            agentName: agent?.name,
            action: action,
            text: feedbackText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
    }
  };

  const handleSendReply = () => {
    if (!merchantInput.trim()) return;
    if (onMerchantReply) {
        onMerchantReply(merchantInput);
    }
    setMerchantInput('');
  };

  // Helper to generate dynamic history items based on agent type
  const getHistoryItems = () => {
      const type = agent?.name?.includes('交通') || agent?.services?.includes('接机') ? 'transport' :
                   agent?.name?.includes('酒店') || agent?.services?.includes('订房') ? 'hotel' :
                   agent?.name?.includes('餐饮') || agent?.services?.includes('点餐') ? 'food' : 'scenic';
      
      const items = [];
      for (let i = 1; i <= 3; i++) {
          if (type === 'transport') {
              items.push({ title: '专车接送 - 机场', time: `10:${10+i} AM`, price: '¥158.00' });
          } else if (type === 'hotel') {
              items.push({ title: '大床房 - 2晚', time: `09:${20+i} AM`, price: '¥899.00' });
          } else if (type === 'food') {
              items.push({ title: '订座 - 4人桌', time: `11:${30+i} AM`, price: '¥260.00' });
          } else {
              items.push({ title: '门票预订 - 2张', time: `10:${40+i} AM`, price: '¥128.00' });
          }
      }
      return items;
  };

  const historyItems = getHistoryItems();

  return (
    <div className="w-full h-full bg-slate-50 flex flex-col relative overflow-hidden font-sans">
      {/* Status Bar */}
      <div className="px-6 py-3 flex justify-between items-center text-xs font-bold z-20 text-slate-800">
        <span>9:41</span>
        <div className="flex gap-1.5">
          <Signal size={12} />
          <Wifi size={12} />
          <Battery size={12} />
        </div>
      </div>

      {/* B-Side Header */}
      <div className="bg-white px-4 py-3 shadow-sm z-10 border-b border-slate-100">
        <div className="flex items-center justify-between mb-4">
           <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-slate-50 text-slate-600">
              <ArrowLeft size={20} />
           </button>
           <span className="font-bold text-slate-800">商家工作台</span>
           <div className="flex items-center gap-3">
               <button 
                 onClick={() => setActiveTab('messages')}
                 className={`relative p-2 rounded-full transition-colors ${activeTab === 'messages' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-500'}`}
               >
                  <MessageSquare size={20} />
                  {hasUnread && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                  )}
               </button>
               <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 relative">
                  <Bell size={16} />
                  <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
               </div>
           </div>
        </div>
        
        {/* Merchant Profile Mini */}
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md border-2 border-white">
                <Store size={20} />
            </div>
            <div>
                <h2 className="text-sm font-bold text-slate-800">{agent?.name || "商家服务终端"}</h2>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                    <div className={`w-1.5 h-1.5 rounded-full ${isHumanMode ? 'bg-orange-500' : 'bg-green-500'}`}></div>
                    <span>{isHumanMode ? '人工介入中' : 'AI自动接单中'}</span>
                </div>
            </div>
        </div>
      </div>

      {activeTab === 'messages' ? (
        <div className="flex-1 flex flex-col bg-slate-50">
            {/* Chat Header / Mode Switch */}
            <div className="bg-white p-3 border-b border-slate-100 flex justify-between items-center shadow-sm z-10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center border border-white shadow-sm">
                        <User size={16} className="text-cyan-600" />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-slate-800">当前访客</div>
                        <div className="text-[10px] text-slate-400">来自: 黄小西智能体</div>
                    </div>
                </div>
                <button 
                    onClick={onToggleHumanMode}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all flex items-center gap-1 ${
                        isHumanMode 
                        ? 'bg-orange-50 text-orange-600 border-orange-200 shadow-sm' 
                        : 'bg-white text-slate-500 border-slate-200'
                    }`}
                >
                    {isHumanMode ? '退出人工' : '人工介入'}
                </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={chatScrollRef}>
                {chatHistory && chatHistory.map((msg, idx) => (
                    msg.isSuggestion ? (
                        <div key={idx} className="flex gap-3">
                             <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center shrink-0 border border-white shadow-sm">
                                 <Zap size={14} className="text-yellow-600" />
                             </div>
                             <div className="max-w-[80%] p-3 rounded-xl text-xs leading-relaxed shadow-sm bg-yellow-50 text-slate-600 border border-yellow-100 rounded-tl-none italic">
                                 <span className="block text-[9px] text-yellow-600 font-bold mb-1 flex items-center gap-1">
                                     <Zap size={10} /> AI 智能提醒
                                 </span>
                                 {msg.text}
                                 <button 
                                    onClick={() => setMerchantInput(msg.text)} 
                                    className="mt-2 text-[10px] bg-white border border-yellow-200 text-yellow-700 px-2 py-1 rounded-full shadow-sm hover:bg-yellow-50 flex items-center gap-1 transition-colors"
                                 >
                                    <Check size={10} /> 采纳回复
                                 </button>
                             </div>
                        </div>
                    ) : (
                    <div key={idx} className={`flex gap-3 ${msg.sender === 'merchant' ? 'flex-row-reverse' : ''}`}>
                        {msg.sender !== 'merchant' && (
                            <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center shrink-0 border border-white shadow-sm">
                                {msg.sender === 'agent' ? <Zap size={14} className="text-cyan-600" /> : <User size={14} className="text-cyan-600" />}
                            </div>
                        )}
                        <div className={`max-w-[80%] p-3 rounded-xl text-xs leading-relaxed shadow-sm ${
                            msg.sender === 'merchant' 
                                ? 'bg-blue-600 text-white rounded-tr-none' 
                                : msg.sender === 'agent'
                                    ? 'bg-white text-slate-600 border border-slate-100 rounded-tl-none italic'
                                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                        }`}>
                            {msg.sender === 'agent' && <span className="block text-[9px] text-cyan-500 font-bold mb-1">AI 自动回复</span>}
                            {msg.text}
                        </div>
                    </div>
                    )
                ))}
                {(!chatHistory || chatHistory.length === 0) && (
                    <div className="text-center py-10 text-slate-400 text-xs">
                        暂无对话记录
                    </div>
                )}
            </div>

            {/* Input Area (Only in Human Mode) */}
            <AnimatePresence>
                {isHumanMode && (
                    <motion.div 
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        className="p-3 bg-white border-t border-slate-100 flex gap-2 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
                    >
                        <input 
                            type="text" 
                            value={merchantInput}
                            onChange={(e) => setMerchantInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                            placeholder="输入回复内容..."
                            className="flex-1 bg-slate-100 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 ring-blue-100 transition-all"
                        />
                        <button 
                            onClick={handleSendReply}
                            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-blue-200 active:scale-95 transition-transform"
                        >
                            发送
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      ) : (
      <>
      {/* Dashboard Stats */}
      <div className="grid grid-cols-3 gap-3 p-4">
          <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center">
              <span className="text-xs text-slate-400 font-medium mb-1">待处理</span>
              <span className="text-xl font-extrabold text-blue-600">{activeRequest ? 1 : 0}</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center">
              <span className="text-xs text-slate-400 font-medium mb-1">今日接单</span>
              <span className="text-xl font-extrabold text-slate-700">12</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center">
              <span className="text-xs text-slate-400 font-medium mb-1">服务评分</span>
              <span className="text-xl font-extrabold text-orange-500">4.9</span>
          </div>
      </div>

      {/* Main Content: Request Stream */}
      <div className="flex-1 overflow-y-auto px-4 pb-32 space-y-4">
          <div className="flex items-center gap-2 mb-2">
              <Activity size={14} className="text-blue-500" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">实时请求流</span>
          </div>

          <AnimatePresence>
            {activeRequest ? (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden"
                >
                    {/* Request Header */}
                    <div className="bg-blue-50/50 p-3 flex justify-between items-center border-b border-blue-50">
                        <div className="flex items-center gap-2">
                            <div className="px-2 py-0.5 bg-blue-100 text-blue-600 text-[10px] font-bold rounded-md">
                                来自转发
                            </div>
                            <span className="text-xs font-bold text-slate-700">黄小西</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{activeRequest.timestamp}</span>
                    </div>

                    {/* Request Body */}
                    <div className="p-4">
                        <div className="flex items-start gap-3 mb-4">
                             <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                <User size={20} className="text-slate-400" />
                             </div>
                             <div>
                                 <div className="text-sm font-bold text-slate-800 mb-0.5">{activeRequest.userType}需求单</div>
                                 <div className="text-xs text-slate-500 leading-relaxed">
                                     用户正在咨询相关服务，请尽快响应。
                                 </div>
                             </div>
                        </div>

                        {/* Data Grid */}
                        <div className="bg-slate-50 rounded-xl p-3 mb-4 border border-slate-100">
                             {Object.entries(activeRequest.content || {}).map(([key, value], idx) => (
                                 <div key={idx} className="flex justify-between items-center py-1.5 border-b border-slate-200/50 last:border-0">
                                     <span className="text-xs text-slate-500 font-medium">{key}</span>
                                     <span className="text-xs font-bold text-slate-800">{value}</span>
                                 </div>
                             ))}
                        </div>

                        {/* AI Insight Section */}
                        {processingState === 'analyzing' && (
                            <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 p-3 rounded-xl animate-pulse">
                                <Zap size={14} className="animate-spin" />
                                <span>AI正在分析库存与服务策略...</span>
                            </div>
                        )}

                        {processingState === 'ready' && aiInsight && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className={`p-3 rounded-xl border ${
                                    aiInsight.type === 'danger' ? 'bg-red-50 border-red-100 text-red-800' : 
                                    aiInsight.type === 'warning' ? 'bg-orange-50 border-orange-100 text-orange-800' : 
                                    'bg-green-50 border-green-100 text-green-800'
                                }`}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <Zap size={14} fill="currentColor" />
                                    <span className="font-bold text-xs">AI 智能决策建议</span>
                                </div>
                                <p className="text-xs opacity-90 mb-2">{aiInsight.description}</p>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleAction('ai_suggest')}
                                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1 shadow-sm ${
                                            aiInsight.type === 'danger' ? 'bg-white text-red-600' : 
                                            'bg-white text-green-600'
                                        }`}
                                    >
                                        <MessageSquare size={12} />
                                        {aiInsight.actionSuggestion}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                        
                        {processingState === 'completed' && (
                             <div className="flex flex-col items-center justify-center py-4 text-green-600">
                                 <CheckCircle size={32} className="mb-2" />
                                 <span className="text-sm font-bold">已反馈给黄小西</span>
                                 <span className="text-xs text-green-500/80">游客将收到您的处理结果</span>
                             </div>
                        )}
                    </div>

                    {/* Action Footer */}
                    {processingState === 'ready' && (
                        <div className="p-3 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-3">
                            <button className="py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors">
                                拒绝/忙碌
                            </button>
                            <button 
                                onClick={() => handleAction('accept')}
                                className="py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                            >
                                <Check size={14} />
                                确认接单
                            </button>
                        </div>
                    )}
                </motion.div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                        <Clock size={24} />
                    </div>
                    <span className="text-xs font-medium">暂无新请求</span>
                </div>
            )}
          </AnimatePresence>

          {/* Past History (Dynamic Mock) */}
          <div className="pt-4">
              <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400">最近已处理</span>
                  <span className="text-[10px] text-blue-500 font-bold">查看全部</span>
              </div>
              <div className="space-y-3">
                  {historyItems.map((item, i) => (
                      <div key={i} className="bg-white p-3 rounded-xl border border-slate-100 flex justify-between items-center opacity-60">
                          <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                                  <Check size={14} />
                              </div>
                              <div>
                                  <div className="text-xs font-bold text-slate-700">{item.title}</div>
                                  <div className="text-[10px] text-slate-400">{item.time} · 已完成</div>
                              </div>
                          </div>
                          <span className="text-xs font-bold text-slate-800">{item.price}</span>
                      </div>
                  ))}
              </div>
          </div>
      </div>
      </>
      )}
    </div>
  );
};

export default AgentWorkspace;
