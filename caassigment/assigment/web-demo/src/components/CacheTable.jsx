import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CacheTable({ cacheLines, activeIndex, resetCache }) {
  const tableRef = useRef(null);
  
  // Auto-scroll to active index when it changes
  useEffect(() => {
    if (activeIndex !== null && activeIndex >= 0 && activeIndex < cacheLines.length && tableRef.current) {
      const activeRow = tableRef.current.querySelector(`[data-index="${activeIndex}"]`);
      if (activeRow) {
        activeRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activeIndex]);

  return (
    <div className="flex flex-col h-full bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b border-surface-container-high bg-surface-container-low">
        <h2 className="font-display font-semibold text-on-surface text-lg">Cache Data Vector</h2>
        <button 
          onClick={resetCache}
          className="px-4 py-1.5 bg-surface-container-high hover:bg-surface-dim text-on-surface text-sm font-body rounded-md transition-colors border-none cursor-pointer"
        >
          Reset Cache
        </button>
      </div>

      <div className="flex-1 overflow-auto no-scrollbar" ref={tableRef}>
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-surface-container pb-2 z-10 text-xs font-mono uppercase tracking-widest text-on-surface-variant">
            <tr>
              <th className="px-4 py-3 font-normal">Idx</th>
              <th className="px-4 py-3 font-normal">V</th>
              <th className="px-4 py-3 font-normal">Tag</th>
              <th className="px-4 py-3 font-normal">Data</th>
            </tr>
          </thead>
          <tbody className="font-mono text-sm">
            {cacheLines.map((line, i) => {
              const isActive = activeIndex === i;
              const hexTag = line.tag.toString(16).padStart(2, '0').toUpperCase();
              const hexData = line.data.toString(16).padStart(3, '0').toUpperCase();
              const binTag = line.tag.toString(2).padStart(6, '0');
              const binIdx = i.toString(2).padStart(9, '0');

              return (
                <motion.tr 
                  key={i}
                  data-index={i}
                  initial={{ backgroundColor: 'transparent' }}
                  animate={{ 
                    backgroundColor: isActive 
                      ? 'var(--secondary)' // Teal glow for 2 seconds ideally
                      : (line.valid ? 'var(--surface-container-high)' : 'transparent'),
                    color: isActive ? 'var(--on-secondary)' : 'var(--on-surface)'
                  }}
                  transition={{ duration: 0.3 }}
                  className="group relative border-b border-surface-container hover:bg-surface-container"
                  title={`Tag: ${binTag} | Index: ${binIdx}`}
                >
                  <td className="px-4 py-1.5 text-outline-variant">{i}</td>
                  <td className={`px-4 py-1.5 ${line.valid ? 'text-primary' : 'text-outline-variant/30'}`}>
                    {line.valid ? '1' : '0'}
                  </td>
                  <td className="px-4 py-1.5">{line.valid ? `0x${hexTag}` : '—'}</td>
                  <td className="px-4 py-1.5 text-on-surface-variant">{line.valid ? `0x${hexData}` : '—'}</td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
