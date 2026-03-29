import { useState, useEffect, useCallback, useRef, useMemo } from "react";

// ─── WORD DATA ───
const ALL_WORDS = [
  { id:"siecle", word:"siècle", game:"siècle", hint:"100 ans", tip:"Du latin « saeculum ». Le è devant consonne + e muet → accent grave." },
  { id:"humain", word:"humain", game:"humain", hint:"Toi et moi", tip:"Du latin « humanus ». Féminin : humaine → pas de E au masculin !" },
  { id:"vers", word:"vers", game:"vers", hint:"En direction de", tip:"Ne confonds pas : vert (couleur), ver (animal), vers (direction → S final)." },
  { id:"voguer", word:"voguer", game:"voguer", hint:"Avancer sur l'eau", tip:"Le U après G garde le son dur [g]. Comme naviguer !" },
  { id:"naviguer", word:"naviguer", game:"naviguer", hint:"Diriger un bateau", tip:"Du latin « navigare » (navis = bateau). GU = son dur [g]." },
  { id:"permettre", word:"permettre", game:"permettre", hint:"Donner le droit", tip:"Per + mettre → deux T comme « mettre » !" },
  { id:"atravers", word:"à travers", game:"travers", hint:"D'un côté à l'autre", prefix:"à ", tip:"« À » avec accent = direction. « Travers » avec S, pense à traverser." },
  { id:"celebre", word:"célèbre", game:"célèbre", hint:"Connu de tous", tip:"Cé-LÈ-bre : 1er É aigu (syllabe ouverte), 2e È grave (devant consonne)." },
  { id:"representer", word:"représenter", game:"représenter", hint:"Montrer, symboliser", tip:"Re-pré-sen-ter. « Présent » est caché dedans !" },
  { id:"pourquoi", word:"pourquoi", game:"pourquoi", hint:"Pour quelle raison ?", tip:"« Pour » + « quoi » collés ! QU fait le son [k]." },
  { id:"voici", word:"voici", game:"voici", hint:"Regarde, c'est là !", tip:"« Voi » (voir) + « ci » (ici). Voici = ce qui est proche." },
  { id:"parceque", word:"parce que", game:"parce que", hint:"Donne la raison", tip:"2 mots : « parce que » donne la cause. ≠ « par ce que » (3 mots)." },
  { id:"dehors", word:"dehors", game:"dehors", hint:"À l'extérieur", tip:"De-hors. H aspiré. Finit par S muet." },
  { id:"apres", word:"après", game:"après", hint:"Quand c'est fini", tip:"Accent grave sur È. S final muet. Pense à « l'après-midi »." },
  { id:"parfois", word:"parfois", game:"parfois", hint:"De temps en temps", tip:"Par + fois. S final muet." },
  { id:"hier", word:"hier", game:"hier", hint:"Le jour d'avant", tip:"4 lettres ! H muet. Pas de E à la fin !" },
  { id:"si", word:"si", game:"si", hint:"Mot de condition", tip:"2 lettres ! Condition : « Si tu viens... »" },
  { id:"deja", word:"déjà", game:"déjà", hint:"C'est fait !", tip:"Dé-jà : É aigu + À grave. Deux accents dans un petit mot !" },
  { id:"beaucoup", word:"beaucoup", game:"beaucoup", hint:"Énormément", tip:"BEAU + COUP ! P final muet. Jamais de S à la fin !" },
  { id:"geographie", word:"géographie", game:"géographie", hint:"Étude des pays", tip:"Géo (terre) + graphie (écrire). PH = [f]. Deux É aigus." },
  { id:"louest", word:"l'ouest", game:"ouest", hint:"Où le soleil se couche", prefix:"l'", tip:"Commence par OU. T final muet. « West » en anglais." },
  { id:"fascinant", word:"fascinant", game:"fascinant", hint:"Très très intéressant", tip:"SC fait [s] devant I. Féminin fascinante → -ANT au masculin." },
  { id:"musee", word:"musée", game:"musée", hint:"On y voit des œuvres", tip:"Des Muses (déesses). Mu-sé-e : É + e muet final." },
  { id:"surplomber", word:"surplomber", game:"surplomber", hint:"Dominer d'en haut", tip:"Sur + plomber. « Plomb » est dedans ! B muet mais gardé." },
  { id:"lumiere", word:"lumière", game:"lumière", hint:"Ce qui éclaire", tip:"Lu-miè-re. È grave devant consonne + e muet. Famille de « lumineux »." },
  { id:"plusieurs", word:"plusieurs", game:"plusieurs", hint:"Plus que un", tip:"Toujours pluriel, toujours un S ! Vient de « plus »." },
  { id:"voler", word:"voler", game:"voler", hint:"Comme un oiseau", tip:"2 sens : voler (ciel) ou voler (prendre). Famille de « vol, envol »." },
  { id:"ouvert", word:"ouvert", game:"ouvert", hint:"Pas fermé", tip:"Participe passé de « ouvrir ». Féminin ouverte → T s'entend !" },
  { id:"fermer", word:"fermer", game:"fermer", hint:"Contraire d'ouvrir", tip:"Du latin « firmare ». Famille : ferme, fermoir, fermeture." },
  { id:"escalier", word:"escalier", game:"escalier", hint:"On monte les marches", tip:"De « échelle » (scala en latin). -IER comme chevalier." },
  { id:"enfin", word:"enfin", game:"enfin", hint:"Pour finir", tip:"En + fin. EN = son [ɑ̃]." },
  { id:"soleil", word:"soleil", game:"soleil", hint:"L'étoile du jour", tip:"-EIL fait [ɛj]. Famille de « solaire ». Pas de E final !" },
  { id:"chauffer", word:"chauffer", game:"chauffer", hint:"Rendre chaud", tip:"Chaud → chauffer. Deux F ! Le D devient FF + ER." },
  { id:"sommeil", word:"sommeil", game:"sommeil", hint:"Quand on dort", prefix:"le ", tip:"Deux M ! -EIL comme soleil. Du latin « somnus »." },
  { id:"bourgeons", word:"bourgeons", game:"bourgeons", hint:"Poussent au printemps", prefix:"les ", tip:"GE = son [j]. ON = son nasal. Pluriel → S." },
  { id:"gazouiller", word:"gazouiller", game:"gazouiller", hint:"Chant des oiseaux", tip:"-ILLER = deux L ! Comme briller, habiller." },
  { id:"ecureuils", word:"écureuils", game:"écureuils", hint:"Queue touffue", prefix:"les ", tip:"-EUIL après C (pas -UEIL). Pluriel → S." },
  { id:"sautiller", word:"sautiller", game:"sautiller", hint:"Petits sauts", tip:"Sauter → sautiller. -ILLER = deux L. AU = son [o]." },
  { id:"maison", word:"maison", game:"maison", hint:"Là où on habite", tip:"AI = [ɛ]. ON = [ɔ̃]. Famille : maisonnette." },
];

// ─── CREATURES to unlock ───
const CREATURES = [
  { name: "Papillon Doré", emoji: "🦋", at: 1 },
  { name: "Renard des Bois", emoji: "🦊", at: 3 },
  { name: "Hibou Savant", emoji: "🦉", at: 5 },
  { name: "Cerf Majestueux", emoji: "🦌", at: 8 },
  { name: "Aigle Royal", emoji: "🦅", at: 11 },
  { name: "Loup de Lune", emoji: "🐺", at: 14 },
  { name: "Dauphin Étoilé", emoji: "🐬", at: 17 },
  { name: "Tortue Ancienne", emoji: "🐢", at: 20 },
  { name: "Dragon Gardien", emoji: "🐉", at: 25 },
  { name: "Phénix Légendaire", emoji: "🔥", at: 30 },
  { name: "Licorne Arc-en-ciel", emoji: "🦄", at: 35 },
  { name: "Lion Céleste", emoji: "🦁", at: 39 },
];

// ─── MAP WAYPOINTS (coordinates for viewBox 0 0 100 40) ───
const MAP_WAYPOINTS = [
  { x: 8, y: 35, type: 'start', zone: 'Campement', label: '🏕️' },
  { x: 12, y: 31, type: 'normal', zone: 'Forêt', label: '1' },
  { x: 16, y: 27, type: 'normal', zone: 'Forêt', label: '2' },
  { x: 20, y: 23, type: 'normal', zone: 'Forêt', label: '3' },
  { x: 24, y: 19, type: 'normal', zone: 'Forêt', label: '4' },
  { x: 28, y: 17, type: 'boss', zone: 'Forêt', label: '⚔️' },
  { x: 35, y: 14, type: 'normal', zone: 'Montagne', label: '6' },
  { x: 40, y: 11, type: 'normal', zone: 'Montagne', label: '7' },
  { x: 44, y: 9, type: 'normal', zone: 'Montagne', label: '8' },
  { x: 48, y: 7, type: 'normal', zone: 'Montagne', label: '9' },
  { x: 52, y: 6, type: 'boss', zone: 'Montagne', label: '⚔️' },
  { x: 58, y: 10, type: 'normal', zone: 'Rivière', label: '11' },
  { x: 62, y: 14, type: 'normal', zone: 'Rivière', label: '12' },
  { x: 66, y: 18, type: 'normal', zone: 'Rivière', label: '13' },
  { x: 70, y: 21, type: 'normal', zone: 'Rivière', label: '14' },
  { x: 74, y: 23, type: 'boss', zone: 'Rivière', label: '⚔️' },
  { x: 80, y: 21, type: 'normal', zone: 'Château', label: '16' },
  { x: 84, y: 18, type: 'normal', zone: 'Château', label: '17' },
  { x: 88, y: 15, type: 'normal', zone: 'Château', label: '18' },
  { x: 91, y: 13, type: 'normal', zone: 'Château', label: '19' },
  { x: 94, y: 10, type: 'treasure', zone: 'Château', label: '🏆' },
];

// ─── MILESTONES & ACHIEVEMENTS ───
const MILESTONES = {
  eclair: { name: '⚡ Éclair', desc: 'Réponse en moins de 5 secondes', bonus: 15, emoji: '⚡' },
  flash: { name: '💨 Flash', desc: 'Réponse en moins de 10 secondes', bonus: 10, emoji: '💨' },
  rapide: { name: '🏃 Rapide', desc: 'Réponse en moins de 15 secondes', bonus: 5, emoji: '🏃' },
  serie3: { name: '🔥 Série de feu', desc: '3 bonnes réponses d\'affilée', bonus: 20, emoji: '🔥🔥🔥' },
  serie5: { name: '🌟 Imparable', desc: '5 bonnes réponses d\'affilée', bonus: 50, emoji: '🌟' },
  serie10: { name: '👑 Légende', desc: '10 bonnes réponses d\'affilée', bonus: 100, emoji: '👑' },
  sansFaute: { name: '✨ Sans faute', desc: 'Zone complétée sans erreur', bonus: 30, emoji: '✨' },
  premierCoup: { name: '🎯 Premier coup', desc: 'Sans utiliser d\'indices', bonus: 25, emoji: '🎯' },
  econome: { name: '💰 Économe', desc: 'Finir sans acheter d\'indices', bonus: 40, emoji: '💰' },
  comeback: { name: '💪 Comeback', desc: 'Gagner avec 1 seule vie', bonus: 35, emoji: '💪' },
};

const EXTRA_LETTERS = "abcdefghijklmnopqrstuvwxyzéèêàâùûôî".split("");
const shuffle = (a) => { const b=[...a]; for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];} return b; };
const speakWord = (t) => { const u=new SpeechSynthesisUtterance(t); u.lang="fr-FR"; u.rate=0.75; speechSynthesis.cancel(); speechSynthesis.speak(u); };

// ─── STORAGE ───
const STORAGE_KEY = "leo-mots-aventure";
const loadData = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; } };
const saveData = (d) => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch {} };
const getWordStats = () => { const d = loadData(); return d.wordStats || {}; };
const saveWordStats = (ws) => { const d = loadData(); d.wordStats = ws; saveData(d); };
const getDisabled = () => { const d = loadData(); return new Set(d.disabled || []); };
const saveDisabled = (s) => { const d = loadData(); d.disabled = [...s]; saveData(d); };
const getUnlocked = () => { const d = loadData(); return new Set(d.unlocked || []); };
const saveUnlocked = (s) => { const d = loadData(); d.unlocked = [...s]; saveData(d); };
const getTotalWins = () => { const d = loadData(); return d.totalWins || 0; };
const saveTotalWins = (n) => { const d = loadData(); d.totalWins = n; saveData(d); };
const getAchievements = () => { const d = loadData(); return new Set(d.achievements || []); };
const saveAchievements = (s) => { const d = loadData(); d.achievements = [...s]; saveData(d); };

// ─── FIREWORKS ───
function Fireworks({ onDone }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = 400; canvas.height = 300;
    const particles = [];
    const colors = ["#fbbf24","#22c55e","#ec4899","#8b5cf6","#ef4444","#3b82f6","#f97316"];
    // Create bursts
    for (let b = 0; b < 3; b++) {
      const cx = 100 + Math.random() * 200, cy = 60 + Math.random() * 100;
      for (let i = 0; i < 30; i++) {
        const angle = (Math.PI * 2 * i) / 30 + Math.random() * 0.3;
        const speed = 2 + Math.random() * 4;
        particles.push({ x: cx, y: cy, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1, color: colors[Math.floor(Math.random() * colors.length)], size: 2 + Math.random() * 3, delay: b * 12 });
      }
    }
    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, 400, 300);
      let alive = false;
      for (const p of particles) {
        if (frame < p.delay) { alive = true; continue; }
        p.x += p.vx; p.y += p.vy; p.vy += 0.08; p.life -= 0.018; p.vx *= 0.98;
        if (p.life <= 0) continue;
        alive = true;
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      frame++;
      if (alive) requestAnimationFrame(animate);
      else onDone?.();
    };
    animate();
    // Play reward sound
    try {
      const ac = new (window.AudioContext || window.webkitAudioContext)();
      const playNote = (freq, start, dur) => {
        const o = ac.createOscillator(); const g = ac.createGain();
        o.type = "sine"; o.frequency.value = freq;
        g.gain.setValueAtTime(0.15, ac.currentTime + start);
        g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + start + dur);
        o.connect(g); g.connect(ac.destination);
        o.start(ac.currentTime + start); o.stop(ac.currentTime + start + dur);
      };
      playNote(523, 0, 0.15); playNote(659, 0.1, 0.15); playNote(784, 0.2, 0.15);
      playNote(1047, 0.3, 0.4);
    } catch {}
  }, [onDone]);
  return <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", pointerEvents: "none", zIndex: 50 }} />;
}

// ─── MAP FIREWORKS ───
function MapFireworks({ x, y, onDone }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const particles = [];
    const colors = ["#fbbf24","#22c55e","#ec4899","#8b5cf6","#ef4444","#3b82f6"];
    for (let i = 0; i < 25; i++) {
      const angle = (Math.PI * 2 * i) / 25 + Math.random() * 0.2;
      const speed = 1.5 + Math.random() * 2.5;
      particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1, color: colors[Math.floor(Math.random() * colors.length)], size: 2 + Math.random() * 2 });
    }
    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy; p.vy += 0.06; p.life -= 0.02; p.vx *= 0.98;
        if (p.life <= 0) continue;
        alive = true;
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      frame++;
      if (alive) requestAnimationFrame(animate);
      else setTimeout(() => onDone?.(), 100);
    };
    animate();
  }, [x, y, onDone]);
  return null;
}

// ─── MILESTONE POPUP ───
function MilestonePopup({ milestone, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    try {
      const ac = new (window.AudioContext || window.webkitAudioContext)();
      const playNote = (freq, start, dur) => {
        const o = ac.createOscillator(); const g = ac.createGain();
        o.type = "sine"; o.frequency.value = freq;
        g.gain.setValueAtTime(0.1, ac.currentTime + start);
        g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + start + dur);
        o.connect(g); g.connect(ac.destination);
        o.start(ac.currentTime + start); o.stop(ac.currentTime + start + dur);
      };
      playNote(659, 0, 0.1); playNote(784, 0.08, 0.1); playNote(988, 0.16, 0.2);
    } catch {}
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div style={{ position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)", zIndex: 200, animation: "slideUp 0.3s ease-out" }}>
      <div style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)", borderRadius: 16, padding: "20px 32px", textAlign: "center", border: "3px solid #fbbf24", boxShadow: "0 8px 30px rgba(245,158,11,0.5)" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: 8, animation: "tada 0.6s ease-out" }}>{milestone.emoji}</div>
        <h3 style={{ color: "#451a03", fontSize: "1.2rem", fontWeight: 700, fontFamily: "'Fredoka',sans-serif", marginBottom: 4 }}>{milestone.name}</h3>
        <p style={{ color: "#78350f", fontSize: "0.85rem", marginBottom: 8 }}>{milestone.desc}</p>
        <div style={{ color: "#451a03", fontSize: "1.4rem", fontWeight: 800, fontFamily: "'Fredoka',sans-serif" }}>+{milestone.bonus}⭐</div>
      </div>
    </div>
  );
}

// ─── MAP VIEW ───
function MapView({ currentWaypoint, completedWaypoints, onContinue, isPreBoss }) {
  const mapRef = useRef(null);
  const [showFireworks, setShowFireworks] = useState(false);
  const [fireworksPos, setFireworksPos] = useState({ x: 0, y: 0 });
  const [animatingTo, setAnimatingTo] = useState(null);

  useEffect(() => {
    if (currentWaypoint > 0 && currentWaypoint <= MAP_WAYPOINTS.length) {
      const wp = MAP_WAYPOINTS[currentWaypoint - 1];
      if (mapRef.current) {
        const rect = mapRef.current.getBoundingClientRect();
        const x = (wp.x / 100) * rect.width;
        const y = (wp.y / 100) * rect.height;
        setFireworksPos({ x, y });
        setShowFireworks(true);
        setAnimatingTo(currentWaypoint - 1);
      }
    }
  }, [currentWaypoint]);

  const handleFireworksDone = () => {
    setShowFireworks(false);
    setAnimatingTo(null);
  };

  return (
    <div style={{ background: "linear-gradient(135deg,rgba(120,53,15,0.4),rgba(30,20,10,0.6))", borderRadius: "clamp(12px, 3vw, 20px)", padding: "clamp(12px, 4vw, 20px)", border: "1px solid rgba(251,191,36,0.2)", animation: "slideUp 0.5s ease-out", maxWidth: "100%" }}>
      {isPreBoss && (
        <div style={{ textAlign: "center", marginBottom: 16, animation: "pulse 2s ease-in-out infinite" }}>
          <h3 style={{ color: "#ef4444", fontFamily: "'Fredoka',sans-serif", fontSize: "clamp(1rem, 4vw, 1.3rem)", marginBottom: 8 }}>⚔️ BOSS À VENIR ! ⚔️</h3>
          <p style={{ color: "#fbbf24", fontSize: "clamp(0.8rem, 3vw, 0.95rem)" }}>Prépare-toi pour le combat...</p>
        </div>
      )}
      
      <h3 style={{ color: "#fbbf24", fontFamily: "'Fredoka',sans-serif", fontSize: "clamp(1rem, 4vw, 1.2rem)", textAlign: "center", marginBottom: 12 }}>🗺️ Carte de l'Aventure</h3>
      
      <div style={{ position: "relative", width: "100%", maxWidth: "min(600px, 95vw)", margin: "0 auto", borderRadius: "clamp(8px, 2vw, 12px)", overflow: "hidden", border: "2px solid rgba(251,191,36,0.3)", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
        <img ref={mapRef} src="/adventure-map.png" alt="Carte d'aventure" style={{ width: "100%", height: "auto", display: "block" }} />
        
        <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 100 40" preserveAspectRatio="xMidYMid meet">
          {MAP_WAYPOINTS.map((wp, idx) => {
            const isCompleted = completedWaypoints.has(idx);
            const isCurrent = idx === currentWaypoint;
            const isAnimating = idx === animatingTo;
            const isBoss = wp.type === 'boss' || wp.type === 'treasure';
            
            return (
              <g key={idx}>
                <circle
                  cx={wp.x}
                  cy={wp.y}
                  r={isBoss ? 2.2 : 1.8}
                  fill={isCompleted ? "#22c55e" : isCurrent ? "#fbbf24" : "rgba(100,100,100,0.5)"}
                  stroke={isCurrent ? "#f59e0b" : isCompleted ? "#16a34a" : "#888"}
                  strokeWidth="0.3"
                  style={{ 
                    filter: isCurrent ? "drop-shadow(0 0 1px #fbbf24)" : isCompleted ? "drop-shadow(0 0 0.5px #22c55e)" : "none",
                    animation: isCurrent ? "pulse 1.5s ease-in-out infinite" : "none"
                  }}
                />
                {isCompleted && (
                  <text x={wp.x} y={wp.y + 0.5} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize="1.8" fontWeight="bold">✓</text>
                )}
                {isCurrent && (
                  <text x={wp.x} y={wp.y - 3.5} textAnchor="middle" fontSize="3.5" style={{ animation: isAnimating ? "float 1s ease-in-out" : "none" }}>🧑‍🌾</text>
                )}
              </g>
            );
          })}
        </svg>

        {showFireworks && mapRef.current && (
          <canvas 
            ref={canvas => {
              if (canvas && !canvas.dataset.initialized) {
                canvas.width = mapRef.current.offsetWidth;
                canvas.height = mapRef.current.offsetHeight;
                canvas.dataset.initialized = "true";
              }
            }}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
          />
        )}
        {showFireworks && <MapFireworks x={fireworksPos.x} y={fireworksPos.y} onDone={handleFireworksDone} />}
      </div>

      <div style={{ textAlign: "center", marginTop: "clamp(12px, 3vw, 16px)", color: "#d4a574", fontSize: "clamp(0.8rem, 3vw, 0.9rem)" }}>
        <p style={{ marginBottom: 8 }}>📍 {MAP_WAYPOINTS[Math.min(currentWaypoint, MAP_WAYPOINTS.length - 1)]?.zone}</p>
        <p style={{ color: "#a3836a", fontSize: "clamp(0.7rem, 2.5vw, 0.8rem)" }}>Étape {currentWaypoint + 1}/{MAP_WAYPOINTS.length}</p>
      </div>

      {onContinue && (
        <div style={{ textAlign: "center", marginTop: "clamp(12px, 3vw, 16px)" }}>
          <button onClick={onContinue} style={{ padding: "clamp(10px, 2.5vw, 12px) clamp(20px, 5vw, 28px)", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#f59e0b,#d97706)", color: "#451a03", fontWeight: 700, fontSize: "clamp(0.9rem, 3vw, 1rem)", fontFamily: "'Fredoka',sans-serif", cursor: "pointer", boxShadow: "0 3px 0 #92400e" }}>
            Continuer l'aventure →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── SOUND BUTTON ───
function SoundButton({ word, size = 40 }) {
  return (
    <button onClick={() => speakWord(word)} title="Écouter"
      style={{ width:size, height:size, borderRadius:"50%", border:"none", background:"linear-gradient(135deg,#8b5cf6,#7c3aed)", color:"#fff", fontSize:size*0.45, cursor:"pointer", boxShadow:"0 3px 0 #5b21b6", transition:"transform 0.15s", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}
      onMouseDown={e=>e.currentTarget.style.transform="scale(0.9)"} onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}
    >🔊</button>
  );
}

// ─── PAID HINT BUTTON ───
function PaidHintButton({ label, cost, score, onBuy, disabled }) {
  const canBuy = score >= cost && !disabled;
  return (
    <button onClick={canBuy ? onBuy : undefined}
      style={{
        padding:"4px 10px", borderRadius:8, border:"none",
        background: canBuy ? "linear-gradient(135deg,#f472b6,#ec4899)" : "rgba(100,100,100,0.4)",
        color: canBuy ? "#fff" : "#888", fontSize:"0.7rem", fontWeight:700,
        fontFamily:"'Fredoka',sans-serif", cursor: canBuy ? "pointer" : "not-allowed",
        boxShadow: canBuy ? "0 2px 0 #be185d" : "none", whiteSpace:"nowrap",
      }}
    >{label} {disabled ? "✓" : `-${cost}⭐`}</button>
  );
}

// ─── TIP BOX ───
function TipBox({ text }) {
  return (
    <div style={{ background:"linear-gradient(135deg,rgba(236,72,153,0.15),rgba(139,92,246,0.1))", border:"1px solid rgba(236,72,153,0.3)", borderRadius:10, padding:"8px 12px", marginTop:6, animation:"slideUp 0.3s ease-out" }}>
      <p style={{ color:"#f9a8d4", fontSize:"0.8rem", margin:0, lineHeight:1.4 }}>💡 <strong>Astuce :</strong> {text}</p>
    </div>
  );
}

// ─── GAME 1: Lettres mélangées ───
function ScrambleGame({ wordObj, onWin, onFail, score, onSpend }) {
  const clean = wordObj.game.replace(/\s/g,"");
  const prefix = wordObj.prefix||"";
  const [allLetters] = useState(() => {
    const real=clean.split(""); const fc=Math.min(4,Math.max(2,Math.floor(clean.length*0.4)));
    const fakes=[]; for(let i=0;i<fc;i++) fakes.push(EXTRA_LETTERS[Math.floor(Math.random()*EXTRA_LETTERS.length)]);
    return shuffle([...real,...fakes]).map((l,i)=>({letter:l,id:i}));
  });
  const [selected,setSelected]=useState([]);
  const [available,setAvailable]=useState(allLetters);
  const [errorSlots,setErrorSlots]=useState(new Set());
  const [success,setSuccess]=useState(false);
  const [boughtHint,setBoughtHint]=useState(false);
  const [boughtSound,setBoughtSound]=useState(false);
  const [boughtTip,setBoughtTip]=useState(false);
  const [showTip,setShowTip]=useState(false);

  const pick = (item) => {
    if(success) return;
    const idx = selected.indexOf(null);
    let newSel;
    if(idx>=0) { newSel=[...selected]; newSel[idx]=item; }
    else { newSel=[...selected,item]; }
    setSelected(newSel);
    setAvailable(available.filter(a=>a.id!==item.id));
    setErrorSlots(new Set());
    const filled = newSel.filter(s=>s!==null).length;
    if(filled===clean.length) {
      const attempt=newSel.map(s=>s?.letter||"").join("");
      if(attempt===clean) { setSuccess(true); setTimeout(()=>onWin(),300); }
      else {
        const errs=new Set();
        for(let i=0;i<clean.length;i++) if(newSel[i]?.letter!==clean[i]) errs.add(i);
        setErrorSlots(errs);
        setShowTip(true); setBoughtTip(true);
        onFail();
        setTimeout(()=>{
          const kept=[...newSel]; const ret=[];
          for(const i of errs){ret.push(kept[i]);kept[i]=null;}
          setSelected(kept);
          setAvailable(prev=>[...prev,...ret]);
          setErrorSlots(new Set());
        },1200);
      }
    }
  };
  const remove = (item,idx) => { if(success||!item) return; const ns=[...selected]; ns[idx]=null; setSelected(ns); setAvailable([...available,item]); };

  return (
    <div style={{textAlign:"center"}}>
      <h3 style={{color:"#fbbf24",fontFamily:"'Fredoka',sans-serif",fontSize:"1.1rem",marginBottom:6}}>🗺️ Remets les lettres dans l'ordre !</h3>
      <p style={{color:"#ef4444",fontSize:"0.7rem",marginBottom:4}}>⚠️ Lettres pièges !</p>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginBottom:6,flexWrap:"wrap"}}>
        <p style={{color:"#d4a574",fontSize:"0.85rem",fontStyle:"italic",margin:0}}>Indice : {wordObj.hint}</p>
        <SoundButton word={wordObj.word} size={32}/>
        {!boughtTip && <PaidHintButton label="💡" cost={10} score={score} disabled={boughtTip} onBuy={()=>{onSpend(10);setBoughtTip(true);setShowTip(true);}}/>}
      </div>
      {showTip && <TipBox text={wordObj.tip}/>}
      <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:4,minHeight:48,marginBottom:16,flexWrap:"wrap",marginTop:10}}>
        {prefix && <span style={{color:"#fbbf24",fontSize:"1.2rem",fontWeight:700,fontFamily:"'Fredoka',sans-serif",marginRight:4}}>{prefix}</span>}
        {clean.split("").map((_,i)=>{
          const item=selected[i]; const isErr=errorSlots.has(i);
          return <div key={i} onClick={()=>item&&remove(item,i)} style={{
            width:36,height:42,borderRadius:8,
            border:success?"2px solid #22c55e":isErr?"2px solid #ef4444":"2px dashed rgba(251,191,36,0.4)",
            background:item?(success?"linear-gradient(135deg,#22c55e,#16a34a)":isErr?"linear-gradient(135deg,#dc2626,#b91c1c)":"linear-gradient(135deg,#92400e,#78350f)"):"rgba(0,0,0,0.2)",
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem",fontWeight:700,color:"#fff",fontFamily:"'Fredoka',sans-serif",cursor:item?"pointer":"default",transition:"all 0.2s",animation:isErr?"headShake 0.5s":"none",
          }}>{item?.letter||""}</div>;
        })}
      </div>
      <div style={{display:"flex",justifyContent:"center",gap:6,flexWrap:"wrap"}}>
        {available.map(item=>(
          <button key={item.id} onClick={()=>pick(item)} style={{
            width:40,height:44,borderRadius:10,border:"none",background:"linear-gradient(135deg,#f59e0b,#d97706)",color:"#451a03",fontSize:"1.2rem",fontWeight:800,fontFamily:"'Fredoka',sans-serif",cursor:"pointer",boxShadow:"0 3px 0 #92400e",
          }} onMouseDown={e=>e.currentTarget.style.transform="translateY(2px)"} onMouseUp={e=>e.currentTarget.style.transform="translateY(0)"}>{item.letter}</button>
        ))}
      </div>
    </div>
  );
}

// ─── GAME 2: Écris le mot complet ───
function WriteGame({ wordObj, onWin, onFail, score, onSpend }) {
  const target = wordObj.game.toLowerCase();
  const prefix = wordObj.prefix||"";
  const [input,setInput]=useState("");
  const [status,setStatus]=useState(null);
  const [boughtTip,setBoughtTip]=useState(false);
  const [showTip,setShowTip]=useState(false);
  const [showAnswer,setShowAnswer]=useState(false);

  const submit = () => {
    if(!input.trim()) return;
    const norm=s=>s.toLowerCase().trim().replace(/\s+/g," ");
    if(norm(input)===norm(target)||norm(input)===norm(wordObj.word)) { setStatus("win"); setTimeout(()=>onWin(),300); }
    else { setStatus("fail"); setShowTip(true); setBoughtTip(true); setShowAnswer(true); onFail(); setTimeout(()=>{setStatus(null);setInput("");setShowAnswer(false);},2500); }
  };

  return (
    <div style={{textAlign:"center"}}>
      <h3 style={{color:"#fbbf24",fontFamily:"'Fredoka',sans-serif",fontSize:"1.1rem",marginBottom:6}}>✏️ Écris le mot en entier !</h3>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginBottom:6,flexWrap:"wrap"}}>
        <p style={{color:"#d4a574",fontSize:"0.85rem",fontStyle:"italic",margin:0}}>Indice : {wordObj.hint}</p>
        <SoundButton word={wordObj.word} size={32}/>
        {!boughtTip && <PaidHintButton label="💡" cost={10} score={score} disabled={boughtTip} onBuy={()=>{onSpend(10);setBoughtTip(true);setShowTip(true);}}/>}
      </div>
      {showTip && <TipBox text={wordObj.tip}/>}
      {prefix && <p style={{color:"#fbbf24",fontSize:"0.9rem",marginTop:8,marginBottom:2}}>Le mot commence par : <strong>{prefix}</strong>___</p>}
      <div style={{display:"flex",justifyContent:"center",gap:8,marginTop:12,animation:status==="fail"?"headShake 0.5s":status==="win"?"tada 0.8s":"none"}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="Écris le mot..."
          style={{padding:"10px 14px",borderRadius:10,border:status==="win"?"2px solid #22c55e":status==="fail"?"2px solid #ef4444":"2px solid rgba(251,191,36,0.4)",background:"rgba(0,0,0,0.3)",color:"#fff",fontSize:"1.1rem",fontFamily:"'Fredoka',sans-serif",outline:"none",width:200}}/>
        <button onClick={submit} style={{padding:"10px 18px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#22c55e,#16a34a)",color:"#fff",fontWeight:700,fontFamily:"'Fredoka',sans-serif",cursor:"pointer",boxShadow:"0 3px 0 #15803d"}}>OK</button>
      </div>
      {showAnswer && <p style={{color:"#ef4444",fontFamily:"'Fredoka',sans-serif",marginTop:12,fontSize:"1rem"}}>C'était : <strong style={{color:"#fbbf24"}}>{wordObj.prefix||""}{wordObj.game}</strong></p>}
    </div>
  );
}

// ─── GAME 3: Dictée (écouter) ───
function ListenGame({ wordObj, onWin, onFail, score, onSpend }) {
  const [input,setInput]=useState(""); const [status,setStatus]=useState(null);
  const [revealed,setRevealed]=useState(false);
  const [boughtTip,setBoughtTip]=useState(false); const [showTip,setShowTip]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>speakWord(wordObj.word),400);return()=>clearTimeout(t);},[wordObj.word]);
  const submit=()=>{
    if(!input.trim())return;const norm=s=>s.toLowerCase().trim().replace(/\s+/g," ");
    if(norm(input)===norm(wordObj.word)||norm(input)===norm(wordObj.game)){setStatus("win");setTimeout(()=>onWin(),300);}
    else{setStatus("fail");setRevealed(true);setShowTip(true);setBoughtTip(true);onFail();setTimeout(()=>{setStatus(null);setInput("");setRevealed(false);},2500);}
  };
  return (
    <div style={{textAlign:"center"}}>
      <h3 style={{color:"#fbbf24",fontFamily:"'Fredoka',sans-serif",fontSize:"1.1rem",marginBottom:6}}>👂 Écoute et écris !</h3>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginBottom:10,flexWrap:"wrap"}}>
        {!boughtTip && <PaidHintButton label="💡 Astuce" cost={10} score={score} disabled={boughtTip} onBuy={()=>{onSpend(10);setBoughtTip(true);setShowTip(true);}}/>}
      </div>
      {showTip && <TipBox text={wordObj.tip}/>}
      <button onClick={()=>speakWord(wordObj.word)} style={{width:64,height:64,borderRadius:"50%",border:"none",background:"linear-gradient(135deg,#8b5cf6,#7c3aed)",color:"#fff",fontSize:"1.8rem",cursor:"pointer",boxShadow:"0 4px 0 #5b21b6",marginBottom:16,marginTop:6}} onMouseDown={e=>e.currentTarget.style.transform="scale(0.93)"} onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}>🔊</button>
      <div style={{display:"flex",justifyContent:"center",gap:8,animation:status==="fail"?"headShake 0.5s":status==="win"?"tada 0.8s":"none"}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="Écris ici..." style={{padding:"10px 14px",borderRadius:10,border:status==="win"?"2px solid #22c55e":status==="fail"?"2px solid #ef4444":"2px solid rgba(251,191,36,0.4)",background:"rgba(0,0,0,0.3)",color:"#fff",fontSize:"1.1rem",fontFamily:"'Fredoka',sans-serif",outline:"none",width:180}}/>
        <button onClick={submit} style={{padding:"10px 18px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#22c55e,#16a34a)",color:"#fff",fontWeight:700,fontFamily:"'Fredoka',sans-serif",cursor:"pointer",boxShadow:"0 3px 0 #15803d"}}>OK</button>
      </div>
      {revealed && <p style={{color:"#ef4444",fontFamily:"'Fredoka',sans-serif",marginTop:12}}>C'était : <strong style={{color:"#fbbf24"}}>{wordObj.word}</strong></p>}
    </div>
  );
}

// ─── GAME 4: Pendu (BOSS — no hints unless paid) ───
const HP=[(c)=>{c.beginPath();c.arc(150,55,16,0,Math.PI*2);c.stroke();},(c)=>{c.beginPath();c.moveTo(150,71);c.lineTo(150,120);c.stroke();},(c)=>{c.beginPath();c.moveTo(150,85);c.lineTo(125,105);c.stroke();},(c)=>{c.beginPath();c.moveTo(150,85);c.lineTo(175,105);c.stroke();},(c)=>{c.beginPath();c.moveTo(150,120);c.lineTo(130,150);c.stroke();},(c)=>{c.beginPath();c.moveTo(150,120);c.lineTo(170,150);c.stroke();},(c)=>{c.beginPath();c.moveTo(143,50);c.lineTo(147,54);c.stroke();c.beginPath();c.moveTo(147,50);c.lineTo(143,54);c.stroke();},(c)=>{c.beginPath();c.moveTo(153,50);c.lineTo(157,54);c.stroke();c.beginPath();c.moveTo(157,50);c.lineTo(153,54);c.stroke();c.beginPath();c.arc(150,65,5,0,Math.PI,true);c.stroke();}];

function HangmanGame({ wordObj, onWin, onFail, score, onSpend, isBoss }) {
  const gw=wordObj.game.toLowerCase(); const prefix=wordObj.prefix||"";
  const unique=useMemo(()=>new Set(gw.replace(/\s/g,"").split("")),[gw]);
  const [guessed,setGuessed]=useState(new Set()); const [errors,setErrors]=useState(0); const [status,setStatus]=useState(null);
  const [boughtHint,setBoughtHint]=useState(false); const [boughtSound,setBoughtSound]=useState(false); const [boughtTip,setBoughtTip]=useState(false); const [showTip,setShowTip]=useState(false);
  const canvasRef=useRef(null); const maxE=HP.length;
  const alpha="abcdefghijklmnopqrstuvwxyz".split(""); const acc="éèêëàâùûôîïç".split("");

  useEffect(()=>{const cv=canvasRef.current;if(!cv)return;const c=cv.getContext("2d");c.clearRect(0,0,300,170);c.strokeStyle="#fbbf24";c.lineWidth=3;c.lineCap="round";c.beginPath();c.moveTo(40,160);c.lineTo(200,160);c.stroke();c.beginPath();c.moveTo(80,160);c.lineTo(80,20);c.stroke();c.beginPath();c.moveTo(80,20);c.lineTo(150,20);c.stroke();c.beginPath();c.moveTo(150,20);c.lineTo(150,39);c.stroke();c.strokeStyle=errors>=maxE-1?"#ef4444":"#f59e0b";for(let i=0;i<errors;i++)HP[i]?.(c);},[errors,maxE]);

  const guess=(l)=>{if(status||guessed.has(l))return;const ng=new Set([...guessed,l]);setGuessed(ng);if(!gw.includes(l)){const ne=errors+1;setErrors(ne);if(ne>=maxE){setStatus("lost");setTimeout(()=>onFail(),1800);}}else{if([...unique].every(x=>ng.has(x))){setStatus("won");setTimeout(()=>onWin(),300);}}};

  const kb=(ltrs)=><div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:4}}>{ltrs.map(l=>{const ig=guessed.has(l);const ic=ig&&gw.includes(l);const iw=ig&&!gw.includes(l);return<button key={l} onClick={()=>guess(l)} disabled={ig||!!status} style={{width:32,height:36,borderRadius:6,border:"none",background:ic?"linear-gradient(135deg,#22c55e,#16a34a)":iw?"rgba(239,68,68,0.3)":ig?"rgba(0,0,0,0.2)":"linear-gradient(135deg,#f59e0b,#d97706)",color:ic?"#fff":iw?"#ef4444":ig?"#666":"#451a03",fontSize:"0.9rem",fontWeight:700,fontFamily:"'Fredoka',sans-serif",cursor:ig||status?"default":"pointer",opacity:iw?0.5:1}}>{l}</button>})}</div>;

  return (
    <div style={{textAlign:"center"}}>
      {isBoss && <div style={{background:"linear-gradient(135deg,rgba(239,68,68,0.2),rgba(245,158,11,0.1))",border:"1px solid rgba(239,68,68,0.4)",borderRadius:10,padding:"6px 14px",marginBottom:10,display:"inline-block"}}><span style={{color:"#fbbf24",fontSize:"0.85rem",fontWeight:700}}>⚔️ BOSS DE ZONE ⚔️</span></div>}
      <h3 style={{color:"#fbbf24",fontFamily:"'Fredoka',sans-serif",fontSize:"1.1rem",marginBottom:8}}>☠️ Le Pendu !</h3>
      {/* Paid hints row */}
      <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:10,flexWrap:"wrap"}}>
        <PaidHintButton label="📝 Indice" cost={10} score={score} disabled={boughtHint} onBuy={()=>{onSpend(10);setBoughtHint(true);}}/>
        <PaidHintButton label="🔊 Son" cost={10} score={score} disabled={boughtSound} onBuy={()=>{onSpend(10);setBoughtSound(true);speakWord(wordObj.word);}}/>
        <PaidHintButton label="💡 Astuce" cost={10} score={score} disabled={boughtTip} onBuy={()=>{onSpend(10);setBoughtTip(true);setShowTip(true);}}/>
      </div>
      {boughtHint && <p style={{color:"#d4a574",fontSize:"0.85rem",fontStyle:"italic",marginBottom:4}}>Indice : {wordObj.hint}</p>}
      {boughtSound && <div style={{marginBottom:8}}><SoundButton word={wordObj.word} size={34}/></div>}
      {showTip && <TipBox text={wordObj.tip}/>}
      <canvas ref={canvasRef} width={300} height={170} style={{display:"block",margin:"4px auto 12px",maxWidth:"100%"}}/>
      <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:4,marginBottom:16,flexWrap:"wrap",animation:status==="won"?"tada 0.8s":status==="lost"?"headShake 0.5s":"none"}}>
        {prefix && <span style={{color:"#fbbf24",fontSize:"1.3rem",fontWeight:700,fontFamily:"'Fredoka',sans-serif",marginRight:4}}>{prefix}</span>}
        {gw.split("").map((l,i)=>l===" "?<div key={i} style={{width:12}}/>:<div key={i} style={{width:30,height:38,borderBottom:guessed.has(l)?"none":"3px solid #f59e0b",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.3rem",fontWeight:700,fontFamily:"'Fredoka',sans-serif",color:status==="lost"&&!guessed.has(l)?"#ef4444":"#fff"}}>{guessed.has(l)||status==="lost"?l:""}</div>)}
      </div>
      {kb(alpha)}<div style={{marginTop:4}}>{kb(acc)}</div>
      {status==="won"&&<p style={{color:"#22c55e",fontFamily:"'Fredoka',sans-serif",marginTop:12,fontSize:"1.1rem"}}>✨ Sauvé ! ✨</p>}
      {status==="lost"&&<p style={{color:"#ef4444",fontFamily:"'Fredoka',sans-serif",marginTop:12}}>C'était : <strong style={{color:"#fbbf24"}}>{prefix}{wordObj.game}</strong></p>}
    </div>
  );
}

// ─── SETTINGS SCREEN ───
function Settings({ onBack }) {
  const [disabled, setDisabled] = useState(getDisabled());
  const stats = getWordStats();
  const toggle = (id) => {
    const next = new Set(disabled);
    if (next.has(id)) next.delete(id); else next.add(id);
    setDisabled(next); saveDisabled(next);
  };
  const unlocked = getUnlocked();
  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "0 auto" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "#fbbf24", fontSize: "1rem", cursor: "pointer", fontFamily: "'Fredoka',sans-serif", marginBottom: 16 }}>← Retour</button>
      <h2 style={{ color: "#fbbf24", fontFamily: "'Fredoka',sans-serif", fontSize: "1.3rem", marginBottom: 6 }}>🎒 Mes Mots</h2>
      <p style={{ color: "#a3836a", fontSize: "0.8rem", marginBottom: 16 }}>Désactive les mots maîtrisés. Ils ne reviendront plus dans les parties.</p>
      <div style={{ maxHeight: "45vh", overflowY: "auto", marginBottom: 24 }}>
        {ALL_WORDS.map(w => {
          const s = stats[w.id] || { wins: 0, fails: 0 };
          const off = disabled.has(w.id);
          return (
            <div key={w.id} onClick={() => toggle(w.id)}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 10, marginBottom: 4, cursor: "pointer", background: off ? "rgba(239,68,68,0.1)" : "rgba(251,191,36,0.08)", border: off ? "1px solid rgba(239,68,68,0.3)" : "1px solid rgba(251,191,36,0.15)", transition: "all 0.2s" }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: off ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", flexShrink: 0 }}>
                {off ? "✗" : "✓"}
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ color: off ? "#888" : "#fbbf24", fontWeight: 600, fontFamily: "'Fredoka',sans-serif", fontSize: "0.95rem", textDecoration: off ? "line-through" : "none" }}>{w.prefix || ""}{w.game}</span>
              </div>
              <div style={{ color: "#22c55e", fontSize: "0.7rem" }}>✓{s.wins}</div>
              <div style={{ color: "#ef4444", fontSize: "0.7rem" }}>✗{s.fails}</div>
            </div>
          );
        })}
      </div>
      <h2 style={{ color: "#fbbf24", fontFamily: "'Fredoka',sans-serif", fontSize: "1.3rem", marginBottom: 6 }}>🏆 Mes Créatures ({unlocked.size}/{CREATURES.length})</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
        {CREATURES.map(c => {
          const has = unlocked.has(c.name);
          return (
            <div key={c.name} style={{ width: 70, textAlign: "center", padding: "8px 4px", borderRadius: 10, background: has ? "rgba(251,191,36,0.1)" : "rgba(0,0,0,0.2)", border: has ? "1px solid rgba(251,191,36,0.3)" : "1px solid rgba(100,100,100,0.2)" }}>
              <div style={{ fontSize: "1.8rem", filter: has ? "none" : "grayscale(1) brightness(0.3)" }}>{c.emoji}</div>
              <p style={{ color: has ? "#fbbf24" : "#555", fontSize: "0.65rem", margin: "4px 0 0", fontFamily: "'Fredoka',sans-serif" }}>{has ? c.name : `${c.at} mots`}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── MAIN ───
const NORMAL_GAMES = ["scramble", "write", "listen"];

export default function App() {
  const [screen, setScreen] = useState("title");
  const [wordQueue, setWordQueue] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [gameType, setGameType] = useState("");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [wordsLearned, setWordsLearned] = useState(new Set());
  const [showMap, setShowMap] = useState(false);
  const [mapProgress, setMapProgress] = useState(0);
  const [isBoss, setIsBoss] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [newCreature, setNewCreature] = useState(null);
  const [totalWins, setTotalWins] = useState(getTotalWins());
  
  // New: Milestones & Map
  const [startTime, setStartTime] = useState(null);
  const [usedHints, setUsedHints] = useState(false);
  const [milestonePopup, setMilestonePopup] = useState(null);
  const [achievements, setAchievements] = useState(getAchievements());
  const [completedWaypoints, setCompletedWaypoints] = useState(new Set());
  const [showFullMap, setShowFullMap] = useState(false);
  const [zoneStartLives, setZoneStartLives] = useState(5);

  // Cheat: + adds life
  useEffect(() => {
    const h = (e) => { if (e.key === "+" || (e.key === "=" && !e.shiftKey)) setLives(p => p + 1); };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, []);

  const pickGame = () => NORMAL_GAMES[Math.floor(Math.random() * NORMAL_GAMES.length)];

  const buildQueue = () => {
    const disabled = getDisabled();
    const stats = getWordStats();
    let pool = ALL_WORDS.filter(w => !disabled.has(w.id));
    if (pool.length === 0) pool = [...ALL_WORDS];
    // Prioritize least-mastered words
    pool.sort((a, b) => {
      const sa = stats[a.id]?.wins || 0, sb = stats[b.id]?.wins || 0;
      if (sa !== sb) return sa - sb;
      return Math.random() - 0.5;
    });
    // Take first 20 or all, then shuffle
    return shuffle(pool.slice(0, Math.min(20, pool.length)));
  };

  const startGame = () => {
    setWordQueue(buildQueue());
    setCurrentIdx(0); setGameType(pickGame()); setScore(0); setLives(5);
    setStreak(0); setMaxStreak(0); setWordsLearned(new Set());
    setShowMap(false); setMapProgress(0); setIsBoss(false);
    setShowFireworks(false); setNewCreature(null);
    setStartTime(Date.now()); setUsedHints(false);
    setMilestonePopup(null); setCompletedWaypoints(new Set());
    setShowFullMap(false); setZoneStartLives(5);
    setScreen("play");
  };

  const handleWin = () => {
    setShowFireworks(true);
    const w = wordQueue[currentIdx];
    
    // Calculate response time
    const responseTime = startTime ? Date.now() - startTime : 0;
    
    // Update stats
    const ws = getWordStats(); if (!ws[w.id]) ws[w.id] = { wins: 0, fails: 0 }; ws[w.id].wins++; saveWordStats(ws);
    const newTotal = totalWins + 1; setTotalWins(newTotal); saveTotalWins(newTotal);
    
    // Check creature unlock
    const unlocked = getUnlocked();
    const justUnlocked = CREATURES.find(c => c.at === newTotal && !unlocked.has(c.name));
    if (justUnlocked) { unlocked.add(justUnlocked.name); saveUnlocked(unlocked); setNewCreature(justUnlocked); }

    // Base bonus
    let bonus = isBoss ? 25 : 10;
    
    // Check milestones
    const newStreak = streak + 1;
    const milestones = [];
    
    // Speed milestones
    if (responseTime < 5000 && responseTime > 0) milestones.push('eclair');
    else if (responseTime < 10000 && responseTime > 0) milestones.push('flash');
    else if (responseTime < 15000 && responseTime > 0) milestones.push('rapide');
    
    // Streak milestones
    if (newStreak === 3) milestones.push('serie3');
    else if (newStreak === 5) milestones.push('serie5');
    else if (newStreak === 10) milestones.push('serie10');
    
    // No hints milestone
    if (!usedHints) milestones.push('premierCoup');
    
    // Comeback milestone (1 life left)
    if (lives === 1) milestones.push('comeback');
    
    // Add milestone bonuses and show popup
    if (milestones.length > 0) {
      const firstMilestone = milestones[0];
      const ms = MILESTONES[firstMilestone];
      if (ms) {
        bonus += ms.bonus;
        setMilestonePopup(ms);
        // Save achievement
        const achs = getAchievements();
        if (!achs.has(firstMilestone)) {
          achs.add(firstMilestone);
          saveAchievements(achs);
          setAchievements(achs);
        }
      }
    }
    
    setScore(prev => prev + bonus + streak * 5);
    setStreak(prev => { const n = prev + 1; if (n > maxStreak) setMaxStreak(n); return n; });
    setWordsLearned(prev => new Set([...prev, w.word]));
    setMapProgress(prev => prev + 1);
    setCompletedWaypoints(prev => new Set([...prev, currentIdx]));
    
    // Reset for next word
    setStartTime(null);
    setUsedHints(false);
  };

  // Called after fireworks finish
  const afterFireworks = () => {
    setShowFireworks(false);
    if (newCreature) return; // Wait for creature modal dismiss
    proceedAfterWin();
  };

  const proceedAfterWin = () => {
    setNewCreature(null);
    if (isBoss) { setIsBoss(false); setShowMap(true); return; }
    // Show map before each boss (at positions 4, 9, 14, 19)
    const nextIdx = currentIdx + 1;
    if ([4, 9, 14, 19].includes(nextIdx) && nextIdx < wordQueue.length) {
      setShowFullMap(true);
      setTimeout(() => {
        setShowFullMap(false);
        nextWord("hangman", true);
      }, 4000); // Show map for 4 seconds before boss
      return;
    }
    nextWord();
  };

  const nextWord = (forceType, forceBoss) => {
    if (currentIdx >= wordQueue.length - 1) { setScreen("victory"); return; }
    setCurrentIdx(p => p + 1); setGameType(forceType || pickGame()); setIsBoss(!!forceBoss);
    setShowMap(false); setShowFullMap(false);
    setStartTime(Date.now()); setUsedHints(false);
    
    // Track zone start for "sans faute" milestone
    if ((currentIdx + 1) % 5 === 1) setZoneStartLives(lives);
  };

  const handleFail = () => {
    const w = wordQueue[currentIdx];
    const ws = getWordStats(); if (!ws[w.id]) ws[w.id] = { wins: 0, fails: 0 }; ws[w.id].fails++; saveWordStats(ws);
    setStreak(0); setLives(p => { const n = p - 1; if (n <= 0) setTimeout(() => setScreen("gameover"), 500); return n; });
  };

  const handleSpend = (n) => { setScore(p => Math.max(0, p - n)); setUsedHints(true); };
  const currentWord = wordQueue[currentIdx];
  const progress = wordQueue.length > 0 ? (currentIdx / wordQueue.length) * 100 : 0;
  const zones = ["Forêt Enchantée", "Rivière Mystique", "Montagne Sacrée", "Temple Ancien", "Grotte Secrète", "Village Oublié", "Pont des Étoiles", "Clairière Dorée"];
  const zoneIdx = Math.floor(mapProgress / 5) % zones.length;
  const nextCreature = CREATURES.find(c => c.at > totalWins);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#1a0a2e 0%,#16213e 30%,#0f3460 60%,#1a3c34 100%)", fontFamily: "'Fredoka',sans-serif", overflow: "hidden", position: "relative" }}>
      <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes twinkle{0%,100%{opacity:.3}50%{opacity:1}}
        @keyframes headShake{0%{transform:translateX(0)}15%{transform:translateX(-8px)}30%{transform:translateX(8px)}45%{transform:translateX(-5px)}60%{transform:translateX(5px)}75%{transform:translateX(-2px)}100%{transform:translateX(0)}}
        @keyframes tada{0%{transform:scale(1)}10%{transform:scale(.95) rotate(-2deg)}30%{transform:scale(1.08) rotate(2deg)}50%{transform:scale(1.08) rotate(-2deg)}70%{transform:scale(1.05) rotate(1deg)}100%{transform:scale(1) rotate(0)}}
        @keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{box-shadow:0 0 10px rgba(251,191,36,.3)}50%{box-shadow:0 0 25px rgba(251,191,36,.6)}}
        @keyframes bossGlow{0%,100%{box-shadow:0 0 15px rgba(239,68,68,.3)}50%{box-shadow:0 0 35px rgba(239,68,68,.6)}}
        @keyframes creaturePop{0%{transform:scale(0) rotate(-20deg)}50%{transform:scale(1.3) rotate(5deg)}100%{transform:scale(1) rotate(0)}}
      `}</style>

      {[...Array(25)].map((_,i)=><div key={i} style={{position:"fixed",width:i%3===0?3:2,height:i%3===0?3:2,borderRadius:"50%",background:"#fff",top:`${Math.random()*50}%`,left:`${Math.random()*100}%`,animation:`twinkle ${2+Math.random()*3}s ease-in-out infinite`,animationDelay:`${Math.random()*3}s`,pointerEvents:"none"}}/>)}

      {/* CREATURE UNLOCK MODAL */}
      {newCreature && (
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.7)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={proceedAfterWin}>
          <div style={{background:"linear-gradient(135deg,#1a0a2e,#16213e)",borderRadius:24,padding:"32px 40px",textAlign:"center",border:"2px solid #fbbf24",animation:"slideUp 0.5s ease-out",maxWidth:300}}>
            <div style={{fontSize:"4rem",animation:"creaturePop 0.6s ease-out",marginBottom:8}}>{newCreature.emoji}</div>
            <h3 style={{color:"#fbbf24",fontSize:"1.3rem",marginBottom:4}}>Nouvelle créature !</h3>
            <p style={{color:"#d4a574",fontSize:"1.1rem",marginBottom:4,fontWeight:600}}>{newCreature.name}</p>
            <p style={{color:"#a3836a",fontSize:"0.8rem",marginBottom:16}}>rejoint ton équipe d'aventure !</p>
            <p style={{color:"#666",fontSize:"0.7rem"}}>Touche pour continuer</p>
          </div>
        </div>
      )}

      {/* TITLE */}
      {screen === "title" && (
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:20,animation:"slideUp 0.8s ease-out"}}>
          <div style={{fontSize:"4rem",marginBottom:8,animation:"float 3s ease-in-out infinite"}}>🏔️</div>
          <h1 style={{color:"#fbbf24",fontSize:"clamp(1.6rem,6vw,2.4rem)",textAlign:"center",textShadow:"0 2px 20px rgba(251,191,36,0.4)",marginBottom:4,lineHeight:1.2}}>L'Aventure des Mots</h1>
          <p style={{color:"#d4a574",marginBottom:4,fontSize:"1rem"}}>de Léo l'Explorateur</p>
          {nextCreature && <p style={{color:"#a3836a",fontSize:"0.8rem",marginBottom:4}}>Prochaine créature : {nextCreature.emoji} dans {nextCreature.at - totalWins} mot{nextCreature.at-totalWins>1?"s":""}</p>}
          <p style={{color:"#6b5c4d",fontSize:"0.75rem",marginBottom:24}}>{totalWins} mots maîtrisés au total • {getUnlocked().size}/{CREATURES.length} créatures</p>
          <button onClick={startGame} style={{padding:"16px 32px",borderRadius:16,border:"none",background:"linear-gradient(135deg,#f59e0b,#d97706)",color:"#451a03",fontSize:"1.3rem",fontWeight:700,fontFamily:"'Fredoka',sans-serif",cursor:"pointer",boxShadow:"0 5px 0 #92400e,0 8px 30px rgba(245,158,11,0.3)",animation:"pulse 2s ease-in-out infinite"}}
            onMouseDown={e=>e.currentTarget.style.transform="translateY(3px)"} onMouseUp={e=>e.currentTarget.style.transform="translateY(0)"}
          >🗺️ Partir à l'aventure !</button>
          <button onClick={()=>setScreen("settings")} style={{marginTop:14,padding:"10px 24px",borderRadius:12,border:"1px solid rgba(251,191,36,0.3)",background:"transparent",color:"#fbbf24",fontSize:"0.9rem",fontWeight:600,fontFamily:"'Fredoka',sans-serif",cursor:"pointer"}}>⚙️ Mes mots & créatures</button>
          <div style={{marginTop:20,display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center",color:"#a3836a",fontSize:"0.75rem"}}>
            <div>🔤 Mélangées</div><div>✏️ Écriture</div><div>👂 Dictée</div><div>⚔️ Boss Pendu</div>
          </div>
        </div>
      )}

      {/* SETTINGS */}
      {screen === "settings" && <Settings onBack={() => setScreen("title")} />}

      {/* MILESTONE POPUP */}
      {milestonePopup && <MilestonePopup milestone={milestonePopup} onClose={() => setMilestonePopup(null)} />}

      {/* PLAY */}
      {screen === "play" && currentWord && (
        <div style={{padding:"16px 16px 24px",maxWidth:500,margin:"0 auto",position:"relative"}}>
          {showFireworks && <Fireworks onDone={afterFireworks}/>}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,fontSize:"0.85rem"}}>
            <div style={{color:"#fbbf24",fontWeight:600}}>⭐ {score}</div>
            <div style={{color:"#f87171"}}>{"❤️".repeat(Math.max(0,lives))}{"🖤".repeat(Math.max(0,5-lives))}</div>
            <div style={{color:"#22c55e",fontWeight:600}}>🔥 {streak}</div>
          </div>
          <div style={{height:8,background:"rgba(0,0,0,0.3)",borderRadius:4,marginBottom:8,overflow:"hidden"}}><div style={{height:"100%",width:`${progress}%`,background:"linear-gradient(90deg,#f59e0b,#22c55e)",borderRadius:4,transition:"width 0.5s ease"}}/></div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <span style={{color:"#a3836a",fontSize:"0.75rem"}}>📍 {zones[zoneIdx]} — {currentIdx+1}/{wordQueue.length}</span>
            {nextCreature && <span style={{color:"#a3836a",fontSize:"0.7rem"}}>{nextCreature.emoji} dans {Math.max(0,nextCreature.at-totalWins)}</span>}
          </div>
          <div style={{textAlign:"center",marginBottom:16}}>
            <button onClick={() => setShowFullMap(!showFullMap)} style={{padding:"6px 14px",borderRadius:8,border:"1px solid rgba(251,191,36,0.3)",background:"rgba(251,191,36,0.1)",color:"#fbbf24",fontSize:"0.75rem",fontWeight:600,fontFamily:"'Fredoka',sans-serif",cursor:"pointer"}}>
              {showFullMap ? "🎮 Retour au jeu" : "🗺️ Voir la carte"}
            </button>
          </div>

          {showMap && (
            <div style={{animation:"slideUp 0.5s ease-out",background:"linear-gradient(135deg,rgba(251,191,36,0.15),rgba(34,197,94,0.1))",borderRadius:16,padding:24,textAlign:"center",border:"1px solid rgba(251,191,36,0.3)",marginBottom:16}}>
              <div style={{fontSize:"2.5rem",marginBottom:8}}>🏕️</div>
              <h3 style={{color:"#fbbf24",marginBottom:4,fontSize:"1.1rem"}}>Zone conquise !</h3>
              <p style={{color:"#d4a574",marginBottom:4,fontSize:"0.9rem"}}>Tu as traversé la <strong>{zones[zoneIdx]}</strong></p>
              <p style={{color:"#22c55e",marginBottom:14,fontSize:"0.85rem"}}>{wordsLearned.size} mots appris • ⭐ {score}</p>
              <button onClick={()=>nextWord()} style={{padding:"12px 28px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#f59e0b,#d97706)",color:"#451a03",fontWeight:700,fontSize:"1rem",fontFamily:"'Fredoka',sans-serif",cursor:"pointer",boxShadow:"0 3px 0 #92400e"}}>Continuer →</button>
            </div>
          )}

          {showFullMap ? (
            <MapView currentWaypoint={currentIdx} completedWaypoints={completedWaypoints} onContinue={() => setShowFullMap(false)} isPreBoss={[4, 9, 14, 19].includes(currentIdx + 1)} />
          ) : !showMap && (
            <div style={{background:isBoss?"linear-gradient(135deg,rgba(239,68,68,0.2),rgba(120,53,15,0.4))":"linear-gradient(135deg,rgba(120,53,15,0.4),rgba(30,20,10,0.6))",borderRadius:20,padding:"24px 18px",border:isBoss?"1px solid rgba(239,68,68,0.4)":"1px solid rgba(251,191,36,0.2)",animation:isBoss?"bossGlow 2s ease-in-out infinite":"slideUp 0.4s ease-out"}}>
              {gameType==="scramble"&&<ScrambleGame key={currentIdx+"-s"} wordObj={currentWord} onWin={handleWin} onFail={handleFail} score={score} onSpend={handleSpend}/>}
              {gameType==="write"&&<WriteGame key={currentIdx+"-w"} wordObj={currentWord} onWin={handleWin} onFail={handleFail} score={score} onSpend={handleSpend}/>}
              {gameType==="listen"&&<ListenGame key={currentIdx+"-l"} wordObj={currentWord} onWin={handleWin} onFail={handleFail} score={score} onSpend={handleSpend}/>}
              {gameType==="hangman"&&<HangmanGame key={currentIdx+"-h"} wordObj={currentWord} onWin={handleWin} onFail={handleFail} score={score} onSpend={handleSpend} isBoss={isBoss}/>}
            </div>
          )}
        </div>
      )}

      {/* VICTORY */}
      {screen === "victory" && (
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:20,animation:"slideUp 0.8s ease-out"}}>
          <div style={{fontSize:"4rem",marginBottom:10,animation:"float 2s ease-in-out infinite"}}>🏆</div>
          <h2 style={{color:"#fbbf24",fontSize:"1.8rem",textShadow:"0 2px 15px rgba(251,191,36,0.4)",marginBottom:8}}>Trésor trouvé !</h2>
          <p style={{color:"#d4a574",marginBottom:20,textAlign:"center",maxWidth:280}}>Bravo Léo ! Aventure terminée !</p>
          <div style={{background:"rgba(0,0,0,0.3)",borderRadius:16,padding:"18px 28px",marginBottom:24,border:"1px solid rgba(251,191,36,0.2)",textAlign:"center"}}>
            <div style={{color:"#fbbf24",fontSize:"2rem",fontWeight:700,marginBottom:6}}>⭐ {score}</div>
            <div style={{color:"#d4a574",fontSize:"0.9rem",marginBottom:3}}>{wordsLearned.size} mots maîtrisés</div>
            <div style={{color:"#22c55e",fontSize:"0.9rem"}}>🔥 Meilleure série : {maxStreak}</div>
            <div style={{color:"#a3836a",fontSize:"0.85rem",marginTop:6}}>Total : {totalWins} mots • {getUnlocked().size} créatures</div>
          </div>
          <button onClick={startGame} style={{padding:"14px 32px",borderRadius:14,border:"none",background:"linear-gradient(135deg,#f59e0b,#d97706)",color:"#451a03",fontSize:"1.1rem",fontWeight:700,fontFamily:"'Fredoka',sans-serif",cursor:"pointer",boxShadow:"0 4px 0 #92400e"}}>🗺️ Nouvelle aventure !</button>
        </div>
      )}

      {/* GAME OVER */}
      {screen === "gameover" && (
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:20,animation:"slideUp 0.8s ease-out"}}>
          <div style={{fontSize:"3.5rem",marginBottom:10}}>🏕️</div>
          <h2 style={{color:"#f59e0b",fontSize:"1.6rem",marginBottom:8}}>Retour au campement !</h2>
          <p style={{color:"#d4a574",marginBottom:20,textAlign:"center",maxWidth:280}}>L'aventurier se repose et repart !</p>
          <div style={{background:"rgba(0,0,0,0.3)",borderRadius:16,padding:"18px 28px",marginBottom:24,border:"1px solid rgba(251,191,36,0.2)",textAlign:"center"}}>
            <div style={{color:"#fbbf24",fontSize:"1.5rem",fontWeight:700,marginBottom:6}}>⭐ {score}</div>
            <div style={{color:"#d4a574",fontSize:"0.9rem"}}>{wordsLearned.size} mots découverts</div>
          </div>
          <button onClick={startGame} style={{padding:"14px 32px",borderRadius:14,border:"none",background:"linear-gradient(135deg,#f59e0b,#d97706)",color:"#451a03",fontSize:"1.1rem",fontWeight:700,fontFamily:"'Fredoka',sans-serif",cursor:"pointer",boxShadow:"0 4px 0 #92400e"}}>🔄 Réessayer !</button>
        </div>
      )}
    </div>
  );
}
