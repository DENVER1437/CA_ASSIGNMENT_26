import { motion } from 'framer-motion';

export default function StatsPanel({ hitRatio, fsmState, hitCount, missCount, sparklineData }) {
  const fsmSteps = ['IDLE', 'LOOKUP', fsmState === 'MISS' ? 'MISS' : 'HIT', 'FETCH'];

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - ((Number.isNaN(hitRatio) ? 0 : hitRatio) / 100) * circumference;

  const maxPts = 20;
  const svgWidth = 200;
  const svgHeight = 40;
  
  const generatePoints = () => {
    if (!sparklineData || sparklineData.length === 0) return { polyline: '', circles: [] };
    const stepX = svgWidth / Math.max(1, sparklineData.length - 1);
    
    // Reverse because index 0 is newest, but we draw left (oldest) to right (newest)
    const reversed = [...sparklineData].reverse();
    
    const polyline = reversed.map((isHit, i) => {
      const x = i * stepX;
      const y = isHit ? 5 : svgHeight - 5;
      return `${x},${y}`;
    }).join(' ');

    const circles = reversed.map((isHit, i) => ({
      x: i * stepX,
      y: isHit ? 5 : svgHeight - 5,
      isHit
    }));

    return { polyline, circles };
  };

  const { polyline, circles } = generatePoints();

  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 flex flex-col justify-between h-full relative">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-display font-semibold text-on-surface text-lg">Simulator Metrics</h3>
          <div className="flex gap-6 mt-4">
            <div>
              <div className="text-secondary font-display font-bold text-3xl">{hitCount}</div>
              <div className="font-body text-xs text-on-surface-variant font-medium">Hits</div>
            </div>
            <div>
              <div className="text-tertiary-container font-display font-bold text-3xl">{missCount}</div>
              <div className="font-body text-xs text-on-surface-variant font-medium">Misses</div>
            </div>
            <div>
              <div className="text-on-surface font-display font-bold text-3xl">{hitCount + missCount}</div>
              <div className="font-body text-xs text-on-surface-variant font-medium">Total</div>
            </div>
          </div>
        </div>

        {/* SVG Arc Gauge */}
        <div className="relative flex flex-col items-center justify-center w-24 h-24">
          <svg className="transform -rotate-90 w-24 h-24">
            <circle cx="48" cy="48" r="40" stroke="var(--surface-container-high)" strokeWidth="8" fill="transparent" />
            <motion.circle 
              cx="48" cy="48" r="40" 
              stroke="var(--secondary)" 
              strokeWidth="8" 
              fill="transparent" 
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: 'easeOut' }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display font-bold text-lg text-on-surface">
              {Number.isNaN(hitRatio) ? 0 : hitRatio.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Sparkline */}
      <div className="w-full h-12 mb-6 flex items-end">
        <svg width="100%" height="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="none">
          {polyline && (
             <polyline 
               points={polyline} 
               stroke="var(--outline-variant)" 
               strokeWidth="1.5"
               fill="none" 
               strokeLinejoin="round" 
               opacity={0.3}
             />
          )}
          {circles.map((c, i) => (
             <circle 
               key={i} 
               cx={c.x} 
               cy={c.y} 
               r="3.5" 
               fill={c.isHit ? 'var(--secondary)' : 'var(--tertiary-container)'} 
             />
          ))}
        </svg>
      </div>

      {/* FSM State Machine Tracker */}
      <h3 className="font-display font-bold text-outline-variant text-[10px] tracking-widest uppercase mb-3">FSM Logic Path</h3>
      <div className="flex gap-2 bg-surface-container-low p-1.5 rounded-lg border border-surface-container-high">
        {fsmSteps.map(state => {
          const isActive = fsmState === state || (fsmState === 'MISS' && state === 'MISS') || (fsmState === 'HIT' && state === 'HIT');
          return (
             <div 
               key={state}
               className={`relative flex-1 text-center py-2 rounded-md text-[11px] font-display font-bold tracking-widest uppercase transition-colors duration-300 z-10 
                 ${isActive ? 'text-on-primary' : 'text-on-surface-variant/70'}`}
             >
               {state}
               {isActive && (
                 <motion.div 
                   layoutId="fsmActive"
                   className="absolute inset-0 bg-primary shadow-[0_2px_8px_rgba(0,72,141,0.25)] rounded-md -z-10"
                   transition={{ type: "spring", stiffness: 400, damping: 30 }}
                 />
               )}
             </div>
          );
        })}
      </div>
    </div>
  );
}
