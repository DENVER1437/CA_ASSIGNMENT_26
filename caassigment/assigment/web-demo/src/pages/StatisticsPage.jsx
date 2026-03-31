import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const rawLog = [
  '[95ns]  Addr=0x0000 | Data=0x001 | MISS | Hits=0 Misses=1',
  '[135ns] Addr=0x0000 | Data=0x001 | HIT  | Hits=1 Misses=1',
  '[205ns] Addr=0x0100 | Data=0x101 | MISS | Hits=1 Misses=2',
  '[245ns] Addr=0x0100 | Data=0x101 | HIT  | Hits=2 Misses=2',
  '[315ns] Addr=0x4000 | Data=0x001 | MISS | Hits=2 Misses=3',
  '[385ns] Addr=0x0000 | Data=0x001 | MISS | Hits=2 Misses=4',
  '[455ns] Addr=0x0010 | Data=0x011 | MISS | Hits=2 Misses=5',
  '[495ns] Addr=0x0010 | Data=0x011 | HIT  | Hits=3 Misses=5',
  '[535ns] Addr=0x0010 | Data=0x011 | HIT  | Hits=4 Misses=5',
  '[605ns] Addr=0x0020 | Data=0x021 | MISS | Hits=4 Misses=6',
  'Final: Hits=4 | Misses=6 | Hit Ratio=40.00%',
];

function TerminalOutput() {
  const [lines, setLines] = useState([]);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < rawLog.length) {
        setLines(prev => [...prev, rawLog[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 120);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900/50 backdrop-blur-md rounded-xl overflow-hidden border border-white/10">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <span className="text-slate-500 text-xs font-mono ml-2">iverilog + vvp</span>
        <span className="ml-auto text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-semibold">✓ Verified</span>
      </div>
      <div className="p-4 font-mono text-sm space-y-0.5 max-h-72 overflow-auto no-scrollbar">
        {lines.map((line, i) => {
          if (!line) return null;
          const isHit = line.includes('| HIT');
          const isMiss = line.includes('| MISS');
          const isFinal = line.startsWith('Final:');
          let color = 'text-slate-400';
          if (isHit) color = 'text-emerald-400';
          else if (isMiss) color = 'text-red-400';
          else if (isFinal) color = 'text-white font-bold';
          return (
            <div key={i} className={color}>
              <span className="text-slate-600 mr-3 select-none">{i + 1}</span>
              {line}
            </div>
          );
        })}
        {lines.length < rawLog.length && (
          <motion.span
            animate={{ opacity: [0, 1] }}
            transition={{ repeat: Infinity, duration: 0.7 }}
            className="inline-block w-2 h-4 bg-blue-400 ml-6"
          />
        )}
      </div>
    </div>
  );
}

export default function StatisticsPage({ hitCount, missCount, hitRatio, accessLog }) {
  const total = hitCount + missCount;
  const hitPct = total === 0 ? 0 : hitRatio;
  const missPct = total === 0 ? 0 : 100 - hitRatio;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Bento Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: 'memory', label: 'Total Accesses', val: total, bg: 'bg-primary' },
          { icon: 'check_circle', label: 'Cache Hits', val: hitCount, bg: 'bg-emerald-600' },
          { icon: 'cancel', label: 'Cache Misses', val: missCount, bg: 'bg-red-600' },
          { icon: 'speed', label: 'Hit Rate', val: `${total === 0 ? 0 : hitRatio.toFixed(1)}%`, bg: 'bg-surface-tint' },
        ].map((s, i) => (
          <div key={i} className="bg-slate-900/50 backdrop-blur-md rounded-xl p-5 border border-white/10">
            <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
              <span className="material-symbols-outlined text-white text-lg">{s.icon}</span>
            </div>
            <p className="text-sm text-slate-400 font-label">{s.label}</p>
            <p className="text-3xl font-headline font-bold text-white mt-1">{s.val}</p>
          </div>
        ))}
      </div>

      {/* Bar Chart + Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-slate-900/50 backdrop-blur-md rounded-xl border border-white/10 p-6">
          <h3 className="font-headline font-semibold text-white mb-5">Hit vs Miss Distribution</h3>
          <div className="flex items-end gap-8 justify-center h-48">
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs text-slate-400">{hitPct.toFixed(1)}%</span>
              <div
                className="w-20 bg-emerald-500 rounded-t-lg transition-all duration-700 min-h-[4px]"
                style={{ height: `${Math.max(hitPct * 1.6, 4)}px` }}
              />
              <span className="text-xs font-label font-semibold text-white">Hits</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs text-slate-400">{missPct.toFixed(1)}%</span>
              <div
                className="w-20 bg-red-500 rounded-t-lg transition-all duration-700 min-h-[4px]"
                style={{ height: `${Math.max(missPct * 1.6, 4)}px` }}
              />
              <span className="text-xs font-label font-semibold text-white">Misses</span>
            </div>
          </div>
        </div>

        {/* Execution Insights */}
        <div className="space-y-4">
          {[
            {
              icon: 'moving', title: 'Spatial Locality',
              desc: 'Sequential addresses map to nearby cache lines, improving hit rates for contiguous access patterns.',
              color: 'text-blue-400',
            },
            {
              icon: 'swap_horiz', title: 'Conflict Misses',
              desc: 'Direct-mapped caches can thrash when multiple addresses map to the same index with different tags.',
              color: 'text-red-400',
            },
            {
              icon: 'timer', title: 'Access Latency',
              desc: 'Cache hits resolve in 1 cycle. Misses incur 2-cycle main memory latency plus cache write-back.',
              color: 'text-amber-400',
            },
          ].map((item, i) => (
            <div key={i} className="bg-slate-900/50 backdrop-blur-md rounded-xl border border-white/10 p-4 flex gap-4">
              <span className={`material-symbols-outlined text-2xl ${item.color} mt-0.5`}>{item.icon}</span>
              <div>
                <p className="font-headline font-semibold text-white text-sm">{item.title}</p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Terminal Output */}
      <div>
        <h3 className="font-headline font-semibold text-white mb-3">Simulation Output (iverilog)</h3>
        <TerminalOutput />
      </div>

      {/* Editorial Card */}
      <div className="bg-slate-900/50 backdrop-blur-md rounded-xl p-8 text-center border border-white/10">
        <p className="text-slate-500 text-sm font-label uppercase tracking-wider mb-2">Architecture Insight</p>
        <p className="text-slate-200 text-lg font-headline font-semibold max-w-2xl mx-auto leading-relaxed">
          "The memory wall problem demonstrates that processor speeds grow exponentially faster than memory access times —
          making cache design one of the most critical aspects of computer architecture."
        </p>
        <p className="text-slate-600 text-xs mt-4 font-label">— Wulf & McKee, 1995</p>
      </div>
    </motion.div>
  );
}
