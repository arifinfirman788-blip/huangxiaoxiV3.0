import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Share, MoreHorizontal, Sun, Cloud, CloudRain, Info, Plane, Train, MapPin, ChevronRight, QrCode, AlertCircle, Clock, CheckCircle2, Utensils, Hotel, Camera, Coffee, Navigation, Phone, FileText, Headphones, Ticket, Car, Sparkles, Plus, Search, Edit3, GripVertical, Map, Calendar, X, List, Layout, Wand2 } from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { getPlaceholder } from '../utils/imageUtils';

const AIPlanningModal = ({ isOpen, onClose, onConfirm }) => {
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('');

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[60] flex items-end sm:items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" onClick={onClose} />
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="bg-white w-full sm:w-[90%] sm:max-w-md sm:rounded-2xl rounded-t-[2rem] p-6 pointer-events-auto relative z-10"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
               <Wand2 size={16} className="text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">AI 智能规划</h3>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 mb-8">
           <p className="text-sm text-slate-500 leading-relaxed">
             请告诉小西您的今日起止点，AI将结合您的已有行程，为您智能规划合理路线。
           </p>
           
           <div className="bg-slate-50 p-4 rounded-xl space-y-3">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                 <input 
                   type="text" 
                   placeholder="今日起点 (如: 酒店名称)" 
                   className="flex-1 bg-transparent text-sm font-bold text-slate-800 placeholder-slate-400 border-none outline-none"
                   value={startPoint}
                   onChange={(e) => setStartPoint(e.target.value)}
                 />
              </div>
              <div className="w-full h-px bg-slate-200 ml-5" />
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                 <input 
                   type="text" 
                   placeholder="今日终点 (如: 机场/下一站)" 
                   className="flex-1 bg-transparent text-sm font-bold text-slate-800 placeholder-slate-400 border-none outline-none"
                   value={endPoint}
                   onChange={(e) => setEndPoint(e.target.value)}
                 />
              </div>
           </div>
        </div>

        <button 
          onClick={() => onConfirm(startPoint, endPoint)}
          disabled={!startPoint || !endPoint}
          className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-transform disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
        >
          <Wand2 size={16} />
          开始智能规划
        </button>
      </motion.div>
    </div>
  );
};

const AddSpotModal = ({ isOpen, onClose, onAdd }) => {
  const [activeTab, setActiveTab] = useState('search'); // search | import | custom
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [customData, setCustomData] = useState({ name: '', type: 'scenic', desc: '', time: '10:00' });

  // Mock database for search
  const mockPlaces = [
    { name: '黄果树瀑布', type: 'scenic', address: '安顺市关岭布依族苗族自治县', desc: '亚洲第一大瀑布' },
    { name: '甲秀楼', type: 'scenic', address: '贵阳市南明区翠微巷', desc: '贵阳地标建筑' },
    { name: '青岩古镇', type: 'scenic', address: '贵阳市花溪区', desc: '四大古镇之一' },
    { name: '丝恋红汤丝娃娃', type: 'food', address: '贵阳市云岩区', desc: '贵州特色美食' },
    { name: '老凯俚酸汤鱼', type: 'food', address: '贵阳市南明区', desc: '正宗酸汤鱼' },
    { name: '桔子水晶酒店', type: 'hotel', address: '贵阳市中心', desc: '舒适型酒店' },
    { name: '贵阳北站', type: 'transport', address: '贵阳市观山湖区', desc: '高铁站' },
    { name: '龙洞堡机场', type: 'transport', address: '贵阳市南明区', desc: '国际机场' },
    { name: '小车河湿地公园', type: 'scenic', address: '贵阳市南明区', desc: '城市湿地' },
    { name: '花溪夜郎谷', type: 'scenic', address: '贵阳市花溪区', desc: '石头城堡' },
  ];

  useEffect(() => {
    if (query.trim()) {
      const results = mockPlaces.filter(place => 
        place.name.includes(query) || place.address.includes(query)
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [query]);

  if (!isOpen) return null;

  const handleConfirm = (place = null) => {
    let newSpot;
    if (place) {
        newSpot = {
            id: Date.now(),
            time: "12:00", // Default time
            title: place.name,
            type: place.type,
            status: "planned",
            details: {
              name: place.name,
              desc: place.desc || place.address
            }
        };
    } else {
        newSpot = {
          id: Date.now(),
          time: customData.time || "12:00",
          title: customData.name || query || "新行程节点",
          type: customData.type,
          status: "planned",
          details: {
            name: customData.name || query || "新行程节点",
            desc: customData.desc || "用户自定义添加"
          }
        };
    }
    onAdd(newSpot);
    onClose();
  };

  return (
    <div className="absolute inset-0 z-[60] flex items-end sm:items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" onClick={onClose} />
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="bg-white w-full sm:w-[90%] sm:max-w-md sm:rounded-2xl rounded-t-[2rem] p-6 pointer-events-auto relative z-10 max-h-[80vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-800">添加行程节点</h3>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
          {['search', 'import', 'custom'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === tab ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'
              }`}
            >
              {tab === 'search' && '搜索地点'}
              {tab === 'import' && '智能导入'}
              {tab === 'custom' && '自定义'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mb-6 min-h-[150px]">
          {activeTab === 'search' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="搜索景点、餐厅、酒店..." 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl text-sm font-bold text-slate-800 border-none outline-none focus:ring-2 focus:ring-slate-200"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              
              {/* Search Results */}
              {searchResults.length > 0 ? (
                <div className="mt-4 space-y-2 max-h-[200px] overflow-y-auto">
                   {searchResults.map((result, i) => (
                      <div 
                        key={i} 
                        onClick={() => handleConfirm(result)}
                        className="p-3 bg-slate-50 rounded-xl flex items-center justify-between active:bg-slate-100 cursor-pointer"
                      >
                         <div>
                            <div className="font-bold text-slate-800 text-sm">{result.name}</div>
                            <div className="text-[10px] text-slate-400">{result.address}</div>
                         </div>
                         <div className="text-[10px] font-bold px-2 py-1 bg-white rounded text-slate-500 border border-slate-100">
                            {result.type === 'scenic' ? '景点' : result.type === 'food' ? '美食' : result.type === 'hotel' ? '酒店' : '交通'}
                         </div>
                      </div>
                   ))}
                </div>
              ) : query && (
                <div className="text-center text-xs text-slate-400 py-4">
                  未找到相关地点，可尝试切换到“自定义”添加
                </div>
              )}
              
              {!query && (
                <div className="text-center text-xs text-slate-400 py-4">
                  输入关键词搜索地点
                </div>
              )}
            </div>
          )}

          {activeTab === 'import' && (
            <div className="space-y-4">
              <textarea 
                placeholder="粘贴小红书/抖音/携程笔记，AI自动解析行程..." 
                className="w-full h-32 p-4 bg-slate-50 rounded-xl text-sm text-slate-800 border-none outline-none resize-none focus:ring-2 focus:ring-slate-200"
              />
            </div>
          )}

          {activeTab === 'custom' && (
            <div className="space-y-3">
               <input 
                  type="text" 
                  placeholder="地点/活动名称" 
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm font-bold text-slate-800 border-none outline-none"
                  value={customData.name}
                  onChange={(e) => setCustomData({...customData, name: e.target.value})}
                />
                <div className="flex gap-3">
                   <select 
                      className="flex-1 px-4 py-3 bg-slate-50 rounded-xl text-sm font-bold text-slate-800 border-none outline-none"
                      value={customData.type}
                      onChange={(e) => setCustomData({...customData, type: e.target.value})}
                   >
                      <option value="scenic">景点</option>
                      <option value="food">餐饮</option>
                      <option value="hotel">住宿</option>
                      <option value="transport">交通</option>
                      <option value="custom">自定义活动</option>
                   </select>
                   <input 
                      type="time" 
                      className="flex-1 px-4 py-3 bg-slate-50 rounded-xl text-sm font-bold text-slate-800 border-none outline-none"
                      value={customData.time}
                      onChange={(e) => setCustomData({...customData, time: e.target.value})}
                   />
                </div>
                <input 
                  type="text" 
                  placeholder="备注说明 (选填)" 
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm text-slate-800 border-none outline-none"
                  value={customData.desc}
                  onChange={(e) => setCustomData({...customData, desc: e.target.value})}
                />
            </div>
          )}
        </div>

        <button 
          onClick={handleConfirm}
          className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-transform"
        >
          确认添加
        </button>
      </motion.div>
    </div>
  );
};

const TripDetail = ({ adoptedTrip }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [viewMode, setViewMode] = useState('overview'); // 'overview' | 'daily'
  const [activeTab, setActiveTab] = useState('all'); // For overview filtering
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [isAddSpotOpen, setIsAddSpotOpen] = useState(false);
  const [isAIPlanningOpen, setIsAIPlanningOpen] = useState(false);
  
  // Initialize state with default or adopted trip
  const [trip, setTrip] = useState(() => {
    const baseTrip = (adoptedTrip && adoptedTrip.itinerary) ? adoptedTrip : {
        title: "贵阳市经典路线3日游",
        days: 3,
        itinerary: [
          {
            date: "12月11日",
            dayLabel: "Day 1",
            tag: "抵达日",
            weather: { temp: "12°C - 18°C", desc: "多云转晴", icon: Cloud },
            highlights: "抵达贵阳 — 特色早餐 — 文昌阁 — 甲秀楼夜景",
            tips: "为您监控到今日进港航班流量较大，建议下机后直接使用下方「一键叫车」服务。",
            timeline: [
              { time: "08:00", title: "航班抵达", type: "flight", status: "arrived", tips: "建议提前2小时到达机场。", details: { flightNo: "CZ3685", dep: "北京大兴", arr: "龙洞堡T2", depTime: "06:00", arrTime: "08:10", status: "飞行中", desc: "预计提前10分钟抵达" } },
              { time: "09:30", title: "早餐·糯米饭", type: "food", status: "upcoming", tips: "这家店排队人较多。", image: getPlaceholder(400, 300, 'Breakfast'), details: { name: "六广门毛阿姨糯米饭", desc: "距离下个节点 2.5km" } },
              { time: "14:00", title: "文昌阁", type: "scenic", status: "upcoming", tips: "阁楼内楼梯较陡。", image: getPlaceholder(400, 300, 'Attraction'), details: { name: "明代古建筑", desc: "游玩时长约 1.5 小时" } }
            ]
          },
          {
            date: "12月12日",
            dayLabel: "Day 2",
            tag: "文化探索",
            weather: { temp: "10°C - 15°C", desc: "小雨", icon: CloudRain },
            highlights: "黔灵山公园 — 弘福寺 — 贵州省博物馆",
            tips: "今日有小雨，出行请记得携带雨具。",
            timeline: [
              { time: "09:00", title: "黔灵山公园", type: "scenic", status: "planned", tips: "公园内猴子较多。", image: getPlaceholder(400, 300, 'Park'), details: { name: "黔南第一山", desc: "游玩时长约 3 小时" } },
              { time: "12:30", title: "午餐·丝娃娃", type: "food", status: "planned", tips: "建议搭配酸汤食用。", image: getPlaceholder(400, 300, 'Lunch'), details: { name: "丝恋红汤丝娃娃", desc: "必吃榜餐厅" } }
            ]
          },
          {
            date: "12月13日",
            dayLabel: "Day 3",
            tag: "返程日",
            weather: { temp: "11°C - 17°C", desc: "晴", icon: Sun },
            highlights: "青岩古镇 — 状元蹄 — 送机",
            tips: "古镇石板路较多，建议穿着舒适的鞋子。",
            timeline: [
              { time: "10:00", title: "青岩古镇", type: "scenic", status: "planned", tips: "建议穿着舒适的运动鞋。", image: getPlaceholder(400, 300, 'Ancient Town'), details: { name: "四大古镇之一", desc: "游玩时长约 4 小时" } },
              { time: "16:00", title: "前往机场", type: "transport", status: "planned", tips: "请检查随身物品。", image: null, details: { name: "送机服务", desc: "预计 45 分钟抵达机场" } }
            ]
          }
        ]
    };
    return baseTrip;
  });

  // Sync state with prop
  useEffect(() => {
    if (adoptedTrip && adoptedTrip.itinerary) {
      setTrip(adoptedTrip);
    }
  }, [adoptedTrip]);

  const getAgentInfo = (type) => {
    switch (type) {
      case 'flight':
        return { name: "民航运行中心·交通智能体", icon: Plane, color: "text-blue-800", bgColor: "bg-blue-100", iconColor: "text-blue-600", headerBg: "bg-blue-50/50", border: "border-blue-50", tag: "实时监控航路", btnBg: "bg-blue-600", btnShadow: "shadow-blue-200" };
      case 'train':
      case 'transport':
        return { name: "交通出行服务·调度智能体", icon: Car, color: "text-green-800", bgColor: "bg-green-100", iconColor: "text-green-600", headerBg: "bg-green-50/50", border: "border-green-50", tag: "智能调度中", btnBg: "bg-green-600", btnShadow: "shadow-green-200" };
      case 'food':
        return { name: "本地生活服务·餐饮智能体", icon: Utensils, color: "text-orange-800", bgColor: "bg-orange-100", iconColor: "text-orange-600", headerBg: "bg-orange-50/50", border: "border-orange-50", tag: "美味推荐", btnBg: "bg-orange-600", btnShadow: "shadow-orange-200" };
      case 'scenic':
        return { name: "景区智慧服务·景区智能体", icon: Camera, color: "text-purple-800", bgColor: "bg-purple-100", iconColor: "text-purple-600", headerBg: "bg-purple-50/50", border: "border-purple-50", tag: "景点导览", btnBg: "bg-purple-600", btnShadow: "shadow-purple-200" };
      case 'hotel':
        return { name: "酒店住宿服务·酒店智能体", icon: Hotel, color: "text-indigo-800", bgColor: "bg-indigo-100", iconColor: "text-indigo-600", headerBg: "bg-indigo-50/50", border: "border-indigo-50", tag: "贴心管家", btnBg: "bg-indigo-600", btnShadow: "shadow-indigo-200" };
      default:
        return { name: "行程助手·智能体", icon: Info, color: "text-slate-800", bgColor: "bg-slate-100", iconColor: "text-slate-600", headerBg: "bg-slate-50/50", border: "border-slate-50", tag: "行程服务", btnBg: "bg-slate-800", btnShadow: "shadow-slate-200" };
    }
  };

  const getServices = (type) => {
    switch (type) {
      case 'flight': return [{ label: "电子登机牌", icon: QrCode, primary: true }, { label: "遇到问题?", icon: AlertCircle, primary: false, danger: true }];
      case 'food': return [{ label: "一键导航", icon: Navigation, primary: true }, { label: "查看菜单", icon: FileText, primary: false }, { label: "排队取号", icon: Clock, primary: false }];
      case 'scenic': return [{ label: "语音讲解", icon: Headphones, primary: true }, { label: "地图导览", icon: MapPin, primary: false }, { label: "购票/预约", icon: Ticket, primary: false }];
      case 'hotel': return [{ label: "一键导航", icon: Navigation, primary: true }, { label: "联系前台", icon: Phone, primary: false }, { label: "客房服务", icon: Coffee, primary: false }];
      case 'transport': return [{ label: "联系司机", icon: Phone, primary: true }, { label: "分享行程", icon: Share, primary: false }];
      default: return [{ label: "查看详情", icon: Info, primary: true }];
    }
  };

  const handleAddDay = () => {
    const newDayIndex = trip.itinerary.length + 1;
    const newDay = {
      date: `Day ${newDayIndex}`, // Placeholder date
      dayLabel: `Day ${newDayIndex}`,
      tag: "新行程",
      weather: { temp: "20°C", desc: "晴", icon: Sun },
      highlights: "点击添加行程亮点",
      timeline: []
    };
    setTrip({
      ...trip,
      days: trip.days + 1,
      itinerary: [...trip.itinerary, newDay]
    });
    // Scroll to the new day in daily view
    setSelectedDayIndex(newDayIndex - 1);
  };

  const handleDayUpdate = (index, field, value) => {
    const newItinerary = [...trip.itinerary];
    newItinerary[index] = { ...newItinerary[index], [field]: value };
    setTrip({ ...trip, itinerary: newItinerary });
  };

  const handleTimelineReorder = (newTimeline) => {
    const newItinerary = [...trip.itinerary];
    newItinerary[selectedDayIndex] = { ...newItinerary[selectedDayIndex], timeline: newTimeline };
    setTrip({ ...trip, itinerary: newItinerary });
  };

  const handleAddSpot = (newSpot) => {
     const newItinerary = [...trip.itinerary];
     newItinerary[selectedDayIndex].timeline.push(newSpot);
     // Simple sort by time (optional, but good for UX)
     newItinerary[selectedDayIndex].timeline.sort((a, b) => a.time.localeCompare(b.time));
     setTrip({ ...trip, itinerary: newItinerary });
  };

  const handleAIPlanning = (start, end) => {
    setIsAIPlanningOpen(false);
    
    // Sanitize itinerary to remove non-serializable data (like React components/icons)
    const sanitizedItinerary = trip.itinerary.map(day => ({
        ...day,
        weather: { 
            temp: day.weather.temp, 
            desc: day.weather.desc 
            // Exclude icon component
        },
        timeline: day.timeline.map(node => ({
            ...node,
            // Ensure no circular refs or non-serializable fields
        }))
    }));

    // Navigate to ChatPlanning with context
    navigate('/chat-planning', { 
        state: { 
            mode: 'day_planning',
            dayIndex: selectedDayIndex,
            currentItinerary: sanitizedItinerary,
            startPoint: start,
            endPoint: end,
            tripId: id
        } 
    });
  };

  return (
    <div className="h-full w-full bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className="pt-12 pb-4 px-4 flex items-center justify-between bg-white border-b border-slate-100 z-[60] relative">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft size={20} className="text-slate-800" />
        </button>
        <div className="flex gap-2 bg-slate-100 p-1 rounded-full">
           <button 
            onClick={() => setViewMode('overview')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${viewMode === 'overview' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
          >
            <Map size={14} /> 总览
          </button>
          <button 
            onClick={() => setViewMode('daily')}
             className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${viewMode === 'daily' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
           >
             <Layout size={14} /> 每日
           </button>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
          <MoreHorizontal size={20} className="text-slate-800" />
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20 relative">
        
        {/* OVERVIEW MODE */}
        {viewMode === 'overview' && (
          <>
            {/* Map Placeholder - Always Visible in Overview */}
            <div className="w-full h-48 bg-slate-200 relative mb-4 group cursor-pointer overflow-hidden">
               <img 
                 src={getPlaceholder(800, 400, 'Map Overview')} 
                 className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                 alt="Trip Map" 
               />
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-bold text-slate-800">
                     <Map size={16} className="text-blue-600" />
                     查看路线地图
                  </div>
               </div>
            </div>

            {/* Filter Tabs */}
            <div className="bg-white px-4 pb-4 pt-2 sticky top-0 z-40 shadow-sm">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {[{ id: 'all', label: '全部' }, { id: 'transport', label: '交通' }, { id: 'food', label: '餐饮' }, { id: 'scenic', label: '景点' }, { id: 'hotel', label: '住宿' }].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                      activeTab === tab.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 space-y-8">
              {trip.itinerary.map((day, index) => (
                <div key={index} className="space-y-6" id={`day-${index}`}>
                  {/* Date Header */}
                  <div className="flex items-center justify-between sticky z-30 py-3 bg-slate-50/95 backdrop-blur-sm -mx-4 px-4 shadow-sm border-b border-slate-100 transition-all" style={{ top: `${0 + (index * 60)}px` }}>
                     <div className="flex items-center gap-3">
                       <h1 className="text-2xl font-black text-slate-800 italic tracking-tight">{day.dayLabel}</h1>
                       <span className="px-2 py-1 bg-slate-200 text-slate-600 text-xs font-bold rounded-md">{day.tag}</span>
                     </div>
                     <span className="text-xs font-bold text-slate-400">{day.date}</span>
                  </div>

                  {/* Timeline */}
                  <div className="relative space-y-8 pl-4">
                     <div className="absolute left-[19px] top-2 bottom-0 w-0.5 bg-slate-200" />
                     {day.timeline.filter(t => activeTab === 'all' || t.type === activeTab).map((node, nodeIndex) => {
                       const agent = getAgentInfo(node.type);
                       const services = getServices(node.type);
                       return (
                         <div key={nodeIndex} className="relative">
                            <div className={`absolute -left-[5px] top-0 w-3 h-3 rounded-full ring-4 ring-white z-10 ${node.status === 'arrived' || node.status === 'completed' ? 'bg-blue-500' : 'bg-slate-300'}`} />
                            <div className="flex justify-between items-center mb-3 pl-6">
                               <span className="text-sm font-bold text-slate-400 font-mono">{node.time}</span>
                               <span className="text-sm font-bold text-slate-800">{node.title}</span>
                            </div>
                            <div className="ml-6">
                              <div onClick={() => navigate('/chat-planning', { state: { nodeContext: node } })} className={`bg-white rounded-2xl shadow-sm border ${agent.border} overflow-hidden cursor-pointer active:scale-98 transition-transform`}>
                                 <div className={`${agent.headerBg} p-3 flex justify-between items-center border-b ${agent.border}`}>
                                    <div className="flex items-center gap-1.5">
                                      <div className={`w-5 h-5 rounded-full ${agent.bgColor} flex items-center justify-center`}><agent.icon size={12} className={agent.iconColor} /></div>
                                      <span className={`text-xs font-bold ${agent.color}`}>{agent.name}</span>
                                    </div>
                                 </div>
                                 <div className="p-4">
                                    <h3 className="text-lg font-black text-slate-800 mb-1">{node.details.name || node.title}</h3>
                                    <div className="text-xs text-slate-500 font-medium mb-2 line-clamp-2">{node.details.desc}</div>
                                 </div>
                              </div>
                            </div>
                         </div>
                       );
                     })}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* DAILY MODE */}
        {viewMode === 'daily' && (
           <div className="flex flex-col min-h-full">
              {/* Day Selector */}
              <div className="bg-white border-b border-slate-100 sticky top-0 z-40">
                 <div className="flex overflow-x-auto scrollbar-hide px-4 py-3 gap-3">
                    {trip.itinerary.map((day, index) => (
                       <button
                          key={index}
                          onClick={() => setSelectedDayIndex(index)}
                          className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                             selectedDayIndex === index 
                             ? 'bg-slate-900 text-white border-slate-900 shadow-md transform scale-105' 
                             : 'bg-white text-slate-500 border-slate-200'
                          }`}
                       >
                          {day.dayLabel}
                       </button>
                    ))}
                    <button 
                       onClick={handleAddDay}
                       className="flex-shrink-0 w-10 flex items-center justify-center rounded-xl border border-dashed border-slate-300 text-slate-400 hover:bg-slate-50"
                    >
                       <Plus size={16} />
                    </button>
                 </div>
              </div>

              {/* Editable Day Header */}
              <div className="px-6 py-6 bg-white mb-2">
                 <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                       <input 
                          type="text" 
                          value={trip.itinerary[selectedDayIndex].dayLabel}
                          onChange={(e) => handleDayUpdate(selectedDayIndex, 'dayLabel', e.target.value)}
                          className="text-3xl font-black text-slate-800 italic tracking-tight bg-transparent border-none outline-none w-full placeholder-slate-300"
                       />
                       <input 
                          type="text" 
                          value={trip.itinerary[selectedDayIndex].tag}
                          onChange={(e) => handleDayUpdate(selectedDayIndex, 'tag', e.target.value)}
                          className="mt-1 text-sm font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-md border-none outline-none w-auto inline-block"
                       />
                    </div>
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 cursor-pointer hover:bg-purple-50 hover:text-purple-500 transition-colors" onClick={() => setIsAIPlanningOpen(true)}>
                       <Wand2 size={20} />
                    </div>
                 </div>
                 
                 {/* Reorderable List */}
                 <Reorder.Group 
                    axis="y" 
                    values={trip.itinerary[selectedDayIndex].timeline} 
                    onReorder={handleTimelineReorder}
                    className="space-y-3"
                 >
                    {trip.itinerary[selectedDayIndex].timeline.map((node) => {
                       // Need a stable ID for reorder
                       const itemKey = node.id || node.time + node.title; 
                       const agent = getAgentInfo(node.type);
                       
                       return (
                         <Reorder.Item key={itemKey} value={node} className="relative">
                            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4 active:shadow-lg active:scale-[1.02] transition-all">
                               <div className="cursor-grab active:cursor-grabbing text-slate-300 p-1">
                                  <GripVertical size={16} />
                               </div>
                               <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                     <span className="text-xs font-bold text-slate-400 font-mono">{node.time}</span>
                                     <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${agent.bgColor} ${agent.color}`}>{agent.name.split('·')[0]}</span>
                                  </div>
                                  <h4 className="font-bold text-slate-800 truncate">{node.title}</h4>
                                  <p className="text-xs text-slate-400 truncate">{node.details.desc}</p>
                               </div>
                            </div>
                         </Reorder.Item>
                       );
                    })}
                 </Reorder.Group>

                 {/* Add Spot Button */}
                 <button 
                    onClick={() => setIsAddSpotOpen(true)}
                    className="w-full py-4 mt-6 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-slate-400 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all"
                 >
                    <Plus size={18} />
                    添加行程节点
                 </button>
              </div>
           </div>
        )}
      </div>

      {/* Add Spot Modal */}
      <AnimatePresence>
        {isAddSpotOpen && (
          <AddSpotModal 
            isOpen={isAddSpotOpen} 
            onClose={() => setIsAddSpotOpen(false)} 
            onAdd={handleAddSpot}
          />
        )}
      </AnimatePresence>

      {/* AI Planning Modal */}
      <AnimatePresence>
        {isAIPlanningOpen && (
          <AIPlanningModal 
            isOpen={isAIPlanningOpen} 
            onClose={() => setIsAIPlanningOpen(false)} 
            onConfirm={handleAIPlanning}
          />
        )}
      </AnimatePresence>

    </div>
  );
};

export default TripDetail;
