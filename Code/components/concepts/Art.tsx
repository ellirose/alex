import { useId, type CSSProperties } from 'react';
import { mulberry32 } from '@/lib/random';

/** Original concept artwork, drawn as SVG. Every brand here is fictional. */

const DISPLAY: CSSProperties = { fontFamily: 'var(--font-fraunces), Georgia, serif' };
const SANS: CSSProperties = { fontFamily: 'var(--font-manrope), system-ui, sans-serif' };
const svgProps = { className: 'block h-full w-full', 'aria-hidden': true } as const;

/* 1 — Cobre & Costa: coffee roaster identity board */
export function CobreCosta() {
  const teal = '#1F5560';
  const copper = '#C46A3C';
  const cream = '#F8F1E4';
  const wave = (y: number) => `M-30 ${y} q7.5 -9 15 0 t15 0 t15 0 t15 0`;
  const swatches = ['#1F5560', '#C46A3C', '#E8B04A', '#E9DECB'];
  return (
    <svg viewBox="0 0 400 300" {...svgProps}>
      <rect width="400" height="300" fill="#E9DECB" />
      <rect x="14" y="14" width="204" height="184" rx="16" fill={cream} />
      <g transform="translate(116 90)">
        <circle r="46" fill="none" stroke={copper} strokeWidth="5" />
        <circle r="38" fill="none" stroke={copper} strokeWidth="1.2" strokeDasharray="2 4" />
        <g transform="rotate(28 0 -12)">
          <ellipse cx="0" cy="-12" rx="10" ry="15" fill={copper} />
          <path d="M-1.5 -25Q5 -12 -1.5 1" stroke={cream} strokeWidth="2.4" fill="none" strokeLinecap="round" />
        </g>
        <path d={wave(12)} stroke={teal} strokeWidth="4.5" fill="none" strokeLinecap="round" />
        <path d={wave(24)} stroke={teal} strokeWidth="4.5" fill="none" strokeLinecap="round" />
      </g>
      <text x="116" y="164" textAnchor="middle" fontSize="19" fontWeight="600" fill={teal} style={DISPLAY}>
        {'Cobre & Costa'}
      </text>
      <text x="116" y="181" textAnchor="middle" fontSize="6.5" fontWeight="800" letterSpacing="2.6" fill={copper} style={SANS}>
        TOSTADORES · VALPARAÍSO
      </text>

      <rect x="228" y="14" width="158" height="130" rx="16" fill={teal} />
      <circle cx="372" cy="30" r="44" fill="#24626E" />
      <path d="M276 36h62l7 96h-76z" fill={cream} />
      <path d="M276 36h62l1.5 14h-65z" fill="#E4D3B8" />
      <circle cx="307" cy="86" r="14" fill="none" stroke={copper} strokeWidth="3" />
      <path d="M298 90q4.5-5 9 0t9 0" stroke={teal} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <text x="307" y="119" textAnchor="middle" fontSize="6" fontWeight="800" letterSpacing="0.8" fill={teal} style={SANS}>
        ESPRESSO 250 G
      </text>

      <rect x="228" y="156" width="158" height="130" rx="16" fill={copper} />
      <path d="M250 196h46l-6 70h-34z" fill={cream} />
      <rect x="246" y="187" width="54" height="11" rx="5" fill={teal} />
      <path d="M252.5 214h41l-1.4 20h-38.2z" fill={teal} />
      <path d="M261 225q3-4 6 0t6 0t6 0t6 0" stroke={cream} strokeWidth="2" fill="none" strokeLinecap="round" />
      <g transform="rotate(-10 345 228)">
        <rect x="310" y="205" width="70" height="44" rx="5" fill={cream} />
        <circle cx="324" cy="219" r="6" fill="none" stroke={copper} strokeWidth="2" />
        <rect x="316" y="232" width="40" height="3" rx="1.5" fill={teal} />
        <rect x="316" y="239" width="26" height="3" rx="1.5" fill="#C9B79C" />
      </g>

      <rect x="14" y="210" width="204" height="76" rx="16" fill={cream} />
      {swatches.map((c, i) => (
        <g key={c}>
          <circle cx={48 + i * 46} cy="240" r="17" fill={c} stroke={i === 3 ? '#CDBB9F' : 'none'} />
          <text x={48 + i * 46} y="273" textAnchor="middle" fontSize="6" fontWeight="700" fill="#6B5B48" style={SANS}>
            {c}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* 2 — Andes Outfitters: emblem & logo suite */
export function AndesOutfitters() {
  const id = useId().replace(/:/g, '');
  const green = '#2F4A3A';
  const cream = '#F6EFE2';
  const rust = '#B9572F';
  return (
    <svg viewBox="0 0 400 300" {...svgProps}>
      <defs>
        <path id={`ring-${id}`} d="M119,140 m-70,0 a70,70 0 1,1 140,0 a70,70 0 1,1 -140,0" />
        <clipPath id={`disc-${id}`}>
          <circle cx="119" cy="140" r="58" />
        </clipPath>
      </defs>
      <rect width="400" height="300" fill="#F1EADF" />
      <rect x="14" y="14" width="210" height="272" rx="16" fill={green} />
      <circle cx="119" cy="140" r="84" fill="none" stroke={cream} strokeWidth="2.5" />
      <text fontSize="10.5" fontWeight="800" fill={cream} style={SANS}>
        <textPath href={`#ring-${id}`} textLength="430" lengthAdjust="spacing">
          ANDES OUTFITTERS • SANTIAGO • EST. 2026 •
        </textPath>
      </text>
      <circle cx="119" cy="140" r="58" fill={cream} />
      <g clipPath={`url(#disc-${id})`}>
        <circle cx="146" cy="116" r="10" fill="#E8B04A" />
        <polygon points="55,176 92,122 110,142 134,104 185,176" fill="#7F9A86" />
        <polygon points="134,104 142,116 137,114 134,118 130,114 126,117" fill={cream} />
        <polygon points="92,122 99,132 95,131 92,134 89,131 86,132" fill={cream} />
        <polygon points="55,200 98,138 124,166 150,140 185,200" fill={green} />
        <path d="M80 186q20-10 40 0t40 0" stroke={cream} strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>

      <text x="244" y="64" fontSize="36" fontWeight="600" fill={green} style={DISPLAY}>
        Andes
      </text>
      <text x="246" y="82" fontSize="9" fontWeight="800" letterSpacing="4.4" fill={rust} style={SANS}>
        OUTFITTERS
      </text>
      <line x1="244" y1="100" x2="386" y2="100" stroke={green} strokeOpacity=".25" strokeDasharray="3 4" />

      <circle cx="266" cy="146" r="22" fill={green} />
      <text x="266" y="152" textAnchor="middle" fontSize="16" fontWeight="600" fill={cream} style={DISPLAY}>
        AO
      </text>
      <rect x="296" y="124" width="44" height="44" rx="11" fill={rust} />
      <polygon points="303,160 314,140 320,148 327,136 334,160" fill={cream} />
      <path d="M350 126h34v22q0 15-17 23q-17-8-17-23z" fill="none" stroke={green} strokeWidth="3" />
      <polygon points="356,156 364,143 368,148 373,140 380,156" fill={green} />

      {[green, rust, '#E8B04A', '#7F9A86'].map((c, i) => (
        <rect key={c} x={244 + i * 37} y="204" width="31" height="60" rx="9" fill={c} />
      ))}
      <text x="244" y="282" fontSize="6.5" fontWeight="700" letterSpacing="1.6" fill="#6E6A5E" style={SANS}>
        BOSQUE · ÓXIDO · SOL · LIQUEN
      </text>
    </svg>
  );
}

/* 3 — Ruta: Patagonia trip-planner app */
export function RutaApp() {
  const id = useId().replace(/:/g, '');
  const ink = '#1E2B3A';
  return (
    <svg viewBox="0 0 400 300" {...svgProps}>
      <defs>
        <clipPath id={`scr-${id}`}>
          <rect x="84" y="34" width="112" height="238" rx="19" />
        </clipPath>
      </defs>
      <rect width="400" height="300" fill="#CFE3E6" />
      <circle cx="340" cy="34" r="96" fill="#BDD8DC" />
      <circle cx="30" cy="290" r="76" fill="#BDD8DC" />

      <g transform="rotate(-5 140 150)">
        <rect x="78" y="28" width="124" height="250" rx="24" fill={ink} />
        <rect x="84" y="34" width="112" height="238" rx="19" fill="#F7F3EA" />
        <g clipPath={`url(#scr-${id})`}>
          {[70, 96, 122, 148, 174].map((y, i) => (
            <path key={y} d={`M70 ${y}q30-${14 + i * 2} 64 4t76-6`} stroke="#BFD6DA" strokeWidth="1.4" fill="none" />
          ))}
          <ellipse cx="158" cy="112" rx="22" ry="11" fill="#A6CDD3" />
          <path d="M102 182C118 160 108 140 138 130S170 92 176 72" stroke="#C46A3C" strokeWidth="3.4" fill="none" strokeLinecap="round" />
          <path d="M102 182C118 160 108 140 138 130S170 92 176 72" stroke="#fff" strokeWidth="1.2" strokeDasharray="2 5" fill="none" />
          <circle cx="102" cy="182" r="5.5" fill="#2A7C8E" stroke="#fff" strokeWidth="2" />
          <path d="M176 58a8 8 0 0 1 8 8c0 6-8 14-8 14s-8-8-8-14a8 8 0 0 1 8-8z" fill="#D9705C" />
          <circle cx="176" cy="66" r="3" fill="#fff" />
          <rect x="90" y="198" width="100" height="66" rx="12" fill="#fff" stroke="#E6DED0" />
          <text x="98" y="216" fontSize="9" fontWeight="800" fill={ink} style={SANS}>
            Torres del Paine
          </text>
          <text x="98" y="228" fontSize="7" fontWeight="600" fill="#4A5868" style={SANS}>
            4 días · 72 km
          </text>
          <rect x="98" y="238" width="84" height="18" rx="9" fill="#C46A3C" />
          <text x="140" y="250" textAnchor="middle" fontSize="7.5" fontWeight="800" fill="#fff" style={SANS}>
            Iniciar ruta
          </text>
        </g>
        <rect x="122" y="40" width="36" height="7" rx="3.5" fill={ink} />
      </g>

      <g transform="rotate(6 280 160)">
        <rect x="218" y="40" width="124" height="250" rx="24" fill={ink} />
        <rect x="224" y="46" width="112" height="238" rx="19" fill="#FFFDF8" />
        <text x="234" y="80" fontSize="14" fontWeight="600" fill={ink} style={DISPLAY}>
          Mis rutas
        </text>
        <rect x="234" y="88" width="30" height="10" rx="5" fill={ink} />
        <rect x="268" y="88" width="30" height="10" rx="5" fill="#EFE5D3" />
        {[
          { c: '#2A7C8E', p: 0.8 },
          { c: '#D9705C', p: 0.45 },
          { c: '#E9B23C', p: 1 },
        ].map((card, i) => {
          const y = 106 + i * 56;
          return (
            <g key={i}>
              <rect x="232" y={y} width="96" height="48" rx="10" fill="#F3ECE0" />
              <rect x="238" y={y + 6} width="36" height="36" rx="8" fill={card.c} />
              <polygon points={`${242},${y + 36} ${251},${y + 20} ${256},${y + 27} ${262},${y + 17} ${270},${y + 36}`} fill="#fff" fillOpacity=".85" />
              <rect x="280" y={y + 11} width="40" height="5" rx="2.5" fill={ink} />
              <rect x="280" y={y + 20} width="28" height="4" rx="2" fill="#8C98A6" />
              <rect x="280" y={y + 32} width="40" height="4" rx="2" fill="#E3D7C4" />
              <rect x="280" y={y + 32} width={40 * card.p} height="4" rx="2" fill="#C46A3C" />
            </g>
          );
        })}
        <rect x="246" y="270" width="68" height="4" rx="2" fill={ink} fillOpacity=".25" />
      </g>
    </svg>
  );
}

/* 4 — Mercado Puerto: harbor food-market landing page */
const TOWN = (() => {
  const rand = mulberry32(9);
  const colors = ['#D9705C', '#E9B23C', '#2A7C8E', '#9FB4CC', '#EBC3AB', '#FFFDF8', '#BC5C33'];
  const out: { x: number; y: number; w: number; h: number; c: string }[] = [];
  for (let row = 0; row < 5; row++) {
    let x = 200;
    while (x < 366) {
      const w = 10 + rand() * 9;
      out.push({ x, y: 104 + row * 12 + rand() * 3 - Math.sin((x - 200) / 40) * 10, w, h: 9 + rand() * 9, c: colors[Math.floor(rand() * colors.length)] });
      x += w + 1;
    }
  }
  return out;
})();

export function MercadoPuerto() {
  const id = useId().replace(/:/g, '');
  const ink = '#1E2B3A';
  return (
    <svg viewBox="0 0 400 300" {...svgProps}>
      <defs>
        <clipPath id={`hero-${id}`}>
          <rect x="200" y="54" width="166" height="128" rx="12" />
        </clipPath>
      </defs>
      <rect width="400" height="300" fill="#F6E0AE" />
      <rect x="18" y="18" width="364" height="264" rx="14" fill="#FFFDF8" />
      <path d="M32 18h336a14 14 0 0 1 14 14v8H18v-8a14 14 0 0 1 14-14z" fill="#EFE5D3" />
      {['#D9705C', '#E9B23C', '#2A7C8E'].map((c, i) => (
        <circle key={c} cx={32 + i * 10} cy="29" r="3" fill={c} />
      ))}
      <rect x="150" y="24" width="100" height="10" rx="5" fill="#FFFDF8" />

      <text x="34" y="62" fontSize="11" fontWeight="600" fill={ink} style={DISPLAY}>
        Mercado Puerto
      </text>
      {[0, 1, 2].map((i) => (
        <rect key={i} x={232 + i * 30} y="56" width="22" height="4" rx="2" fill="#8C98A6" />
      ))}
      <circle cx="356" cy="58" r="7" fill={ink} />

      <text x="34" y="106" fontSize="28" fontWeight="600" fill={ink} style={DISPLAY}>
        Sabores
      </text>
      <text x="34" y="136" fontSize="28" fontWeight="500" fontStyle="italic" fill="#BC5C33" style={DISPLAY}>
        del puerto.
      </text>
      <rect x="34" y="148" width="130" height="4" rx="2" fill="#C9C1B4" />
      <rect x="34" y="157" width="104" height="4" rx="2" fill="#C9C1B4" />
      <rect x="34" y="170" width="70" height="22" rx="11" fill={ink} />
      <text x="69" y="184.5" textAnchor="middle" fontSize="8.5" fontWeight="800" fill="#fff" style={SANS}>
        Comprar
      </text>
      <rect x="110" y="170" width="62" height="22" rx="11" fill="none" stroke={ink} strokeOpacity=".3" />
      <text x="141" y="184.5" textAnchor="middle" fontSize="8.5" fontWeight="700" fill={ink} style={SANS}>
        Recetas
      </text>

      <g clipPath={`url(#hero-${id})`}>
        <rect x="200" y="54" width="166" height="128" fill="#F7ECDD" />
        <circle cx="338" cy="76" r="12" fill="#F2C35B" />
        <path d="M200 120Q260 86 366 104V182H200z" fill="#E7D8BE" />
        {TOWN.map((b, i) => (
          <rect key={i} x={b.x} y={b.y - b.h} width={b.w} height={b.h} fill={b.c} stroke="#1E2B3A" strokeOpacity=".14" strokeWidth=".6" />
        ))}
        <rect x="200" y="160" width="166" height="22" fill="#94C3CB" />
        <path d="M200 168q10-3 20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0" stroke="#fff" strokeOpacity=".7" fill="none" />
      </g>

      {['#D9705C', '#E9B23C', '#7FB3BF', '#BC5C33'].map((c, i) => {
        const x = 34 + i * 84;
        return (
          <g key={c}>
            <rect x={x} y="200" width="74" height="68" rx="10" fill="#F3ECE0" />
            <circle cx={x + 37} cy="226" r="15" fill={c} />
            <path d={`M${x + 37} 211q6-6 10-4q-3 6-10 4z`} fill="#5E8B5A" />
            <rect x={x + 10} y="248" width="34" height="4" rx="2" fill={ink} fillOpacity=".7" />
            <text x={x + 10} y="262" fontSize="7" fontWeight="800" fill="#BC5C33" style={SANS}>
              ${(4 + i) * 1000 + 990}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* 5 — Café Cerro Alegre: staff uniform system */
export function CafeUniform() {
  return (
    <svg viewBox="0 0 400 300" {...svgProps}>
      <rect width="400" height="300" fill="#EFE6D8" />
      <rect x="14" y="14" width="372" height="272" rx="16" fill="#F7F1E7" />
      <text x="30" y="44" fontSize="15" fontWeight="600" fill="#1E2B3A" style={DISPLAY}>
        Café Cerro Alegre
      </text>
      <text x="30" y="58" fontSize="6.5" fontWeight="800" letterSpacing="2.4" fill="#BC5C33" style={SANS}>
        STAFF UNIFORM SYSTEM
      </text>

      <path d="M80 80L106 66Q120 76 134 66L160 80L184 108L168 122L159 113V262H81V113L72 122L56 108Z" fill="#253445" />
      <path d="M106 66L120 90L112 93L100 70Z" fill="#33485F" />
      <path d="M134 66L120 90L128 93L140 70Z" fill="#33485F" />
      <path d="M106 66L120 90L134 66" stroke="#BC5C33" strokeWidth="3.5" fill="none" strokeLinejoin="round" />
      <path d="M120 92V124" stroke="#3A4F66" strokeWidth="2" />
      <circle cx="120" cy="102" r="1.8" fill="#F7F1E7" />
      <circle cx="120" cy="114" r="1.8" fill="#F7F1E7" />
      <path d="M56 108L72 122M184 108L168 122" stroke="#BC5C33" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="142" cy="120" r="6.5" fill="none" stroke="#BC5C33" strokeWidth="1.8" />

      <path d="M262 66Q280 44 298 66" stroke="#B65A47" strokeWidth="3" fill="none" />
      <path d="M258 66H302V104Q302 112 310 116L322 122V262H238V122L250 116Q258 112 258 104Z" fill="#D9705C" />
      <path d="M238 130q-16 6-22 24M322 130q16 6 22 24" stroke="#B65A47" strokeWidth="3" fill="none" strokeLinecap="round" />
      <rect x="252" y="182" width="56" height="36" rx="5" fill="#C9604D" />
      <rect x="255" y="185" width="50" height="30" rx="3" fill="none" stroke="#F7F1E7" strokeOpacity=".55" strokeDasharray="2 2" />
      <path d="M280 185V215" stroke="#F7F1E7" strokeOpacity=".55" strokeDasharray="2 2" />
      <text x="280" y="92" textAnchor="middle" fontSize="13" fontWeight="600" fill="#F7F1E7" style={DISPLAY}>
        C·A
      </text>
      <text x="280" y="102" textAnchor="middle" fontSize="4.6" fontWeight="800" letterSpacing="1.4" fill="#F7F1E7" style={SANS}>
        CERRO ALEGRE
      </text>

      {['#253445', '#D9705C', '#BC5C33', '#F2E6D2'].map((c, i) => (
        <circle key={c} cx="362" cy={112 + i * 34} r="12" fill={c} stroke={i === 3 ? '#D8C8AE' : 'none'} />
      ))}
    </svg>
  );
}

/* 6 — Noches de Atacama: astronomy festival poster */
const STARS = (() => {
  const rand = mulberry32(31);
  return Array.from({ length: 70 }, () => ({ x: rand() * 300, y: rand() * 260, r: 0.4 + rand() * 1.3, o: 0.35 + rand() * 0.6 }));
})();

export function AtacamaPoster() {
  return (
    <svg viewBox="0 0 300 400" {...svgProps}>
      <rect width="300" height="400" fill="#22324A" />
      <ellipse cx="160" cy="150" rx="200" ry="34" transform="rotate(-24 160 150)" fill="#fff" opacity=".06" />
      <ellipse cx="160" cy="150" rx="140" ry="16" transform="rotate(-24 160 150)" fill="#fff" opacity=".05" />
      {STARS.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#F6EBD8" opacity={s.o} />
      ))}
      <circle cx="150" cy="70" r="22" fill="#E8B04A" />
      <ellipse cx="150" cy="70" rx="38" ry="8" transform="rotate(-16 150 70)" fill="none" stroke="#F6EBD8" strokeOpacity=".7" strokeWidth="1.6" />

      <path d="M0 282Q70 242 150 264T300 252V400H0Z" fill="#8C4A2F" />
      <path d="M0 312Q90 272 180 302T300 294V400H0Z" fill="#C46A3C" />
      <path d="M186 292a14 14 0 0 1 28 0z" fill="#F1E4CC" />
      <rect x="186" y="292" width="28" height="9" fill="#E5D3B4" />
      <rect x="198" y="279" width="4" height="12" fill="#C46A3C" />
      <path d="M0 352Q100 320 200 344T300 338V400H0Z" fill="#E7A86E" />

      <text x="150" y="152" textAnchor="middle" fontSize="50" fontWeight="600" letterSpacing="-1" fill="#F6EBD8" style={DISPLAY}>
        Noches
      </text>
      <text x="150" y="188" textAnchor="middle" fontSize="32" fontWeight="500" fontStyle="italic" fill="#E8B04A" style={DISPLAY}>
        de Atacama
      </text>
      <text x="150" y="210" textAnchor="middle" fontSize="7.5" fontWeight="800" letterSpacing="3" fill="#F6EBD8" fillOpacity=".8" style={SANS}>
        FESTIVAL DE ASTRONOMÍA
      </text>
      <text x="150" y="224" textAnchor="middle" fontSize="7" fontWeight="700" letterSpacing="1.6" fill="#F6EBD8" fillOpacity=".6" style={SANS}>
        12—14 MARZO 2026 · SAN PEDRO DE ATACAMA
      </text>
    </svg>
  );
}
