import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CacheViewPage({ cacheLines, lastAccess, hitRatio, hitCount, missCount, resetCache }) {
  const [search, setSearch] = useState('');
  const activeRef = useRef(null);
  const total = hitCount + missCount;

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [lastAccess]);

  const filtered = cacheLines.map((line, i) => ({ ...line, idx: i })).filter((line) => {
    if (!search) return true;
    return line.idx.toString().includes(search) || line.idx.toString(16).includes(search.toLowerCase());
  });

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex gap-6 flex-col xl:flex-row">
      {/* Main Table */}
      <div className="flex-1 bg-slate-900/50 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-400">table_chart</span>
            <h3 className="font-headline font-semibold text-white">Cache Data Vector</h3>
            <span className="text-xs text-slate-400 bg-white/10 px-2 py-0.5 rounded-full ml-2">512 Lines</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search index..."
              className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-mono outline-none w-32 text-white placeholder:text-slate-600"
            />
          </div>
        </div>

        <div className="overflow-auto max-h-[600px] no-scrollbar">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-slate-900/90 backdrop-blur-sm z-10">
              <tr className="text-xs font-label font-semibold uppercase text-slate-400 tracking-wider">
                <th className="py-3 px-4 text-left w-20">Index</th>
                <th className="py-3 px-4 text-center w-20">Valid</th>
                <th className="py-3 px-4 text-left">Tag</th>
                <th className="py-3 px-4 text-left">Data</th>
                <th className="py-3 px-4 text-right w-24">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((line, loopIndex) => {
                const isActive = lastAccess && lastAccess.index === line.idx;
                const altBg = loopIndex % 2 === 0 ? 'bg-white/5' : 'bg-transparent';
                return (
                  <tr
                    key={line.idx}
                    ref={isActive ? activeRef : null}
                    className={`border-t border-white/5 transition-colors ${
                      isActive
                        ? 'bg-blue-500/20 border-l-4 border-l-blue-400'
                        : line.valid
                          ? `${altBg} hover:bg-white/10`
                          : `${altBg} opacity-40`
                    }`}
                  >
                    <td className="py-2.5 px-4 font-mono text-white">{line.idx}</td>
                    <td className="py-2.5 px-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                        line.valid
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-white/5 text-slate-600'
                      }`}>
                        {line.valid ? '1' : '0'}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-300">
                      {line.valid ? `0x${line.tag.toString(16).padStart(2, '0').toUpperCase()}` : '—'}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-300">
                      {line.valid ? `0x${line.data.toString(16).padStart(3, '0').toUpperCase()}` : '—'}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      {isActive && (
                        <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full font-semibold">
                          Updated
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full xl:w-72 space-y-4 shrink-0">
        {/* Hit Ratio Card */}
        <div className="bg-gradient-to-br from-primary to-primary-container rounded-xl p-5 text-white border border-white/10">
          <p className="text-primary-fixed text-xs font-label uppercase tracking-wider mb-1">Hit Ratio</p>
          <p className="text-4xl font-headline font-bold">{total === 0 ? '0' : hitRatio.toFixed(1)}%</p>
          <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-700"
              style={{ width: `${total === 0 ? 0 : hitRatio}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-primary-fixed/70">
            <span>{hitCount} hits</span>
            <span>{missCount} misses</span>
          </div>
        </div>

        {/* Configuration */}
        <div className="bg-slate-900/50 backdrop-blur-md rounded-xl border border-white/10 p-5">
          <h4 className="font-headline font-semibold text-white text-sm mb-3">Cache Configuration</h4>
          <div className="space-y-2.5 text-sm">
            {[
              ['Mapping', 'Direct-Mapped'],
              ['Lines', '512'],
              ['Data Width', '12-bit'],
              ['Tag Bits', '6'],
              ['Index Bits', '9'],
              ['Address', '15-bit'],
              ['Memory', '32K Words'],
              ['Latency', '2-cycle'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-slate-400">{k}</span>
                <span className="font-mono text-white font-medium">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reset */}
        <button
          onClick={resetCache}
          className="w-full py-3 bg-red-500/20 text-red-300 rounded-xl font-label font-semibold text-sm hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2 border border-red-500/20"
        >
          <span className="material-symbols-outlined text-lg">restart_alt</span>
          Reset Cache
        </button>
      </div>
    </motion.div>
  );
}
