import { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu, MemoryStick, Timer, ChevronRight,
  Activity, Database, Layers,
  Play, ArrowRight, Sparkles, GraduationCap
} from 'lucide-react';


// ─── Glowing Data Flow Line ─────────────────────────────────
function DataFlowLine({ delay = 0 }) {
  return (
    <motion.div
      className="absolute h-px w-40 opacity-20"
      style={{
        background: 'linear-gradient(90deg, transparent, #3b82f6, #06b6d4, transparent)',
        left: '-160px',
        top: `${20 + Math.random() * 60}%`,
      }}
      animate={{ x: ['0vw', '120vw'] }}
      transition={{
        duration: 6 + Math.random() * 4,
        repeat: Infinity,
        delay,
        ease: 'linear',
      }}
    />
  );
}

// ─── Feature Card ───────────────────────────────────────────
function FeatureCard({ icon: Icon, title, description, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="group relative"
    >
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-blue-500/20 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
      <div className="relative bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 h-full hover:border-blue-500/30 transition-all duration-500">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20 flex items-center justify-center mb-4 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-shadow duration-500">
          <Icon className="w-6 h-6 text-cyan-400" strokeWidth={1.5} />
        </div>
        <h3 className="text-white font-semibold text-lg mb-2 font-headline">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

// ─── Student Card ───────────────────────────────────────────
function StudentCard({ name, id, role, initials, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <div className="relative bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 hover:border-blue-500/25 transition-all duration-500">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg font-headline shadow-lg shadow-blue-500/20">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold text-base truncate">{name}</h4>
            <p className="text-cyan-400 font-mono text-xs mt-0.5">{id}</p>
            <p className="text-slate-400 text-xs mt-1">{role}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── FSM State Badge ────────────────────────────────────────
function FSMBadge() {
  const states = ['IDLE', 'LOOKUP', 'HIT', 'MISS', 'FETCH'];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIdx(prev => (prev + 1) % states.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-md">
      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_rgba(6,182,212,0.6)]" />
      <span className="text-xs font-mono text-cyan-300">FSM:</span>
      <AnimatePresence mode="wait">
        <motion.span
          key={states[idx]}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="text-xs font-mono text-white font-semibold min-w-[50px]"
        >
          {states[idx]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

// ─── Typewriter Text ────────────────────────────────────────
function TypewriterText({ text, className, delay = 0 }) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i <= text.length) {
        setDisplayed(text.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [text, started]);

  return (
    <span className={className}>
      {displayed}
      {displayed.length < text.length && started && (
        <span className="inline-block w-0.5 h-[1em] bg-cyan-400 ml-0.5 animate-pulse align-baseline" />
      )}
    </span>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  MAIN HOMEPAGE COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function HomePage({ onNavigate }) {
  const dataFlows = useMemo(() => Array.from({ length: 8 }, (_, i) => i * 1.5), []);

  const features = [
    {
      icon: Activity,
      title: '5-State FSM',
      description: 'IDLE → LOOKUP → HIT / MISS → FETCH complete pipeline controller with animated state transitions.',
    },
    {
      icon: Layers,
      title: '512 Cache Lines',
      description: 'Direct-mapped architecture with 1-bit valid, 6-bit tag, and 12-bit data per line.',
    },
    {
      icon: Database,
      title: '32K Main Memory',
      description: '15-bit address space with 12-bit word width. Initialized as mem[i] = (i + 1) & 0xFFF.',
    },
    {
      icon: Timer,
      title: '2-Cycle Latency',
      description: 'Realistic memory delay simulation with pipelined ready signal on cache miss recovery.',
    },
  ];

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'simulation', label: 'Simulation' },
    { id: 'cache-view', label: 'Cache View' },
    { id: 'statistics', label: 'Statistics' },
    { id: 'about', label: 'About' },
  ];

  const techStack = [
    'Verilog HDL', 'Icarus Verilog', 'React', 'Tailwind', 'Framer Motion'
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Animated data flow lines */}
      {dataFlows.map((delay, i) => (
        <DataFlowLine key={i} delay={delay} />
      ))}

      {/* Radial gradient overlays */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/[0.03] rounded-full blur-[100px]" />
      </div>

      {/* ─── TOP NAVBAR ─────────────────────────────────────── */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Cpu className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div>
              <span className="text-white font-bold text-sm font-headline tracking-wide">CacheCtrl</span>
              <span className="text-slate-500 text-[10px] block leading-tight">v1.0</span>
            </div>
          </div>

          {/* Nav links — desktop */}
          <div className="hidden md:flex items-center gap-1 bg-white/[0.04] backdrop-blur-lg border border-white/[0.08] rounded-full px-2 py-1.5">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                  link.id === 'home'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* FSM Badge */}
          <FSMBadge />
        </div>
      </motion.nav>

      {/* ─── HERO SECTION ───────────────────────────────────── */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* University Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md mb-8"
          >
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-slate-300 font-medium tracking-wide">
              Nirma University · Institute of Technology · 2CS504
            </span>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-cyan-400 font-mono text-sm tracking-[0.3em] uppercase mb-4"
          >
            Bridging the Latency Gap
          </motion.p>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-headline leading-[0.95] mb-6"
          >
            <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              Cache
            </span>
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Ctrl
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="text-slate-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-3 font-light"
          >
            Interactive Direct-Mapped Cache Memory Controller Simulator
          </motion.p>

          {/* Course info */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="text-slate-500 text-xs font-mono mb-10"
          >
            2CS504 — Computer Architecture · 4th Semester, 2026
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            {/* Primary CTA — glowing pulse */}
            <button
              onClick={() => onNavigate('simulation')}
              className="group relative px-8 py-3.5 rounded-xl font-semibold text-sm text-white overflow-hidden transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl blur-xl opacity-60 group-hover:opacity-90 transition-opacity animate-pulse" />
              <div className="absolute inset-px bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[11px]" />
              <span className="relative flex items-center gap-2">
                <Play className="w-4 h-4" fill="currentColor" />
                Start Simulation
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>

            {/* Secondary CTA */}
            <button
              onClick={() => onNavigate('about')}
              className="group px-8 py-3.5 rounded-xl font-semibold text-sm text-slate-300 border border-white/[0.1] hover:border-blue-500/30 hover:bg-white/[0.03] transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                Explore Architecture
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </motion.div>

          {/* Tech Stack Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.6 }}
            className="flex flex-wrap justify-center gap-2.5"
          >
            {techStack.map((tech, i) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 1.6 + i * 0.1 }}
                className="px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-400 text-xs font-mono hover:border-blue-500/30 hover:text-blue-300 transition-all duration-300 cursor-default"
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-slate-600 text-[10px] uppercase tracking-[0.2em]">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            className="w-5 h-8 rounded-full border border-slate-700 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2 rounded-full bg-blue-400/60" />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── FEATURES SECTION ───────────────────────────────── */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-cyan-400 font-mono text-xs tracking-[0.2em] uppercase mb-3">Architecture</p>
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-white mb-4">
              Built on Verified{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Hardware Design
              </span>
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Every component mirrors the Verilog RTL implementation — from FSM state transitions to
              the 2-cycle memory latency pipeline.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <FeatureCard key={i} icon={f.icon} title={f.title} description={f.description} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── MEMORY HIERARCHY DIAGRAM ───────────────────────── */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-cyan-400 font-mono text-xs tracking-[0.2em] uppercase mb-3">Data Path</p>
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-white">
              Memory Hierarchy
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row items-stretch gap-0"
          >
            {[
              { icon: Cpu, label: 'CPU', sub: 'Request Generator', color: 'from-blue-500 to-blue-600' },
              { icon: MemoryStick, label: 'L1 Cache', sub: '512 Lines · Direct-Mapped', color: 'from-cyan-500 to-blue-500' },
              { icon: Database, label: 'Main Memory', sub: '32K × 12-bit · 2-cycle', color: 'from-purple-500 to-blue-500' },
            ].map((item, i) => (
              <div key={i} className="flex items-center flex-1">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="flex-1 bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 text-center hover:border-blue-500/20 transition-all duration-300 group"
                >
                  <div className={`w-14 h-14 mx-auto rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3 shadow-lg shadow-blue-500/10 group-hover:shadow-blue-500/25 transition-shadow`}>
                    <item.icon className="w-7 h-7 text-white" strokeWidth={1.5} />
                  </div>
                  <p className="text-white font-semibold text-base font-headline">{item.label}</p>
                  <p className="text-slate-400 text-xs mt-1">{item.sub}</p>
                </motion.div>
                {i < 2 && (
                  <div className="hidden md:flex flex-col items-center justify-center px-2 min-w-[50px]">
                    <motion.div
                      animate={{ x: [0, 6, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut', delay: i * 0.3 }}
                    >
                      <ArrowRight className="w-5 h-5 text-blue-500/40" />
                    </motion.div>
                    <span className="text-[9px] text-slate-600 font-mono mt-1">
                      {i === 0 ? 'addr[14:0]' : 'data[11:0]'}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── TEAM SECTION ───────────────────────────────────── */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-cyan-400 font-mono text-xs tracking-[0.2em] uppercase mb-3">Team</p>
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-white mb-4">
              The Engineers
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
            <StudentCard
              name="Meet Kotecha"
              id="24BCE380"
              role="RTL Design & Web Simulator"
              initials="MK"
              delay={0.1}
            />
            <StudentCard
              name="Dhruvraj Rathod"
              id="24BCE374"
              role="Verification & Testing"
              initials="DR"
              delay={0.2}
            />
          </div>

          {/* Guided By */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 backdrop-blur-md"
          >
            <p className="text-slate-500 text-xs uppercase tracking-[0.15em] mb-1">Guided By</p>
            <p className="text-slate-300 font-medium text-sm">Prof. [Your Professor's Name]</p>
            <p className="text-slate-500 text-xs mt-0.5">Department of Computer Science & Engineering</p>
          </motion.div>
        </div>
      </section>

      {/* ─── ADDRESS BIT BREAKDOWN ──────────────────────────── */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <p className="text-cyan-400 font-mono text-xs tracking-[0.2em] uppercase mb-3">Address Architecture</p>
            <h2 className="text-2xl md:text-3xl font-bold font-headline text-white">
              15-Bit Address Decomposition
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 backdrop-blur-md"
          >
            {/* Bit fields */}
            <div className="flex gap-px justify-center mb-6 overflow-x-auto">
              {Array.from({ length: 15 }, (_, i) => {
                const bitIdx = 14 - i;
                const isTag = bitIdx >= 9;
                const isIndex = bitIdx < 9;
                return (
                  <motion.div
                    key={bitIdx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    className={`w-10 h-14 flex flex-col items-center justify-center rounded-lg border text-xs font-mono ${
                      isTag
                        ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                        : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                    }`}
                  >
                    <span className="text-[9px] text-slate-500">{bitIdx}</span>
                    <span className="font-semibold">{isTag ? 'T' : 'I'}</span>
                  </motion.div>
                );
              })}
            </div>

            {/* Labels */}
            <div className="flex justify-center gap-8 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-500/40 border border-blue-500/60" />
                <span className="text-slate-300 font-mono">Tag [14:9] — 6 bits</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-cyan-500/40 border border-cyan-500/60" />
                <span className="text-slate-300 font-mono">Index [8:0] — 9 bits</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FINAL CTA ──────────────────────────────────────── */}
      <section className="relative z-10 py-28 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-8 h-8 text-cyan-400/60 mx-auto mb-5" />
            <h2 className="text-3xl md:text-5xl font-bold font-headline text-white mb-4">
              Ready to{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Simulate
              </span>
              ?
            </h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-8">
              Explore the cache controller in action — test hit/miss patterns,
              observe FSM transitions, and analyze performance metrics in real time.
            </p>
            <button
              onClick={() => onNavigate('simulation')}
              className="group relative px-10 py-4 rounded-xl font-semibold text-white overflow-hidden text-base"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl blur-2xl opacity-40 group-hover:opacity-70 transition-opacity animate-pulse" />
              <div className="absolute inset-px bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[11px]" />
              <span className="relative flex items-center gap-2 justify-center">
                <Play className="w-5 h-5" fill="currentColor" />
                Launch Simulator
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/[0.05] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-white" />
            </div>
            <span className="text-slate-500 text-xs font-mono">CacheCtrl v1.0</span>
          </div>
          <p className="text-slate-600 text-xs text-center">
            Nirma University · 2CS504 — Computer Architecture · 4th Semester 2026
          </p>
          <p className="text-slate-600 text-xs">
            Meet Kotecha · Dhruvraj Rathod
          </p>
        </div>
      </footer>
    </div>
  );
}
