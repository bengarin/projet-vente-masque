/* Éléments visuels du thème scrapbook — repris à l'identique de l'ancien assets/app.js.
   Les SVG sont des chaînes internes (aucune donnée venant de l'extérieur). */
import { useId, useMemo } from "react";

export const ICON = {
  menu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M3.5 6h17M3.5 12h17M3.5 18h17"/></svg>',
  cart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.6 12.2a1.6 1.6 0 0 0 1.6 1.3h8.6a1.6 1.6 0 0 0 1.6-1.2L21 8H6"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15M13 6l6 6-6 6"/></svg>'
};

export const DECO = {
  star:c=>`<svg viewBox="0 0 60 60"><path d="M30 4l7.6 15.4 17 2.5-12.3 12 2.9 16.9L30 42.8 14.8 50.8l2.9-16.9L5.4 21.9l17-2.5z" fill="${c||'#F7D33A'}" stroke="#fff" stroke-width="5" stroke-linejoin="round" paint-order="stroke"/><path d="M30 4l7.6 15.4 17 2.5-12.3 12 2.9 16.9L30 42.8 14.8 50.8l2.9-16.9L5.4 21.9l17-2.5z" fill="none" stroke="rgba(22,35,138,.25)" stroke-width="1.2" stroke-linejoin="round"/></svg>`,
  ostar:()=>`<svg viewBox="0 0 60 60"><path d="M30 6l7 14.6 16 2.3-11.6 11.3 2.8 15.9L30 42.6 15.8 50.1l2.8-15.9L7 22.9l16-2.3z" fill="none" stroke="#1530C8" stroke-width="3.2" stroke-linejoin="round"/></svg>`,
  spark:c=>`<svg viewBox="0 0 60 60"><path d="M30 4c2 14 8 20 22 22-14 2-20 8-22 22-2-14-8-20-22-22 14-2 20-8 22-22z" fill="${c||'#fff'}" stroke="#1530C8" stroke-width="3" stroke-linejoin="round"/></svg>`,
  sparks:()=>`<svg viewBox="0 0 60 60"><path d="M22 10c1.6 11 6 15.5 17 17-11 1.6-15.4 6-17 17-1.6-11-6-15.4-17-17 11-1.5 15.4-6 17-17z" fill="#F7D33A" stroke="#1530C8" stroke-width="2.6" stroke-linejoin="round"/><path d="M46 4c.9 6 3.4 8.5 9.4 9.4-6 .9-8.5 3.4-9.4 9.4-.9-6-3.4-8.5-9.4-9.4 6-.9 8.5-3.4 9.4-9.4z" fill="#fff" stroke="#1530C8" stroke-width="2.2" stroke-linejoin="round"/></svg>`,
  rays:c=>`<svg viewBox="0 0 40 40"><g stroke="${c||'#1530C8'}" stroke-width="4.2" stroke-linecap="round"><path d="M8 28L3 34"/><path d="M18 22l2-12"/><path d="M27 26l9-6"/></g></svg>`,
  side:c=>`<svg viewBox="0 0 40 40"><g stroke="${c||'#F3CF45'}" stroke-width="4.2" stroke-linecap="round"><path d="M30 8l-12 6"/><path d="M32 20H16"/><path d="M30 32l-12-6"/></g></svg>`,
  heart:()=>`<svg viewBox="0 0 60 60"><path d="M30 52S6 37 6 21c0-8 6-13 12.5-13C24 8 28 11 30 15c2-4 6-7 11.5-7C48 8 54 13 54 21c0 16-24 31-24 31z" fill="#fff" stroke="#1530C8" stroke-width="3.4" stroke-linejoin="round"/></svg>`,
  smile:()=>`<svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="24" fill="#FBE38A" stroke="#16238A" stroke-width="3"/><circle cx="22" cy="25" r="2.6" fill="#16238A"/><circle cx="38" cy="25" r="2.6" fill="#16238A"/><path d="M19 35c6 8 16 8 22 0" fill="none" stroke="#16238A" stroke-width="3" stroke-linecap="round"/></svg>`,
  squig:()=>`<svg viewBox="0 0 100 14"><path d="M2 8c8-6 14 6 22 0s14 6 22 0 14 6 22 0 14 6 22 0" fill="none" stroke="#F3CF45" stroke-width="4.5" stroke-linecap="round"/></svg>`,
  face:()=>`<svg viewBox="0 0 60 70"><path d="M30 3c15 0 26 12 26 30 0 20-12 34-26 34S4 53 4 33C4 15 15 3 30 3z" fill="#fff" stroke="#CDBBF3" stroke-width="2"/><ellipse cx="20" cy="30" rx="6.5" ry="4" fill="#CDBBF3"/><ellipse cx="40" cy="30" rx="6.5" ry="4" fill="#CDBBF3"/><ellipse cx="30" cy="50" rx="7.5" ry="4" fill="#CDBBF3"/></svg>`
};

export function maskStack(n){
  const cols = ["#CDBBF3","#F7DA6A","#2338C9"], dx = n <= 3 ? 20 : n <= 5 ? 15 : 12;
  const face = "M32 2C49 2 62 15 62 36 62 60 48 80 32 80 16 80 2 60 2 36 2 15 15 2 32 2z";
  const w = 66 + (n-1) * dx, uid = "m" + n;
  let g = "";
  for (let i = n-1; i >= 1; i--){
    const c = n === 3 ? ["#F7DA6A","#2338C9"][i-1] : cols[(i-1) % 3];
    g += `<g transform="translate(${2+i*dx} 4)" filter="url(#${uid}s)"><path d="${face}" fill="${c}"/><path d="${face}" fill="url(#${uid}t)"/>
      <ellipse cx="44" cy="34" rx="7" ry="4.5" fill="rgba(255,255,255,.35)"/></g>`;
  }
  g += `<g transform="translate(2 4)" filter="url(#${uid}s)"><path d="${face}" fill="#fff" stroke="#B9A4EE" stroke-width="2"/><path d="${face}" fill="url(#${uid}t)"/>
    <ellipse cx="20" cy="33" rx="8" ry="5" fill="#D4C5F6"/><ellipse cx="44" cy="33" rx="8" ry="5" fill="#D4C5F6"/>
    <path d="M27 48q5 3 10 0" fill="none" stroke="#B9A4EE" stroke-width="2.5" stroke-linecap="round"/><ellipse cx="32" cy="62" rx="9" ry="4.6" fill="#D4C5F6"/></g>`;
  return `<svg viewBox="0 0 ${w+6} 90" aria-hidden="true"><defs>
    <filter id="${uid}s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="2" dy="2" stdDeviation="1.6" flood-color="#3A1A70" flood-opacity=".22"/></filter>
    <pattern id="${uid}t" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="transparent"/><path d="M0 7h40M0 19h40M0 31h40" stroke="rgba(0,0,0,.035)"/><path d="M5 0v40M17 0v40M29 0v40" stroke="rgba(255,255,255,.06)"/></pattern>
  </defs>${g}</svg>`;
}

/* Sticker dessiné : <Deco k="rays" c="#F3CF45" className="dc a" /> */
export function Deco({ k, c, className = "dc" }) {
  const svg = DECO[k] ? DECO[k](c) : "";
  return <span className={className} aria-hidden="true" dangerouslySetInnerHTML={{ __html: svg }} />;
}

export function Icon({ name, className }) {
  return <span className={className} aria-hidden="true" style={className ? undefined : { display: "contents" }} dangerouslySetInnerHTML={{ __html: ICON[name] }} />;
}

export function MaskStack({ n }) {
  return <span className="art" dangerouslySetInnerHTML={{ __html: maskStack(n) }} />;
}

/* ---------- Papier déchiré : bords irréguliers calculés une fois (même algorithme qu'avant) ---------- */
function rnd(seed) { let s = seed % 2147483647 || 7; return () => (s = s * 16807 % 2147483647) / 2147483647; }
function hash(str) { let h = 0; for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0; return Math.abs(h); }

export function tornClip(a = 6, sides = "tblr", seed = 1) {
  const r = rnd(1000 + seed * 97 + a * 13), pts = [], amp = k => (sides.includes(k) ? a : 0);
  const edge = (n, f) => { for (let j = 0; j <= n; j++) pts.push(f(j / n, r())); };
  edge(28, (t, q) => `${(t * 100).toFixed(2)}% ${(q * amp("t")).toFixed(1)}px`);
  edge(8, (t, q) => `calc(100% - ${(q * amp("r")).toFixed(1)}px) ${(t * 100).toFixed(2)}%`);
  edge(28, (t, q) => `${(100 - t * 100).toFixed(2)}% calc(100% - ${(q * amp("b")).toFixed(1)}px)`);
  edge(8, (t, q) => `${(q * amp("l")).toFixed(1)}px ${(100 - t * 100).toFixed(2)}%`);
  return `polygon(${pts.join(",")})`;
}

/* <Paper torn={6} sides="tb" className="yel">…</Paper> → <div class="paper yel" style="clip-path:…"> */
export function Paper({ torn = 6, sides = "tblr", seed, as: Tag = "div", className = "", style, children, ...rest }) {
  const id = useId();
  const s = seed ?? hash(id) % 997;
  const clipPath = useMemo(() => tornClip(torn, sides, s), [torn, sides, s]);
  return <Tag className={`paper ${className}`.trim()} style={{ clipPath, ...style }} {...rest}>{children}</Tag>;
}

/* Bloc « ombre + papier » très utilisé dans les titres */
export function Torn({ torn, sides, className = "", children, wrap = "div" }) {
  const W = wrap;
  return <W className="sh"><Paper torn={torn} sides={sides} className={className}>{children}</Paper></W>;
}

export const LOGO = {
  src: "/images/logo-mapetitecoree.png", src2x: "/images/logo-mapetitecoree@2x.png",
  webp: "/images/logo-mapetitecoree.webp", webp2x: "/images/logo-mapetitecoree@2x.webp", w: 640, h: 175,
  alt: "mapetitecoree.ma",
};
export function Logo({ cls }) {
  return (
    <picture>
      <source type="image/webp" srcSet={`${LOGO.webp} 1x, ${LOGO.webp2x} 2x`} />
      <img className={`logo ${cls}`} src={LOGO.src} srcSet={`${LOGO.src} 1x, ${LOGO.src2x} 2x`} width={LOGO.w} height={LOGO.h} alt={LOGO.alt} decoding="async" />
    </picture>
  );
}
