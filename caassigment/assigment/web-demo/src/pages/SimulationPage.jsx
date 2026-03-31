import { useState } from 'react';
import { motion } from 'framer-motion';

export default function SimulationPage({ accessCache, fsmState, lastAccess, hitCount, missCount }) {
  const [hexInput, setHexInput] = useState('');
  const [seqMode, setSeqMode] = useState(false);
  const [seqText, setSeqText] = useState('');
  const isSimulating = fsmState !== 'IDLE';

  const handleSubmit = async () => {
    if (isSimulating || !hexInput.trim()) return;
    await accessCache(hexInput.trim());
  };

  const handlePreset = async (hex) => {
    if (isSimulating) return;
    setHexInput(hex);
    await accessCache(hex);
  };

  const runConflictDemo = async () => {
    if (isSimulating) return;
    const seq = ['0000', '0000', '0100', '0100', '4000', '0000'];
    for (const addr of seq) {
      setHexInput(addr);
      await accessCache(addr);
      await new Promise(r => setTimeout(r, 400));
    }
  };

  const runSequence = async () => {
    if (isSimulating || !seqText.trim()) return;
    const addrs = seqText.split(/[\n,\s]+/).filter(Boolean);
    for (const addr of addrs) {
      setHexInput(addr);
      await accessCache(addr.replace(/^0x/i, ''));
      await new Promise(r => setTimeout(r, 400));
    }
  };

  // Address decomposition
  const numAddr = parseInt(hexInput || '0000', 16) & 0x7FFF;
  const binStr = numAddr.toString(2).padStart(15, '0');
  const tagBits = binStr.slice(0, 6);
  const idxBits = binStr.slice(6, 15);

  const fsmSteps = ['IDLE', 'LOOKUP', 'HIT', 'MISS', 'FETCH'];

  const isValidHex = (v) => /^[0-9a-fA-F]{0,4}$/.test(v);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Address Input Card */}
        <div className="bg-slate-900/50 backdrop-blur-md rounded-xl border border-white/10 p-6">
          <div className="flex items-center gap-2 mb-5">
            <span className="material-symbols-outlined text-blue-400">input</span>
            <h3 className="font-headline font-semibold text-white">Memory Request</h3>
          </div>

          <div className="mb-4">
            <label className="text-sm font-label text-slate-400 mb-1.5 block">CPU Address (Hex)</label>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 px-3">
                <span className="text-slate-500 font-mono text-sm mr-1">0x</span>
                <input
                  type="text"
                  value={hexInput}
                  onChange={(e) => isValidHex(e.target.value) && setHexInput(e.target.value.toUpperCase())}
                  placeholder="0000"
                  maxLength={4}
                  className="flex-1 bg-transparent py-2.5 font-mono text-white outline-none text-sm placeholder-white/40"
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={isSimulating}
                className="px-5 py-2.5 bg-primary text-on-primary font-label font-semibold rounded-lg hover:bg-primary-container disabled:opacity-50 transition-colors"
              >
                Access Memory
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1.5">Valid range: 0x0000 – 0x7FFF (15-bit address space)</p>
          </div>

          {/* Presets */}
          <div className="mb-4">
            <p className="text-xs font-label font-medium text-slate-400 uppercase tracking-wider mb-2">Quick Presets</p>
            <div className="flex flex-wrap gap-2">
              {[
                ['0000', 'Cold Miss'],
                ['0000', 'Hit Re-access'],
                ['0100', 'New Index'],
                ['4000', 'Conflict Miss'],
                ['0010', 'Sequential'],
              ].map(([hex, label], i) => (
                <button
                  key={i}
                  onClick={() => handlePreset(hex)}
                  disabled={isSimulating}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono rounded-lg disabled:opacity-40 transition-colors border border-white/10"
                >
                  0x{hex} <span className="text-slate-500 ml-1">({label})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Conflict Demo & Sequence */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={runConflictDemo}
              disabled={isSimulating}
              className="px-4 py-2 bg-red-500/20 text-red-300 font-label text-xs font-semibold rounded-lg hover:bg-red-500/30 disabled:opacity-40 transition-colors border border-red-500/20"
            >
              ⚠ Conflict Demo
            </button>
            <button
              onClick={() => setSeqMode(!seqMode)}
              className="px-4 py-2 bg-white/5 text-slate-400 font-label text-xs rounded-lg hover:bg-white/10 transition-colors border border-white/10"
            >
              {seqMode ? 'Hide Sequence' : 'Sequence Mode'}
            </button>
          </div>

          {seqMode && (
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <textarea
                value={seqText}
                onChange={(e) => setSeqText(e.target.value)}
                placeholder={"Enter hex addresses, one per line:\n0000\n0100\n4000"}
                rows={4}
                className="w-full bg-slate-900/50 rounded-lg p-3 font-mono text-sm text-white border border-white/10 outline-none resize-none placeholder:text-slate-600"
              />
              <button
                onClick={runSequence}
                disabled={isSimulating}
                className="mt-2 px-4 py-2 bg-primary text-on-primary text-xs font-semibold rounded-lg disabled:opacity-40"
              >
                Run Sequence
              </button>
            </div>
          )}
        </div>

        {/* Result + FSM Card */}
        <div className="space-y-4">
          {/* Last Access Result */}
          {lastAccess && (
            <motion.div
              key={lastAccess.timestamp}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`rounded-xl p-6 border-2 backdrop-blur-md ${
                lastAccess.hit
                  ? 'bg-emerald-500/15 border-emerald-500/50'
                  : 'bg-red-500/15 border-red-500/50'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className={`material-symbols-outlined text-3xl ${lastAccess.hit ? 'text-emerald-400' : 'text-red-400'}`}>
                  {lastAccess.hit ? 'check_circle' : 'cancel'}
                </span>
                <div>
                  <p className={`text-lg font-headline font-bold ${lastAccess.hit ? 'text-emerald-300' : 'text-red-300'}`}>
                    CACHE {lastAccess.hit ? 'HIT' : 'MISS'}
                  </p>
                  <p className="text-xs text-slate-400">Address 0x{lastAccess.addr.toUpperCase()}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <p className="text-xs text-slate-400">Data</p>
                  <p className="font-mono font-bold text-white">0x{(lastAccess.data || 0).toString(16).padStart(3, '0').toUpperCase()}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <p className="text-xs text-slate-400">Tag</p>
                  <p className="font-mono font-bold text-white">{lastAccess.tag}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <p className="text-xs text-slate-400">Index</p>
                  <p className="font-mono font-bold text-white">{lastAccess.index}</p>
                </div>
              </div>
            </motion.div>
          )}

          {!lastAccess && (
            <div className="rounded-xl p-8 bg-white/5 border border-white/10 text-center backdrop-blur-md">
              <span className="material-symbols-outlined text-4xl text-slate-600 mb-2 block">memory</span>
              <p className="text-slate-400 text-sm">Enter an address and click "Access Memory" to begin simulation.</p>
            </div>
          )}

          {/* FSM State Pills */}
          <div className="bg-slate-900/50 backdrop-blur-md rounded-xl border border-white/10 p-5">
            <p className="text-xs font-label font-medium text-slate-400 uppercase tracking-wider mb-3">FSM Logic Path</p>
            <div className="flex gap-1.5">
              {fsmSteps.map((s) => (
                <div
                  key={s}
                  className={`flex-1 text-center py-2 rounded-lg text-xs font-label font-bold tracking-wide transition-all duration-300 ${
                    fsmState === s
                      ? 'bg-primary text-on-primary shadow-md shadow-primary/30'
                      : 'bg-white/5 text-slate-500'
                  }`}
                >
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Address Decomposition */}
      <div className="bg-slate-900/50 backdrop-blur-md rounded-xl border border-white/10 p-6">
        <h3 className="font-headline font-semibold text-white mb-4">Address Decomposition</h3>
        <motion.div className="flex gap-0.5 mb-5" key={hexInput} initial="hidden" animate="show"
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.02 } } }}
        >
          {binStr.split('').map((bit, i) => {
            const isTag = i < 6;
            return (
              <motion.div
                key={i}
                variants={{ hidden: { y: -15, opacity: 0 }, show: { y: 0, opacity: 1 } }}
                className={`flex-1 flex flex-col items-center py-2 rounded text-xs font-mono border ${
                  isTag
                    ? 'bg-purple-500/20 border-purple-500/30 text-purple-300'
                    : 'bg-blue-500/20 border-blue-500/30 text-blue-300'
                }`}
              >
                <span className="text-[9px] opacity-50">{14 - i}</span>
                <span className="font-bold text-base">{bit}</span>
              </motion.div>
            );
          })}
        </motion.div>
        <div className="flex gap-4">
          <div className="flex-1 bg-purple-500/15 rounded-lg p-3 border border-purple-500/25">
            <p className="text-xs text-purple-300 font-label font-semibold uppercase">Tag (6 bits)</p>
            <p className="font-mono text-lg text-purple-200 font-bold mt-1">0x{parseInt(tagBits, 2).toString(16).padStart(2, '0').toUpperCase()}</p>
            <p className="font-mono text-xs text-purple-400 tracking-widest">{tagBits}</p>
          </div>
          <div className="flex-1 bg-blue-500/15 rounded-lg p-3 border border-blue-500/25">
            <p className="text-xs text-blue-300 font-label font-semibold uppercase">Index (9 bits)</p>
            <p className="font-mono text-lg text-blue-200 font-bold mt-1">0x{parseInt(idxBits, 2).toString(16).padStart(3, '0').toUpperCase()}</p>
            <p className="font-mono text-xs text-blue-400 tracking-widest">{idxBits}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
