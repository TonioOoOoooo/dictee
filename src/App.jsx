import { useState, useEffect, useCallback, useRef, useMemo } from "react";

// ─── WORD DATA ───
const ALL_WORDS = [
  { id:"siecle", word:"siècle", game:"siècle", hint:"C’est très, très long : 100 ans.", tip:"Ça commence par le son [s] écrit avec S, pas avec C. On entend « siè » au début, avec un accent grave : è." },
  { id:"humain", word:"humain", game:"humain", hint:"Une personne, pas un animal.", tip:"Ça commence par HU. Au milieu, on entend « main » comme la main du corps. Pas de E à la fin." },
  { id:"vers", word:"vers", game:"vers", hint:"Je vais ___ l’école.", tip:"C’est le mot de direction. Il finit par S. Attention à ne pas écrire vert ou ver." },
  { id:"voguer", word:"voguer", game:"voguer", hint:"Avancer doucement sur l’eau en bateau.", tip:"Ça commence par VO. Pour garder le son [g], il faut mettre U après le G." },
  { id:"naviguer", word:"naviguer", game:"naviguer", hint:"Conduire un bateau sur la mer.", tip:"On entend [g] avant le son « é ». Pour garder ce son, il faut GU." },
  { id:"permettre", word:"permettre", game:"permettre", hint:"Dire oui, autoriser.", tip:"On retrouve le mot « mettre » dedans. Comme « mettre », il y a deux T." },
  { id:"atravers", word:"à travers", game:"travers", hint:"Passer d’un côté à l’autre, par exemple dans une forêt.", prefix:"à ", tip:"D’abord le petit mot « à » avec accent. Ensuite, le deuxième mot finit par S." },
  { id:"celebre", word:"célèbre", game:"célèbre", hint:"Très connu, comme une grande star.", tip:"Il y a 2 accents. Le premier sonne É, le second sonne È." },
  { id:"representer", word:"représenter", game:"représenter", hint:"Parler ou agir à la place de quelqu’un.", tip:"Le début ressemble à « re-pré ». On retrouve presque le mot « présent » à l’intérieur." },
  { id:"pourquoi", word:"pourquoi", game:"pourquoi", hint:"Le mot qu’on dit pour demander la raison.", tip:"C’est comme deux petits mots collés : « pour » puis « quoi »." },
  { id:"voici", word:"voici", game:"voici", hint:"Mot qu’on dit pour montrer quelque chose près de soi.", tip:"Le début fait penser à « voir ». La fin fait penser à « ici »." },
  { id:"parceque", word:"parce que", game:"parce que", hint:"C’est le début d’une réponse à « pourquoi ? »", tip:"Ce n’est pas un seul mot. Il faut en écrire 2." },
  { id:"dehors", word:"dehors", game:"dehors", hint:"Je sors jouer dans le jardin, je vais ___.", tip:"Ça commence par DE. À la fin, on entend « hors », comme quand on est à l’extérieur." },
  { id:"apres", word:"après", game:"après", hint:"Le contraire de « avant ».", tip:"Il y a un accent grave sur le È. Le mot finit par S." },
  { id:"parfois", word:"parfois", game:"parfois", hint:"De temps en temps.", tip:"On peut le couper en 2 morceaux : « par » et « fois »." },
  { id:"hier", word:"hier", game:"hier", hint:"Le jour juste avant aujourd’hui.", tip:"Petit mot de 4 lettres. Il commence par H et ne finit pas par E." },
  { id:"si", word:"si", game:"si", hint:"Petit mot pour imaginer une condition, par exemple : ___ tu viens…", tip:"C’est un tout petit mot de 2 lettres, avec S puis I." },
  { id:"deja", word:"déjà", game:"déjà", hint:"Quand quelque chose est fait avant maintenant.", tip:"Petit mot avec 2 accents. Le premier sonne É, le dernier sonne À." },
  { id:"beaucoup", word:"beaucoup", game:"beaucoup", hint:"Le contraire de « un peu ».", tip:"On entend « beau » au début. Le mot finit par COUP, sans S à la fin." },
  { id:"geographie", word:"géographie", game:"géographie", hint:"La matière de l’école qui parle des pays, des cartes et de la Terre.", tip:"Le début fait « géo ». Plus loin, le son [f] s’écrit PH." },
  { id:"louest", word:"l'ouest", game:"ouest", hint:"Le côté où le soleil se couche.", prefix:"l'", tip:"Le mot commence par OU. Il faut penser à « west » en anglais pour la fin." },
  { id:"fascinant", word:"fascinant", game:"fascinant", hint:"Tellement intéressant qu’on a du mal à regarder ailleurs.", tip:"Au milieu, le son [s] s’écrit SC. Le mot finit par -ant." },
  { id:"musee", word:"musée", game:"musée", hint:"Un lieu où l’on va voir des tableaux, des statues ou des objets anciens.", tip:"Le mot finit par le son « é », écrit avec É puis un E muet juste après." },
  { id:"surplomber", word:"surplomber", game:"surplomber", hint:"Être placé plus haut que quelque chose.", tip:"Le mot commence par SUR. On retrouve « plomb » dedans, avec un B qu’on n’entend pas." },
  { id:"lumiere", word:"lumière", game:"lumière", hint:"Ce qu’allume une lampe dans une pièce sombre.", tip:"Le début est LU. Au milieu, il y a un È avec accent grave." },
  { id:"plusieurs", word:"plusieurs", game:"plusieurs", hint:"Plus d’un.", tip:"Le mot commence par PLUS. Il faut garder le S de la fin." },
  { id:"voler", word:"voler", game:"voler", hint:"Ce que font les oiseaux dans le ciel.", tip:"Le début est VOL, comme dans « un vol d’oiseau »." },
  { id:"ouvert", word:"ouvert", game:"ouvert", hint:"Le contraire de « fermé ».", tip:"Ça commence par OUV. À la fin, on entend presque « air », mais ça s’écrit avec ER puis T." },
  { id:"fermer", word:"fermer", game:"fermer", hint:"Le contraire de « ouvrir ».", tip:"Le début est FERM, comme dans « fermeture »." },
  { id:"escalier", word:"escalier", game:"escalier", hint:"Une suite de marches pour monter ou descendre.", tip:"Le début est ESCA. La fin s’écrit -IER." },
  { id:"enfin", word:"enfin", game:"enfin", hint:"Le mot qu’on dit quand on a trop attendu.", tip:"Le mot commence par EN. À la fin, le son nasal s’écrit IN." },
  { id:"soleil", word:"soleil", game:"soleil", hint:"Il brille dans le ciel pendant la journée.", tip:"Le début est SOL. La fin s’écrit -EIL, comme dans sommeil." },
  { id:"chauffer", word:"chauffer", game:"chauffer", hint:"Rendre plus chaud.", tip:"Le début vient de « chaud ». Attention, il y a deux F." },
  { id:"sommeil", word:"sommeil", game:"sommeil", hint:"Ce qu’on a quand on bâille et qu’on veut dormir.", prefix:"le ", tip:"Il y a deux M. La fin s’écrit -EIL, comme dans soleil." },
  { id:"bourgeons", word:"bourgeons", game:"bourgeons", hint:"Petites boules sur les branches avant les feuilles.", prefix:"les ", tip:"Au milieu, le son [j] s’écrit GE. À la fin, comme il y en a plusieurs, il faut un S." },
  { id:"gazouiller", word:"gazouiller", game:"gazouiller", hint:"Faire de petits chants d’oiseaux.", tip:"Le début est GAZOU. À la fin, il faut deux L avant ER." },
  { id:"ecureuils", word:"écureuils", game:"écureuils", hint:"Petits animaux qui grimpent aux arbres et cachent des noisettes.", prefix:"les ", tip:"Le mot commence par ÉCU. La fin s’écrit -EUILS." },
  { id:"sautiller", word:"sautiller", game:"sautiller", hint:"Faire plein de petits sauts.", tip:"Le début vient de « saut ». À la fin, il faut deux L avant ER." },
  { id:"maison", word:"maison", game:"maison", hint:"L’endroit où habite une famille.", tip:"Au début, on entend « mai ». À la fin, le son nasal s’écrit ON." },
  // ─── La famille ───
  { id:"membre", word:"membre", game:"membre", prefix:"un ", hint:"Quelqu'un qui fait partie d'un groupe ou d'une famille.", tip:"Au milieu, il y a BR. Le mot finit par RE." },
  { id:"enfance", word:"enfance", game:"enfance", prefix:"l'", hint:"La période de la vie quand on est petit enfant.", tip:"Le mot commence par EN. On retrouve le mot enfant dedans." },
  { id:"famille", word:"famille", game:"famille", prefix:"la ", hint:"Les parents, les frères, les sœurs, les grands-parents.", tip:"Au milieu, il y a deux L. Le mot finit par ILLE." },
  { id:"fille", word:"fille", game:"fille", prefix:"la ", hint:"Un enfant de sexe féminin.", tip:"Le mot finit par ILLE avec deux L." },
  { id:"frere", word:"frère", game:"frère", prefix:"le ", hint:"Un garçon qui a les mêmes parents que toi.", tip:"Il y a un accent grave sur le È. Le mot finit par RE." },
  { id:"soeur", word:"sœur", game:"sœur", prefix:"la ", hint:"Une fille qui a les mêmes parents que toi.", tip:"Le son [eu] s'écrit Œ, avec la lettre O collée au E." },
  { id:"peintre", word:"peintre", game:"peintre", prefix:"la ", hint:"Une personne qui crée des tableaux.", tip:"Le son [in] s'écrit EIN. Le mot finit par TRE." },
  { id:"ruban", word:"ruban", game:"ruban", prefix:"un ", hint:"Une longue bande de tissu colorée pour décorer.", tip:"Le début est RU. La fin s'écrit AN." },
  { id:"arbre", word:"arbre", game:"arbre", prefix:"un ", hint:"Une grande plante avec un tronc et des branches.", tip:"Le début est AR. Le mot finit par BRE." },
  { id:"parent", word:"parent", game:"parent", prefix:"le ", hint:"Le père ou la mère d'un enfant.", tip:"Le début est PAR. La fin s'écrit ENT avec un T muet." },
  { id:"tenue", word:"tenue", game:"tenue", prefix:"la ", hint:"Les vêtements qu'on porte pour une occasion.", tip:"Le début est TEN. Le mot finit par UE." },
  { id:"mariage", word:"mariage", game:"mariage", prefix:"le ", hint:"La fête quand deux personnes décident de vivre ensemble.", tip:"On retrouve le mot mari au début. Le son [j] s'écrit GE." },
  { id:"pays", word:"pays", game:"pays", prefix:"le ", hint:"Une grande région du monde, comme la France.", tip:"On ne prononce pas le S de la fin. Attention au Y au milieu." },
  { id:"origine", word:"origine", game:"origine", prefix:"l'", hint:"Le point de départ, d'où vient quelqu'un.", tip:"Le début est ORI. On retrouve un G avant la fin -INE." },
  { id:"pere", word:"père", game:"père", prefix:"le ", hint:"Le papa d'un enfant.", tip:"Court : P puis È puis RE. L'accent est grave." },
  { id:"mere", word:"mère", game:"mère", prefix:"la ", hint:"La maman d'un enfant.", tip:"Court : M puis È puis RE. L'accent est grave." },
  { id:"grandsparents", word:"grands-parents", game:"grands-parents", prefix:"les ", hint:"Le papa et la maman de ton père ou de ta mère.", tip:"Deux mots reliés par un trait d'union. Le premier finit par DS." },
  { id:"cote", word:"côté", game:"côté", prefix:"le ", hint:"La partie gauche ou droite de quelque chose.", tip:"Il y a un accent circonflexe sur le Ô. La fin s'écrit É." },
  { id:"voir", word:"voir", game:"voir", hint:"Utiliser ses yeux pour percevoir quelque chose.", tip:"Court : V, O, I, R. Juste 4 lettres." },
  { id:"tenir", word:"tenir", game:"tenir", hint:"Garder quelque chose dans ses mains.", tip:"Ça commence par TEN. La fin est IR." },
  { id:"tracer", word:"tracer", game:"tracer", hint:"Dessiner une ligne ou un trait.", tip:"Ça commence par TRA. Le son [s] devant le E s'écrit avec C." },
  { id:"reconnaitre", word:"reconnaître", game:"reconnaître", hint:"Identifier quelqu'un qu'on a déjà vu.", tip:"Le début est RE + CON + NAÎ. Le Î prend un accent circonflexe. La fin est TRE." },
  { id:"petit", word:"petit", game:"petit", hint:"Le contraire de grand.", tip:"Le mot finit par IT avec un T muet." },
  { id:"genealogique", word:"généalogique", game:"généalogique", hint:"Qui parle de la famille et de ses origines (arbre ___).", tip:"Ça commence par GÉ. Au milieu, on retrouve ALOGIQUE." },
  { id:"represente", word:"représenté", game:"représenté", hint:"Montré ou dessiné sur quelque chose.", tip:"Le début est RE-PRÉ. On retrouve presque présent dedans. La fin est É." },
  { id:"maternel", word:"maternel", game:"maternel", hint:"Qui vient du côté de la mère.", tip:"Le début est MATER. La fin est NEL." },
  { id:"paternel", word:"paternel", game:"paternel", hint:"Qui vient du côté du père.", tip:"Le début est PATER. La fin est NEL." },
  { id:"autour", word:"autour", game:"autour", hint:"Tout ce qui entoure quelque chose, de tous les côtés.", tip:"On peut le couper : AU + TOUR. La fin est OUR." },
  { id:"dans", word:"dans", game:"dans", hint:"À l'intérieur de quelque chose.", tip:"Petit mot de 4 lettres. La fin s'écrit ANS." },
  { id:"mais", word:"mais", game:"mais", hint:"Mot pour opposer deux idées.", tip:"Petit mot de 4 lettres. La fin s'écrit AIS." },
  { id:"entre", word:"entre", game:"entre", hint:"Au milieu de deux choses.", tip:"Le début est EN. La fin est TRE." },
  { id:"pres", word:"près", game:"près", hint:"Le contraire de loin.", tip:"Il y a un accent grave sur le È. Le mot finit par S." },
  { id:"ilya", word:"il y a", game:"il y a", hint:"Ce qu'on dit pour indiquer que quelque chose existe.", tip:"Ce sont trois petits mots : IL, Y et A." },
];

// ─── DICTÉES (groupes de mots) ───
const DICTEES = {
  "Les explorateurs": new Set(["siecle","humain","vers","voguer","naviguer","permettre","atravers","celebre","representer","pourquoi","voici","parceque","dehors","apres","parfois","hier","si","deja","beaucoup","geographie","louest","fascinant","musee","surplomber","lumiere","plusieurs","voler","ouvert","fermer","escalier","enfin"]),
  "Le printemps": new Set(["soleil","chauffer","sommeil","bourgeons","gazouiller","ecureuils","sautiller","maison"]),
  "La famille": new Set(["membre","enfance","famille","fille","frere","soeur","peintre","ruban","arbre","parent","tenue","mariage","pays","origine","pere","mere","grandsparents","cote","voir","tenir","tracer","reconnaitre","petit","genealogique","represente","maternel","paternel","autour","dans","mais","entre","pres","ilya"]),
};
// Order: most recent dictée first (highlighted), "Toutes les dictées" last
const DICTEE_ORDER = ["La famille", "Le printemps", "Les explorateurs"];
const DICTEE_NAMES = [...DICTEE_ORDER, "Toutes les dictées"];
const LATEST_DICTEE = DICTEE_ORDER[0];

// Dictées that have an English translation available (module EN)
const DICTEES_EN_ENABLED = new Set(["La famille"]);

// English translations (per word id) for the "La famille" dictée
const WORDS_EN = {
  membre:        { word:"member",       game:"member",       prefix:"a ",   hint:"Someone who is part of a group or a family.", tip:"6 letters. Double B before ER." },
  enfance:       { word:"childhood",    game:"childhood",    prefix:"",     hint:"The time of life when you are a small child.", tip:"Two parts joined: CHILD + HOOD." },
  famille:       { word:"family",       game:"family",       prefix:"the ", hint:"Parents, brothers, sisters, grandparents…", tip:"6 letters. Ends with a Y: FAMIL-Y." },
  fille:         { word:"daughter",     game:"daughter",     prefix:"the ", hint:"A female child of her parents.", tip:"Tricky: D-A-U-G-H-T-E-R. The G and H are silent." },
  frere:         { word:"brother",      game:"brother",      prefix:"a ",   hint:"A boy with the same parents as you.", tip:"BRO + THER. Starts with a B." },
  soeur:         { word:"sister",       game:"sister",       prefix:"a ",   hint:"A girl with the same parents as you.", tip:"6 letters: SIS + TER." },
  peintre:       { word:"painter",      game:"painter",      prefix:"a ",   hint:"A person who makes pictures with paint.", tip:"Starts with PAINT + ER." },
  ruban:         { word:"ribbon",       game:"ribbon",       prefix:"a ",   hint:"A long colourful strip of fabric used to decorate.", tip:"Double B in the middle." },
  arbre:         { word:"tree",         game:"tree",         prefix:"a ",   hint:"A tall plant with a trunk and branches.", tip:"Just 4 letters: T-R-E-E. Double E." },
  parent:        { word:"parent",       game:"parent",       prefix:"a ",   hint:"The father or the mother of a child.", tip:"PAR + ENT. Same spelling as in French!" },
  tenue:         { word:"outfit",       game:"outfit",       prefix:"an ",  hint:"The clothes someone wears for a special day.", tip:"OUT + FIT. 6 letters." },
  mariage:       { word:"wedding",      game:"wedding",      prefix:"a ",   hint:"The party when two people decide to live together.", tip:"Double D in the middle: WED + DING." },
  pays:          { word:"country",      game:"country",      prefix:"a ",   hint:"A big region of the world, like France or England.", tip:"COUN + TRY. Ends with a Y." },
  origine:       { word:"origin",       game:"origin",       prefix:"the ", hint:"The point where someone or something comes from.", tip:"6 letters: ORI + GIN." },
  pere:          { word:"father",       game:"father",       prefix:"the ", hint:"The dad of a child.", tip:"FA + THER. 6 letters." },
  mere:          { word:"mother",       game:"mother",       prefix:"the ", hint:"The mum of a child.", tip:"MO + THER. 6 letters." },
  grandsparents: { word:"grandparents", game:"grandparents", prefix:"the ", hint:"The parents of your father or your mother.", tip:"One word made of two: GRAND + PARENTS." },
  cote:          { word:"side",         game:"side",         prefix:"the ", hint:"The left or right part of something.", tip:"Just 4 letters: S-I-D-E." },
  voir:          { word:"to see",       game:"to see",       prefix:"",     hint:"To use your eyes to notice something.", tip:"Two words: TO + SEE. Double E at the end." },
  tenir:         { word:"to hold",      game:"to hold",      prefix:"",     hint:"To keep something in your hands.", tip:"Two words: TO + HOLD." },
  tracer:        { word:"to draw",      game:"to draw",      prefix:"",     hint:"To make lines on paper with a pen or pencil.", tip:"Two words: TO + DRAW. Ends with AW." },
  reconnaitre:   { word:"to recognize", game:"to recognize", prefix:"",     hint:"To identify someone you have seen before.", tip:"RE + COG + NIZE." },
  petit:         { word:"small",        game:"small",        prefix:"",     hint:"The opposite of big.", tip:"5 letters with double L at the end: SMA + LL." },
  genealogique:  { word:"genealogical", game:"genealogical", prefix:"",     hint:"About family history (___ tree).", tip:"Hard word! GEN + E + A + LOG + I + CAL." },
  represente:    { word:"represented",  game:"represented",  prefix:"",     hint:"Shown or drawn in a picture.", tip:"RE + PRESENT + ED. Ends with ED." },
  maternel:      { word:"maternal",     game:"maternal",     prefix:"",     hint:"Coming from the mother's side.", tip:"Like 'mother': MATER + NAL." },
  paternel:      { word:"paternal",     game:"paternal",     prefix:"",     hint:"Coming from the father's side.", tip:"Like 'father': PATER + NAL." },
  autour:        { word:"around",       game:"around",       prefix:"",     hint:"On every side of something.", tip:"A + ROUND. 6 letters." },
  dans:          { word:"in",           game:"in",           prefix:"",     hint:"Inside something.", tip:"Tiny word: just I and N." },
  mais:          { word:"but",          game:"but",          prefix:"",     hint:"A word used to contrast two ideas.", tip:"3 letters: B-U-T." },
  entre:         { word:"between",      game:"between",      prefix:"",     hint:"In the middle of two things.", tip:"BE + TWEEN. Double E." },
  pres:          { word:"near",         game:"near",         prefix:"",     hint:"The opposite of far.", tip:"4 letters: N-E-A-R." },
  ilya:          { word:"there is",     game:"there is",     prefix:"",     hint:"Words used to say that something exists.", tip:"Two words: THERE + IS." },
};

const localizeWord = (w, lang) => {
  if (lang !== "en") return w;
  const en = WORDS_EN[w.id];
  return en ? { ...w, ...en } : w;
};

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

// ─── MAP WAYPOINTS (coordinates for viewBox 0 0 100 40, matching adventure-map.png) ───
const MAP_WAYPOINTS = [
  { x: 8, y: 34, type: 'start', zone: 'Campement', label: '🏕️' },
  { x: 11, y: 32, type: 'normal', zone: 'Forêt', label: '1' },
  { x: 14, y: 30, type: 'normal', zone: 'Forêt', label: '2' },
  { x: 17, y: 28, type: 'normal', zone: 'Forêt', label: '3' },
  { x: 19, y: 26, type: 'normal', zone: 'Forêt', label: '4' },
  { x: 22, y: 24, type: 'boss', zone: 'Forêt', label: '⚔️' },
  { x: 25, y: 21, type: 'normal', zone: 'Montagne', label: '6' },
  { x: 28, y: 18, type: 'normal', zone: 'Montagne', label: '7' },
  { x: 31, y: 16, type: 'normal', zone: 'Montagne', label: '8' },
  { x: 35, y: 13, type: 'normal', zone: 'Montagne', label: '9' },
  { x: 38, y: 10, type: 'boss', zone: 'Montagne', label: '⚔️' },
  { x: 42, y: 13, type: 'normal', zone: 'Rivière', label: '11' },
  { x: 46, y: 16, type: 'normal', zone: 'Rivière', label: '12' },
  { x: 50, y: 20, type: 'normal', zone: 'Rivière', label: '13' },
  { x: 54, y: 23, type: 'normal', zone: 'Rivière', label: '14' },
  { x: 58, y: 26, type: 'boss', zone: 'Rivière', label: '⚔️' },
  { x: 62, y: 23, type: 'normal', zone: 'Château', label: '16' },
  { x: 66, y: 20, type: 'normal', zone: 'Château', label: '17' },
  { x: 70, y: 17, type: 'normal', zone: 'Château', label: '18' },
  { x: 74, y: 14, type: 'normal', zone: 'Château', label: '19' },
  { x: 78, y: 12, type: 'boss', zone: 'Château', label: '⚔️' },
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

const EXTRA_LETTERS = [..."abcdefghijklmnopqrstuvwxyzéèêàâùûôî".normalize("NFC")];
const shuffle = (a) => { const b=[...a]; for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];} return b; };
const speakWord = (t, lang="fr-FR") => { const u=new SpeechSynthesisUtterance(t); u.lang=lang; u.rate = lang.startsWith("en") ? 0.9 : 0.75; speechSynthesis.cancel(); speechSynthesis.speak(u); };

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
const getSelectedDictee = () => { const d = loadData(); return d.selectedDictee || LATEST_DICTEE; };
const saveSelectedDictee = (name) => { const d = loadData(); d.selectedDictee = name; saveData(d); };
// Words mastered "du premier coup" via Écriture/Dictée (no fail, no hint, no payment, full validation)
const getMastered = () => { const d = loadData(); return new Set(d.mastered || []); };
const saveMastered = (s) => { const d = loadData(); d.mastered = [...s]; saveData(d); };
// Dictées completed perfectly (all words mastered without any faute over a single session)
const getDicteePerfect = () => { const d = loadData(); return new Set(d.dicteePerfect || []); };
const saveDicteePerfect = (s) => { const d = loadData(); d.dicteePerfect = [...s]; saveData(d); };
// Per-dictée toggle: only train words not yet mastered
const getOnlyTodo = () => { const d = loadData(); return d.onlyTodo || {}; };
const saveOnlyTodo = (m) => { const d = loadData(); d.onlyTodo = m; saveData(d); };
const getLang = () => { const d = loadData(); return d.lang === "en" ? "en" : "fr"; };
const saveLang = (l) => { const d = loadData(); d.lang = l; saveData(d); };

// ─── SELECTION HELPER ───
const getWordsForSelection = (mode, packId) => {
  if (mode === "dictation" && packId) {
    const pack = WORD_PACKS.find(p => p.id === packId);
    return pack ? pack.words : ALL_WORDS;
  }
  return ALL_WORDS;
};

// ─── FIREWORKS ───
function Fireworks({ onDone }) {
  const canvasRef = useRef(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = 400; canvas.height = 300;
    let cancelled = false;
    const particles = [];
    const colors = ["#fbbf24","#22c55e","#ec4899","#8b5cf6","#ef4444","#3b82f6","#f97316"];
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
      if (cancelled) return;
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
      else onDoneRef.current?.();
    };
    animate();
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
    return () => { cancelled = true; };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", pointerEvents: "none", zIndex: 50 }} />;
}

// ─── MUSIC MANAGER ───
const musicRefs = { start: null, game: null, final: null, lost: null };
function getMusicAudio(key, src, volume, loop = false) {
  if (!musicRefs[key]) {
    musicRefs[key] = new Audio(src);
    musicRefs[key].loop = loop;
    musicRefs[key].volume = volume;
  }
  return musicRefs[key];
}
function stopAllMusic() {
  Object.values(musicRefs).forEach(a => { if (a) { a.pause(); a.currentTime = 0; } });
}

function MusicController({ screen, musicOn }) {
  const triedAutoPlay = useRef(false);

  const playForScreen = useCallback(() => {
    if (!musicOn) { stopAllMusic(); return; }
    stopAllMusic();
    try {
      if (screen === "title") {
        const a = getMusicAudio("start", "/Start.mp3", 0.5);
        a.play().catch(() => {});
      } else if (screen === "play") {
        const a = getMusicAudio("game", "/Game.mp3", 0.10, true);
        a.play().catch(() => {});
      } else if (screen === "victory") {
        const a = getMusicAudio("final", "/Final.mp3", 0.6);
        a.play().catch(() => {});
      } else if (screen === "gameover") {
        const a = getMusicAudio("lost", "/Lost.mp3", 0.45);
        a.play().catch(() => {});
      }
    } catch {}
  }, [screen, musicOn]);

  // Auto-start on first user interaction (browsers block autoplay)
  useEffect(() => {
    if (triedAutoPlay.current) return;
    const startOnInteraction = () => {
      triedAutoPlay.current = true;
      playForScreen();
      document.removeEventListener("click", startOnInteraction);
      document.removeEventListener("touchstart", startOnInteraction);
      document.removeEventListener("keydown", startOnInteraction);
    };
    document.addEventListener("click", startOnInteraction);
    document.addEventListener("touchstart", startOnInteraction);
    document.addEventListener("keydown", startOnInteraction);
    return () => {
      document.removeEventListener("click", startOnInteraction);
      document.removeEventListener("touchstart", startOnInteraction);
      document.removeEventListener("keydown", startOnInteraction);
    };
  }, [playForScreen]);

  useEffect(() => { playForScreen(); }, [playForScreen]);
  return null;
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
        <img ref={mapRef} src="/adventure-map.png?v=2" alt="Carte d'aventure" style={{ width: "100%", height: "auto", display: "block" }} />
        
        <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 100 40" preserveAspectRatio="none">
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
function SoundButton({ word, size = 40, lang = "fr-FR" }) {
  const isEn = lang.startsWith("en");
  return (
    <button onClick={() => speakWord(word, lang)} title={isEn ? "Listen (English)" : "Écouter (Français)"}
      style={{ width:size, height:size, borderRadius:"50%", border:"none", background: isEn ? "linear-gradient(135deg,#3b82f6,#1d4ed8)" : "linear-gradient(135deg,#8b5cf6,#7c3aed)", color:"#fff", fontSize:size*0.42, cursor:"pointer", boxShadow: isEn ? "0 3px 0 #1e3a8a" : "0 3px 0 #5b21b6", transition:"transform 0.15s", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}
      onMouseDown={e=>e.currentTarget.style.transform="scale(0.9)"} onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}
    >{isEn ? "🇬🇧" : "🔊"}</button>
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
function ScrambleGame({ wordObj, onWin, onFail, score, onSpend, voiceLang = "fr-FR" }) {
  const clean = wordObj.game.normalize("NFC").replace(/\s/g,"");
  const prefix = wordObj.prefix||"";
  const [allLetters] = useState(() => {
    const real=[...clean]; const fc=Math.min(4,Math.max(2,Math.floor(clean.length*0.4)));
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
        setShowTip(true);
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
        <SoundButton word={wordObj.word} size={32} lang={voiceLang}/>
        {!boughtTip && <PaidHintButton label="💡" cost={10} score={score} disabled={boughtTip} onBuy={()=>{onSpend(10);setBoughtTip(true);setShowTip(true);}}/>}
      </div>
      {showTip && !boughtTip && <TipBox text={`Le mot a ${clean.length} lettres et commence par « ${clean[0]} ».`}/>}
      {showTip && boughtTip && <TipBox text={wordObj.tip}/>}
      <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:4,minHeight:48,marginBottom:16,flexWrap:"wrap",marginTop:10}}>
        {prefix && <span style={{color:"#fbbf24",fontSize:"1.2rem",fontWeight:700,fontFamily:"'Fredoka',sans-serif",marginRight:4}}>{prefix}</span>}
        {[...clean].map((_,i)=>{
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
function WriteGame({ wordObj, onWin, onFail, score, onSpend, voiceLang = "fr-FR" }) {
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
    else { setStatus("fail"); setShowTip(true); setBoughtTip(true); setShowAnswer(true); onFail(); setTimeout(()=>{setStatus(null);setInput("");setShowAnswer(false);},1500); }
  };

  return (
    <div style={{textAlign:"center"}}>
      <h3 style={{color:"#fbbf24",fontFamily:"'Fredoka',sans-serif",fontSize:"1.1rem",marginBottom:6}}>✏️ Écris le mot en entier !</h3>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginBottom:6,flexWrap:"wrap"}}>
        <p style={{color:"#d4a574",fontSize:"0.85rem",fontStyle:"italic",margin:0}}>Indice : {wordObj.hint}</p>
        <SoundButton word={wordObj.word} size={32} lang={voiceLang}/>
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
function ListenGame({ wordObj, onWin, onFail, score, onSpend, voiceLang = "fr-FR" }) {
  const [input,setInput]=useState(""); const [status,setStatus]=useState(null);
  const [revealed,setRevealed]=useState(false);
  const [boughtTip,setBoughtTip]=useState(false); const [showTip,setShowTip]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>speakWord(wordObj.word, voiceLang),400);return()=>clearTimeout(t);},[wordObj.word, voiceLang]);
  const submit=()=>{
    if(!input.trim())return;const norm=s=>s.toLowerCase().trim().replace(/\s+/g," ");
    if(norm(input)===norm(wordObj.word)||norm(input)===norm(wordObj.game)){setStatus("win");setTimeout(()=>onWin(),300);}
    else{setStatus("fail");setRevealed(true);setShowTip(true);setBoughtTip(true);onFail();setTimeout(()=>{setStatus(null);setInput("");setRevealed(false);},1500);}
  };
  return (
    <div style={{textAlign:"center"}}>
      <h3 style={{color:"#fbbf24",fontFamily:"'Fredoka',sans-serif",fontSize:"1.1rem",marginBottom:6}}>👂 Écoute et écris !</h3>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginBottom:10,flexWrap:"wrap"}}>
        {!boughtTip && <PaidHintButton label="💡 Astuce" cost={10} score={score} disabled={boughtTip} onBuy={()=>{onSpend(10);setBoughtTip(true);setShowTip(true);}}/>}
      </div>
      {showTip && <TipBox text={wordObj.tip}/>}
      <button onClick={()=>speakWord(wordObj.word, voiceLang)} title={voiceLang.startsWith("en") ? "Listen" : "Écouter"} style={{width:64,height:64,borderRadius:"50%",border:"none",background: voiceLang.startsWith("en") ? "linear-gradient(135deg,#3b82f6,#1d4ed8)" : "linear-gradient(135deg,#8b5cf6,#7c3aed)",color:"#fff",fontSize:"1.8rem",cursor:"pointer",boxShadow: voiceLang.startsWith("en") ? "0 4px 0 #1e3a8a" : "0 4px 0 #5b21b6",marginBottom:16,marginTop:6}} onMouseDown={e=>e.currentTarget.style.transform="scale(0.93)"} onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}>{voiceLang.startsWith("en") ? "🇬🇧" : "🔊"}</button>
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

function HangmanGame({ wordObj, onWin, onFail, score, onSpend, isBoss, voiceLang = "fr-FR" }) {
  const gw=wordObj.game.normalize("NFC").toLowerCase(); const prefix=wordObj.prefix||"";
  const unique=useMemo(()=>new Set([...gw.replace(/\s/g,"")]),[gw]);
  const [guessed,setGuessed]=useState(new Set()); const [errors,setErrors]=useState(0); const [status,setStatus]=useState(null);
  const [boughtHint,setBoughtHint]=useState(false); const [boughtSound,setBoughtSound]=useState(false); const [boughtTip,setBoughtTip]=useState(false); const [showTip,setShowTip]=useState(false);
  const canvasRef=useRef(null); const maxE=HP.length;
  const alpha=[..."abcdefghijklmnopqrstuvwxyz"]; const acc=[..."éèêëàâùûôîïç".normalize("NFC")];

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
        <PaidHintButton label="🔊 Son" cost={10} score={score} disabled={boughtSound} onBuy={()=>{onSpend(10);setBoughtSound(true);speakWord(wordObj.word, voiceLang);}}/>
        <PaidHintButton label="💡 Astuce" cost={10} score={score} disabled={boughtTip} onBuy={()=>{onSpend(10);setBoughtTip(true);setShowTip(true);}}/>
      </div>
      {boughtHint && <p style={{color:"#d4a574",fontSize:"0.85rem",fontStyle:"italic",marginBottom:4}}>Indice : {wordObj.hint}</p>}
      {boughtSound && <div style={{marginBottom:8}}><SoundButton word={wordObj.word} size={34} lang={voiceLang}/></div>}
      {showTip && <TipBox text={wordObj.tip}/>}
      <canvas ref={canvasRef} width={300} height={170} style={{display:"block",margin:"4px auto 12px",maxWidth:"100%"}}/>
      <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:4,marginBottom:16,flexWrap:"wrap",animation:status==="won"?"tada 0.8s":status==="lost"?"headShake 0.5s":"none"}}>
        {prefix && <span style={{color:"#fbbf24",fontSize:"1.3rem",fontWeight:700,fontFamily:"'Fredoka',sans-serif",marginRight:4}}>{prefix}</span>}
        {[...gw].map((l,i)=>l===" "?<div key={i} style={{width:12}}/>:<div key={i} style={{width:30,height:38,borderBottom:guessed.has(l)?"none":"3px solid #f59e0b",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.3rem",fontWeight:700,fontFamily:"'Fredoka',sans-serif",color:status==="lost"&&!guessed.has(l)?"#ef4444":"#fff"}}>{guessed.has(l)||status==="lost"?l:""}</div>)}
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
  const [screen, setScreen] = useState("splash");
  const [wordQueue, setWordQueue] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [gameType, setGameType] = useState("");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [wordsLearned, setWordsLearned] = useState(new Set());
  const [showMap, setShowMap] = useState(false);
  const [isBoss, setIsBoss] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [newCreature, setNewCreature] = useState(null);
  const [totalWins, setTotalWins] = useState(getTotalWins());
  
  // New: Milestones & Map
  const [startTime, setStartTime] = useState(null);
  const [usedHints, setUsedHints] = useState(false);
  const [milestonePopup, setMilestonePopup] = useState(null);
  const [achievements, setAchievements] = useState(getAchievements());
  const [showFullMap, setShowFullMap] = useState(false);
  const [zoneStartLives, setZoneStartLives] = useState(5);
  const [musicOn, setMusicOn] = useState(true);
  const [bossWord, setBossWord] = useState(null);
  const [sessionPlayedWords, setSessionPlayedWords] = useState([]);
<<<<<<< HEAD
  const [selectedMode, setSelectedMode] = useState("all");
  const [selectedPackId, setSelectedPackId] = useState(null);
  const [packEmptyWarning, setPackEmptyWarning] = useState(false);
=======
  const [selectedDictee, setSelectedDictee] = useState(getSelectedDictee());
  // Mastery & dictée tracking
  const [mastered, setMastered] = useState(getMastered());
  const [dicteePerfect, setDicteePerfect] = useState(getDicteePerfect());
  const [onlyTodo, setOnlyTodo] = useState(getOnlyTodo());
  // Per-word session tracking
  const [wordPhase, setWordPhase] = useState("main"); // 'main' | 'writeValidation'
  const [wordHadFail, setWordHadFail] = useState(false);
  const [sessionResults, setSessionResults] = useState({}); // { [wordId]: 'mastered' | 'todo' }
  const [justPerfectedDictee, setJustPerfectedDictee] = useState(null);
  // Language mode (fr / en) for the whole app
  const [lang, setLang] = useState(getLang());
  const voiceLang = lang === "en" ? "en-US" : "fr-FR";
>>>>>>> 5a324b0 (go)

  // Cheat: + adds life
  useEffect(() => {
    const h = (e) => { if (e.key === "+" || (e.key === "=" && !e.shiftKey)) setLives(p => p + 1); };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, []);

<<<<<<< HEAD
  const pickGame = () => NORMAL_GAMES[Math.floor(Math.random() * NORMAL_GAMES.length)];

  const buildQueue = (words) => {
    const disabled = getDisabled();
    const stats = getWordStats();
    let pool = words.filter(w => !disabled.has(w.id));
    if (pool.length === 0) return [];
    // Prioritize least-mastered words
    pool.sort((a, b) => {
      const sa = stats[a.id]?.wins || 0, sb = stats[b.id]?.wins || 0;
      if (sa !== sb) return sa - sb;
      return Math.random() - 0.5;
=======
  // ── Detect dictée perfection on entering the victory screen
  useEffect(() => {
    if (screen !== "victory") return;
    if (selectedDictee === "Toutes les dictées") return;
    const setIds = DICTEES[selectedDictee];
    if (!setIds) return;
    // All words of the dictée must be in mastered set
    const allMastered = [...setIds].every(id => mastered.has(id));
    if (!allMastered) return;
    if (dicteePerfect.has(selectedDictee)) return; // already celebrated
    // Mark as perfect, persist, trigger celebration
    setDicteePerfect(prev => {
      const next = new Set(prev); next.add(selectedDictee); saveDicteePerfect(next); return next;
>>>>>>> 5a324b0 (go)
    });
    setJustPerfectedDictee(selectedDictee);
  }, [screen, selectedDictee, mastered, dicteePerfect]);

  // Helper for the title screen and recap
  const dicteeStats = (name) => {
    const ids = name === "Toutes les dictées"
      ? new Set(ALL_WORDS.map(w => w.id))
      : (DICTEES[name] || new Set());
    const total = ids.size;
    let done = 0;
    ids.forEach(id => { if (mastered.has(id)) done++; });
    return { total, done, isPerfect: total > 0 && done === total };
  };

<<<<<<< HEAD
  const startGame = () => {
    const words = getWordsForSelection(selectedMode, selectedPackId);
    const queue = buildQueue(words);
    if (queue.length === 0) {
      setPackEmptyWarning(true);
      return;
    }
    setPackEmptyWarning(false);
=======
  const pickGame = () => NORMAL_GAMES[Math.floor(Math.random() * NORMAL_GAMES.length)];

  const buildQueue = (overrides = {}) => {
    const disabled = getDisabled();
    const dicteeSet = DICTEES[selectedDictee] || null; // null = toutes
    const todoMode = overrides.forceTodo ?? !!onlyTodo[selectedDictee];
    const masteredSet = mastered;
    const isEn = lang === "en";
    let pool = ALL_WORDS.filter(w =>
      !disabled.has(w.id)
      && (!dicteeSet || dicteeSet.has(w.id))
      && (!isEn || WORDS_EN[w.id]) // in EN mode, only keep words that have a translation
    );
    if (pool.length === 0) pool = [...ALL_WORDS].filter(w => !isEn || WORDS_EN[w.id]);
    if (pool.length === 0) pool = [...ALL_WORDS];
    // Split into todo (not mastered) vs done (mastered)
    const todo = pool.filter(w => !masteredSet.has(w.id));
    const done = pool.filter(w => masteredSet.has(w.id));
    let queue;
    if (todoMode) {
      queue = shuffle(todo);
    } else {
      // Priority: todo first (shuffled), then done as filler
      queue = [...shuffle(todo), ...shuffle(done)];
    }
    // Cap at 20
    return queue.slice(0, Math.min(20, queue.length));
  };

  const startGameWith = (queue) => {
    if (!queue.length) return;
>>>>>>> 5a324b0 (go)
    setWordQueue(queue);
    setCurrentIdx(0); setGameType(pickGame()); setScore(0); setLives(5);
    setStreak(0); setMaxStreak(0); setWordsLearned(new Set());
    setShowMap(false); setIsBoss(false);
    setShowFireworks(false); setNewCreature(null);
    setStartTime(Date.now()); setUsedHints(false);
    setMilestonePopup(null);
    setShowFullMap(false); setZoneStartLives(5);
    setBossWord(null); setSessionPlayedWords([]);
    setWordPhase("main"); setWordHadFail(false);
    setSessionResults({}); setJustPerfectedDictee(null);
    setScreen("play");
  };
  const startGame = () => startGameWith(buildQueue());
  const startGameTodoOnly = () => {
    // Force the "to retravailler" mode for next session
    const q = buildQueue({ forceTodo: true });
    if (q.length === 0) return; // nothing to retrain
    startGameWith(q);
  };

  const handleWin = () => {
    const w = bossWord || wordQueue[currentIdx];

    // ── Scramble → Write validation: ensure the child writes the word too
    if (!isBoss && wordPhase === "main" && gameType === "scramble") {
      // Switch to a forced Write phase for the same word; do NOT advance.
      setWordPhase("writeValidation");
      setGameType("write");
      setStartTime(Date.now());
      // Keep usedHints / wordHadFail (they track the whole word attempt)
      return;
    }

    setShowFireworks(true);

    // ── Mastery tracking (per dictée session + persistent set)
    if (!isBoss) {
      const wasFlaggedTodo = sessionResults[w.id] === "todo";
      const perfect = !wordHadFail && !usedHints && !wasFlaggedTodo;
      if (perfect) {
        setSessionResults(prev => ({ ...prev, [w.id]: "mastered" }));
        // Add to persistent mastered set
        setMastered(prev => {
          if (prev.has(w.id)) return prev;
          const next = new Set(prev); next.add(w.id); saveMastered(next); return next;
        });
      } else {
        setSessionResults(prev => ({ ...prev, [w.id]: prev[w.id] || "todo" }));
      }
    }

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
    setSessionPlayedWords(prev => [...prev, w]);
    
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
    // After boss victory: clear boss word, show zone recap
    if (isBoss) { setIsBoss(false); setBossWord(null); setShowMap(true); return; }
    // Check if boss should trigger (after every 5 normal words: indices 4, 9, 14, 19)
    if ((currentIdx + 1) % 5 === 0 && currentIdx < wordQueue.length) {
      // Pick a revision word from ALL words seen so far (excluding the one just played)
      const candidates = wordQueue.slice(0, currentIdx);
      const revisionWord = candidates.length > 0
        ? candidates[Math.floor(Math.random() * candidates.length)]
        : wordQueue[currentIdx];
      // Set up boss immediately (no timeout) and show map
      setBossWord(revisionWord);
      setIsBoss(true);
      setGameType("hangman");
      setStartTime(Date.now());
      setUsedHints(false);
      setShowFullMap(true);
      return;
    }
    nextWord();
  };

  const nextWord = (forceType, forceBoss) => {
    if (currentIdx >= wordQueue.length - 1) { setScreen("victory"); return; }
    setCurrentIdx(p => p + 1); setGameType(forceType || pickGame()); setIsBoss(!!forceBoss);
    setShowMap(false); setShowFullMap(false);
    setStartTime(Date.now()); setUsedHints(false);
    // Reset per-word session tracking
    setWordPhase("main"); setWordHadFail(false);
    
    // Track zone start for "sans faute" milestone
    if ((currentIdx + 1) % 5 === 1) setZoneStartLives(lives);
  };

  const handleFail = () => {
    const w = bossWord || wordQueue[currentIdx];
    const ws = getWordStats(); if (!ws[w.id]) ws[w.id] = { wins: 0, fails: 0 }; ws[w.id].fails++; saveWordStats(ws);
    // Mark word as "to retravailler" for this session (sticky)
    setSessionResults(prev => prev[w.id] === "todo" ? prev : { ...prev, [w.id]: "todo" });
    // Re-queue once per attempt (a single word may trigger several onFail in scramble)
    if (!isBoss && !wordHadFail) {
      setWordHadFail(true);
      setWordQueue(prev => {
        const remaining = prev.length - currentIdx - 1;
        const next = [...prev];
        const insertOffset = 1 + Math.floor(Math.random() * (Math.max(remaining, 0) + 1));
        next.splice(currentIdx + insertOffset, 0, w);
        return next;
      });
    }
    setStreak(0); setUsedHints(true);
    setLives(p => { const n = p - 1; if (n <= 0) setTimeout(() => setScreen("gameover"), 500); return n; });
  };

  const handleSpend = (n) => { setScore(p => Math.max(0, p - n)); setUsedHints(true); };
  const currentWord = bossWord || wordQueue[currentIdx];
  const progress = wordQueue.length > 0 ? (currentIdx / wordQueue.length) * 100 : 0;
  const zones = ["Forêt Enchantée", "Rivière Mystique", "Montagne Sacrée", "Temple Ancien", "Grotte Secrète", "Village Oublié", "Pont des Étoiles", "Clairière Dorée"];
  const zoneIdx = Math.floor(currentIdx / 5) % zones.length;
  const nextCreature = CREATURES.find(c => c.at > totalWins);
  const mapWaypoint = Math.min(currentIdx + 1, MAP_WAYPOINTS.length - 1);
  const completedWaypoints = useMemo(() => { const s = new Set(); for (let i = 0; i <= currentIdx; i++) s.add(i); return s; }, [currentIdx]);

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

      <MusicController screen={screen} musicOn={musicOn} />
      <button onClick={() => setMusicOn(p => !p)} style={{position:"fixed",top:10,right:10,zIndex:200,padding:"6px 12px",borderRadius:20,border:"1px solid rgba(251,191,36,0.4)",background:"rgba(0,0,0,0.5)",color:musicOn?"#fbbf24":"#666",fontSize:"0.75rem",fontFamily:"'Fredoka',sans-serif",fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6,backdropFilter:"blur(4px)"}}><span style={{fontSize:"1rem"}}>{musicOn ? "🔊" : "🔇"}</span>{musicOn ? "Musique" : "Muet"}</button>

      {/* FR / EN language toggle */}
      <div style={{position:"fixed",top:10,left:10,zIndex:200,display:"flex",background:"rgba(0,0,0,0.5)",borderRadius:20,padding:3,border:"1px solid rgba(251,191,36,0.4)",backdropFilter:"blur(4px)"}}>
        {[
          { id:"fr", label:"🇫🇷 FR" },
          { id:"en", label:"🇬🇧 EN" },
        ].map(opt => {
          const active = lang === opt.id;
          return (
            <button key={opt.id}
              onClick={() => {
                if (lang === opt.id) return;
                setLang(opt.id); saveLang(opt.id);
                // If current dictée is not available in the target lang, fall back to La famille
                if (opt.id === "en" && !DICTEES_EN_ENABLED.has(selectedDictee)) {
                  setSelectedDictee(LATEST_DICTEE); saveSelectedDictee(LATEST_DICTEE);
                }
              }}
              style={{padding:"4px 10px",borderRadius:18,border:"none",
                background: active ? (opt.id==="en" ? "linear-gradient(135deg,#3b82f6,#1d4ed8)" : "linear-gradient(135deg,#f59e0b,#d97706)") : "transparent",
                color: active ? "#fff" : "#a3836a",
                fontSize:"0.75rem",fontWeight:700,fontFamily:"'Fredoka',sans-serif",cursor:"pointer",
                boxShadow: active ? "0 2px 0 rgba(0,0,0,0.25)" : "none",
                transition:"all 0.15s"
              }}>{opt.label}</button>
          );
        })}
      </div>

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
      {screen === "splash" && (
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:20,cursor:"pointer"}} onClick={() => setScreen("title")}>
          <div style={{maxWidth:500,width:"95%",marginBottom:20,borderRadius:16,overflow:"hidden",border:"3px solid #fbbf24",boxShadow:"0 8px 40px rgba(251,191,36,0.3)"}}>
            <img src="/START.png" alt="Aventure" style={{width:"100%",height:"auto",display:"block"}} />
          </div>
          <h1 style={{color:"#fbbf24",fontSize:"clamp(1.8rem,7vw,2.8rem)",textAlign:"center",textShadow:"0 2px 20px rgba(251,191,36,0.4)",marginBottom:6,lineHeight:1.2}}>Mots Jules Simon</h1>
          <p style={{color:"#d4a574",marginBottom:6,fontSize:"1.1rem"}}>L'Aventure des Mots de Léo</p>
          <p style={{color:"#a3836a",marginBottom:24,fontSize:"0.8rem"}}>Un jeu d'orthographe et d'aventure</p>
          <button style={{padding:"20px 48px",borderRadius:20,border:"none",background:"linear-gradient(135deg,#f59e0b,#d97706)",color:"#451a03",fontSize:"1.5rem",fontWeight:700,fontFamily:"'Fredoka',sans-serif",cursor:"pointer",boxShadow:"0 6px 0 #92400e,0 10px 40px rgba(245,158,11,0.3)",animation:"pulse 2s ease-in-out infinite"}}>
            ▶ Jouer
          </button>
          <p style={{color:"#6b5c4d",fontSize:"0.7rem",marginTop:16}}>Touche n'importe où pour commencer</p>
        </div>
      )}

      {screen === "title" && (
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:20,animation:"slideUp 0.8s ease-out"}}>
          <div style={{maxWidth:420,width:"90%",marginBottom:14,borderRadius:14,overflow:"hidden",border:"2px solid rgba(251,191,36,0.4)",boxShadow:"0 6px 30px rgba(251,191,36,0.2)"}}>
            <img src="/START.png" alt="Aventure" style={{width:"100%",height:"auto",display:"block"}} />
          </div>
          <h1 style={{color:"#fbbf24",fontSize:"clamp(1.6rem,6vw,2.4rem)",textAlign:"center",textShadow:"0 2px 20px rgba(251,191,36,0.4)",marginBottom:4,lineHeight:1.2}}>L'Aventure des Mots</h1>
          <p style={{color:"#d4a574",marginBottom:4,fontSize:"1rem"}}>de Léo l'Explorateur</p>
          {nextCreature && <p style={{color:"#a3836a",fontSize:"0.8rem",marginBottom:4}}>Prochaine créature : {nextCreature.emoji} dans {nextCreature.at - totalWins} mot{nextCreature.at-totalWins>1?"s":""}</p>}
<<<<<<< HEAD
          <p style={{color:"#6b5c4d",fontSize:"0.75rem",marginBottom:16}}>{totalWins} mots maîtrisés au total • {getUnlocked().size}/{CREATURES.length} créatures</p>

          {/* ── Sélecteur de dictée ── */}
          <div style={{width:"90%",maxWidth:380,marginBottom:16}}>
            <p style={{color:"#d4a574",fontSize:"0.8rem",marginBottom:8,textAlign:"center",fontWeight:600}}>📖 Choisir une dictée :</p>
            {/* Toutes les dictées */}
            <button
              onClick={()=>{setSelectedMode("all");setSelectedPackId(null);setPackEmptyWarning(false);}}
              style={{width:"100%",padding:"10px 14px",borderRadius:12,border:selectedMode==="all"?"2px solid #fbbf24":"1px solid rgba(251,191,36,0.3)",background:selectedMode==="all"?"rgba(251,191,36,0.15)":"transparent",color:selectedMode==="all"?"#fbbf24":"#d4a574",fontSize:"0.9rem",fontWeight:700,fontFamily:"'Fredoka',sans-serif",cursor:"pointer",marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"center",transition:"all 0.15s"}}
            >
              <span>📚 Toutes les dictées</span>
              <span style={{color:"#a3836a",fontSize:"0.75rem",fontWeight:400}}>{ALL_WORDS.length} mots</span>
            </button>
            {/* Liste des packs, du plus récent au plus ancien */}
            {[...WORD_PACKS].sort((a,b)=>b.order-a.order).map(pack=>{
              const isSelected = selectedMode==="dictation" && selectedPackId===pack.id;
              return (
                <button key={pack.id}
                  onClick={()=>{setSelectedMode("dictation");setSelectedPackId(pack.id);setPackEmptyWarning(false);}}
                  style={{width:"100%",padding:"10px 14px",borderRadius:12,border:isSelected?"2px solid #fbbf24":"1px solid rgba(251,191,36,0.2)",background:isSelected?"rgba(251,191,36,0.15)":"rgba(0,0,0,0.15)",color:isSelected?"#fbbf24":"#d4a574",fontSize:"0.9rem",fontWeight:isSelected?700:500,fontFamily:"'Fredoka',sans-serif",cursor:"pointer",marginBottom:5,display:"flex",justifyContent:"space-between",alignItems:"center",transition:"all 0.15s"}}
                >
                  <span>{isSelected?"▶ ":""}{pack.label}</span>
                  <span style={{color:"#a3836a",fontSize:"0.75rem",fontWeight:400}}>{pack.words.length} mots</span>
                </button>
=======
          <p style={{color:"#6b5c4d",fontSize:"0.75rem",marginBottom:20}}>{totalWins} mots maîtrisés au total • {getUnlocked().size}/{CREATURES.length} créatures</p>

          <div style={{width:"100%",maxWidth:440,marginBottom:18}}>
            <p style={{color:"#fbbf24",fontSize:"0.9rem",fontWeight:600,fontFamily:"'Fredoka',sans-serif",textAlign:"center",marginBottom:10}}>📖 Choisir une dictée :</p>
            {DICTEE_NAMES.map((name, idx) => {
              const isAll = name === "Toutes les dictées";
              const isLatest = name === LATEST_DICTEE;
              const stats = dicteeStats(name);
              const isSelected = selectedDictee === name;
              const isPerfect = stats.isPerfect;
              const ids = isAll ? new Set(ALL_WORDS.map(w => w.id)) : (DICTEES[name] || new Set());
              const todoCount = [...ids].filter(id => !mastered.has(id)).length;
              const todoToggle = !!onlyTodo[name];
              const isEnAvailable = lang !== "en" || isAll || DICTEES_EN_ENABLED.has(name);
              const disabledForLang = !isEnAvailable;

              return (
                <div key={name} style={{ marginBottom: 10, opacity: disabledForLang ? 0.45 : 1 }}>
                  <button
                    disabled={disabledForLang}
                    onClick={() => { if (disabledForLang) return; setSelectedDictee(name); saveSelectedDictee(name); }}
                    style={{
                      display:"flex",flexDirection:"column",alignItems:"stretch",gap:6,
                      width:"100%",padding: isLatest ? "14px 18px" : "10px 16px",borderRadius:12,
                      border: isPerfect
                        ? (isSelected ? "2px solid #22c55e" : "1px solid rgba(34,197,94,0.5)")
                        : (isSelected ? "2px solid #fbbf24" : "1px solid rgba(251,191,36,0.2)"),
                      background: isPerfect
                        ? "linear-gradient(135deg,rgba(34,197,94,0.18),rgba(22,163,74,0.10))"
                        : (isSelected ? "linear-gradient(135deg,rgba(245,158,11,0.25),rgba(217,119,6,0.15))" : "rgba(30,20,10,0.4)"),
                      color: isPerfect ? "#22c55e" : (isSelected ? "#fbbf24" : "#d4a574"),
                      fontSize: isLatest ? "1rem" : "0.9rem",fontWeight: (isSelected || isLatest) ? 700 : 500,
                      fontFamily:"'Fredoka',sans-serif",cursor:"pointer",
                      boxShadow: isSelected ? "0 2px 12px rgba(251,191,36,0.25)" : "none",
                      transition:"all 0.15s",textAlign:"left"
                    }}
                  >
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
                      <span style={{display:"flex",alignItems:"center",gap:6}}>
                        {isPerfect ? "🏆" : (isAll ? "📚" : "📑")}
                        <span>{name}</span>
                        {isLatest && !isPerfect && !disabledForLang && <span style={{fontSize:"0.65rem",background:"#ef4444",color:"#fff",padding:"2px 6px",borderRadius:8,fontWeight:700}}>📌 À TRAVAILLER</span>}
                        {isPerfect && <span style={{fontSize:"0.65rem",background:"#22c55e",color:"#fff",padding:"2px 6px",borderRadius:8,fontWeight:700}}>PARFAIT</span>}
                        {disabledForLang && <span style={{fontSize:"0.65rem",background:"#3b82f6",color:"#fff",padding:"2px 6px",borderRadius:8,fontWeight:700}}>🔒 EN bientôt</span>}
                      </span>
                      <span style={{fontSize:"0.78rem",opacity:0.85,whiteSpace:"nowrap"}}>{stats.done}/{stats.total}</span>
                    </div>
                    {/* Mastery progress bar */}
                    <div style={{width:"100%",height:6,background:"rgba(0,0,0,0.35)",borderRadius:4,overflow:"hidden"}}>
                      <div style={{
                        width: `${stats.total ? (stats.done / stats.total) * 100 : 0}%`,
                        height:"100%",
                        background: isPerfect ? "linear-gradient(90deg,#22c55e,#16a34a)" : "linear-gradient(90deg,#fbbf24,#f59e0b)",
                        transition:"width 0.4s"
                      }} />
                    </div>
                  </button>
                  {/* Todo toggle (only when this dictée is selected and there's something to retrain) */}
                  {isSelected && todoCount > 0 && todoCount < stats.total && (
                    <button
                      onClick={() => {
                        const next = { ...onlyTodo, [name]: !todoToggle };
                        setOnlyTodo(next); saveOnlyTodo(next);
                      }}
                      style={{
                        marginTop:6,marginLeft:6,padding:"5px 10px",borderRadius:8,
                        border: todoToggle ? "1px solid #ef4444" : "1px solid rgba(239,68,68,0.3)",
                        background: todoToggle ? "rgba(239,68,68,0.18)" : "transparent",
                        color: todoToggle ? "#ef4444" : "#a3836a",
                        fontSize:"0.72rem",fontWeight:600,fontFamily:"'Fredoka',sans-serif",cursor:"pointer"
                      }}
                    >
                      {todoToggle ? "✓ " : ""}🔁 Seulement à retravailler ({todoCount} mot{todoCount>1?"s":""})
                    </button>
                  )}
                </div>
>>>>>>> 5a324b0 (go)
              );
            })}
          </div>

<<<<<<< HEAD
          {/* Avertissement dictée vide */}
          {packEmptyWarning && (
            <div style={{width:"90%",maxWidth:380,marginBottom:12,padding:"10px 14px",borderRadius:10,background:"rgba(239,68,68,0.15)",border:"1px solid rgba(239,68,68,0.4)",textAlign:"center"}}>
              <p style={{color:"#fca5a5",fontSize:"0.85rem",margin:0}}>⚠️ Tous les mots de cette dictée sont désactivés.<br/>Active des mots dans ⚙️ Mes mots, ou choisis une autre dictée.</p>
            </div>
          )}

=======
>>>>>>> 5a324b0 (go)
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

          {showMap && (() => {
            const zoneStart = Math.max(0, currentIdx - 4);
            const zoneWords = wordQueue.slice(zoneStart, currentIdx + 1);
            return (
            <div style={{animation:"slideUp 0.5s ease-out",background:"linear-gradient(135deg,rgba(251,191,36,0.15),rgba(34,197,94,0.1))",borderRadius:16,padding:24,textAlign:"center",border:"1px solid rgba(251,191,36,0.3)",marginBottom:16}}>
              <div style={{fontSize:"2.5rem",marginBottom:8}}>🏕️</div>
              <h3 style={{color:"#fbbf24",marginBottom:4,fontSize:"1.1rem"}}>Zone conquise !</h3>
              <p style={{color:"#d4a574",marginBottom:4,fontSize:"0.9rem"}}>Tu as traversé la <strong>{zones[zoneIdx]}</strong></p>
              <p style={{color:"#22c55e",marginBottom:10,fontSize:"0.85rem"}}>{wordsLearned.size} mots appris • ⭐ {score}</p>
              <div style={{background:"rgba(0,0,0,0.2)",borderRadius:12,padding:"12px 16px",marginBottom:14,textAlign:"left"}}>
                <p style={{color:"#fbbf24",fontSize:"0.8rem",fontWeight:600,marginBottom:8,textAlign:"center"}}>📚 Mots de cette zone :</p>
                {zoneWords.map((w, i) => (
                  <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                    <span style={{color:"#22c55e",fontSize:"0.9rem"}}>✓</span>
                    <span style={{color:"#fff",fontSize:"0.9rem",fontWeight:600}}>{w.word}</span>
                    <span style={{color:"#a3836a",fontSize:"0.75rem",fontStyle:"italic"}}>— {w.hint}</span>
                  </div>
                ))}
              </div>
              <button onClick={()=>nextWord()} style={{padding:"12px 28px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#f59e0b,#d97706)",color:"#451a03",fontWeight:700,fontSize:"1rem",fontFamily:"'Fredoka',sans-serif",cursor:"pointer",boxShadow:"0 3px 0 #92400e"}}>Continuer →</button>
            </div>
            );
          })()}

          {showFullMap ? (
            <MapView currentWaypoint={mapWaypoint} completedWaypoints={completedWaypoints} onContinue={() => setShowFullMap(false)} isPreBoss={bossWord !== null} />
          ) : !showMap && (
            <div style={{background:isBoss?"linear-gradient(135deg,rgba(239,68,68,0.2),rgba(120,53,15,0.4))":"linear-gradient(135deg,rgba(120,53,15,0.4),rgba(30,20,10,0.6))",borderRadius:20,padding:"24px 18px",border:isBoss?"1px solid rgba(239,68,68,0.4)":"1px solid rgba(251,191,36,0.2)",animation:isBoss?"bossGlow 2s ease-in-out infinite":"slideUp 0.4s ease-out"}}>
              {gameType==="scramble"&&<ScrambleGame key={currentIdx+"-s-"+lang} wordObj={localizeWord(currentWord, lang)} onWin={handleWin} onFail={handleFail} score={score} onSpend={handleSpend} voiceLang={voiceLang}/>}
              {gameType==="write"&&<WriteGame key={currentIdx+"-w-"+lang} wordObj={localizeWord(currentWord, lang)} onWin={handleWin} onFail={handleFail} score={score} onSpend={handleSpend} voiceLang={voiceLang}/>}
              {gameType==="listen"&&<ListenGame key={currentIdx+"-l-"+lang} wordObj={localizeWord(currentWord, lang)} onWin={handleWin} onFail={handleFail} score={score} onSpend={handleSpend} voiceLang={voiceLang}/>}
              {gameType==="hangman"&&<HangmanGame key={currentIdx+"-h"+(bossWord?"-boss":"")+"-"+lang} wordObj={localizeWord(currentWord, lang)} onWin={handleWin} onFail={handleFail} score={score} onSpend={handleSpend} isBoss={isBoss} voiceLang={voiceLang}/>}
            </div>
          )}
        </div>
      )}

      {/* VICTORY */}
      {screen === "victory" && (() => {
        // Build mastered/todo word lists from sessionPlayedWords + sessionResults
        const seenIds = new Set();
        const playedUnique = sessionPlayedWords.filter(w => {
          if (seenIds.has(w.id)) return false;
          seenIds.add(w.id); return true;
        });
        const masteredList = playedUnique.filter(w => sessionResults[w.id] === "mastered");
        const todoList = playedUnique.filter(w => sessionResults[w.id] !== "mastered");
        const stats = dicteeStats(selectedDictee);
        const isPerfectNow = !!justPerfectedDictee;
        return (
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-start",minHeight:"100vh",padding:20,paddingTop:30,animation:"slideUp 0.8s ease-out",position:"relative"}}>
          <Fireworks onDone={() => {}} />
          {isPerfectNow && <Fireworks onDone={() => {}} />}
          <div style={{fontSize:"3.5rem",marginBottom:6,animation:"float 2s ease-in-out infinite"}}>{isPerfectNow ? "🏆" : "🎉"}</div>
          <h2 style={{color:"#fbbf24",fontSize:"1.6rem",textShadow:"0 2px 15px rgba(251,191,36,0.4)",marginBottom:6,textAlign:"center"}}>
            {isPerfectNow ? `Dictée « ${selectedDictee} » parfaite !` : "Aventure terminée !"}
          </h2>
          {isPerfectNow && <p style={{color:"#22c55e",fontSize:"0.95rem",fontWeight:600,marginBottom:14,textAlign:"center"}}>✨ Tous les mots maîtrisés du premier coup ! ✨</p>}

          <div style={{background:"rgba(0,0,0,0.3)",borderRadius:14,padding:"14px 24px",marginBottom:14,border:"1px solid rgba(251,191,36,0.2)",textAlign:"center"}}>
            <div style={{color:"#fbbf24",fontSize:"1.7rem",fontWeight:700,marginBottom:4}}>⭐ {score}</div>
            <div style={{color:"#22c55e",fontSize:"0.85rem"}}>🔥 Meilleure série : {maxStreak}</div>
            <div style={{color:"#a3836a",fontSize:"0.8rem",marginTop:4}}>Dictée « {selectedDictee} » : {stats.done}/{stats.total} mots maîtrisés</div>
          </div>

          {masteredList.length > 0 && (
            <div style={{background:"rgba(34,197,94,0.08)",borderRadius:12,padding:"12px 14px",marginBottom:10,width:"95%",maxWidth:440,border:"1px solid rgba(34,197,94,0.3)"}}>
              <p style={{color:"#22c55e",fontSize:"0.9rem",fontWeight:600,marginBottom:8,textAlign:"center"}}>✅ Maîtrisés du premier coup ({masteredList.length})</p>
              <div style={{maxHeight:140,overflowY:"auto"}}>
                {masteredList.map(w => (
                  <div key={w.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                    <span style={{color:"#22c55e",fontSize:"0.85rem"}}>✓</span>
                    <span style={{color:"#fff",fontSize:"0.85rem",fontWeight:600}}>{w.prefix||""}{w.word}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {todoList.length > 0 && (
            <div style={{background:"rgba(239,68,68,0.08)",borderRadius:12,padding:"12px 14px",marginBottom:14,width:"95%",maxWidth:440,border:"1px solid rgba(239,68,68,0.3)"}}>
              <p style={{color:"#ef4444",fontSize:"0.9rem",fontWeight:600,marginBottom:8,textAlign:"center"}}>� À retravailler ({todoList.length})</p>
              <div style={{maxHeight:140,overflowY:"auto"}}>
                {todoList.map(w => (
                  <div key={w.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                    <span style={{color:"#ef4444",fontSize:"0.85rem"}}>✗</span>
                    <span style={{color:"#fff",fontSize:"0.85rem",fontWeight:600}}>{w.prefix||""}{w.word}</span>
                    <span style={{color:"#a3836a",fontSize:"0.7rem",fontStyle:"italic",marginLeft:"auto"}}>— {w.hint}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center",marginBottom:8}}>
            {todoList.length > 0 && (
              <button onClick={startGameTodoOnly} style={{padding:"12px 22px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#ef4444,#dc2626)",color:"#fff",fontSize:"0.95rem",fontWeight:700,fontFamily:"'Fredoka',sans-serif",cursor:"pointer",boxShadow:"0 4px 0 #991b1b"}}>🔁 Rejouer les mots à retravailler</button>
            )}
            <button onClick={startGame} style={{padding:"12px 22px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#f59e0b,#d97706)",color:"#451a03",fontSize:"0.95rem",fontWeight:700,fontFamily:"'Fredoka',sans-serif",cursor:"pointer",boxShadow:"0 4px 0 #92400e"}}>🗺️ Nouvelle aventure</button>
            <button onClick={() => setScreen("title")} style={{padding:"12px 22px",borderRadius:12,border:"1px solid rgba(251,191,36,0.4)",background:"transparent",color:"#fbbf24",fontSize:"0.9rem",fontWeight:600,fontFamily:"'Fredoka',sans-serif",cursor:"pointer"}}>🏠 Retour</button>
          </div>
        </div>
        );
      })()}

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
