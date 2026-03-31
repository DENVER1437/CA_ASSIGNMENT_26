import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SimulationOutput() {
  const [lines, setLines] = useState([]);

  // iverilog hardcoded trace
  const rawLog = `[95ns]  Addr=0x0000 | Data=0x001 | MISS | Hits=0 Misses=1
[135ns] Addr=0x0000 | Data=0x001 | HIT  | Hits=1 Misses=1
[205ns] Addr=0x0100 | Data=0x101 | MISS | Hits=1 Misses=2
[245ns] Addr=0x0100 | Data=0x101 | HIT  | Hits=2 Misses=2
[315ns] Addr=0x4000 | Data=0x001 | MISS | Hits=2 Misses=3
[385ns] Addr=0x0000 | Data=0x001 | MISS | Hits=2 Misses=4
[455ns] Addr=0x0010 | Data=0x011 | MISS | Hits=2 Misses=5
[495ns] Addr=0x0010 | Data=0x011 | HIT  | Hits=3 Misses=5
[535ns] Addr=0x0010 | Data=0x011 | HIT  | Hits=4 Misses=5
[605ns] Addr=0x0020 | Data=0x021 | MISS | Hits=4 Misses=6
Final: Hits=4 | Misses=6 | Hit Ratio=40.00%`.split('\n');

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setLines(prev => [...prev, rawLog[i]]);
      i++;
      if (i >= rawLog.length) clearInterval(interval);
    }, 120);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#121415] border border-outline-variant/20 rounded-xl overflow-hidden shadow-sm h-full flex flex-col font-mono text-sm leading-relaxed">
      <div className="flex justify-between items-center px-4 py-2 bg-inverse-surface text-inverse-on-surface border-b border-white/10 shrink-0">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
        </div>
        <div className="text-xs font-medium tracking-wide flex items-center gap-2">
          <span>iverilog + vvp</span>
          <span className="bg-[#307231]/40 text-[#acf4a4] px-1.5 py-0.5 rounded text-[10px] font-bold">✅ Verified</span>
        </div>
      </div>
      <div className="p-4 overflow-auto no-scrollbar flex-1 relative">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1">
          {lines.map((line, idx) => {
            if (!line) return null;
            const isHit = line.includes('| HIT ');
            const isMiss = line.includes('| MISS');
            const isFinal = line.startsWith('Final:');
            
            let colorClass = 'text-[#abb2bf]';
            if (isHit) colorClass = 'text-[#acf4a4]';
            else if (isMiss) colorClass = 'text-[#ffb4ac]';
            else if (isFinal) colorClass = 'text-white font-bold';
            
            return (
              <div key={idx} className={colorClass}>
                <span className="text-outline/40 mr-3 select-none">{idx+1}</span>
                {line}
              </div>
            );
          })}
        </motion.div>
        {lines.length < rawLog.length && (
           <motion.div animate={{ opacity: [0, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} className="inline-block w-2 bg-[#d6e3ff] h-4 translate-y-1 ml-6 mt-1" />
        )}
      </div>
    </div>
  );
}
