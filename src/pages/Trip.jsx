import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, ChevronRight, Users, Clock, ArrowUpRight, Scale, CheckCircle2, Circle, X, Play, Calendar as CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getPlaceholder } from '../utils/imageUtils';

const Trip = ({ adoptedTrip, onUpdateTrip }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [selectedTrips, setSelectedTrips] = useState([]);
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [tempStartDate, setTempStartDate] = useState('');
  const [tripToStart, setTripToStart] = useState(null);

  // Mock Data for Demo Purposes if adoptedTrip is the only one
  const mockHistoryTrips = [
    {
      id: 'mock-1',
      title: '黔东南苗寨深度体验3日游',
      date: '04/15 - 04/17',
      days: 3,
      distance: '320km',
      rating: '9.6',
      image: getPlaceholder(400, 300, 'Miao Village Trip'),
      status: 'planned' // Changed from completed to planned for demo
    },
    {
      id: 'mock-2',
      title: '遵义红色记忆之旅2日游',
      date: '03/10 - 03/11',
      days: 2,
      distance: '180km',
      rating: '9.5',
      image: getPlaceholder(400, 300, 'Zunyi Trip'),
      status: 'planned' // Changed from completed to planned for demo
    }
  ];

  const myTrips = adoptedTrip ? [adoptedTrip, ...mockHistoryTrips] : [...mockHistoryTrips];

  const handleOpenStartModal = (trip, e) => {
    e.stopPropagation();
    setTripToStart(trip);
    setIsStartModalOpen(true);
  };

  const handleStartTrip = () => {
    if (!tempStartDate || !tripToStart) return;
    const date = new Date(tempStartDate);
    if (date <= new Date()) {
        alert("请选择当前时间之后的时间");
        return;
    }
    
    // If it's the adopted trip, update it
    if (adoptedTrip && tripToStart.id === adoptedTrip.id) {
        onUpdateTrip({ startTime: date.toISOString(), status: 'upcoming' });
    } else {
        // For mock trips, we can't really update global state effectively without a real backend or more complex state
        // But for demo, we'll just alert
        alert(`行程 "${tripToStart.title}" 已开启！`);
    }
    
    setIsStartModalOpen(false);
    setTripToStart(null);
    setTempStartDate('');
  };

  const handleTerminateTrip = (trip, e) => {
      e.stopPropagation();
      if (window.confirm('确定要提前结束该行程吗？结束行程后将停止行程提醒。')) {
          if (adoptedTrip && trip.id === adoptedTrip.id) {
              onUpdateTrip({ startTime: null, status: 'completed' });
          } else {
              alert(`行程 "${trip.title}" 已结束！`);
          }
      }
  };

  // Dynamically generate tabs based on trips
  const uniqueDates = [...new Set(myTrips.map(trip => trip.date))];
  const tabs = [
    { id: 'all', label: '全部' },
    ...uniqueDates.map((date, index) => ({ id: `date-${index}`, label: date }))
  ];

  const filteredTrips = activeTab === 'all' 
    ? myTrips 
    : myTrips.filter(t => {
        const selectedTab = tabs.find(tab => tab.id === activeTab);
        return selectedTab && t.date === selectedTab.label;
    });

  const toggleTripSelection = (tripId) => {
    if (selectedTrips.includes(tripId)) {
      setSelectedTrips(selectedTrips.filter(id => id !== tripId));
    } else {
      if (selectedTrips.length >= 3) {
        // Optional: Alert max 3
        return;
      }
      setSelectedTrips([...selectedTrips, tripId]);
    }
  };

  const handleStartCompare = () => {
    const tripsToCompare = myTrips.filter(t => selectedTrips.includes(t.id));
    navigate('/trip/compare', { state: { trips: tripsToCompare } });
  };

  return (
    <div className="h-full w-full relative overflow-hidden">
      <div className="h-full w-full overflow-y-auto scrollbar-hide pb-24 px-6 pt-12">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-black text-slate-800 tracking-tighter leading-tight">精选线路</h1>
        <p className="text-sm text-slate-500 font-medium mt-1 tracking-wide">EXPLORE GUIZHOU</p>
      </header>

      {/* Featured Routes (Horizontal Scroll) - Shrunk */}
      <div className="overflow-x-auto scrollbar-hide -mx-6 px-6 mb-8 flex gap-3">
        <HorizontalTripCard 
          country="中国·贵州"
          title="黄果树瀑布深度游"
          date="05/01 - 05/03"
          users={[getPlaceholder(100, 100, 'U1'), getPlaceholder(100, 100, 'U2'), getPlaceholder(100, 100, 'U3')]}
          extraUsers={22}
          bgImage={getPlaceholder(600, 300, 'Waterfall Trip')}
          icon="🌊"
        />
        <HorizontalTripCard 
          country="中国·贵州"
          title="西江千户苗寨"
          date="05/04 - 05/06"
          users={[getPlaceholder(100, 100, 'U4'), getPlaceholder(100, 100, 'U5')]}
          extraUsers={15}
          bgImage={getPlaceholder(600, 300, 'Miao Village')}
          icon="🏮"
        />
      </div>

      {/* My Trips Section */}
      <section>
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex justify-between items-center mr-2">
            <h2 className="text-xl font-bold text-slate-800 whitespace-nowrap">我的行程</h2>
            
            <button 
              onClick={() => {
                setIsCompareMode(!isCompareMode);
                setSelectedTrips([]);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${isCompareMode ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              {isCompareMode ? <X size={14} /> : <Scale size={14} />}
              {isCompareMode ? '取消对比' : '行程对比'}
            </button>
          </div>

          {/* Date Tabs (Hide in compare mode to simplify) */}
          {!isCompareMode && (
            <div className="flex gap-3 overflow-x-auto scrollbar-hide w-full pb-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 px-5 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === tab.id ? 'bg-[#052216] text-white shadow-lg scale-105' : 'bg-white text-slate-800 border border-slate-100'}`}
                >
                  <Calendar size={16} className={activeTab === tab.id ? 'opacity-100' : 'opacity-40'} />
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Trip List */}
        <div className="space-y-6 pb-20">
          <AnimatePresence mode="popLayout">
            {filteredTrips.map((trip) => (
              <TripCard 
                key={trip.id} 
                trip={trip} 
                isCompareMode={isCompareMode}
                isSelected={selectedTrips.includes(trip.id)}
                onSelect={() => toggleTripSelection(trip.id)}
                onStart={(e) => handleOpenStartModal(trip, e)}
                onTerminate={(e) => handleTerminateTrip(trip, e)}
              />
            ))}
          </AnimatePresence>
          {filteredTrips.length === 0 && (
            <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-3xl border border-slate-100">
              <Calendar size={48} className="mx-auto mb-2 opacity-20" />
              <p className="text-sm">暂无行程，快去规划你的第一次旅行吧</p>
            </div>
          )}
        </div>
      </section>
      </div>

      {/* Floating Action Button for Compare */}
      <AnimatePresence>
        {isCompareMode && selectedTrips.length >= 2 && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute bottom-28 right-6 z-50"
          >
            <div className="relative group">
               {/* Tooltip */}
               <div className="absolute bottom-full right-0 mb-3 w-max opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                 <div className="bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl mb-1">
                   点击开始对比
                 </div>
               </div>

               <button 
                onClick={handleStartCompare}
                className="w-16 h-16 bg-cyan-500 text-white rounded-full shadow-2xl shadow-cyan-200 flex flex-col items-center justify-center active:scale-95 transition-transform relative border-4 border-white gap-0.5"
               >
                <span className="text-[10px] font-bold leading-none">开始</span>
                <span className="text-[10px] font-bold leading-none">比对</span>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm">
                  {selectedTrips.length}
                </div>
               </button>
            </div>
          </motion.div>
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
                 <h2 className="text-xl font-bold text-slate-800">开启行程：{tripToStart?.title}</h2>
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
    </div>
  );
};

const HorizontalTripCard = ({ country, title, date, users, extraUsers, bgImage, icon }) => (
  // Shrunk dimensions: w-[70%] h-48 (was w-[85%] h-64)
  <div className="flex-shrink-0 w-[70%] h-48 rounded-[2rem] p-5 text-white relative overflow-hidden group">
    {/* Background Image */}
    <div className="absolute inset-0">
      <img src={bgImage} alt={title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
    </div>

    <div className="absolute top-0 right-0 p-4 z-10">
       <button className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/10">
         <ArrowUpRight size={12} />
       </button>
    </div>

    <div className="relative z-10 h-full flex flex-col justify-between">
      <div className="pt-1">
        <div className="flex items-center gap-1.5 mb-1.5">
           <div className="w-3 h-2 bg-cyan-500 rounded-sm" /> 
           <span className="text-[9px] font-bold tracking-widest uppercase opacity-90 text-shadow">{country}</span>
        </div>
        <h3 className="text-lg font-bold leading-tight mb-1.5 text-shadow-sm line-clamp-2">{title}</h3>
        <div className="flex items-center gap-1.5 text-[10px] opacity-80 font-medium">
          <Calendar size={10} />
          <span>{date}</span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex -space-x-2">
          {users.map((u, i) => (
            <img key={i} src={u} alt="User" className="w-6 h-6 rounded-full border border-slate-900 object-cover" />
          ))}
          <div className="w-6 h-6 rounded-full bg-cyan-500 border border-slate-900 flex items-center justify-center text-white text-[8px] font-bold">
            +{extraUsers}
          </div>
        </div>
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
          <span className="text-base">{icon}</span>
        </div>
      </div>
    </div>
  </div>
);

const TripCard = ({ trip, isCompareMode, isSelected, onSelect, onStart, onTerminate }) => {
  const navigate = useNavigate();
  
  return (
  <motion.div 
    layout
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: -20, opacity: 0 }}
    onClick={() => {
      if (isCompareMode) {
        onSelect();
      } else {
        navigate(`/trip/${trip.id}`);
      }
    }}
    className={`w-full h-[280px] rounded-[2rem] relative overflow-hidden group cursor-pointer shadow-sm transition-all ${isCompareMode && isSelected ? 'ring-4 ring-cyan-500 scale-[0.98]' : ''}`}
  >
    <img 
      src={trip.image} 
      alt={trip.title} 
      crossOrigin="anonymous"
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
    
    <div className="absolute top-5 left-5 z-20 flex items-center gap-2">
       <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/10">
         {trip.status === 'upcoming' ? '即将开始' : trip.status === 'completed' ? '已完成' : '计划中'}
       </span>
    </div>

    {/* Start Trip Button (Only for planned/upcoming without start time) */}
    {!isCompareMode && !trip.startTime && trip.status !== 'completed' && (
      <div className="absolute top-5 right-5 z-30">
        <button 
          onClick={onStart}
          className="bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg shadow-cyan-500/30 flex items-center gap-1.5 active:scale-95 transition-all"
        >
          <Play size={12} fill="currentColor" />
          开始行程
        </button>
      </div>
    )}

    {/* Terminate Trip Button (For trips that have started) */}
    {!isCompareMode && trip.startTime && trip.status !== 'completed' && (
      <div className="absolute top-5 right-5 z-30">
        <button 
          onClick={onTerminate}
          className="bg-red-500/80 hover:bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg shadow-red-500/30 flex items-center gap-1.5 active:scale-95 transition-all backdrop-blur-md"
        >
          <X size={12} />
          提前结束
        </button>
      </div>
    )}

    {/* Selection Overlay */}
    {isCompareMode && (
      <div className="absolute top-5 right-5 z-30">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isSelected ? 'bg-cyan-500 text-white shadow-lg' : 'bg-white/30 backdrop-blur-md border border-white/50'}`}>
          {isSelected ? <CheckCircle2 size={18} /> : <Circle size={18} className="text-white" />}
        </div>
      </div>
    )}

    <div className="absolute bottom-0 left-0 right-0 p-6">
      <div className="mb-4">
        <h3 className="text-white text-xl font-bold leading-tight mb-1 line-clamp-2">
          {trip.title}
        </h3>
        <p className="text-white/60 text-xs font-medium">{trip.date}</p>
      </div>
      
      <div className="flex items-center gap-3 text-white/80 text-xs font-medium">
         <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-lg backdrop-blur-sm">
           <Clock size={12} />
           <span>{trip.days}天</span>
         </div>
         <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-lg backdrop-blur-sm">
           <MapPin size={12} />
           <span>{trip.distance}</span>
         </div>
         <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-lg backdrop-blur-sm">
           <Users size={12} />
           <span>{trip.rating}分</span>
         </div>
      </div>
    </div>
  </motion.div>
)};

export default Trip;
