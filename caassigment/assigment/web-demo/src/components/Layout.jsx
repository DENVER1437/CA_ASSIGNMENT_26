import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';

export default function Layout({ children, activePage, onNavigate, pageTitle, fsmState }) {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('sidebar-collapsed') === 'true';
  });

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      localStorage.setItem('sidebar-collapsed', String(!prev));
      return !prev;
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-transparent">
      <Sidebar
        activePage={activePage}
        onNavigate={onNavigate}
        isCollapsed={isCollapsed}
        toggleCollapse={toggleCollapse}
      />
      
      <div className="flex flex-col flex-1 overflow-hidden h-screen z-10 relative bg-transparent">
        <motion.header
          initial={false}
          animate={{ paddingLeft: isCollapsed ? 16 : 24 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="flex items-center justify-between h-16 bg-slate-900/50 backdrop-blur-xl border-b border-white/10 shrink-0 sticky top-0"
        >
          {/* Header content wrapper to maintain spacing inside the padded area */}
          <div className="flex items-center justify-between w-full pr-4 lg:pr-6">
            <span className="text-sm text-slate-400 font-label font-medium uppercase tracking-wider">
              Workspace / <span className="text-white">{pageTitle}</span>
            </span>
            <div className="flex items-center gap-3">
              <span className="text-xs bg-slate-900/60 border border-white/20 rounded-full px-3 py-1 font-label font-medium text-slate-300">
                <span className={`w-2 h-2 inline-block rounded-full mr-1.5 ${fsmState === 'IDLE' ? 'bg-slate-500' : 'bg-blue-400 animate-pulse'}`} />
                FSM: {fsmState}
              </span>
            </div>
          </div>
        </motion.header>

        <motion.main
          initial={false}
          animate={{ marginLeft: 0 }} // Per user request: flex row handles width smoothly
          className="flex-1 overflow-y-auto overflow-x-hidden relative"
        >
          {/* Pad the content inside so cards don't scrape edges natively */}
          <div className="p-4 lg:p-6 min-h-full">
            {children}
          </div>
        </motion.main>
      </div>
    </div>
  );
}
