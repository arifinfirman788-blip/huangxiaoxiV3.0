import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { GitBranch, RotateCcw } from 'lucide-react';
import Layout from './components/Layout';
import MobileWrapper from './components/MobileWrapper';
import ProjectMindMap from './components/ProjectMindMap';
import Home from './pages/Home';
import Trip from './pages/Trip';
import Message from './pages/Message';
import Profile from './pages/Profile';
import Shop from './pages/Shop';
import MessageDetail from './pages/MessageDetail';
import AgentCategoryList from './pages/AgentCategoryList';
import News from './pages/News';
import ChatPlanning from './pages/ChatPlanning';
import TripDetail from './pages/TripDetail';
import TripCompare from './pages/TripCompare';
import Login from './pages/Login';
import AgentSquare from './pages/AgentSquare';
import AgentWorkspace from './components/AgentWorkspace';

// Auth Guard Component
const RequireAuth = ({ children, isAuthenticated }) => {
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

function App() {
  const [showMindMap, setShowMindMap] = useState(false);
  const [adoptedTrip, setAdoptedTrip] = useState(null);
  
  // Split View State for Dual-Phone Agent Interaction
  const [splitViewState, setSplitViewState] = useState({
    isOpen: false,
    agent: null,
    data: null,
    merchantChatHistory: [], // Added to store chat history
    isHumanMode: false
  });

  // Load persisted trip on mount
  useEffect(() => {
     const savedTrip = localStorage.getItem('adoptedTrip');
     if (savedTrip) {
        setAdoptedTrip(JSON.parse(savedTrip));
     }
  }, []);

  const handleAdoptTrip = (trip) => {
    setAdoptedTrip(trip);
    // Persist to local storage
    localStorage.setItem('adoptedTrip', JSON.stringify(trip));
  };

  const handleUpdateTrip = (updates) => {
    if (!adoptedTrip) return;
    const newTrip = { ...adoptedTrip, ...updates };
    setAdoptedTrip(newTrip);
    localStorage.setItem('adoptedTrip', JSON.stringify(newTrip));
  };

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(true);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleReset = () => {
    setIsAuthenticated(false);
    setAdoptedTrip(null);
    setSplitViewState({ isOpen: false, agent: null, data: null });
    localStorage.removeItem('adoptedTrip');
    window.location.href = '/'; // Force reload/navigate to home to clear everything cleanly
  };

  const handleServiceSubmit = ({ serviceType, data, agentContext }) => {
    console.log('Service Submitted:', serviceType, data, agentContext);
    setSplitViewState({
      isOpen: true,
      agent: agentContext || { name: '商家智能体', avatar: null, color: 'text-slate-800' },
      data: data,
      merchantChatHistory: [] // Reset history on new service
    });
  };

  const handleConnectAgent = (agentContext) => {
    setSplitViewState({
      isOpen: true,
      agent: agentContext,
      data: null, // No data yet, just connecting
      merchantChatHistory: [] // Reset history on new connection
    });
  };

  const [agentFeedback, setAgentFeedback] = useState(null);
  const [merchantMessage, setMerchantMessage] = useState(null);

  const handleAgentFeedback = (feedback) => {
    console.log('Agent Feedback Received:', feedback);
    setAgentFeedback(feedback);
    // Close the workspace (Service Agent hides)
    setSplitViewState(prev => ({ ...prev, isOpen: false }));
  };

  const handleUserMessage = (msg) => {
     // Append user/ai message to merchant chat history
     setSplitViewState(prev => ({
         ...prev,
         merchantChatHistory: [...prev.merchantChatHistory, msg]
     }));
  };

  const handleMerchantReply = (text) => {
     const msg = {
         id: Date.now(),
         sender: 'agent',
         text: text,
         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
     };
     
     // Update local history
     setSplitViewState(prev => ({
         ...prev,
         merchantChatHistory: [...prev.merchantChatHistory, { ...msg, sender: 'merchant' }]
     }));

     // Send to ChatInterface
     setMerchantMessage(msg);
  };

  const handleToggleHumanMode = () => {
    setSplitViewState(prev => ({ ...prev, isHumanMode: !prev.isHumanMode }));
  };

  return (
    <Router basename={import.meta.env.BASE_URL}>
      {/* Global Reset State Button */}
      <button 
        onClick={handleReset}
        className="fixed top-4 left-4 z-[9999] bg-red-500 text-white p-3 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 font-bold pr-5 border-2 border-white/20"
        title="重置状态"
      >
        <RotateCcw size={20} />
        <span className="text-xs">重置状态</span>
      </button>

      {/* Global Functional Mind Map Button */}
      <button 
        onClick={() => setShowMindMap(true)}
        className="fixed top-20 left-4 z-[9999] bg-slate-900 text-white p-3 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 font-bold pr-5 border-2 border-white/20"
        title="查看功能脑图"
      >
        <GitBranch size={20} />
        <span className="text-xs">功能预览</span>
      </button>

      {/* Mind Map Modal */}
      <ProjectMindMap isOpen={showMindMap} onClose={() => setShowMindMap(false)} />

      <MobileWrapper 
        trip={adoptedTrip}
        isSplitView={splitViewState.isOpen}
        secondaryContent={
          splitViewState.isOpen ? (
            <AgentWorkspace 
              agent={splitViewState.agent} 
              data={splitViewState.data} 
              chatHistory={splitViewState.merchantChatHistory}
              onClose={() => setSplitViewState(prev => ({ ...prev, isOpen: false }))}
              onFeedback={handleAgentFeedback}
              onMerchantReply={handleMerchantReply}
              isHumanMode={splitViewState.isHumanMode}
              onToggleHumanMode={handleToggleHumanMode}
            />
          ) : null
        }
      >
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          
          <Route element={<Layout onAdoptTrip={handleAdoptTrip} isAuthenticated={isAuthenticated} hasTrip={!!adoptedTrip} isBottomNavVisible={isBottomNavVisible} />}>
            <Route path="/" element={
              <Home 
                adoptedTrip={adoptedTrip} 
                onUpdateTrip={handleUpdateTrip} 
                isAuthenticated={isAuthenticated} 
                toggleBottomNav={setIsBottomNavVisible}
                onServiceSubmit={handleServiceSubmit}
                onConnectAgent={handleConnectAgent}
                agentFeedback={agentFeedback}
                merchantMessage={merchantMessage}
                onUserMessage={handleUserMessage}
                isHumanMode={splitViewState.isHumanMode}
              />
            } />
            <Route path="/trip" element={
              <RequireAuth isAuthenticated={isAuthenticated}>
                <Trip adoptedTrip={adoptedTrip} onUpdateTrip={handleUpdateTrip} />
              </RequireAuth>
            } />
            <Route path="/shop" element={<Shop />} />
            <Route path="/profile" element={
              <Profile isAuthenticated={isAuthenticated} onLogout={handleLogout} />
            } />
            <Route path="/category/:id" element={<AgentCategoryList />} />
          </Route>
          
          <Route path="/message" element={
            <RequireAuth isAuthenticated={isAuthenticated}>
              <Message />
            </RequireAuth>
          } />
          <Route path="/message/:id" element={
            <RequireAuth isAuthenticated={isAuthenticated}>
              <MessageDetail />
            </RequireAuth>
          } />
          <Route path="/news" element={<News />} />
          <Route path="/agent-square" element={<AgentSquare />} />
          <Route path="/chat-planning" element={
            <RequireAuth isAuthenticated={isAuthenticated}>
              <ChatPlanning onAdoptTrip={setAdoptedTrip} />
            </RequireAuth>
          } />
          <Route path="/trip/:id" element={
            <RequireAuth isAuthenticated={isAuthenticated}>
              <TripDetail adoptedTrip={adoptedTrip} />
            </RequireAuth>
          } />
          <Route path="/trip/compare" element={
            <RequireAuth isAuthenticated={isAuthenticated}>
              <TripCompare />
            </RequireAuth>
          } />
        </Routes>
      </MobileWrapper>
    </Router>
  );
}

export default App;
