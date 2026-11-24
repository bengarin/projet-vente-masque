/* Étape 2 — taille du pack : 3, 4 ou 6 masques (ancienne page etape-2.html). Tailles et prix viennent de l'admin. */
import { useNavigate } from "react-router-dom";
import { Deco, ICON, MaskStack, Paper, Torn } from "../../ui/decor.jsx";
import { useBodyClass, useOverlay } from "../../ui/overlay.jsx";
import { CatalogGate, Header, StepDots } from "../Chrome.jsx";
import { PATHS, useShop } from "../ShopContext.jsx";
import "../../styles/pg-pack.css";

const P = {
  fr: { title: "Choisis ton pack !", sub: <>Combien de masques veux-tu <span className="hl cobu">composer</span> ?</>,
    line1: "Pack de", line2: "masques", later: "Prix du pack affiché ensuite",
    cur: c => `Ta sélection actuelle : ${c} masque${c > 1 ? "s" : ""}. Elle est conservée.`,
    shrinkT: "Réduire ton pack ?", shrink: (c, n, k) => `Tu as déjà choisi ${c} masques. Le pack de ${n} n'en garde que ${n} : ${k === 1 ? "ce masque sera retiré" : "ces " + k + " masques seront retirés"} (les derniers ajoutés).`,
    ok: n => `Oui, passer au pack de ${n}`, cancel: "Annuler, garder mon pack", done: (n, k) => `Pack de ${n} : ${k} masque${k > 1 ? "s" : ""} retiré${k > 1 ? "s" : ""}.`,
    none: "Aucune taille de pack n'est disponible pour le moment." },
  ar: { title: "اختاري الباك ديالك!", sub: <>شحال من ماسك بغيتي <span className="hl cobu">تجمعي</span>؟</>,
    line1: "باك ديال", line2: "ماسكات", later: "ثمن الباك غادي يبان من بعد",
    cur: c => `الاختيار ديالك دابا: ${c} ماسكات. غادي يبقى محفوظ.`,
    shrinkT: "تصغّري الباك؟", shrink: (c, n, k) => `اخترتي ${c} ماسكات. باك ${n} فيه غير ${n}: ${k === 1 ? "هاد الماسك غادي يتحيّد" : "هاد " + k + " ماسكات غادي يتحيّدو"} (آخر اللي تزادو).`,
    ok: n => `إيه، دوزي لباك ${n}`, cancel: "لا، خلي الباك ديالي", done: (n, k) => (k === 1 ? `باك ${n}: تحيّد ماسك واحد.` : `باك ${n}: تحيّدو ${k} ماسكات.`),
    none: "ما كاين حتى باك متوفر دابا." },
  en: { title: "Choose your pack!", sub: <>How many masks would you like to <span className="hl cobu">put together</span>?</>,
    line1: "Pack of", line2: "masks", later: "Pack price shown next",
    cur: c => `Your current selection: ${c} mask${c > 1 ? "s" : ""}. It is kept.`,
    shrinkT: "Make your pack smaller?", shrink: (c, n, k) => `You have already picked ${c} masks. The pack of ${n} only keeps ${n}: ${k === 1 ? "this mask will be removed" : "these " + k + " masks will be removed"} (the last ones added).`,
    ok: n => `Yes, switch to the pack of ${n}`, cancel: "Cancel, keep my pack", done: (n, k) => `Pack of ${n}: ${k} mask${k > 1 ? "s" : ""} removed.`,
    none: "No pack size is available right now." },
};
const DECOS = [
  <><Deco k="rays" className="dc a" /><span className="tape check" /></>,
  <><Deco k="star" className="dc a" /><Deco k="rays" c="#F3CF45" className="dc b" /></>,
  <><Deco k="sparks" className="dc a" /><span className="tape check" /><Deco k="star" className="dc b" /></>,
];

export default function PackPage() {
  useBodyClass("lavpage");
  const { uiLang, t } = useShop();
  const p = P[uiLang];
  return (
    <div className="pg-pack">
      <Header step={2} langMenu />
      <main className="wrap">
        <section className="hero">
          <Deco k="star" className="dc d1" />
          <span className="tape check" />
          <div className="tagw"><Torn torn={3} className="yel"><span className="tag">{t.stepTag(2)}</span></Torn><Deco k="rays" /></div><br />
          <div className="h1w"><Torn torn={7} className="yel"><h1>{p.title}</h1></Torn></div><br />
          <div className="subw"><Torn torn={5}><span>{p.sub}</span></Torn></div>
          <Deco k="spark" className="dc d2" />
        </section>
        <CatalogGate><PackOptions p={p} /></CatalogGate>
      </main>
      <PackBar />
    </div>
  );
}

function PackOptions({ p }) {
  const { catalog, packSize, setPackSize, order, count, byId, money } = useShop();
  const { dialog, toast } = useOverlay();
  const sizes = catalog.packSizes;

  const choose = async n => {
    if (count > n) {                       // la sélection dépasse la nouvelle taille → demander confirmation
      const gone = order.slice(n).map(byId).filter(Boolean);
      const ok = await dialog({
        title: p.shrinkT,
        body: <><p>{p.shrink(count, n, gone.length)}</p>
          <ul className="dlist">{gone.map((x, i) => <li key={i}><div className="dl gone"><img src={x.images[0]} alt="" /><span>{x.brand} – {x.name}</span></div></li>)}</ul></>,
        buttons: [{ label: p.ok(n), value: "ok", primary: true }, { label: p.cancel, value: "no" }],
      });
      if (ok !== "ok") return;
      setPackSize(n); toast(p.done(n, gone.length)); return;
    }
    setPackSize(n);
  };

  if (!sizes.length) return <p className="cursel">{p.none}</p>;
  return (
    <>
      <form className="opts" onSubmit={e => e.preventDefault()}>
        {sizes.map(({ size: n, price }, i) => (
          <label key={n} className={`opt k${(i % 3) + 1}`}>
            <input type="radio" name="pack" value={n} checked={n === packSize} onChange={() => choose(n)} />
            <div className="sh"><Paper torn={7} className="card">
              <MaskStack n={n} />
              <span className="div" aria-hidden="true" />
              <span className="txt"><span className="big">{p.line1} {n}<br />{p.line2}</span>
                {price != null ? <span className="chip price">{money(price)}</span> : <span className="chip">{p.later}</span>}</span>
              <span className="radio" dangerouslySetInnerHTML={{ __html: ICON.check }} />
            </Paper>{DECOS[i % 3]}</div>
          </label>
        ))}
      </form>
      {count > 0 && <p className="cursel">{p.cur(count)}</p>}
    </>
  );
}

function PackBar() {
  const { t, packSize } = useShop();
  const navigate = useNavigate();
  return (
    <div className="bar"><div className="barin">
      <StepDots step={2} /><span className="sep" />
      <a className="cta" href={PATHS[3]} aria-disabled={packSize ? "false" : "true"}
        onClick={e => { e.preventDefault(); if (!packSize) { document.querySelector("input[name=pack]")?.focus(); return; } navigate(PATHS[3]); }}>
        <span>{t.continue}</span><span className="ic" dangerouslySetInnerHTML={{ __html: ICON.arrow }} />
      </a>
    </div></div>
  );
}
