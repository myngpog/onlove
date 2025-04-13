import { useState, useEffect, useRef } from 'react';

function getSafeRandom(min = 0, max = 100, excludedMin = 40, excludedMax = 60) {
    const rand = Math.random() * (max - min) + min;
    if (rand > excludedMin && rand < excludedMax) {
      return getSafeRandom(min, max, excludedMin, excludedMax);
    }
    return rand;
  }

function isTooClose(newX, newY, zones, threshold = 10) {
    return zones.some(({ x, y }) => {
      const dx = Math.abs(newX - x);
      const dy = Math.abs(newY - y);
      return dx < threshold && dy < threshold;
    });
  }

  function getSafePosition(zones) {
    let tries = 0;
    while (tries < 10) {
      const x = getSafeRandom(15, 85, 40, 60);
      const y = getSafeRandom(15, 85, 40, 60);
  
      if (!isTooClose(x, y, zones)) {
        return { x, y };
      }
      tries++;
    }
    return { x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 };
  }

function FloatingWords({ newEntry }) {
    console.log("NEW ENTRY:", newEntry);
    const [allDefinitions, setAllDefinitions] = useState([]);
    const [usedZones, setUsedZones] = useState([]);
    const [activeDefs, setActiveDefs] = useState([])
    const recentEntries = useRef(new Map());

    //  fetch from DB
    useEffect(() => {
      const fetchDefs = async () => {
        try {
          const res = await fetch('http://localhost:3001/api/getDefinitions');
          const data = await res.json();
          const texts = data.map(d => d.text);
          setAllDefinitions(texts);
          console.log('✅ Loaded definitions:', texts);
        } catch (err) {
          console.error("Failed to fetch definitions from DB", err);
        }
      };
    
      fetchDefs();
    }, []);
    

    useEffect(() => {
      if (newEntry && newEntry.trim()) {
        const text = newEntry.trim().toLowerCase(); 
        const now = Date.now();
        const lastShown = recentEntries.current.get(text);
    
        if (lastShown && now - lastShown < 6000) return;
    
        recentEntries.current.set(text, now);
    
        const id = `${now}-${Math.random()}`;
        const { x, y } = getSafePosition(usedZones);
        const newDef = { id, text, x, y };
    
        setAllDefinitions(prev => [...prev, text]);
        setActiveDefs(prev => [...prev, newDef]);
        setUsedZones(prev => [...prev, { x, y }]);
    
        setTimeout(() => {
          setActiveDefs(prev => prev.filter(def => def.id !== id));
          setUsedZones(prev => prev.filter(pos => pos.x !== x || pos.y !== y));
          recentEntries.current.delete(text); 
        }, 6000);
      }
    }, [newEntry]);
    

    useEffect(() => {
        const interval = setInterval(() => {
        const { x, y } = getSafePosition(usedZones);
    
        const newDef = {
            id: Date.now(),
            text: allDefinitions[Math.floor(Math.random() * allDefinitions.length)],
            x,
            y
        };
    
        setActiveDefs(prev => {
            if (prev.length >= 5) return prev;
            return [...prev, newDef];
        });
    
        setUsedZones(prev => [...prev, { x, y }]);
    
        setTimeout(() => {
            setUsedZones(prev => prev.filter(pos => pos.x !== x || pos.y !== y));
            setActiveDefs(prev => prev.filter(def => def.id !== newDef.id));
        }, 5000);
        }, 1000);
    
        return () => clearInterval(interval);
    }, [usedZones]);
  
  

  return (
    <>
      {activeDefs.map(def => (
        <p
          key={def.id}
          className="floating-def"
          style={{
            left: `${def.x}%`,
            top: `${def.y}%`
          }}
        >
          {def.text}
        </p>
      ))}
    </>
  )
}

export default FloatingWords
