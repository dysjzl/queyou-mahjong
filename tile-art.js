// Original vector artwork for the three numbered suits. No fonts or image files.
// Tile values follow the rules engine: 0–8 characters, 9–17 circles, 18–26 bamboo.
let drawingId = 0;

const numerals = [
  'M12 23C25 22 39 21 53 19',
  'M19 12L47 11M12 31L54 29',
  'M17 8L48 7M21 20L46 19M11 33L54 31',
  'M13 7H52V33H13ZM25 8V17Q25 23 19 26M39 8V23H46',
  'M16 7H49M30 8L25 32M18 19H44L42 32M11 33H54',
  'M29 5L35 10M12 16H53M25 23Q20 31 13 35M40 23L52 35',
  'M12 19L53 12M31 5V29Q31 35 39 34H51',
  'M26 8Q25 25 13 35M39 8Q41 27 53 35',
  'M16 15H44L41 29Q40 36 48 35H54M28 5L26 19Q23 30 13 35'
];

// 萬: hand-drawn strokes keep the traditional face legible at every tile size.
const character = 'M13 9H52M24 4V14M42 4V14M20 17H46V34H20ZM21 25H45M33 18V52M14 39H52V55Q52 58 45 56M14 39V55M24 51H43M41 45L46 52';

const circleLayouts = {
  2: [[32,24,12,'b'],[32,64,12,'b']],
  3: [[16,22,10,'b'],[32,44,10,'r'],[48,66,10,'g']],
  4: [[18,25,10,'b'],[46,25,10,'b'],[18,63,10,'b'],[46,63,10,'b']],
  5: [[17,23,9,'b'],[47,23,9,'b'],[32,44,9,'r'],[17,65,9,'b'],[47,65,9,'b']],
  6: [[18,21,9.5,'b'],[46,21,9.5,'b'],[18,44,9.5,'g'],[46,44,9.5,'g'],[18,67,9.5,'g'],[46,67,9.5,'g']],
  7: [[16,17,8,'r'],[32,28,8,'r'],[48,39,8,'r'],[18,55,9,'g'],[46,55,9,'g'],[18,75,9,'g'],[46,75,9,'g']],
  8: [[18,15,8.5,'b'],[46,15,8.5,'b'],[18,34,8.5,'b'],[46,34,8.5,'b'],[18,54,8.5,'b'],[46,54,8.5,'b'],[18,73,8.5,'b'],[46,73,8.5,'b']],
  9: [[15,20,7.6,'b'],[32,20,7.6,'b'],[49,20,7.6,'b'],[15,44,7.6,'r'],[32,44,7.6,'r'],[49,44,7.6,'r'],[15,68,7.6,'g'],[32,68,7.6,'g'],[49,68,7.6,'g']]
};

const bambooLayouts = {
  2: [[20,44,48,9,0,'g'],[44,44,48,9,0,'g']],
  3: [[32,23,29,9,0,'g'],[18,62,29,9,0,'g'],[46,62,29,9,0,'g']],
  4: [[19,24,29,9,0,'g'],[45,24,29,9,0,'g'],[19,64,29,9,0,'g'],[45,64,29,9,0,'g']],
  5: [[17,23,28,8,0,'g'],[47,23,28,8,0,'g'],[32,44,28,8,0,'r'],[17,65,28,8,0,'g'],[47,65,28,8,0,'g']],
  6: [[16,24,30,8,0,'g'],[32,24,30,8,0,'g'],[48,24,30,8,0,'g'],[16,64,30,8,0,'g'],[32,64,30,8,0,'g'],[48,64,30,8,0,'g']],
  7: [[32,15,21,8,0,'r'],[16,42,23,8,0,'g'],[32,42,23,8,0,'g'],[48,42,23,8,0,'g'],[16,70,23,8,0,'g'],[32,70,23,8,0,'g'],[48,70,23,8,0,'g']],
  8: [[16,23,29,7,-22,'g'],[27,28,29,7,22,'g'],[38,28,29,7,-22,'g'],[49,23,29,7,22,'g'],[16,65,29,7,22,'g'],[27,60,29,7,-22,'g'],[38,60,29,7,22,'g'],[49,65,29,7,-22,'g']],
  9: [[15,17,23,7.5,0,'g'],[32,17,23,7.5,0,'r'],[49,17,23,7.5,0,'g'],[15,44,23,7.5,0,'g'],[32,44,23,7.5,0,'r'],[49,44,23,7.5,0,'g'],[15,71,23,7.5,0,'g'],[32,71,23,7.5,0,'r'],[49,71,23,7.5,0,'g']]
};

function definitions(id) {
  return `<defs>
    <radialGradient id="${id}b" cx="35%" cy="25%" r="80%"><stop stop-color="#5c9be3"/><stop offset=".38" stop-color="#245dc0"/><stop offset="1" stop-color="#123a88"/></radialGradient>
    <radialGradient id="${id}g" cx="35%" cy="25%" r="80%"><stop stop-color="#49bd7f"/><stop offset=".4" stop-color="#168d50"/><stop offset="1" stop-color="#066130"/></radialGradient>
    <radialGradient id="${id}r" cx="35%" cy="25%" r="80%"><stop stop-color="#f66b53"/><stop offset=".4" stop-color="#d62d23"/><stop offset="1" stop-color="#991a1a"/></radialGradient>
    <linearGradient id="${id}stemg" x2="1" y2="0"><stop stop-color="#075c2a"/><stop offset=".28" stop-color="#1baf4b"/><stop offset=".52" stop-color="#45c86a"/><stop offset=".76" stop-color="#14913e"/><stop offset="1" stop-color="#05602e"/></linearGradient>
    <linearGradient id="${id}stemr" x2="1" y2="0"><stop stop-color="#951d1d"/><stop offset=".35" stop-color="#f04b39"/><stop offset=".6" stop-color="#ed7660"/><stop offset="1" stop-color="#b32121"/></linearGradient>
  </defs>`;
}

function pip(id,[x,y,r,color]) {
  const edge={b:'#123a86',g:'#075f35',r:'#a31c1b'}[color];
  return `<g transform="translate(${x} ${y})"><circle r="${r}" fill="url(#${id}${color})" stroke="${edge}" stroke-width="1"/><circle r="${r*.68}" fill="#fffef2" stroke="#fff" stroke-opacity=".65" stroke-width=".8"/><circle r="${r*.38}" fill="url(#${id}${color})"/><path d="M${-r*.65} ${-r*.3}A${r*.72} ${r*.72} 0 0 1 ${r*.12} ${-r*.7}" fill="none" stroke="#fff" stroke-width="1" stroke-opacity=".6" stroke-linecap="round"/></g>`;
}

function oneCircle(id) {
  const petals=Array.from({length:8},(_,i)=>`<ellipse cx="32" cy="36" rx="2.2" ry="5.5" transform="rotate(${i*45} 32 44)" fill="#0d9259"/>`).join('');
  return `<g><circle cx="32" cy="44" r="22" fill="url(#${id}b)" stroke="#103f8c" stroke-width="1.2"/><circle cx="32" cy="44" r="18" fill="#fffef2"/><circle cx="32" cy="44" r="15" fill="none" stroke="#188b52" stroke-width="2.4"/>${petals}<circle cx="32" cy="44" r="5.7" fill="url(#${id}r)"/><circle cx="32" cy="44" r="2.4" fill="#fff9e6"/><path d="M15 34A20 20 0 0 1 37 25" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.6" stroke-linecap="round"/></g>`;
}

function stem(id,[x,y,h,w,angle,color]) {
  const dark=color==='r'?'#9f2720':'#05652c',light=color==='r'?'#ffc7b0':'#adf2ac';
  return `<g transform="translate(${x} ${y}) rotate(${angle})"><rect x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" rx="${w*.27}" fill="url(#${id}stem${color})" stroke="${dark}" stroke-width="1.1"/><path d="M${-w/2-.5} ${-h/6}H${w/2+.5}M${-w/2-.5} ${h/6}H${w/2+.5}" fill="none" stroke="${dark}" stroke-width="2.8" stroke-linecap="round"/><path d="M${-w/2} ${-h/6-.9}H${w/2}M${-w/2} ${h/6-.9}H${w/2}" fill="none" stroke="${light}" stroke-width=".85"/><path d="M${-w*.16} ${-h/2+3}V${-h/6-3}M${-w*.16} ${-h/6+3}V${h/6-3}M${-w*.16} ${h/6+3}V${h/2-3}" stroke="#fff" stroke-width="1.1" stroke-opacity=".42" stroke-linecap="round"/></g>`;
}

function sparrow(id) {
  return `<g stroke-linejoin="round" stroke-linecap="round">
    <path d="M26 47C19 53 14 63 9 78C17 75 25 65 29 53Z" fill="#06733c" stroke="#075a33" stroke-width="1.2"/>
    <path d="M25 53C21 62 18 72 18 81C24 76 28 66 30 55Z" fill="#1baa54" stroke="#086a36" stroke-width="1.1"/>
    <path d="M24 50C17 53 12 59 8 69C15 66 24 60 29 52Z" fill="#2676af" stroke="#135985" stroke-width="1.1"/>
    <path d="M28 54L34 69L42 73M36 54L42 65L50 65M35 69L32 74M43 65L45 71" fill="none" stroke="#c94727" stroke-width="2.1"/>
    <path d="M22 36C28 31 35 34 40 37C44 27 35 23 36 18C36 12 44 11 47 17C51 25 44 31 45 40C47 49 40 58 31 58C20 58 15 46 22 36Z" fill="url(#${id}g)" stroke="#086536" stroke-width="1.5"/>
    <path d="M23 39C29 37 38 41 39 48C35 53 28 53 23 48C20 45 21 41 23 39Z" fill="#2c78a8" stroke="#135d83" stroke-width="1.1"/>
    <path d="M25 42L34 48M24 46L30 50" fill="none" stroke="#80bdc9" stroke-width="1.1"/>
    <path d="M37 14L37 8L41 12L44 6L46 13" fill="#db3028" stroke="#ad2921" stroke-width="1.1"/>
    <path d="M47 18L55 21L48 24Z" fill="#e2532d" stroke="#b23b21" stroke-width=".8"/>
    <path d="M45 25Q49 28 45 32Q42 29 43 26" fill="#d83928"/>
    <circle cx="44" cy="18" r="1.65" fill="#17252c"/><circle cx="44.4" cy="17.5" r=".55" fill="#fff"/>
    <path d="M25 34Q28 32 31 34M37 36Q40 32 40 28" fill="none" stroke="#a0dfa4" stroke-width="1.2"/>
  </g>`;
}

/** Render a traditional, font-independent mahjong face as an inline SVG. */
export function renderTileFace(tile) {
  if(!Number.isInteger(tile)||tile<0||tile>26)return '';
  const suit=Math.floor(tile/9),number=tile%9+1,id=`qyt${++drawingId}-`;
  let face;
  if(suit===0){
    face=`<g fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="${numerals[number-1]}" transform="translate(0 3)" stroke="#172b40" stroke-width="4.6"/><path d="${character}" transform="translate(0 36) scale(1 .76)" stroke="#ce2424" stroke-width="3.65"/></g>`;
  }else if(suit===1){
    face=number===1?oneCircle(id):circleLayouts[number].map(p=>pip(id,p)).join('');
  }else{
    face=number===1?sparrow(id):bambooLayouts[number].map(p=>stem(id,p)).join('');
  }
  return `<svg class="tile-art tile-art-${['characters','circles','bamboo'][suit]}" viewBox="0 0 64 88" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">${definitions(id)}${face}</svg>`;
}
