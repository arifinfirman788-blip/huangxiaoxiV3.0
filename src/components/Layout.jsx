import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';

const Layout = ({ onAdoptTrip, isAuthenticated, hasTrip }) => {
  const location = useLocation();
  const showBottomNav = ['/', '/trip', '/shop', '/message', '/profile'].includes(location.pathname);

  return (
    <div className="h-full w-full relative font-sans bg-slate-50">
      {/* Global Background Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[80vw] h-[80vw] bg-cyan-100 rounded-full blur-[80px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-20%] w-[90vw] h-[90vw] bg-blue-100 rounded-full blur-[80px] opacity-40 pointer-events-none" />

      {/* Main Content Area */}
      {/* We don't scroll here. We let the child pages handle scrolling to ensure specific scroll behaviors (like sticky headers) work correctly. 
          But we need to ensure this container takes full height. */}
      <div className="h-full w-full relative z-10">
        <Outlet />
      </div>

      {/* Bottom Navigation */}
      {showBottomNav && <BottomNav onAdoptTrip={onAdoptTrip} isAuthenticated={isAuthenticated} hasTrip={hasTrip} />}
    </div>
  );
};

export default Layout;
