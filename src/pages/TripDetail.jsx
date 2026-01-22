import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Share, MoreHorizontal, Sun, Cloud, CloudRain, Info, Plane, Train, MapPin, ChevronRight, QrCode, AlertCircle, Clock, CheckCircle2, Utensils, Hotel, Camera, Coffee, Navigation, Phone, FileText, Headphones, Ticket, Car, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPlaceholder } from '../utils/imageUtils';

const TripDetail = ({ adoptedTrip }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('all');
  const [activeDay, setActiveDay] = useState(-1);

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
      case 'flight':
        return [
          { label: "电子登机牌", icon: QrCode, primary: true },
          { label: "遇到问题?", icon: AlertCircle, primary: false, danger: true }
        ];
      case 'food':
        return [
          { label: "一键导航", icon: Navigation, primary: true },
          { label: "查看菜单", icon: FileText, primary: false },
          { label: "排队取号", icon: Clock, primary: false }
        ];
      case 'scenic':
        return [
          { label: "语音讲解", icon: Headphones, primary: true },
          { label: "地图导览", icon: MapPin, primary: false },
          { label: "购票/预约", icon: Ticket, primary: false }
        ];
      case 'hotel':
        return [
          { label: "一键导航", icon: Navigation, primary: true },
          { label: "联系前台", icon: Phone, primary: false },
          { label: "客房服务", icon: Coffee, primary: false }
        ];
      case 'transport':
        return [
          { label: "联系司机", icon: Phone, primary: true },
          { label: "分享行程", icon: Share, primary: false }
        ];
      default:
        return [
          { label: "查看详情", icon: Info, primary: true }
        ];
    }
  };

  // Mock data structure tailored for the view
  const defaultTrip = {
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
          {
            time: "08:00",
            title: "航班抵达",
            type: "flight",
            status: "arrived",
            tips: "建议提前2小时到达机场，凭身份证办理值机。",
            details: {
              flightNo: "CZ3685",
              dep: "北京大兴",
              arr: "龙洞堡T2",
              depTime: "06:00",
              arrTime: "08:10",
              status: "飞行中",
              desc: "预计提前10分钟抵达"
            }
          },
          {
            time: "09:30",
            title: "早餐·糯米饭",
            type: "food",
            status: "upcoming",
            tips: "这家店排队人较多，建议预留充足时间。",
            image: getPlaceholder(400, 300, 'Breakfast'),
            details: {
              name: "六广门毛阿姨糯米饭",
              desc: "距离下个节点 2.5km"
            }
          },
          {
            time: "14:00",
            title: "文昌阁",
            type: "scenic",
            status: "upcoming",
            tips: "阁楼内楼梯较陡，上下请注意安全。",
            image: getPlaceholder(400, 300, 'Attraction'),
            details: {
              name: "明代古建筑",
              desc: "游玩时长约 1.5 小时"
            }
          },
          {
            time: "18:30",
            title: "住宿·桔子水晶",
            type: "hotel",
            status: "upcoming",
            tips: "酒店位于市中心，夜间休息请注意关好门窗。",
            image: getPlaceholder(400, 300, 'Hotel'),
            details: {
              name: "桔子水晶酒店",
              desc: "评分 5.0 · 舒适型"
            }
          }
        ]
      },
      {
        date: "12月12日",
        dayLabel: "Day 2",
        tag: "文化探索",
        weather: { temp: "10°C - 15°C", desc: "小雨", icon: CloudRain },
        highlights: "黔灵山公园 — 弘福寺 — 贵州省博物馆 — 丝娃娃",
        tips: "今日有小雨，出行请记得携带雨具。黔灵山猴子较多，请注意保管好随身物品。",
        timeline: [
          {
            time: "09:00",
            title: "黔灵山公园",
            type: "scenic",
            status: "planned",
            tips: "公园内猴子较多，请妥善保管食物和贵重物品。",
            image: getPlaceholder(400, 300, 'Park'),
            details: {
              name: "黔南第一山",
              desc: "游玩时长约 3 小时"
            }
          },
          {
            time: "12:30",
            title: "午餐·丝娃娃",
            type: "food",
            status: "planned",
            tips: "建议搭配酸汤食用，口感更佳。",
            image: getPlaceholder(400, 300, 'Lunch'),
            details: {
              name: "丝恋红汤丝娃娃",
              desc: "必吃榜餐厅，建议提前排队"
            }
          },
          {
            time: "15:00",
            title: "贵州省博物馆",
            type: "scenic",
            status: "planned",
            tips: "馆内禁止使用闪光灯，请文明观展。",
            image: getPlaceholder(400, 300, 'Museum'),
            details: {
              name: "了解贵州历史",
              desc: "需提前在公众号预约"
            }
          }
        ]
      },
      {
        date: "12月13日",
        dayLabel: "Day 3",
        tag: "返程日",
        weather: { temp: "11°C - 17°C", desc: "晴", icon: Sun },
        highlights: "青岩古镇 — 状元蹄 — 送机",
        tips: "古镇石板路较多，建议穿着舒适的鞋子。状元蹄可以真空打包带走。",
        timeline: [
          {
            time: "10:00",
            title: "青岩古镇",
            type: "scenic",
            status: "planned",
            tips: "古镇石板路较多，建议穿着舒适的运动鞋。",
            image: getPlaceholder(400, 300, 'Ancient Town'),
            details: {
              name: "四大古镇之一",
              desc: "游玩时长约 4 小时"
            }
          },
          {
            time: "12:00",
            title: "午餐·状元蹄",
            type: "food",
            status: "planned",
            tips: "猪蹄软糯，建议趁热食用。",
            image: getPlaceholder(400, 300, 'Food'),
            details: {
              name: "金必轩",
              desc: "软糯入味，肥而不腻"
            }
          },
          {
            time: "16:00",
            title: "前往机场",
            type: "transport",
            status: "planned",
            tips: "请检查随身物品，避免遗漏在车上。",
            image: null,
            details: {
              name: "送机服务",
              desc: "预计 45 分钟抵达机场"
            }
          }
        ]
      }
    ]
  };

  // Ensure adoptedTrip has itinerary structure or use defaultTrip
  const tripData = (adoptedTrip && adoptedTrip.itinerary) ? adoptedTrip : defaultTrip;

  const tabs = [
    { id: 'all', label: '全部' },
    { id: 'transport', label: '交通' },
    { id: 'food', label: '餐饮' },
    { id: 'scenic', label: '景点' },
    { id: 'hotel', label: '住宿' }
  ];

  return (
    <div className="h-full w-full bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Header - Fixed outside scroll view */}
      <header className="px-4 py-4 flex items-center justify-between bg-white border-b border-slate-100 z-50">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft size={20} className="text-slate-800" />
        </button>
        <div className="flex gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
            <Share size={20} className="text-slate-800" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
            <MoreHorizontal size={20} className="text-slate-800" />
          </button>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-20 relative">
        {/* Sticky Filter Tabs */}
        <div className="bg-white px-4 pb-4 pt-2 sticky top-0 z-40 shadow-sm">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 space-y-8">
          {(tripData.itinerary || []).map((day, index) => (
            <div key={index} className="space-y-6" id={`day-${index}`}>
              {/* Date Header */}
              <div 
                className="flex items-center justify-between sticky z-30 py-3 bg-slate-50/95 backdrop-blur-sm -mx-4 px-4 shadow-sm border-b border-slate-100 transition-all"
                style={{ top: `${0 + (index * 60)}px` }}
                onClick={() => {
                  const element = document.getElementById(`day-${index}`);
                  if (element) {
                    const offset = 0 + (index * 60) + 10; // Header offset + some padding
                    
                    // Find the scroll container (the div with flex-1 overflow-y-auto)
                    const scrollContainer = document.querySelector('.overflow-y-auto.pb-20');
                    if (scrollContainer) {
                         scrollContainer.scrollTo({
                            top: element.offsetTop - (0 + (index * 60)), // Adjust for sticky stack
                            behavior: 'smooth'
                         });
                    }
                  }
                }}
              >
                 <div className="flex items-center gap-3">
                   <h1 className="text-2xl font-black text-slate-800 italic tracking-tight">
                     {day.date}
                   </h1>
                   <span className="px-2 py-1 bg-slate-200 text-slate-600 text-xs font-bold rounded-md">{day.tag}</span>
                 </div>
                 <button className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm">
                   <ChevronRight size={16} className="rotate-90 text-slate-400" />
                 </button>
              </div>

              {/* Content - Always Visible */}
              <div>
                {/* Weather & Summary Card */}
                      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
                         <div className="flex relative">
                           {/* Left: Weather */}
                           <div className="w-[55%] p-4 border-r border-slate-50 relative z-10">
                             <p className="text-xs text-slate-400 font-bold mb-2">今日天气</p>
                             <div className="flex items-center gap-2">
                               {(() => {
                                 const WeatherIcon = day.weather.icon || Sun;
                                 return <WeatherIcon size={22} className="text-blue-500 shrink-0" />;
                               })()}
                               <span className="text-lg font-black text-slate-800 whitespace-nowrap">{day.weather.temp}</span>
                             </div>
                             <div className="mt-1 ml-7">
                               <span className="text-xs font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">{day.weather.desc}</span>
                             </div>
                           </div>

                           {/* Right: Highlights */}
                           <div className="flex-1 p-4 relative z-10 pl-4">
                             <p className="text-xs text-slate-400 font-bold mb-2 flex items-center gap-1">
                               <Clock size={12} /> 行程重点
                             </p>
                             <p className="text-xs text-slate-800 font-bold leading-relaxed line-clamp-3">
                               {day.highlights}
                             </p>
                           </div>
                           
                           {/* Decorative blob */}
                           <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-50" />
                         </div>

                         {/* Footer: Tips */}
                         {day.tips && (
                           <div className="bg-blue-50/30 p-3 flex gap-2 items-start border-t border-blue-50">
                             <div className="w-4 h-4 rounded-full bg-yellow-100 flex items-center justify-center shrink-0 mt-0.5">
                                <Info size={10} className="text-yellow-600" />
                             </div>
                             <p className="text-xs text-slate-600 leading-relaxed">
                               <span className="font-bold text-slate-800">小西助手提醒：</span>
                               {day.tips}
                             </p>
                           </div>
                         )}
                      </div>

                {/* Timeline */}
                <div className="relative space-y-8 pl-4">
                   {/* Timeline Line */}
                   <div className="absolute left-[19px] top-2 bottom-0 w-0.5 bg-slate-200" />

                   {day.timeline.map((node, nodeIndex) => (
                     <div key={nodeIndex} className="relative">
                        {/* Node Dot */}
                        <div className={`absolute -left-[5px] top-0 w-3 h-3 rounded-full ring-4 ring-white z-10 ${
                          node.status === 'arrived' || node.status === 'completed' 
                            ? 'bg-blue-500' 
                            : 'bg-slate-300'
                        }`} />
                        
                        {/* Node Time & Title */}
                        <div className="flex justify-between items-center mb-3 pl-6">
                           <span className="text-sm font-bold text-slate-400 font-mono">{node.time}</span>
                           <span className="text-sm font-bold text-slate-800">{node.title}</span>
                        </div>
                        
                        {/* Node Content */}
                        <div className="ml-6">
                          {(() => {
                            const agent = getAgentInfo(node.type);
                            const services = getServices(node.type);
                            
                            return (
                              <div 
                                onClick={() => navigate('/chat-planning', { state: { nodeContext: node } })}
                                className={`bg-white rounded-2xl shadow-sm border ${agent.border} overflow-hidden cursor-pointer active:scale-98 transition-transform`}
                              >
                                 {/* Header: Agent Info */}
                                 <div className={`${agent.headerBg} p-3 flex justify-between items-center border-b ${agent.border}`}>
                                    <div className="flex items-center gap-1.5">
                                      <div className={`w-5 h-5 rounded-full ${agent.bgColor} flex items-center justify-center`}>
                                        <agent.icon size={12} className={agent.iconColor} />
                                      </div>
                                      <span className={`text-xs font-bold ${agent.color}`}>{agent.name}</span>
                                    </div>
                                    <span className={`text-[10px] font-bold ${agent.iconColor}`}>{agent.tag}</span>
                                 </div>

                                 {/* Body: Key Info */}
                                 <div className="p-5">
                                    {node.type === 'flight' ? (
                                      <div className="flex justify-between items-center mb-1">
                                         <div className="text-center">
                                            <div className="text-2xl font-black text-slate-800">{node.details.depTime}</div>
                                            <div className="text-xs text-slate-500 mt-1 font-bold">{node.details.dep}</div>
                                         </div>
                                         
                                         <div className="flex-1 flex flex-col items-center px-4">
                                            <div className="text-xs font-bold text-blue-600 mb-1">{node.details.flightNo} · <span className="text-blue-500">{node.details.status}</span></div>
                                            <div className="w-full h-0.5 bg-blue-100 relative">
                                               <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-full flex items-center justify-center">
                                                  <Plane size={14} className="text-blue-500 rotate-90" />
                                               </div>
                                            </div>
                                            <div className="text-[10px] text-slate-400 mt-1">{node.details.desc}</div>
                                         </div>

                                         <div className="text-center">
                                            <div className="text-2xl font-black text-slate-800">{node.details.arrTime}</div>
                                            <div className="text-xs text-slate-500 mt-1 font-bold">{node.details.arr}</div>
                                         </div>
                                      </div>
                                    ) : (
                                      <div className="flex gap-4">
                                        {node.image && (
                                          <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 shadow-sm">
                                            <img src={node.image} className="w-full h-full object-cover" alt={node.title} />
                                          </div>
                                        )}
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                          <h3 className="text-lg font-black text-slate-800 mb-1 truncate">{node.details.name || node.title}</h3>
                                          <div className="text-xs text-slate-500 font-medium mb-2 line-clamp-2">{node.details.desc}</div>
                                          <div className="flex flex-wrap gap-2">
                                            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full border border-slate-200">
                                              {node.status === 'upcoming' ? '即将开始' : node.status === 'completed' ? '已完成' : '计划中'}
                                            </span>
                                            {node.type === 'food' && <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-[10px] font-bold rounded-full border border-orange-100">人均 ¥50</span>}
                                            {node.type === 'scenic' && <span className="px-2 py-0.5 bg-purple-50 text-purple-600 text-[10px] font-bold rounded-full border border-purple-100">建议游玩 2h</span>}
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {/* Yellow Xiaoxi Tips */}
                                    {node.tips && (
                                       <div className="mt-4 bg-orange-50/50 border border-orange-100 rounded-xl p-3 flex gap-2.5 items-start">
                                          <div className="w-4 h-4 rounded-full bg-orange-100 flex items-center justify-center shrink-0 mt-0.5">
                                             <Sparkles size={10} className="text-orange-500" />
                                          </div>
                                          <div className="flex-1">
                                             <div className="text-[10px] font-bold text-orange-600 mb-0.5">黄小西Tips</div>
                                             <div className="text-[10px] text-slate-500 leading-relaxed">{node.tips}</div>
                                          </div>
                                       </div>
                                    )}
                                 </div>

                                 {/* Footer: Services */}
                                 <div className="px-4 pb-4 flex gap-3 overflow-x-auto scrollbar-hide">
                                    {services.map((service, idx) => (
                                      <button 
                                        key={idx}
                                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-transform whitespace-nowrap px-3 ${
                                          service.primary 
                                            ? `${agent.btnBg} text-white shadow-lg ${agent.btnShadow}`
                                            : service.danger 
                                              ? 'bg-red-50 text-red-500 border border-red-100'
                                              : 'bg-slate-50 text-slate-600 border border-slate-100'
                                        }`}
                                      >
                                         <service.icon size={14} /> {service.label}
                                      </button>
                                    ))}
                                 </div>
                              </div>
                            );
                          })()}
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TripDetail;
