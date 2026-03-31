import { motion, AnimatePresence } from 'framer-motion';

export default function AccessLog({ logs, clearLog }) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 border-b border-surface-container-high pb-4">
        <h2 className="font-display font-semibold text-on-surface text-lg">Access History</h2>
        <button 
          onClick={clearLog}
          className="px-4 py-1.5 bg-surface-container-high hover:bg-surface-dim text-on-surface text-sm font-body rounded-md transition-colors border-none cursor-pointer"
        >
          Clear
        </button>
      </div>

      <div className="flex-1 overflow-auto no-scrollbar relative">
        <AnimatePresence>
          {logs.map((log) => {
            const timeStr = new Date(log.timestamp).toLocaleTimeString([], { hour12: false, h: '2-digit', m: '2-digit', s: '2-digit', fractionalSecondDigits: 3 });
            const hexData = log.data.toString(16).padStart(3, '0').toUpperCase();
            
            return (
              <motion.div
                key={log.timestamp + log.addr}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`mb-2 p-3 font-mono text-[13px] rounded bg-surface-container-low border-l-4
                  ${log.hit ? 'border-secondary bg-[#e8f5e9]/10' : 'border-tertiary-container bg-[#ffebee]/10'}`}
              >
                <div className="flex justify-between text-outline-variant text-[11px] mb-1">
                  <span>{timeStr}</span>
                  <span className={`px-2 py-0.5 rounded-sm font-bold tracking-widest text-[#fff] ${log.hit ? 'bg-secondary' : 'bg-tertiary-container'}`}>
                    {log.hit ? 'HIT' : 'MISS'}
                  </span>
                </div>
                <div className="flex justify-between text-on-surface-variant group">
                  <span className="font-bold text-on-surface">0x{log.addr}</span>
                  <span className="opacity-70 group-hover:opacity-100 transition-opacity">T: {log.tag} | I: {log.index}</span>
                  <span>Data: 0x{hexData}</span>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
        {logs.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-outline-variant text-sm font-body">
            No access history yet.
          </div>
        )}
      </div>
    </div>
  );
}
