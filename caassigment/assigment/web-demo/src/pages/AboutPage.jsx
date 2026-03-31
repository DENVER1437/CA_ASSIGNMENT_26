import { motion } from 'framer-motion';
import VerilogViewer from '../components/VerilogViewer';

export default function AboutPage({ onNavigate }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Hero */}
      <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-white/10 p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-xs text-blue-400 font-label font-semibold uppercase tracking-wider mb-1">Academic Project</p>
            <h1 className="text-3xl font-headline font-bold text-white">Bridging the Latency Gap</h1>
            <p className="text-slate-400 mt-1">Interactive Direct-Mapped Cache Memory Controller</p>
          </div>
          <div className="bg-blue-500/15 border border-blue-500/25 rounded-xl px-5 py-3 text-center shrink-0">
            <p className="text-xs text-blue-400 font-label font-semibold uppercase">Verilog Core</p>
            <p className="font-mono text-2xl font-bold text-blue-200 mt-1">v1.0</p>
          </div>
        </div>
      </div>

      {/* Project Overview */}
      <div className="bg-slate-900/50 backdrop-blur-md rounded-xl border border-white/10 p-6">
        <h3 className="font-headline font-semibold text-white mb-4">Project Overview</h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          This project implements a fully functional Direct-Mapped Cache Memory Controller in Verilog HDL,
          accompanied by an interactive web-based simulator. The design follows a 5-state FSM architecture
          that faithfully models real hardware behavior, including hit/miss detection, main memory fetch
          with 2-cycle latency, and cache line write-back.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: 'developer_board', title: '5-State FSM', desc: 'IDLE → LOOKUP → HIT/MISS → FETCH full pipeline controller' },
            { icon: 'memory', title: '512 Cache Lines', desc: 'Direct-mapped with 1-bit valid, 6-bit tag, 12-bit data per line' },
            { icon: 'storage', title: '32K Main Memory', desc: '15-bit address space, 12-bit words, initialized with address+1' },
            { icon: 'speed', title: '2-Cycle Latency', desc: 'Realistic memory delay simulation with pipelined ready signal' },
          ].map((f, i) => (
            <div key={i} className="bg-white/5 rounded-lg p-4 flex gap-3 border border-white/10">
              <span className="material-symbols-outlined text-blue-400 text-2xl mt-0.5">{f.icon}</span>
              <div>
                <p className="font-headline font-semibold text-sm text-white">{f.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Info */}
      <div className="bg-slate-900/50 backdrop-blur-md rounded-xl border border-white/10 p-6">
        <h3 className="font-headline font-semibold text-white mb-4">Team</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          {[
            { name: 'Meet Kotecha', id: '24BCE380', role: 'RTL Design & Web Simulator' },
            { name: 'Dhruvraj Rathod', id: '24BCE374', role: 'Verification & Testing' },
          ].map((s, i) => (
            <div key={i} className="bg-white/5 rounded-lg p-4 flex items-center gap-4 border border-white/10">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary font-headline font-bold text-lg">
                {s.name.charAt(0)}
              </div>
              <div>
                <p className="font-headline font-semibold text-white">{s.name}</p>
                <p className="font-mono text-xs text-blue-400">{s.id}</p>
                <p className="text-xs text-slate-400">{s.role}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white/5 rounded-lg p-4 flex flex-wrap gap-6 text-sm border border-white/10">
          <div>
            <p className="text-xs text-slate-500 font-label uppercase">University</p>
            <p className="font-headline font-semibold text-white">Nirma University</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-label uppercase">Course</p>
            <p className="font-headline font-semibold text-white">2CS504 — Computer Architecture</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-label uppercase">Semester</p>
            <p className="font-headline font-semibold text-white">4th Semester, 2026</p>
          </div>
        </div>
      </div>

      {/* Implementation Specs */}
      <div className="bg-slate-900/50 backdrop-blur-md rounded-xl border border-white/10 p-6">
        <h3 className="font-headline font-semibold text-white mb-4">Implementation Stack</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Hardware', value: 'Verilog HDL', icon: 'developer_board' },
            { label: 'Simulator', value: 'Icarus Verilog', icon: 'terminal' },
            { label: 'Frontend', value: 'React + Tailwind', icon: 'web' },
            { label: 'Animation', value: 'Framer Motion', icon: 'animation' },
          ].map((s, i) => (
            <div key={i} className="bg-white/5 rounded-lg p-4 text-center border border-white/10">
              <span className="material-symbols-outlined text-blue-400 text-2xl mb-2 block">{s.icon}</span>
              <p className="text-xs text-slate-500 font-label uppercase">{s.label}</p>
              <p className="font-headline font-semibold text-white text-sm mt-1">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FSM Architecture Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="bg-slate-900/50 backdrop-blur-md rounded-xl border border-white/10 p-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <h3 className="font-headline font-semibold text-white text-xl">FSM Architecture</h3>
          <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[11px] font-semibold uppercase tracking-wide border border-purple-500/30">5 States</span>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          The controller follows a strict 5-state Finite State Machine implemented in Verilog HDL.
          Each state transition is deterministic and driven by cache hit/miss detection logic.
        </p>

        {/* Dark SVG container */}
        <div className="rounded-xl border border-white/10 p-6 mb-6 bg-slate-900/50 backdrop-blur-md">
          <svg width="100%" viewBox="0 0 680 509.02" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <marker id="fsm-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </marker>
            </defs>
            <rect x="270" y="30" width="140" height="56" rx="28" fill="#444441" stroke="#b4b2a9" strokeWidth="0.5"/>
            <text x="340" y="54" textAnchor="middle" dominantBaseline="central" fill="#d3d1c7" fontSize="14" fontWeight="500" fontFamily="sans-serif">IDLE</text>
            <text x="340" y="72" textAnchor="middle" dominantBaseline="central" fill="#b4b2a9" fontSize="12" fontFamily="sans-serif">Wait for CPU req</text>
            <text x="440" y="58" opacity="0.6" fill="#c2c0b6" fontSize="12" fontFamily="sans-serif">no request</text>
            <path d="M412 42 Q460 20 460 58 Q460 80 412 72" fill="none" stroke="#9c9a92" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4" markerEnd="url(#fsm-arrow)"/>
            <line x1="340" y1="86" x2="340" y2="148" stroke="#9c9a92" strokeWidth="1.5" markerEnd="url(#fsm-arrow)"/>
            <text x="356" y="122" opacity="0.7" fill="#c2c0b6" fontSize="12" fontFamily="sans-serif">CPU request</text>
            <rect x="250" y="148" width="180" height="66" rx="8" fill="#3c3489" stroke="#afa9ec" strokeWidth="0.5"/>
            <text x="340" y="172" textAnchor="middle" dominantBaseline="central" fill="#cecbf6" fontSize="14" fontWeight="500" fontFamily="sans-serif">LOOKUP</text>
            <text x="340" y="190" textAnchor="middle" dominantBaseline="central" fill="#afa9ec" fontSize="12" fontFamily="sans-serif">Read cache[index]</text>
            <text x="340" y="206" textAnchor="middle" dominantBaseline="central" fill="#afa9ec" fontSize="12" fontFamily="sans-serif">Compare tag + valid</text>
            <path d="M250 188 L140 188 L140 310" fill="none" stroke="#9c9a92" strokeWidth="1" opacity="0.6" markerEnd="url(#fsm-arrow)"/>
            <text x="68" y="240" opacity="0.7" fill="#c2c0b6" fontSize="12" fontFamily="sans-serif">hit</text>
            <text x="38" y="253" opacity="0.5" fill="#c2c0b6" fontSize="12" fontFamily="sans-serif">(tag match</text>
            <text x="38" y="265" opacity="0.5" fill="#c2c0b6" fontSize="12" fontFamily="sans-serif">+ valid=1)</text>
            <path d="M430 188 L540 188 L540 310" fill="none" stroke="#9c9a92" strokeWidth="1" opacity="0.6" markerEnd="url(#fsm-arrow)"/>
            <text x="552" y="240" opacity="0.7" fill="#c2c0b6" fontSize="12" fontFamily="sans-serif">miss</text>
            <text x="548" y="253" opacity="0.5" fill="#c2c0b6" fontSize="12" fontFamily="sans-serif">(no match</text>
            <text x="548" y="265" opacity="0.5" fill="#c2c0b6" fontSize="12" fontFamily="sans-serif">or valid=0)</text>
            <rect x="60" y="310" width="160" height="66" rx="8" fill="#27500a" stroke="#97c459" strokeWidth="0.5"/>
            <text x="140" y="334" textAnchor="middle" dominantBaseline="central" fill="#c0dd97" fontSize="14" fontWeight="500" fontFamily="sans-serif">HIT</text>
            <text x="140" y="352" textAnchor="middle" dominantBaseline="central" fill="#97c459" fontSize="12" fontFamily="sans-serif">Return cache data</text>
            <text x="140" y="368" textAnchor="middle" dominantBaseline="central" fill="#97c459" fontSize="12" fontFamily="sans-serif">to CPU (1 cycle)</text>
            <rect x="460" y="310" width="160" height="66" rx="8" fill="#791f1f" stroke="#f09595" strokeWidth="0.5"/>
            <text x="540" y="334" textAnchor="middle" dominantBaseline="central" fill="#f7c1c1" fontSize="14" fontWeight="500" fontFamily="sans-serif">MISS</text>
            <text x="540" y="352" textAnchor="middle" dominantBaseline="central" fill="#f09595" fontSize="12" fontFamily="sans-serif">Send addr to</text>
            <text x="540" y="368" textAnchor="middle" dominantBaseline="central" fill="#f09595" fontSize="12" fontFamily="sans-serif">main memory</text>
            <line x1="540" y1="376" x2="540" y2="428" stroke="#9c9a92" strokeWidth="1.5" markerEnd="url(#fsm-arrow)"/>
            <rect x="390" y="428" width="160" height="56" rx="8" fill="#0c447c" stroke="#85b7eb" strokeWidth="0.5"/>
            <text x="470" y="452" textAnchor="middle" dominantBaseline="central" fill="#b5d4f4" fontSize="14" fontWeight="500" fontFamily="sans-serif">FETCH</text>
            <text x="470" y="470" textAnchor="middle" dominantBaseline="central" fill="#85b7eb" fontSize="12" fontFamily="sans-serif">Load block, update cache</text>
            <path d="M390 456 L340 456 L340 430 L280 430 L280 86" fill="none" stroke="#9c9a92" strokeWidth="0.8" strokeDasharray="4 3" opacity="0.4" markerEnd="url(#fsm-arrow)"/>
            <text x="190" y="448" opacity="0.6" fill="#c2c0b6" fontSize="12" fontFamily="sans-serif">→ back to IDLE</text>
            <path d="M140 376 L140 456 L260 456" fill="none" stroke="#9c9a92" strokeWidth="0.8" strokeDasharray="4 3" opacity="0.3" markerEnd="url(#fsm-arrow)"/>
            <rect x="30" y="30" width="10" height="10" rx="2" fill="#3B6D11" opacity="0.6"/>
            <text x="46" y="40" opacity="0.6" fill="#c2c0b6" fontSize="12" fontFamily="sans-serif">HIT path</text>
            <rect x="30" y="48" width="10" height="10" rx="2" fill="#A32D2D" opacity="0.6"/>
            <text x="46" y="58" opacity="0.6" fill="#c2c0b6" fontSize="12" fontFamily="sans-serif">MISS path</text>
            <text x="340" y="496" textAnchor="middle" opacity="0.4" fill="#c2c0b6" fontSize="12" fontFamily="sans-serif">Cache controller FSM — 5 states</text>
          </svg>
        </div>

        {/* State pills grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { state: 'IDLE', label: 'Wait for CPU req', color: 'bg-slate-700/50 text-slate-300 border-slate-600' },
            { state: 'LOOKUP', label: 'Tag comparison', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
            { state: 'HIT', label: '1-cycle response', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
            { state: 'MISS', label: 'Tag mismatch', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
            { state: 'FETCH', label: 'Main mem fetch', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
          ].map((s, i) => (
            <div key={i} className={`rounded-lg border p-3 text-center ${s.color}`}>
              <p className="font-mono font-bold text-sm">{s.state}</p>
              <p className="text-xs mt-0.5 opacity-70">{s.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Hardware Block Diagram Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-slate-900/50 backdrop-blur-md rounded-xl border border-white/10 p-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <h3 className="font-headline font-semibold text-white text-xl">Hardware Block Diagram</h3>
          <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[11px] font-semibold uppercase tracking-wide border border-teal-500/30">RTL Design</span>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          Complete datapath showing the CPU, Cache Controller FSM, Address Splitter, Cache Memory Array,
          and Main Memory — connected by address, data, and control buses.
        </p>

        {/* Dark SVG container */}
        <div className="rounded-xl border border-white/10 p-6 mb-6 bg-slate-900/50 backdrop-blur-md">
          <svg width="100%" viewBox="0 0 680 520" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <marker id="block-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </marker>
            </defs>
            <rect x="40" y="210" width="100" height="56" rx="8" fill="#3c3489" stroke="#afa9ec" strokeWidth="0.5"/>
            <text x="90" y="234" textAnchor="middle" dominantBaseline="central" fill="#cecbf6" fontSize="14" fontWeight="500" fontFamily="sans-serif">CPU</text>
            <text x="90" y="252" textAnchor="middle" dominantBaseline="central" fill="#afa9ec" fontSize="12" fontFamily="sans-serif">15-bit address</text>
            <line x1="140" y1="238" x2="200" y2="238" stroke="#9c9a92" strokeWidth="1.5" markerEnd="url(#block-arrow)"/>
            <rect x="200" y="170" width="160" height="136" rx="10" fill="#085041" stroke="#5dcaa5" strokeWidth="0.5"/>
            <text x="280" y="200" textAnchor="middle" dominantBaseline="central" fill="#9fe1cb" fontSize="14" fontWeight="500" fontFamily="sans-serif">Cache controller</text>
            <text x="280" y="218" textAnchor="middle" dominantBaseline="central" fill="#5dcaa5" fontSize="12" fontFamily="sans-serif">FSM</text>
            <text x="280" y="238" textAnchor="middle" dominantBaseline="central" fill="#5dcaa5" fontSize="12" fontFamily="sans-serif">Tag comparator</text>
            <text x="280" y="256" textAnchor="middle" dominantBaseline="central" fill="#5dcaa5" fontSize="12" fontFamily="sans-serif">Hit / miss logic</text>
            <text x="280" y="274" textAnchor="middle" dominantBaseline="central" fill="#5dcaa5" fontSize="12" fontFamily="sans-serif">Valid bit check</text>
            <rect x="200" y="60" width="160" height="72" rx="8" fill="#444441" stroke="#b4b2a9" strokeWidth="0.5"/>
            <text x="280" y="84" textAnchor="middle" dominantBaseline="central" fill="#d3d1c7" fontSize="14" fontWeight="500" fontFamily="sans-serif">Address splitter</text>
            <text x="280" y="102" textAnchor="middle" dominantBaseline="central" fill="#b4b2a9" fontSize="12" fontFamily="sans-serif">Tag [14:9] — 6 bits</text>
            <text x="280" y="118" textAnchor="middle" dominantBaseline="central" fill="#b4b2a9" fontSize="12" fontFamily="sans-serif">Index [8:0] — 9 bits</text>
            <path d="M90 210 L90 96 L198 96" fill="none" stroke="#9c9a92" strokeWidth="1" opacity="0.5" markerEnd="url(#block-arrow)"/>
            <line x1="280" y1="132" x2="280" y2="168" stroke="#9c9a92" strokeWidth="1.5" markerEnd="url(#block-arrow)"/>
            <rect x="440" y="130" width="160" height="96" rx="8" fill="#633806" stroke="#ef9f27" strokeWidth="0.5"/>
            <text x="520" y="160" textAnchor="middle" dominantBaseline="central" fill="#fac775" fontSize="14" fontWeight="500" fontFamily="sans-serif">Cache memory</text>
            <text x="520" y="178" textAnchor="middle" dominantBaseline="central" fill="#ef9f27" fontSize="12" fontFamily="sans-serif">512 × 12 bits</text>
            <text x="520" y="196" textAnchor="middle" dominantBaseline="central" fill="#ef9f27" fontSize="12" fontFamily="sans-serif">valid | tag | data</text>
            <line x1="360" y1="210" x2="438" y2="190" stroke="#9c9a92" strokeWidth="1.5" markerEnd="url(#block-arrow)"/>
            <line x1="438" y1="210" x2="362" y2="228" stroke="#9c9a92" strokeWidth="1.5" markerEnd="url(#block-arrow)"/>
            <text x="398" y="195" textAnchor="middle" opacity="0.7" fill="#c2c0b6" fontSize="12" fontFamily="sans-serif">index / tag</text>
            <text x="398" y="230" textAnchor="middle" opacity="0.7" fill="#c2c0b6" fontSize="12" fontFamily="sans-serif">data / valid</text>
            <rect x="440" y="320" width="160" height="96" rx="8" fill="#0c447c" stroke="#85b7eb" strokeWidth="0.5"/>
            <text x="520" y="350" textAnchor="middle" dominantBaseline="central" fill="#b5d4f4" fontSize="14" fontWeight="500" fontFamily="sans-serif">Main memory</text>
            <text x="520" y="368" textAnchor="middle" dominantBaseline="central" fill="#85b7eb" fontSize="12" fontFamily="sans-serif">32K × 12 bits</text>
            <text x="520" y="386" textAnchor="middle" dominantBaseline="central" fill="#85b7eb" fontSize="12" fontFamily="sans-serif">15-bit addressable</text>
            <path d="M360 278 L400 278 L400 368 L438 368" fill="none" stroke="#9c9a92" strokeWidth="1" opacity="0.6" markerEnd="url(#block-arrow)"/>
            <path d="M438 350 L400 350 L400 258 L362 258" fill="none" stroke="#378add" strokeWidth="1" opacity="0.6" markerEnd="url(#block-arrow)"/>
            <text x="408" y="295" opacity="0.7" fill="#c2c0b6" fontSize="12" fontFamily="sans-serif">addr (miss)</text>
            <text x="408" y="343" opacity="0.7" fill="#c2c0b6" fontSize="12" fontFamily="sans-serif">data block</text>
            <path d="M200 305 L90 305 L90 266" fill="none" stroke="#0f6e56" strokeWidth="1" opacity="0.6" markerEnd="url(#block-arrow)"/>
            <text x="130" y="320" opacity="0.7" fill="#c2c0b6" fontSize="12" fontFamily="sans-serif">data to CPU</text>
            <rect x="200" y="390" width="80" height="32" rx="6" fill="#27500a" stroke="#97c459" strokeWidth="0.5"/>
            <text x="240" y="407" textAnchor="middle" dominantBaseline="central" fill="#97c459" fontSize="12" fontFamily="sans-serif">HIT</text>
            <rect x="300" y="390" width="80" height="32" rx="6" fill="#791f1f" stroke="#f09595" strokeWidth="0.5"/>
            <text x="340" y="407" textAnchor="middle" dominantBaseline="central" fill="#f09595" fontSize="12" fontFamily="sans-serif">MISS</text>
            <line x1="250" y1="306" x2="240" y2="388" stroke="#9c9a92" strokeWidth="1.5" opacity="0.5" markerEnd="url(#block-arrow)"/>
            <line x1="310" y1="306" x2="340" y2="388" stroke="#9c9a92" strokeWidth="1.5" opacity="0.5" markerEnd="url(#block-arrow)"/>
            <text x="340" y="480" textAnchor="middle" opacity="0.5" fill="#faf9f5" fontSize="14" fontWeight="500" fontFamily="sans-serif">Direct-mapped cache memory controller — block diagram</text>
          </svg>
        </div>

        {/* Component legend row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { dot: 'bg-purple-500', name: 'CPU', desc: 'Request Generator' },
            { dot: 'bg-teal-500', name: 'Controller', desc: 'FSM + Tag Comparator' },
            { dot: 'bg-gray-400', name: 'Addr Splitter', desc: '6-bit Tag | 9-bit Index' },
            { dot: 'bg-amber-500', name: 'Cache Array', desc: '512 Lines × 12-bit' },
            { dot: 'bg-blue-500', name: 'Main Memory', desc: '32K × 12-bit, 2-cycle' },
          ].map((c, i) => (
            <div key={i} className="bg-white/5 rounded-lg p-3 flex items-start gap-2.5 border border-white/10">
              <div className={`w-2.5 h-2.5 rounded-full ${c.dot} mt-1 shrink-0`} />
              <div>
                <p className="font-headline font-semibold text-xs text-white">{c.name}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Verilog Viewer */}
      <VerilogViewer />

      {/* CTA */}
      <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl p-8 text-center border border-white/10">
        <h3 className="text-2xl font-headline font-bold text-white mb-2">Ready to Simulate?</h3>
        <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
          Explore the cache controller in action — test hit/miss patterns, observe FSM transitions,
          and analyze performance metrics in real time.
        </p>
        <button
          onClick={() => onNavigate('simulation')}
          className="px-8 py-3 bg-blue-500 text-white font-label font-bold rounded-xl hover:bg-blue-600 transition-colors"
        >
          Launch Simulator →
        </button>
      </div>
    </motion.div>
  );
}
