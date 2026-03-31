import { motion } from 'framer-motion';
import { LayoutDashboard, Play, Table, BarChart2, Info, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

const sidebarVariants = {
  expanded: { width: 256 },
  collapsed: { width: 64 }
};

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'simulation', label: 'Simulation', icon: Play },
  { id: 'cache-view', label: 'Cache View', icon: Table },
  { id: 'statistics', label: 'Statistics', icon: BarChart2 },
  { id: 'about', label: 'About', icon: Info },
];

export default function Sidebar({ activePage, onNavigate, isCollapsed, toggleCollapse }) {
  return (
    <motion.aside
      variants={sidebarVariants}
      initial={false}
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      // Used overflow-visible here so the absolute hover tooltips don't get clipped.
      // The text elements themselves animate to width: 0 and use overflow-hidden.
      className="relative flex flex-col h-screen bg-slate-900/70 backdrop-blur-xl border-r border-white/10 z-20 shrink-0"
    >
      {/* Toggle Button */}
      <button
        onClick={toggleCollapse}
        className="absolute top-4 right-3 p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-all z-30 flex items-center justify-center"
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
      </button>

      {/* Header / Logo */}
      <div className="p-5 border-b border-white/10 flex items-center h-[72px] shrink-0">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 w-full hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-white text-[20px] leading-none">memory</span>
          </div>
          <motion.div
            animate={{ 
              opacity: isCollapsed ? 0 : 1,
              width: isCollapsed ? 0 : 'auto',
              marginLeft: isCollapsed ? 0 : 12,
            }}
            transition={{ duration: 0.2 }}
            className="text-left overflow-hidden whitespace-nowrap pr-6" // Pr-6 avoids overlapping with toggle button
          >
            <p className="font-headline font-bold text-white text-sm leading-tight block">CacheCtrl</p>
            <p className="text-[10px] text-slate-400 block">Memory Simulation v1.0</p>
          </motion.div>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          const IconComponent = item.icon;
          
          return (
            <div key={item.id} className="relative group">
              <button
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center rounded-lg text-sm font-label transition-colors relative h-10 ${
                  isActive
                    ? 'bg-blue-500/20 text-blue-300 font-semibold border-r-4 border-blue-400'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
                style={{ paddingLeft: isCollapsed ? '0px' : '16px', justifyContent: isCollapsed ? 'center' : 'flex-start' }}
              >
                <div className="flex items-center justify-center w-6 shrink-0">
                  <IconComponent size={20} className={isActive ? 'text-blue-300' : 'text-slate-400 group-hover:text-white transition-colors'} />
                </div>
                
                <motion.span
                  animate={{ 
                    opacity: isCollapsed ? 0 : 1,
                    width: isCollapsed ? 0 : 'auto',
                    marginLeft: isCollapsed ? 0 : 12
                  }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden whitespace-nowrap text-left block"
                >
                  {item.label}
                </motion.span>
              </button>
              
              {/* Tooltip (only when collapsed) */}
              {isCollapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-1 bg-slate-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  {item.label}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom Profile */}
      <div className="p-4 border-t border-white/10 shrink-0 bg-slate-900/40">
        <div className="flex items-center h-10 w-full" style={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}>
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
            M
          </div>
          <motion.div
            animate={{ 
              opacity: isCollapsed ? 0 : 1,
              width: isCollapsed ? 0 : 'auto',
              marginLeft: isCollapsed ? 0 : 12
            }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden whitespace-nowrap"
          >
            <p className="text-sm font-label font-semibold text-white">Meet & Dhruvraj</p>
            <p className="text-[10px] text-slate-400">Nirma University</p>
          </motion.div>
        </div>
      </div>
    </motion.aside>
  );
}
