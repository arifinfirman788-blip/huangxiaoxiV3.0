import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, Star, MapPin, Clock, DollarSign, Activity, Award, Route, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TripCompare = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { trips } = location.state || { trips: [] };
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'details'
  const [highlightsModal, setHighlightsModal] = useState(null); // stores trip data for modal

  if (!trips || trips.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <p className="text-slate-500 mb-4">未选择行程进行对比</p>
        <button onClick={() => navigate(-1)} className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold">
          返回
        </button>
      </div>
    );
  }

  const dimensions = [
    { key: 'theme', label: '行程主题', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50' }, 
    { key: 'budget', label: '预估费用', icon: DollarSign, color: 'text-green-500', bg: 'bg-green-50' },
    { key: 'days', label: '行程天数', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
    { key: 'distance', label: '总路程', icon: MapPin, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { key: 'efficiency', label: '路线效率', icon: Route, color: 'text-orange-500', bg: 'bg-orange-50' },
    { key: 'pace', label: '行程强度', icon: Activity, color: 'text-red-500', bg: 'bg-red-50' },
    { key: 'highlights', label: '特色亮点', icon: Award, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  // Mock data enhancement for comparison if missing
  const enhancedTrips = trips.map((trip, tripIndex) => {
    // Generate mock itinerary for deep dive if missing
    const detailedItinerary = trip.itinerary || Array.from({ length: trip.days || 3 }).map((_, dayIndex) => {
       // Create some overlapping and some unique spots
       const commonSpots = [
         { name: '黄果树瀑布', type: 'scenic', desc: '亚洲第一大瀑布，震撼壮观', tag: '必打卡' },
         { name: '甲秀楼', type: 'scenic', desc: '贵阳地标，夜景绝美', tag: '人文' }
       ];
       const uniqueSpotsA = [
         { name: '天星桥', type: 'scenic', desc: '喀斯特地貌精华，水上石林', tag: '自然' },
         { name: '陡坡塘', type: 'scenic', desc: '西游记取景地', tag: '怀旧' }
       ];
       const uniqueSpotsB = [
         { name: '青岩古镇', type: 'scenic', desc: '明清古建筑群，特色美食', tag: '古镇' },
         { name: '花溪夜郎谷', type: 'scenic', desc: '石头城堡，神秘奇特', tag: '艺术' }
       ];
       
       let spots = [];
       if (dayIndex === 0) {
           spots = [...commonSpots, ...(tripIndex % 2 === 0 ? uniqueSpotsA : uniqueSpotsB)];
       } else {
           spots = tripIndex % 2 === 0 ? uniqueSpotsA : uniqueSpotsB;
       }
       
       return {
           day: dayIndex + 1,
           spots: spots
       };
    });

    return {
      ...trip,
      budget: trip.budget || `¥${Math.floor(Math.random() * 3000) + 2000}`,
      pace: trip.pace || ['轻松', '适中', '紧凑'][Math.floor(Math.random() * 3)],
      theme: trip.theme || ['适合亲子', '适合人文', '适合摄影', '休闲度假'][Math.floor(Math.random() * 4)],
      efficiency: trip.efficiency || (Math.random() > 0.3 ? '顺路不绕行' : '轻微绕路'),
      highlightsCount: trip.itinerary ? trip.itinerary.flatMap(d => d.timeline.filter(t => t.type === 'scenic')).length : detailedItinerary.flatMap(d => d.spots).length,
      highlightsList: trip.itinerary 
        ? trip.itinerary.flatMap(d => d.timeline.filter(t => t.type === 'scenic').map(t => t.title)) 
        : detailedItinerary.flatMap(d => d.spots.map(s => s.name)),
      detailedItinerary
    };
  });

  // Determine winner for each numeric/logic dimension
  const getWinnerId = (key) => {
    if (key === 'budget') {
      // Lower is better
      return enhancedTrips.sort((a, b) => parseInt(a.budget.replace('¥', '')) - parseInt(b.budget.replace('¥', '')))[0].id;
    }
    if (key === 'highlightsCount') {
      // Higher is better
      return enhancedTrips.sort((a, b) => b.highlightsCount - a.highlightsCount)[0].id;
    }
    if (key === 'efficiency') {
        // "顺路不绕行" is better
        return enhancedTrips.find(t => t.efficiency === '顺路不绕行')?.id;
    }
    return null;
  };

  return (
    <div className="h-full w-full bg-white relative flex flex-col overflow-hidden">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide relative">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-800">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-slate-800">行程对比分析</h1>
          <div className="w-10" />
        </div>

        {/* Tab Controls */}
        <div className="px-6 py-2">
            <div className="flex bg-slate-100 p-1 rounded-xl">
                <button 
                    onClick={() => setActiveTab('overview')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'overview' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
                >
                    行程概览
                </button>
                <button 
                    onClick={() => setActiveTab('details')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'details' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
                >
                    深度对比
                </button>
            </div>
        </div>

        <div className="p-6 pb-24">
          {activeTab === 'overview' ? (
          /* Comparison Table */
          <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100">
            
            {/* Header Row */}
            <div className="flex gap-4 mb-6">
              <div className="w-20 shrink-0 flex flex-col justify-end pb-2">
                <span className="text-xs font-bold text-slate-400">对比维度</span>
              </div>
              {enhancedTrips.map(trip => (
                <div key={trip.id} className="flex-1 min-w-0">
                  <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-3 relative shadow-sm">
                    <img src={trip.image} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-800 line-clamp-2 h-8 leading-tight text-center">{trip.title}</h3>
                </div>
              ))}
            </div>

            {/* Dimension Rows */}
            <div className="space-y-6">
              {dimensions.map((dim, index) => {
                const winnerId = getWinnerId(dim.key === 'highlights' ? 'highlightsCount' : dim.key);
                const Icon = dim.icon;

                return (
                  <div key={dim.key} className={`flex items-center gap-4 ${index !== dimensions.length - 1 ? 'border-b border-slate-200/60 pb-6' : ''}`}>
                    {/* Dimension Label */}
                    <div className="w-20 shrink-0 flex flex-col items-center gap-1">
                      <div className={`w-10 h-10 rounded-full ${dim.bg} flex items-center justify-center ${dim.color} shadow-sm`}>
                        <Icon size={18} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">{dim.label}</span>
                    </div>

                    {/* Values */}
                    {enhancedTrips.map(trip => {
                      let displayValue = trip[dim.key];
                      let isClickable = false;

                      if (dim.key === 'highlights') {
                          displayValue = `${trip.highlightsCount}个景点`;
                          isClickable = true;
                      }
                      
                      const isWinner = trip.id === winnerId;

                      return (
                        <div key={trip.id} className="flex-1 flex flex-col items-center justify-center relative h-full">
                           {isWinner && (
                             <div className="absolute -top-6 z-10">
                               <span className="text-[9px] bg-red-100 text-red-500 px-2 py-0.5 rounded-full font-bold shadow-sm border border-red-200">
                                 更优
                               </span>
                             </div>
                           )}
                           
                           {isClickable ? (
                              <button 
                                  onClick={() => setHighlightsModal(trip)}
                                  className={`flex items-center justify-center gap-0.5 text-sm font-bold ${isWinner ? 'text-slate-900 scale-110' : 'text-slate-600'} transition-all hover:text-cyan-600`}
                              >
                                  {displayValue}
                                  <ChevronRight size={12} className="opacity-50" />
                              </button>
                           ) : (
                              <span className={`text-sm font-bold text-center ${isWinner ? 'text-slate-900 scale-110' : 'text-slate-500'} transition-all`}>
                                  {displayValue}
                              </span>
                           )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
          ) : (
            /* Deep Dive View */
            <div className="space-y-8">
                {/* Day by Day Comparison */}
                {Array.from({ length: Math.max(...enhancedTrips.map(t => t.days || 3)) }).map((_, dayIndex) => {
                    const day = dayIndex + 1;
                    // Collect spots for this day from all trips
                    const daySpotsMap = {};
                    enhancedTrips.forEach(trip => {
                        const dayItinerary = trip.detailedItinerary.find(d => d.day === day);
                        if (dayItinerary) {
                            dayItinerary.spots.forEach(spot => {
                                if (!daySpotsMap[spot.name]) {
                                    daySpotsMap[spot.name] = { ...spot, trips: [] };
                                }
                                daySpotsMap[spot.name].trips.push(trip.id);
                            });
                        }
                    });

                    const allSpots = Object.values(daySpotsMap);
                    const commonSpots = allSpots.filter(s => s.trips.length === enhancedTrips.length);
                    const diffSpots = allSpots.filter(s => s.trips.length < enhancedTrips.length);

                    if (allSpots.length === 0) return null;

                    return (
                        <div key={day} className="bg-slate-50 rounded-[2rem] p-5 border border-slate-100">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="bg-slate-900 text-white text-xs font-bold px-2.5 py-1 rounded-lg">Day {day}</span>
                                <h3 className="font-bold text-slate-800">行程节点对比</h3>
                            </div>

                            {/* Common Spots */}
                            {commonSpots.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                                        <Check size={12} className="text-green-500" />
                                        共同包含 ({commonSpots.length})
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {commonSpots.map((spot, i) => (
                                            <div key={i} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="font-bold text-slate-800 text-sm">{spot.name}</span>
                                                    <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{spot.tag}</span>
                                                </div>
                                                <p className="text-[10px] text-slate-400 leading-tight line-clamp-2">{spot.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Differences */}
                            {diffSpots.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                                        <Activity size={12} className="text-orange-500" />
                                        差异对比
                                    </h4>
                                    <div className="space-y-3">
                                        {enhancedTrips.map(trip => {
                                            const tripUniqueSpots = diffSpots.filter(s => s.trips.includes(trip.id));
                                            const missingSpots = diffSpots.filter(s => !s.trips.includes(trip.id));
                                            
                                            return (
                                                <div key={trip.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <img src={trip.image} className="w-6 h-6 rounded-full object-cover border border-slate-200" />
                                                        <span className="font-bold text-xs text-slate-700 truncate max-w-[120px]">{trip.title}</span>
                                                    </div>
                                                    
                                                    {/* Unique Spots (Gains) */}
                                                    {tripUniqueSpots.length > 0 && (
                                                        <div className="mb-3">
                                                            <div className="flex items-center gap-1.5 mb-1.5">
                                                                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">独有体验</span>
                                                            </div>
                                                            <ul className="space-y-1.5">
                                                                {tripUniqueSpots.map((s, i) => (
                                                                    <li key={i} className="flex items-start gap-2">
                                                                        <div className="w-1 h-1 rounded-full bg-green-400 mt-1.5 shrink-0" />
                                                                        <div>
                                                                            <span className="text-xs font-bold text-slate-700">{s.name}</span>
                                                                            <span className="text-[10px] text-slate-400 ml-1">- {s.desc}</span>
                                                                        </div>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}

                                                    {/* Missing Spots (Losses) */}
                                                    {missingSpots.length > 0 && (
                                                        <div>
                                                            <div className="flex items-center gap-1.5 mb-1.5">
                                                                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">未包含</span>
                                                            </div>
                                                            <p className="text-[10px] text-slate-400 leading-relaxed">
                                                                相比其他方案，将错过 
                                                                {missingSpots.map((s, i) => (
                                                                    <span key={i} className="font-bold text-slate-500 mx-1">{s.name}</span>
                                                                ))}
                                                                等体验 ({missingSpots[0]?.desc})
                                                            </p>
                                                        </div>
                                                    )}
                                                    
                                                    {tripUniqueSpots.length === 0 && missingSpots.length === 0 && (
                                                        <p className="text-xs text-slate-400 italic">与其他方案行程一致</p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
          )}
        </div>
      </div>

      {/* Highlights Modal */}
      <AnimatePresence>
        {highlightsModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={() => setHighlightsModal(null)}
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2rem] p-6 z-50 max-h-[60vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">
                    特色亮点 
                    <span className="text-sm font-normal text-slate-500 ml-2">({highlightsModal.highlightsCount}个)</span>
                </h3>
                <button onClick={() => setHighlightsModal(null)} className="p-2 bg-slate-100 rounded-full text-slate-500">
                  <X size={18} />
                </button>
              </div>
              
              <div className="space-y-3">
                {highlightsModal.highlightsList.map((highlight, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-500 flex items-center justify-center font-bold text-xs">
                        {i + 1}
                    </div>
                    <span className="font-bold text-slate-700 text-sm">{highlight}</span>
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

export default TripCompare;
