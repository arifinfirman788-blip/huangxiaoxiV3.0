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

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleReset = () => {
    setIsAuthenticated(false);
    setAdoptedTrip(null);
    localStorage.removeItem('adoptedTrip');
    window.location.href = '/'; // Force reload/navigate to home to clear everything cleanly
  };

  return (
    <Router basename={import.meta.env.BASE_URL}>
      {/* Global Reset State Button */}
      <button 
        onClick={handleReset}
        className="fixed top-[calc(50%-60px)] right-[calc(50%-170px)] z-[9999] bg-red-500 text-white p-3 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 font-bold pr-5 border-2 border-white/20 transform -translate-y-1/2 translate-x-[120%]"
        title="重置状态"
      >
        <RotateCcw size={20} />
        <span className="text-xs">重置状态</span>
      </button>

      {/* Global Functional Mind Map Button */}
      <button 
        onClick={() => setShowMindMap(true)}
        className="fixed top-1/2 right-[calc(50%-170px)] z-[9999] bg-slate-900 text-white p-3 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 font-bold pr-5 border-2 border-white/20 transform -translate-y-1/2 translate-x-[120%]"
        title="查看功能脑图"
      >
        <GitBranch size={20} />
        <span className="text-xs">功能预览</span>
      </button>

      {/* Mind Map Modal */}
      <ProjectMindMap isOpen={showMindMap} onClose={() => setShowMindMap(false)} />

      <MobileWrapper trip={adoptedTrip}>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          
          <Route element={<Layout onAdoptTrip={handleAdoptTrip} isAuthenticated={isAuthenticated} hasTrip={!!adoptedTrip} />}>
            <Route path="/" element={<Home adoptedTrip={adoptedTrip} isAuthenticated={isAuthenticated} />} />
            <Route path="/trip" element={
              <RequireAuth isAuthenticated={isAuthenticated}>
                <Trip adoptedTrip={adoptedTrip} />
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
