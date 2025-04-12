import { useState, useEffect } from 'react'

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
      const x = getSafeRandom(20, 80, 40, 60);
      const y = getSafeRandom(20, 80, 40, 60);
  
      if (!isTooClose(x, y, zones)) {
        return { x, y };
      }
      tries++;
    }
    return { x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 };
  }

function FloatingWords({ newEntry }) {
    console.log("NEW ENTRY:", newEntry);
    const [allDefinitions, setAllDefinitions] = useState([
        "a quiet moment.",
        "remembering their coffee order.",
        "letting go.",
        "showing up.",
        "absence made bearable.",
        "a connection between many individuals where each side shares a part of themselves over time.",
        "being seen.",
        "love involves each individual going out of their way to understand the other side.",
        "warm silence.",
        "a commitment to be integrated into one another’s lives.",
        "just is.",
        "baby don't hurt me don't hurt me no more",
        ]);

    const [usedZones, setUsedZones] = useState([]);
    const [activeDefs, setActiveDefs] = useState([])

    useEffect(() => {
        if (newEntry && newEntry.trim()) {
          const text = newEntry.trim();
          const id = `${Date.now()}-${Math.random()}`;
          const { x, y } = getSafePosition(usedZones);
      
          const newDef = { id, text, x, y };
      
          setAllDefinitions(prev => [...prev, text]);
      
          setActiveDefs(prev => [...prev, newDef]);
          setUsedZones(prev => [...prev, { x, y }]);
      
          setTimeout(() => {
            setActiveDefs(prev => prev.filter(def => def.id !== id));
            setUsedZones(prev => prev.filter(pos => pos.x !== x || pos.y !== y));
          }, 5000);
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
