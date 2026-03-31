import { motion } from 'framer-motion';

const statCard = (icon, label, value, color) => (
  <div className="bg-slate-900/50 backdrop-blur-md rounded-xl p-5 border border-white/10 flex items-start gap-4">
    <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${color}`}>
      <span className="material-symbols-outlined text-white text-xl">{icon}</span>
    </div>
    <div>
      <p className="text-sm text-slate-400 font-label">{label}</p>
      <p className="text-2xl font-headline font-bold text-white mt-0.5">{value}</p>
    </div>
  </div>
);

export default function DashboardPage({ hitCount, missCount, hitRatio, accessLog, onNavigate }) {
  const total = hitCount + missCount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900/40 backdrop-blur-md p-8 text-white border border-white/10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />
        <div className="relative z-10">
          <p className="text-primary-fixed text-sm font-label tracking-wide uppercase mb-2">Nirma University · 2CS504</p>
          <h1 className="text-3xl md:text-4xl font-headline font-bold mb-2">Direct-Mapped Cache</h1>
          <h2 className="text-xl md:text-2xl font-headline font-light text-primary-fixed-dim mb-6">Memory Simulator</h2>
          <p className="text-primary-fixed/80 text-sm max-w-lg mb-6">
            Interactive visualization of a 5-state FSM cache controller with 512 cache lines,
            6-bit tags, 9-bit index, and 32K × 12-bit main memory.
          </p>
          <button
            onClick={() => onNavigate('simulation')}
            className="px-6 py-2.5 bg-white text-primary font-label font-semibold rounded-lg hover:bg-primary-fixed transition-colors"
          >
            Start New Trace →
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCard('memory', 'Total Accesses', total, 'bg-primary')}
        {statCard('check_circle', 'Cache Hits', hitCount, 'bg-secondary')}
        {statCard('cancel', 'Cache Misses', missCount, 'bg-tertiary')}
        {statCard('speed', 'Hit Rate', `${total === 0 ? 0 : hitRatio.toFixed(1)}%`, 'bg-surface-tint')}
      </div>

      {/* Memory Hierarchy Flow */}
      <div className="bg-slate-900/50 backdrop-blur-md rounded-xl border border-white/10 p-6">
        <h3 className="font-headline font-semibold text-white mb-5">Memory Hierarchy Flow</h3>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {[
            { icon: 'developer_board', label: 'CPU', sub: 'Request Generator' },
            null,
            { icon: 'memory', label: 'L1 Cache', sub: '512 Lines · Direct-Mapped' },
            null,
            { icon: 'storage', label: 'Main Memory', sub: '32K × 12-bit · 2-cycle Latency' },
          ].map((item, i) =>
            item === null ? (
              <div key={i} className="text-slate-500 text-2xl font-mono hidden sm:block">→</div>
            ) : (
              <div key={i} className="flex-1 min-w-[140px] bg-white/5 rounded-xl p-4 text-center border border-white/10">
                <span className="material-symbols-outlined text-blue-400 text-3xl mb-2 block">{item.icon}</span>
                <p className="font-headline font-semibold text-white text-sm">{item.label}</p>
                <p className="text-xs text-slate-400 mt-1">{item.sub}</p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Recent Ops */}
      <div className="bg-slate-900/50 backdrop-blur-md rounded-xl border border-white/10 p-6">
        <h3 className="font-headline font-semibold text-white mb-4">Recent Memory Operations</h3>
        {accessLog.length === 0 ? (
          <p className="text-slate-400 text-sm py-8 text-center">No operations yet. Go to Simulation to begin.</p>
        ) : (
          <div className="space-y-2">
            {accessLog.slice(0, 4).map((log, i) => (
              <div key={i} className={`flex items-center justify-between p-3 rounded-lg border-l-4 ${
                log.hit
                  ? 'bg-emerald-500/10 border-emerald-500'
                  : 'bg-red-500/10 border-red-500'
              }`}>
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined text-lg ${log.hit ? 'text-emerald-400' : 'text-red-400'}`}>
                    {log.hit ? 'check_circle' : 'cancel'}
                  </span>
                  <span className="font-mono text-sm text-white font-medium">0x{log.addr.toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span>Tag: {log.tag}</span>
                  <span>Idx: {log.index}</span>
                  <span className={`px-2 py-0.5 rounded-full text-white text-xs font-semibold ${
                    log.hit ? 'bg-emerald-600' : 'bg-red-600'
                  }`}>
                    {log.hit ? 'HIT' : 'MISS'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
