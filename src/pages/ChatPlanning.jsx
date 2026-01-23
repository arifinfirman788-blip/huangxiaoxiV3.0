import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Mic, MapPin, Calendar, Clock, Plane, Bed, Utensils, Flag, Sparkles, Check, ChevronDown, ChevronUp, Star, Info, Car, Camera, Hotel, Headphones, Ticket, Phone, Coffee, FileText, Navigation, Loader2, Wand2, RefreshCcw, ArrowRight } from 'lucide-react';
import TuoSaiImage from '../image/托腮_1.png';
import { getPlaceholder } from '../utils/imageUtils';

const ChatPlanning = ({ onAdoptTrip }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollRef = useRef(null);
  const hasGeneratedPlan = useRef(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'agent',
      text: '你好！我是你的智能行程规划师。请告诉我你想去哪里，玩几天，有什么偏好？',
      time: '10:00'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [activeAgent, setActiveAgent] = useState(null);
  const [currentNode, setCurrentNode] = useState(null);
  const [planningContext, setPlanningContext] = useState(null); // For AI Planning flow

  // Helper to get agent info based on type
  const getAgentInfo = (type) => {
    switch (type) {
      case 'flight':
        return { name: "民航运行中心·交通智能体", icon: Plane, color: "text-blue-800", bgColor: "bg-blue-100", iconColor: "text-blue-600", headerBg: "bg-blue-50", border: "border-blue-100", tag: "实时监控航路", btnBg: "bg-blue-600", description: "接入民航数据中心，提供实时航班动态与保障服务" };
      case 'train':
      case 'transport':
        return { name: "交通出行服务·调度智能体", icon: Car, color: "text-green-800", bgColor: "bg-green-100", iconColor: "text-green-600", headerBg: "bg-green-50", border: "border-green-100", tag: "智能调度中", btnBg: "bg-green-600", description: "连接全网约车运力，提供最优出行方案" };
      case 'food':
        return { name: "本地生活服务·餐饮智能体", icon: Utensils, color: "text-orange-800", bgColor: "bg-orange-100", iconColor: "text-orange-600", headerBg: "bg-orange-50", border: "border-orange-100", tag: "美味推荐", btnBg: "bg-orange-600", description: "汇集本地必吃榜单，提供排队预约服务" };
      case 'scenic':
        return { name: "景区智慧服务·景区智能体", icon: Camera, color: "text-purple-800", bgColor: "bg-purple-100", iconColor: "text-purple-600", headerBg: "bg-purple-50", border: "border-purple-100", tag: "景点导览", btnBg: "bg-purple-600", description: "景区官方授权接入，提供语音讲解与购票服务" };
      case 'hotel':
        return { name: "酒店住宿服务·酒店智能体", icon: Hotel, color: "text-indigo-800", bgColor: "bg-indigo-100", iconColor: "text-indigo-600", headerBg: "bg-indigo-50", border: "border-indigo-100", tag: "贴心管家", btnBg: "bg-indigo-600", description: "酒店PMS直连，提供客房服务与入住办理" };
      default:
        return { name: "行程助手·智能体", icon: Info, color: "text-slate-800", bgColor: "bg-slate-100", iconColor: "text-slate-600", headerBg: "bg-slate-50", border: "border-slate-100", tag: "行程服务", btnBg: "bg-slate-800", description: "您的全能行程助手" };
    }
  };

  // Default trip data
  const defaultTrip = {
    id: Date.now(),
    title: "贵阳市经典路线3日游",
    days: 3,
    itinerary: [
      {
        date: "06.06",
        dayLabel: "Day 1",
        tag: "抵达日",
        // Remove icon component to avoid DataCloneError
        weather: { temp: "22°C", desc: "多云" },
        highlights: "航班抵达 — 特色早餐 — 文昌阁 — 住宿",
        tips: "建议提前预订接机服务，避开早高峰。",
        timeline: [
          {
            id: 'flight-1',
            time: '08:00',
            title: '航班抵达',
            type: 'flight',
            status: 'upcoming',
            tips: "建议提前2小时到达机场，凭身份证办理值机。",
            details: {
              flightNo: 'CZ3685',
              dep: '北京大兴',
              arr: '龙洞堡T2',
              depTime: '06:00',
              arrTime: '08:10',
              status: '飞行中',
              desc: "预计准点到达"
            }
          },
          {
            id: 'breakfast-1',
            time: '09:30',
            title: '早餐·糯米饭',
            type: 'food',
            status: 'upcoming',
            tips: "这家店排队人较多，建议预留充足时间。",
            image: getPlaceholder(200, 200, 'Breakfast'),
            details: {
              name: '六广门毛阿姨糯米饭',
              desc: '距离机场 2.5km'
            }
          },
          {
            id: 'attr-1',
            time: '10:00',
            title: '文昌阁',
            type: 'scenic',
            status: 'upcoming',
            tips: "阁楼内楼梯较陡，上下请注意安全。",
            image: getPlaceholder(400, 300, 'Attraction'),
            details: {
              name: '文昌阁',
              desc: '建议游览时长 1.5h'
            }
          },
          {
            id: 'hotel-1',
            time: '18:30',
            title: '住宿·桔子水晶',
            type: 'hotel',
            status: 'upcoming',
            tips: "酒店位于市中心，夜间休息请注意关好门窗。",
            image: getPlaceholder(400, 300, 'Hotel'),
            details: {
              name: '桔子水晶酒店',
              desc: '评分 5.0'
            }
          }
        ]
      },
      {
        date: "06.07",
        dayLabel: "Day 2",
        tag: "文化探索",
        // Remove icon component to avoid DataCloneError
        weather: { temp: "20°C", desc: "小雨" },
        highlights: "黔灵山公园 — 民生路美食 — 甲秀楼 — 青云集市",
        tips: "今日有小雨，出行请记得携带雨具。",
        timeline: [
          {
            id: 'scenic-2-1',
            time: '09:00',
            title: '黔灵山公园',
            type: 'scenic',
            status: 'planned',
            tips: "公园内猴子较多，请妥善保管食物和贵重物品。",
            image: getPlaceholder(400, 300, 'Park'),
            details: {
              name: '黔灵山公园',
              desc: '建议游览时长 2h'
            }
          },
          {
            id: 'food-2-1',
            time: '11:30',
            title: '民生路集贸市场',
            type: 'food',
            status: 'planned',
            tips: "地道小吃聚集地，建议尝试多种小吃。",
            image: getPlaceholder(200, 200, 'Market'),
            details: {
              name: '民生路集贸市场',
              desc: '地道小吃聚集地'
            }
          },
          {
            id: 'scenic-2-2',
            time: '14:00',
            title: '筑城广场 & 甲秀楼',
            type: 'scenic',
            status: 'planned',
            tips: "甲秀楼夜景很美，建议晚上去拍照。",
            image: getPlaceholder(200, 200, 'Landmark'),
            details: {
              name: '甲秀楼',
              desc: '贵阳地标性建筑'
            }
          },
          {
            id: 'food-2-2',
            time: '18:00',
            title: '青云集市',
            type: 'food',
            status: 'planned',
            tips: "夜市人多拥挤，请注意保管财物。",
            image: getPlaceholder(200, 200, 'Night Market'),
            details: {
              name: '青云集市',
              desc: '网红打卡夜市'
            }
          }
        ]
      },
      {
        date: "06.08",
        dayLabel: "Day 3",
        tag: "返程日",
        // Remove icon component to avoid DataCloneError
        weather: { temp: "24°C", desc: "晴" },
        highlights: "花溪夜郎谷 — 青岩古镇 — 返程",
        tips: "注意安排好返程交通时间。",
        timeline: [
          {
            id: 'scenic-3-1',
            time: '09:00',
            title: '花溪夜郎谷',
            type: 'scenic',
            status: 'planned',
            tips: "石头城堡路面不平，请注意脚下安全。",
            image: getPlaceholder(200, 200, 'Valley'),
            details: {
              name: '花溪夜郎谷',
              desc: '神秘的石头城堡'
            }
          },
          {
            id: 'scenic-3-2',
            time: '13:30',
            title: '青岩古镇',
            type: 'scenic',
            status: 'planned',
            tips: "古镇石板路较多，建议穿着舒适的运动鞋。",
            image: getPlaceholder(200, 200, 'Ancient Town'),
            details: {
              name: '青岩古镇',
              desc: '四大古镇之一'
            }
          },
          {
            id: 'transport-3-1',
            time: '17:00',
            title: '离开贵阳',
            type: 'transport',
            status: 'planned',
            tips: "请检查随身物品，避免遗漏在车上。",
            details: {
              name: '送机服务',
              desc: '前往机场'
            }
          }
        ]
      }
    ]
  };

  useEffect(() => {
    let timer;
    if (location.state?.importedData) {
      const imported = location.state.importedData;
      setCurrentTrip(imported);
      setMessages([
        {
          id: 1,
          sender: 'agent',
          text: '已为您识别到行程信息，请确认👇',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        {
          id: 2,
          sender: 'agent',
          type: 'itinerary',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } else if (location.state?.nodeContext) {
      const node = location.state.nodeContext;
      setCurrentNode(node);
      const agentInfo = getAgentInfo(node.type);
      // Ensure we have a valid trip structure even when entering from a node
      setCurrentTrip(defaultTrip); 
      
      setMessages([
        {
          id: 1,
          sender: 'agent',
          text: `请问您针对【${node.title || node.details?.name}】景区有什么问题，全都可以问小西哦`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } else if (location.state?.mode === 'day_planning') {
        const { startPoint, endPoint, dayIndex, currentItinerary } = location.state;
        setPlanningContext(location.state);
        setCurrentTrip({ ...defaultTrip, itinerary: currentItinerary }); // Sync current itinerary
        
        // Initial messages for AI Planning
        setMessages([
            {
                id: 1,
                sender: 'user',
                text: `我计划今天从【${startPoint}】出发，前往【${endPoint}】，请帮我规划一下今天的行程。`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            },
            {
                id: 2,
                sender: 'agent',
                text: `收到！正在结合您前几天的行程，为您规划从 ${startPoint} 到 ${endPoint} 的最佳路线...`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
        ]);

        // Simulate AI generating plan
             setIsTyping(true);
             timer = setTimeout(() => {
                 setIsTyping(false);
            const planMsg = {
                id: 3,
                sender: 'agent',
                type: 'day_plan_card',
                plan: {
                    day: dayIndex + 1,
                    start: startPoint,
                    end: endPoint,
                    spots: [
                        { time: '09:00', title: startPoint, type: 'hotel', desc: '出发' },
                        { time: '10:30', title: '黔灵山公园', type: 'scenic', desc: '观赏野生猕猴，游览弘福寺', tag: '推荐' },
                        { time: '12:30', title: '民生路美食街', type: 'food', desc: '品尝贵阳地道小吃', tag: '必吃' },
                        { time: '14:30', title: '甲秀楼', type: 'scenic', desc: '贵阳地标，拍照打卡', tag: '地标' },
                        { time: '16:00', title: endPoint, type: 'transport', desc: '抵达目的地' }
                    ]
                },
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, planMsg]);
        }, 2000);

    } else {
      setCurrentTrip(defaultTrip);
    }
    return () => clearTimeout(timer);
  }, [location.state]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: 'user',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);

      if (inputText.includes('门票修改') && currentNode) {
         const policyText = `【${currentNode.title || currentNode.details?.name}】门票修改政策：\n1. 提前24小时可免费修改；\n2. 当日修改需收取10%手续费；\n3. 已使用门票不可修改`;
         
         const policyMsg = {
            id: Date.now() + 1,
            sender: 'agent',
            text: policyText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
         };
         setMessages(prev => [...prev, policyMsg]);

         setTimeout(() => {
             const agentInfo = getAgentInfo(currentNode.type);
             const cardMsg = {
               id: Date.now() + 2,
               sender: 'agent',
               type: 'service_card',
               node: currentNode,
               agentInfo: agentInfo,
               time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
             };
             setMessages(prev => [...prev, cardMsg]);
         }, 1000);
         return;
      }
      
      let aiText = '';
      if (activeAgent) {
         if (activeAgent.name.includes('景区')) {
            aiText = `【${activeAgent.name}】为您服务：收到您的需求！作为您的专属导游，我建议您可以错峰游览，避开人流高峰。还需要为您介绍具体的游玩路线吗？`;
         } else if (activeAgent.name.includes('酒店')) {
            aiText = `【${activeAgent.name}】为您服务：好的，这就为您安排。我们酒店提供24小时管家服务，请问还需要帮您预订早餐吗？`;
         } else if (activeAgent.name.includes('餐饮')) {
            aiText = `【${activeAgent.name}】为您服务：收到！这边已经为您关注了排队情况。如果您需要，我可以为您提前取号。`;
         } else if (activeAgent.name.includes('交通')) {
            aiText = `【${activeAgent.name}】为您服务：明白，已为您规划最优路线。现在的路况比较通畅，预计车程20分钟。`;
         } else {
            aiText = `【${activeAgent.name}】收到您的指令，正在为您处理...`;
         }
      } else {
         aiText = '收到！根据您的需求，我为您规划了“贵阳3日经典游”方案。第一天入住市中心，第二天游览地标景点，第三天体验古镇风情。详情如下👇';
      }

      const aiMsg = {
        id: Date.now() + 1,
        sender: 'agent',
        text: aiText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);

      if (!activeAgent) {
          setTimeout(() => {
            const cardMsg = {
              id: Date.now() + 2,
              sender: 'agent',
              type: 'itinerary',
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, cardMsg]);
          }, 600);
      }
    }, 1500);
  };

  const handleAdopt = () => {
    onAdoptTrip(currentTrip);
    // Don't navigate away, just update state in ItineraryCard
  };

  return (
    <div className="h-full w-full bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className={`px-4 py-4 flex items-center gap-3 backdrop-blur-md sticky top-0 z-50 border-b transition-colors ${activeAgent ? `${activeAgent.headerBg} ${activeAgent.border}` : 'bg-white/80 border-slate-100'}`}>
        <button 
          onClick={() => navigate(-1)}
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${activeAgent ? 'bg-white/50 hover:bg-white/80' : 'bg-slate-100 hover:bg-slate-200'}`}
        >
          <ArrowLeft size={20} className={activeAgent ? activeAgent.color : "text-slate-700"} />
        </button>
        <div className="flex-1">
          <h1 className={`text-lg font-bold ${activeAgent ? activeAgent.color : "text-slate-800"}`}>
            {activeAgent ? activeAgent.name : '行程规划助手'}
          </h1>
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full animate-pulse ${activeAgent ? 'bg-green-600' : 'bg-green-500'}`} />
            <span className={`text-xs ${activeAgent ? activeAgent.color : "text-slate-500"}`}>在线</span>
          </div>
        </div>
        <button className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${activeAgent ? 'bg-white/50 hover:bg-white/80' : 'bg-slate-100 hover:bg-slate-200'}`}>
          <Sparkles size={20} className={activeAgent ? activeAgent.iconColor : "text-cyan-600"} />
        </button>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 pb-32 space-y-6">
        {messages.map((msg) => (
          <motion.div 
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 ${
              msg.sender === 'agent' 
                ? (activeAgent ? `${activeAgent.bgColor} ${activeAgent.border}` : 'bg-cyan-100 border-white')
                : 'bg-slate-200 border-white'
            }`}>
              {msg.sender === 'agent' ? (
                activeAgent ? (
                  <activeAgent.icon size={20} className={activeAgent.iconColor} />
                ) : (
                  <img src={TuoSaiImage} alt="Agent" className="w-full h-full object-contain" />
                )
              ) : (
                <span className="text-lg">👤</span>
              )}
            </div>

            {/* Bubble */}
            <div className={`max-w-[85%] space-y-1 ${msg.sender === 'user' ? 'items-end flex flex-col' : ''}`}>
              {msg.type === 'itinerary' ? (
                <div className="w-full min-w-[300px]">
                  <ItineraryCard onAdopt={handleAdopt} tripData={currentTrip} />
                </div>
              ) : msg.type === 'service_card' ? (
                <div className="w-full min-w-[300px]">
                   <ServiceAgentCard 
                     node={msg.node} 
                     agentInfo={msg.agentInfo} 
                     onConnect={() => {
                        setTimeout(() => {
                          const connectedMsg = {
                             id: Date.now(),
                             sender: 'agent',
                             text: `已为您成功接入${msg.agentInfo.name}，现在您可以直接与它对话了。`,
                             time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          };
                          setMessages(prev => [...prev, connectedMsg]);
                          setActiveAgent(msg.agentInfo);
                        }, 1500);
                     }} 
                   />
                </div>
              ) : msg.type === 'day_plan_card' ? (
                <div className="w-full min-w-[300px]">
                   <DayPlanCard 
                     plan={msg.plan}
                     onConfirm={() => {
                        // 1. Update Trip Data
                        if (planningContext && currentTrip) {
                           const { dayIndex } = planningContext;
                           const newSpots = msg.plan.spots;
                           
                           // Convert spots to timeline items
                           const newTimeline = newSpots.map((spot, idx) => ({
                               id: `ai-${Date.now()}-${idx}`,
                               time: spot.time,
                               title: spot.title,
                               type: spot.type,
                               status: 'planned',
                               tips: spot.desc,
                               details: {
                                   name: spot.title,
                                   desc: spot.desc
                               },
                               image: getPlaceholder(200, 200, spot.type)
                           }));
                           
                           const updatedItinerary = [...currentTrip.itinerary];
                           if (updatedItinerary[dayIndex]) {
                               updatedItinerary[dayIndex] = {
                                   ...updatedItinerary[dayIndex],
                                   timeline: newTimeline,
                                   highlights: newSpots.map(s => s.title).join(' — ')
                               };
                               
                               const updatedTrip = { ...currentTrip, itinerary: updatedItinerary };
                               
                               // 2. Persist
                               if (onAdoptTrip) {
                                   onAdoptTrip(updatedTrip);
                               }
                           }
                        }

                        const confirmMsg = {
                            id: Date.now(),
                            sender: 'agent',
                            text: '已成功将该方案加入您的行程！',
                            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        };
                        setMessages(prev => [...prev, confirmMsg]);
                        // Navigate back after short delay
                        setTimeout(() => navigate(-1), 800);
                     }}
                     onRegenerate={() => {
                        const regenMsg = {
                            id: Date.now(),
                            sender: 'user',
                            text: '我对这个方案不太满意，请重新规划。',
                            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        };
                        setMessages(prev => [...prev, regenMsg]);
                        setIsTyping(true);
                        // Simulate regenerate
                        setTimeout(() => {
                            setIsTyping(false);
                            const newPlanMsg = {
                                id: Date.now() + 1,
                                sender: 'agent',
                                type: 'day_plan_card',
                                plan: { ...msg.plan, spots: [...msg.plan.spots].reverse() }, // Mock change
                                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            };
                            setMessages(prev => [...prev, newPlanMsg]);
                        }, 1500);
                     }}
                   />
                </div>
              ) : (
                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-slate-900 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                }`}>
                  {msg.text}
                </div>
              )}
              <span className="text-[10px] text-slate-400 px-1">{msg.time}</span>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
             <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 ${
               activeAgent ? `${activeAgent.bgColor} ${activeAgent.border}` : 'bg-cyan-100 border-white'
             }`}>
                {activeAgent ? (
                   <activeAgent.icon size={20} className={activeAgent.iconColor} />
                ) : (
                   <img src={TuoSaiImage} alt="Agent" className="w-full h-full object-contain" />
                )}
             </div>
             <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
               <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
               <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
             </div>
          </motion.div>
        )}

      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-2 bg-slate-100 rounded-full p-1.5 pl-4">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="输入您的旅行计划..."
              className="flex-1 bg-transparent text-sm outline-none text-slate-800 placeholder-slate-400"
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className="p-2 text-slate-500 hover:text-slate-700">
              <Mic size={18} />
            </button>
            <button 
              onClick={handleSend}
              className={`p-2 rounded-full transition-all ${inputText.trim() ? 'bg-cyan-500 text-white shadow-md' : 'bg-slate-300 text-white'}`}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
    </div>
  );
};

const ItineraryCard = ({ onAdopt, tripData }) => {
  const [activeDay, setActiveDay] = useState(1);
  const [isBudgetExpanded, setIsBudgetExpanded] = useState(false);
  const [isAdopted, setIsAdopted] = useState(false);

  const handleAdoptClick = () => {
    setIsAdopted(true);
    onAdopt();
  };

  if (!tripData) return null;

  return (
    <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden mb-6">
      {/* Card Header */}
      <div className="p-5 border-b border-slate-50 bg-slate-50/50">
        <h2 className="text-xl font-bold text-slate-800 mb-2">{tripData.title}</h2>
        <div className="flex flex-wrap gap-2 mb-3">
          {['7人参考', '经济型', '行程紧凑', '景点最多'].map((tag, i) => (
            <span key={i} className="text-[10px] px-2 py-1 bg-white border border-slate-200 rounded-full text-slate-500 font-medium">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Map Preview */}
      <div className="h-40 bg-slate-100 relative group cursor-pointer overflow-hidden">
        <img 
          src="https://placehold.co/800x400?text=Map+Preview" 
          alt="Map" 
          className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" 
          crossOrigin="anonymous"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
           <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-slate-800 shadow-sm flex items-center gap-1">
             <MapPin size={12} className="text-cyan-600" />
             点击查看路线地图
           </div>
        </div>
      </div>

      {/* Days Tabs */}
      <div className="flex border-b border-slate-100">
        {[1, 2, 3].map(day => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`flex-1 py-3 text-sm font-bold transition-colors relative ${activeDay === day ? 'text-cyan-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            DAY {day}
            {activeDay === day && (
              <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500"
              />
            )}
          </button>
        ))}
      </div>

      {/* Timeline Content */}
      <div className="p-5 bg-white min-h-[300px]">
        {tripData.itinerary.map((day, idx) => (
          activeDay === idx + 1 && (
            <div key={idx} className="space-y-6 relative">
              <div className="absolute top-2 bottom-0 left-[7px] w-0.5 bg-slate-100" />
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
                        <div className="mt-2 w-full h-32 rounded-lg overflow-hidden">
                           <img src={item.image} alt="" className="w-full h-full object-cover" />
                        </div>
                     )}
                     
                     {/* Yellow Xiaoxi Tips */}
                     {item.tips && (
                        <div className="mt-3 pt-3 border-t border-slate-200/50 flex gap-2 items-start">
                           <div className="w-3.5 h-3.5 rounded-full bg-orange-100 flex items-center justify-center shrink-0 mt-0.5">
                              <Sparkles size={8} className="text-orange-500" />
                           </div>
                           <div className="text-[10px] text-slate-500 leading-relaxed">
                              <span className="font-bold text-orange-600">黄小西Tips：</span>
                              {item.tips}
                           </div>
                        </div>
                     )}
                  </div>
                </TimelineItem>
              ))}
            </div>
          )
        ))}
      </div>
      
      {/* Budget Summary */}
      <div className="bg-slate-50 border-t border-slate-100">
        <button 
          onClick={() => setIsBudgetExpanded(!isBudgetExpanded)}
          className="w-full p-4 flex justify-between items-center"
        >
          <span className="text-xs font-bold text-slate-500">预算参考</span>
          <div className="flex items-center gap-1">
             <span className="text-sm font-bold text-red-500">约 ¥ 3,060</span>
             {isBudgetExpanded ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
          </div>
        </button>
        
        <AnimatePresence>
          {isBudgetExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4">
                 <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                    <div className="grid grid-cols-2 bg-slate-50 p-2 text-[10px] text-slate-500 font-bold border-b border-slate-100">
                       <div className="text-center">项目</div>
                       <div className="text-center">单人费用</div>
                    </div>
                    <div className="divide-y divide-slate-50">
                       <div className="grid grid-cols-2 p-2.5 text-xs text-slate-700">
                          <div className="text-center">往返交通</div>
                          <div className="text-center font-bold">¥ 1080 起</div>
                       </div>
                       <div className="grid grid-cols-2 p-2.5 text-xs text-slate-700">
                          <div className="text-center">住宿</div>
                          <div className="text-center font-bold">¥ 1000 起</div>
                       </div>
                       <div className="grid grid-cols-2 p-2.5 text-xs text-slate-700">
                          <div className="text-center">门票</div>
                          <div className="text-center font-bold">¥ 980 起</div>
                       </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="p-4 bg-white border-t border-slate-100 grid grid-cols-3 gap-3">
         <button className="py-2.5 rounded-xl bg-slate-50 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors">
           查看详情
         </button>
         <button className="py-2.5 rounded-xl bg-slate-50 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors">
           调整方案
         </button>
         <button 
           onClick={handleAdoptClick}
           disabled={isAdopted}
           className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-lg ${
             isAdopted 
               ? 'bg-green-50 text-green-600 border border-green-200 shadow-none' 
               : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200'
           }`}
         >
           {isAdopted ? (
             <>
               <Check size={14} /> 已采纳
             </>
           ) : (
             <>
               <Check size={14} /> 采纳行程
             </>
           )}
         </button>
      </div>
    </div>
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

const ServiceAgentCard = ({ node, agentInfo, onConnect }) => {
  const [status, setStatus] = useState('idle'); // idle, connecting, connected

  const handleConnect = () => {
    if (status !== 'idle') return;
    setStatus('connecting');
    onConnect(); // Trigger parent handler
    
    setTimeout(() => {
      setStatus('connected');
    }, 1500);
  };

  return (
    <div className={`bg-white rounded-2xl overflow-hidden shadow-md border ${agentInfo.border}`}>
       {/* Header */}
       <div className={`${agentInfo.headerBg} p-4 flex items-center gap-3 border-b ${agentInfo.border}`}>
         <div className={`w-10 h-10 rounded-full ${agentInfo.bgColor} flex items-center justify-center shrink-0`}>
           <agentInfo.icon size={20} className={agentInfo.iconColor} />
         </div>
         <div className="flex-1">
           <h3 className={`font-bold text-sm ${agentInfo.color}`}>{agentInfo.name}</h3>
           <p className={`text-[10px] font-bold ${agentInfo.iconColor} opacity-80`}>{agentInfo.tag}</p>
         </div>
       </div>

       {/* Content */}
       <div className="p-4">
         <div className="mb-4">
           <p className="text-xs text-slate-500 leading-relaxed mb-2">{agentInfo.description}</p>
           <div className="bg-slate-50 rounded-lg p-2 flex items-center gap-2">
             <div className="w-8 h-8 rounded-md bg-white border border-slate-100 flex items-center justify-center shrink-0">
                {node.type === 'scenic' ? <Camera size={14} className="text-slate-400"/> : 
                 node.type === 'hotel' ? <Hotel size={14} className="text-slate-400"/> :
                 <Info size={14} className="text-slate-400"/>}
             </div>
             <div className="flex-1 min-w-0">
               <div className="text-xs font-bold text-slate-800 truncate">{node.title || node.details?.name}</div>
               <div className="text-[10px] text-slate-400 truncate">{node.details?.desc}</div>
             </div>
           </div>
         </div>

         <button
           onClick={handleConnect}
           disabled={status !== 'idle'}
           className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
             status === 'idle' 
               ? `${agentInfo.btnBg} text-white hover:opacity-90 active:scale-95 shadow-lg shadow-blue-100` 
               : status === 'connecting'
                 ? 'bg-slate-100 text-slate-400 cursor-wait'
                 : 'bg-green-50 text-green-600 border border-green-200 cursor-default'
           }`}
         >
           {status === 'idle' && (
             <>
               <Sparkles size={14} /> 接入服务
             </>
           )}
           {status === 'connecting' && (
             <>
               <Loader2 size={14} className="animate-spin" /> 正在接入...
             </>
           )}
           {status === 'connected' && (
             <>
               <Check size={14} /> 已接入
             </>
           )}
         </button>
       </div>
    </div>
  );
};

const DayPlanCard = ({ plan, onConfirm, onRegenerate }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-purple-100">
       <div className="bg-purple-50/50 p-4 border-b border-purple-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Wand2 size={16} className="text-purple-600" />
             </div>
             <div>
                <h3 className="font-bold text-sm text-slate-800">AI 推荐行程</h3>
                <p className="text-[10px] text-purple-600 font-bold">基于起点终点智能生成</p>
             </div>
          </div>
       </div>
       
       <div className="p-4 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">
             <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="font-bold">{plan.start}</span>
             </div>
             <ArrowRight size={14} className="text-slate-300" />
             <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="font-bold">{plan.end}</span>
             </div>
          </div>

          <div className="space-y-3 relative pl-2">
             <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100" />
             {plan.spots.map((spot, i) => (
                <div key={i} className="flex gap-3 relative">
                   <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 z-10 border-2 border-white ${
                      i === 0 ? 'bg-green-500 text-white' : 
                      i === plan.spots.length - 1 ? 'bg-red-500 text-white' : 
                      'bg-purple-100 text-purple-500'
                   }`}>
                      {i === 0 || i === plan.spots.length - 1 ? <div className="w-1.5 h-1.5 bg-white rounded-full" /> : <span className="text-[10px] font-bold">{i + 1}</span>}
                   </div>
                   <div className="flex-1 min-w-0 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div className="flex justify-between items-start mb-1">
                         <h4 className="font-bold text-xs text-slate-800">{spot.title}</h4>
                         <span className="text-[10px] font-mono text-slate-400">{spot.time}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">{spot.desc}</p>
                   </div>
                </div>
             ))}
          </div>

          <div className="flex gap-3 pt-2">
             <button 
               onClick={onRegenerate}
               className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-slate-50"
             >
                <RefreshCcw size={14} /> 重新规划
             </button>
             <button 
               onClick={onConfirm}
               className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-slate-800 shadow-lg shadow-slate-200"
             >
                <Check size={14} /> 加入原行程
             </button>
          </div>
       </div>
    </div>
  );
};

export default ChatPlanning;
