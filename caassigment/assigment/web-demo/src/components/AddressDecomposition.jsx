import { motion } from 'framer-motion';

export default function AddressDecomposition({ hexAddr }) {
  const numAddr = parseInt(hexAddr || '0000', 16) & 0x7FFF;
  const binStr = numAddr.toString(2).padStart(15, '0');
  
  const tagStr = binStr.slice(0, 6);
  const idxStr = binStr.slice(6, 15);
  
  const tagHex = parseInt(tagStr, 2).toString(16).padStart(2, '0').toUpperCase();
  const idxHex = parseInt(idxStr, 2).toString(16).padStart(3, '0').toUpperCase();

  const memPercentage = (numAddr / 32767) * 100;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.03 }
    }
  };

  const bitAnim = {
    hidden: { y: -20, opacity: 0, rotateX: 90 },
    show: { y: 0, opacity: 1, rotateX: 0 }
  };

  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden">
      <h2 className="font-display font-semibold text-on-surface text-lg mb-4">Address Decomposition</h2>
      
      {/* Visual Bits */}
      <motion.div 
        variants={container} 
        initial="hidden" 
        animate="show" 
        key={hexAddr} // forces re-render animation on change
        className="flex gap-1 mb-6"
      >
        {binStr.split('').map((bit, i) => {
          const isTag = i < 6;
          return (
            <motion.div 
              key={i} 
              variants={bitAnim}
              className={`flex-1 flex flex-col items-center justify-center py-2 rounded-sm border 
                ${isTag ? 'bg-[#f3e8ff] border-[#d8b4fe] text-[#7e22ce]' : 'bg-primary-fixed border-primary-fixed-dim text-primary'}`}
            >
              <span className="text-[10px] opacity-70 mb-1">{14 - i}</span>
              <span className="font-mono font-bold text-lg">{bit}</span>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Hex/Bin Data */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 bg-surface-container-low p-3 rounded-lg border border-surface-container-high shrink-0">
          <div className="text-xs text-outline font-display font-bold uppercase tracking-widest mb-1">Tag (6 bits)</div>
          <div className="font-mono text-xl text-[#7e22ce] font-bold">0x{tagHex}</div>
          <div className="font-mono text-sm text-outline-variant tracking-widest">{tagStr}</div>
        </div>
        <div className="flex-1 bg-surface-container-low p-3 rounded-lg border border-surface-container-high shrink-0">
          <div className="text-xs text-outline font-display font-bold uppercase tracking-widest mb-1">Index (9 bits)</div>
          <div className="font-mono text-xl text-primary font-bold">0x{idxHex}</div>
          <div className="font-mono text-sm text-outline-variant tracking-widest">{idxStr.match(/.{1,4}/g)?.join(' ')}</div>
        </div>
      </div>

      {/* Memory Map Bar */}
      <div>
        <div className="flex justify-between text-xs text-outline mb-1 font-mono">
          <span>0x0000</span>
          <span>Main Memory (32K)</span>
          <span>0x7FFF</span>
        </div>
        <div className="w-full h-3 bg-surface-container-high rounded-full relative overflow-hidden">
          <motion.div 
            className="absolute top-0 bottom-0 w-1.5 bg-secondary rounded-full shadow-[0_0_10px_var(--secondary)]"
            initial={{ left: 0 }}
            animate={{ left: `${memPercentage}%` }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          />
        </div>
      </div>
    </div>
  );
}
