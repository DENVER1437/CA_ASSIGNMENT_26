import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default function AddressInput({ onAccessCache, isSimulating }) {
  const [hexInput, setHexInput] = useState('');
  const [conflictBanner, setConflictBanner] = useState(false);
  const [sequenceMode, setSequenceMode] = useState(false);
  const [sequenceText, setSequenceText] = useState('');
  const [sequenceProgress, setSequenceProgress] = useState(0);

  const handleInputChange = (e) => {
    const val = e.target.value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 4);
    if (parseInt(val, 16) > 0x7FFF) {
      setHexInput('7FFF');
    } else {
      setHexInput(val.toUpperCase());
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (hexInput && !isSimulating) {
      onAccessCache(hexInput);
    }
  };

  const presets = ['0000', '0100', '0010', '0020'];

  // Conflict Demo Sequence: 0x0000 -> 0x4000 -> 0x0000
  const runConflictDemo = async () => {
    if (isSimulating) return;
    setConflictBanner(true);
    await onAccessCache('0000');
    await sleep(900);
    await onAccessCache('4000');
    await sleep(900);
    setConflictBanner(false);
    await onAccessCache('0000');
  };

  const runSequence = async () => {
    if (isSimulating || !sequenceText) return;
    const addrs = sequenceText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    for (let i = 0; i < addrs.length; i++) {
      setSequenceProgress(((i + 1) / addrs.length) * 100);
      await onAccessCache(addrs[i]);
      await sleep(700);
    }
    setSequenceProgress(0);
  };

  const binPreview = hexInput 
    ? parseInt(hexInput, 16).toString(2).padStart(15, '0').match(/.{1,4}/g)?.join(' ') 
    : '000 0000 0000 0000';

  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_8px_24px_rgba(25,28,30,0.06)] border border-surface-container-high relative overflow-hidden">
      {/* Sequence Progress Bar */}
      {sequenceProgress > 0 && (
        <div 
          className="absolute top-0 left-0 h-1 bg-secondary transition-all duration-300"
          style={{ width: `${sequenceProgress}%` }}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="font-display font-bold text-xl text-on-surface">Memory Request</h2>
        <button 
          onClick={() => setSequenceMode(!sequenceMode)}
          className="text-sm font-body text-primary hover:text-primary-container px-3 py-1 bg-primary-fixed hover:bg-primary-fixed-dim rounded-full transition-colors"
        >
          {sequenceMode ? 'Standard Mode' : 'Sequence Mode'}
        </button>
      </div>

      <AnimatePresence>
        {conflictBanner && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0 }}
            className="mb-4 bg-error-container text-on-error-container px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-between"
          >
            <span>⚠️ Conflict miss — line evicted!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {!sequenceMode ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-outline font-bold text-xl">0x</span>
            <input 
              type="text" 
              value={hexInput}
              onChange={handleInputChange}
              placeholder="0000"
              className="w-full bg-surface-container-highest border-b-2 border-outline focus:border-primary px-12 py-4 font-mono text-2xl text-on-surface outline-none transition-colors rounded-t-lg shadow-inner"
              disabled={isSimulating}
            />
            <div className="absolute right-4 bottom-2 text-xs font-mono text-primary-fixed-variant tracking-widest">{binPreview}</div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {presets.map(p => (
               <button 
                key={p} 
                type="button" 
                onClick={() => { setHexInput(p); onAccessCache(p); }}
                className="font-mono text-sm bg-surface-container-low hover:bg-surface-container-high px-3 py-1.5 rounded border border-outline-variant/30 text-on-surface transition-colors"
               >
                 0x{p}
               </button>
            ))}
          </div>

          <div className="flex gap-3 mt-2">
            <button 
              type="submit" 
              disabled={isSimulating || !hexInput}
              className="flex-1 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold font-body text-lg rounded-xl py-4 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 cursor-pointer"
            >
              Simulate Request
            </button>
            <button 
              type="button"
              onClick={runConflictDemo}
              disabled={isSimulating}
              className="px-6 bg-tertiary-container hover:bg-tertiary-fixed text-on-tertiary-container font-semibold rounded-xl text-sm transition-colors shadow-sm"
            >
              Conflict Demo
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col gap-4">
          <textarea
            value={sequenceText}
            onChange={(e) => setSequenceText(e.target.value)}
            placeholder="0000&#10;0100&#10;0010&#10;0020"
            className="w-full h-32 bg-surface-container-highest border-b-2 border-outline focus:border-primary p-4 font-mono text-sm text-on-surface outline-none transition-colors rounded-t-lg"
            disabled={isSimulating}
          />
          <button 
            onClick={runSequence}
            disabled={isSimulating || !sequenceText}
            className="w-full bg-gradient-to-r from-secondary to-secondary-container text-on-secondary font-bold font-body text-lg rounded-xl py-4 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
          >
            Run Sequence
          </button>
        </div>
      )}
    </div>
  );
}
