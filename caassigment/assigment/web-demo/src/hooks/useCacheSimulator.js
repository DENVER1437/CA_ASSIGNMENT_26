import { useState, useRef, useCallback } from 'react';
import { flushSync } from 'react-dom';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export function useCacheSimulator() {
  const [cacheLines, setCacheLines] = useState(() => 
    Array.from({ length: 512 }, () => ({ valid: false, tag: 0, data: 0 }))
  );
  
  const [fsmState, setFsmState] = useState('IDLE');
  const [hitCount, setHitCount] = useState(0);
  const [missCount, setMissCount] = useState(0);
  const [accessLog, setAccessLog] = useState([]);
  const [sparklineData, setSparklineData] = useState([]);
  const [lastAccess, setLastAccess] = useState(null);

  // Main memory: 32K * 12 bits, initialized as mem[i] = (i + 1) & 0xFFF according to user spec
  const mainMemory = useRef(null);
  if (!mainMemory.current) {
    try {
      mainMemory.current = Array.from({ length: 32768 }, (_, i) => (i + 1) & 0xFFF);
    } catch (e) {
      console.error('Failed to initialize 32K main memory:', e);
      mainMemory.current = []; // fallback
    }
  }
  // Cancel token to kill overlapping animations
  const cancelRef = useRef(null);

  const accessCache = useCallback(async (hexAddr) => {
    // 1. Setup Cancel Token
    if (cancelRef.current) {
      cancelRef.current.cancelled = true;
    }
    const currentToken = { cancelled: false };
    cancelRef.current = currentToken;

    let numAddr = parseInt(hexAddr, 16);
    if (isNaN(numAddr)) return null;

    // Address parse
    numAddr = numAddr & 0x7FFF; // 15 bits max
    const tag = (numAddr >> 9) & 0x3F; // 6 bits
    const index = numAddr & 0x1FF; // 9 bits

    // Begin sequence
    setFsmState('IDLE');
    await sleep(300);
    if (currentToken.cancelled) return;

    setFsmState('LOOKUP');
    await sleep(300);
    if (currentToken.cancelled) return;

    let isHit = false;
    let dataReturned = 0;
    let currentLines = [];
    
    flushSync(() => {
      setCacheLines(prev => {
        currentLines = prev;
        return prev;
      });
    });

    const targetLine = currentLines[index];
    isHit = targetLine.valid && targetLine.tag === tag;
    
    const newLogEntry = {
      addr: numAddr.toString(16).padStart(4, '0'),
      tag,
      index,
      hit: isHit,
      timestamp: Date.now()
    };

    if (isHit) {
      // HIT PATH
      setFsmState('HIT');
      dataReturned = targetLine.data;
      newLogEntry.data = dataReturned;
      
      setHitCount(c => c + 1);
      setAccessLog(prev => [newLogEntry, ...prev].slice(0, 20));
      setSparklineData(prev => [true, ...prev].slice(0, 20));
      setLastAccess(newLogEntry);

      await sleep(300);
      if (currentToken.cancelled) return;

    } else {
      // MISS PATH
      setFsmState('MISS');
      setMissCount(c => c + 1);
      
      // Memory fetch simulation (wait visually)
      await sleep(300);
      if (currentToken.cancelled) return;

      setFsmState('FETCH');
      // Fetch from simulated main memory
      dataReturned = mainMemory.current[numAddr];
      newLogEntry.data = dataReturned;

      setAccessLog(prev => [newLogEntry, ...prev].slice(0, 20));
      setSparklineData(prev => [false, ...prev].slice(0, 20));
      setLastAccess(newLogEntry);

      // Write back to cache
      setCacheLines(prev => {
        const next = [...prev];
        next[index] = { valid: true, tag, data: dataReturned };
        return next;
      });

      await sleep(300);
      if (currentToken.cancelled) return;
    }

    setFsmState('IDLE');
    
    return {
      hit: isHit,
      data: dataReturned,
      tag,
      index,
      fsm_states_sequence: ['IDLE', 'LOOKUP', isHit ? 'HIT' : 'MISS', ...(isHit ? [] : ['FETCH']), 'IDLE']
    };
  }, []);

  const resetCache = useCallback(() => {
    if (cancelRef.current) cancelRef.current.cancelled = true;
    setCacheLines(Array.from({ length: 512 }, () => ({ valid: false, tag: 0, data: 0 })));
    setFsmState('IDLE');
    setHitCount(0);
    setMissCount(0);
    setAccessLog([]);
    setSparklineData([]);
    setLastAccess(null);
  }, []);

  const hitRatio = hitCount + missCount === 0 
    ? 0 
    : (hitCount / (hitCount + missCount)) * 100;

  return {
    accessCache,
    resetCache,
    cacheLines,
    fsmState,
    hitCount,
    missCount,
    hitRatio,
    accessLog,
    sparklineData,
    lastAccess
  };
}
