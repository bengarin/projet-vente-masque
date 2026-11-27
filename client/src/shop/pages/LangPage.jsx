/* Étape 1 — choix de la langue (ancienne page index.html) */
import { Deco, ICON, Paper, Torn } from "../../ui/decor.jsx";
import { Header, StepDots } from "../Chrome.jsx";
import { useShop } from "../ShopContext.jsx";
import "../../styles/pg-lang.css";

const P = {
  fr: { title: <>Choisis ta <span className="hl lavu">langue</span> !</>, sub: "Pour continuer, sélectionne ta langue.", hint: "Tu pourras la changer plus tard." },
  ar: { title: <>اختاري <span className="hl lavu">لغتك</span>!</>, sub: "للمتابعة، اختاري لغتك.", hint: "يمكنك تغييرها لاحقاً." },
  en: { title: <>Choose your <span className="hl lavu">language</span>!</>, sub: "To continue, select your language.", hint: "You can change it later." },
};
const OPTS = [
  { code: "ar", cls: "opt-ar", flag: "/images/deco/drapeau-ma.webp", name: "العربية", dir: "rtl" },
  { code: "fr", cls: "opt-fr", flag: "/images/deco/drapeau-fr.webp", name: "Français", dir: "ltr" },
  { code: "en", cls: "opt-en", flag: "/images/deco/drapeau-en.webp", name: "English", dir: "ltr" },
];

export default function LangPage() {
  const { lang, uiLang, t, setLang, go } = useShop();
  const p = P[uiLang];
  return (
    <div className="pg-lang">
      <Header step={1} />
      <section className="band">
        <Paper torn={9} sides="tb" className="bg lav" />
        <div className="wrap hero">
          <img className="face" src="/images/deco/visage-masque.webp" alt="" width="622" height="640" />
          <div className="head">
            <div className="tagw"><Torn torn={3}><span className="tag">{t.stepTag(1)}</span></Torn><Deco k="rays" /></div>
            <div className="h1w"><Torn torn={6} className="yel"><h1>{p.title}</h1></Torn>
              <Deco k="ostar" className="dc o" /><Deco k="smile" className="dc s" /></div>
          </div>
          <div className="subrow"><div className="subw"><Torn torn={5}><span>{p.sub}</span></Torn><Deco k="rays" /></div></div>
        </div>
        <span className="tape checkl" />
      </section>

      <main className="wrap">
        <form className="opts" onSubmit={e => e.preventDefault()}>
          {OPTS.map(o => (
            <label key={o.code} className={`opt ${o.cls}`}>
              <input type="radio" name="lang" value={o.code} checked={lang === o.code} onChange={() => setLang(o.code)} />
              <span className="stroke"><img className="flag" src={o.flag} alt="" /><span className="name" lang={o.code} dir={o.dir}>{o.name}</span></span>
              <span className="radio" dangerouslySetInnerHTML={{ __html: ICON.check }} />
            </label>
          ))}
        </form>
        <div className="hint"><Deco k="side" /><div className="subw"><Torn torn={4}><span>{p.hint}</span></Torn></div><Deco k="side" /></div>
      </main>

      <div className="bar"><div className="barin">
        <StepDots step={1} /><span className="sep" />
        <a className="cta" href="/pack" aria-disabled={lang ? "false" : "true"}
          onClick={e => { e.preventDefault(); if (!lang) { document.querySelector("input[name=lang]")?.focus(); return; } go(2); }}>
          <span>{t.continue}</span><span className="ic" dangerouslySetInnerHTML={{ __html: ICON.arrow }} />
        </a>
      </div></div>
    </div>
  );
}
