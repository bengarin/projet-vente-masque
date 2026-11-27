/* Soins vendus à l'unité (hors packs de masques) : même carte et même fiche produit que les masques.
   La cliente peut les commander seuls, ou avec un pack de masques dans la même commande. */
import { useState } from "react";
import { Link } from "react-router-dom";
import { Deco, Paper, Torn } from "../../ui/decor.jsx";
import { anim, useBodyClass, useOverlay } from "../../ui/overlay.jsx";
import { CatalogGate, Header } from "../Chrome.jsx";
import { PATHS, useShop } from "../ShopContext.jsx";
import { P as PICK, ProductModal } from "./PickPage.jsx";
import "../../styles/pg-pick.css";

const S = {
  fr: { tag: "SOINS", title: <>Nos <span className="hl">soins</span></>, sub: "À l'unité, avec ou sans pack de masques",
    hint: "Ajoute-les à ta commande : seuls, ou avec ton pack de masques.", mine: n => `Mes soins : ${n}`, cta: "Voir mon panier",
    added: "Ajouté au panier ✓", backTo: "Retour aux soins", none: "Aucun soin disponible pour le moment.", toMasks: "Composer un pack de masques" },
  ar: { tag: "العناية", title: <>منتجات <span className="hl">العناية</span></>, sub: "تُباع بالقطعة، مع باقة الأقنعة أو من دونها",
    hint: "أضيفيها إلى طلبك: وحدها أو مع باقة الأقنعة.", mine: n => `منتجات العناية المختارة: ${n}`, cta: "عرض سلتي",
    added: "أُضيف إلى السلة ✓", backTo: "العودة إلى منتجات العناية", none: "لا يتوفر أي منتج عناية حالياً.", toMasks: "كوّني باقة أقنعة" },
  en: { tag: "SKINCARE", title: <>Our <span className="hl">skincare</span></>, sub: "Sold individually, with or without a mask pack",
    hint: "Add them to your order: on their own, or with your mask pack.", mine: n => `My skincare: ${n}`, cta: "View my cart",
    added: "Added to cart ✓", backTo: "Back to skincare", none: "No skincare available right now.", toMasks: "Build a mask pack" },
};

export default function SoinsPage() {
  useBodyClass("pickpage");
  const { uiLang } = useShop();
  const s = S[uiLang];
  return (
    <div className="pg-pick pg-soins">
      <Header step="soins" langMenu />
      <section className="band">
        <Paper torn={9} sides="tb" className="bg lav" />
        <Paper torn={6} sides="tbr" className="corner l yel" />
        <Paper torn={6} sides="tbl" className="corner r yel" />
        <Deco k="sparks" className="dc d1" /><Deco k="heart" className="dc d2" />
        <div className="wrap">
          <div className="tagw"><Deco k="rays" /><Torn torn={3} className="yel"><span className="tag">{s.tag}</span></Torn><Deco k="rays" /></div><br />
          <div className="h1w"><Torn torn={6}><h1>{s.title}</h1></Torn></div><br />
          <div className="subw"><Torn torn={4}><span>{s.sub}</span></Torn><Deco k="rays" /></div>
        </div>
      </section>
      <CatalogGate><Soins s={s} /></CatalogGate>
    </div>
  );
}

function Soins({ s }) {
  const { uiLang, t, unitProducts, extraQty, setExtraQty, extrasCount, money, setCartOpen, byId } = useShop();
  const { toast } = useOverlay();
  const [pmId, setPmId] = useState(null);
  const p = { ...PICK[uiLang], backTo: s.backTo };

  const change = (x, d) => {
    const before = extraQty(x.id);
    if (!setExtraQty(x.id, before + d)) return;
    const card = document.querySelector(`.pg-soins .item[data-id="${x.id}"]`);
    if (card) { anim(card.querySelector(".sh"), d > 0 ? "bump" : "dip"); anim(card.querySelector(".qbadge"), "popn"); }
    if (d > 0) { toast(s.added); anim(document.getElementById("cartBtn"), "cartwig"); anim(document.getElementById("cartCount"), "popn"); }
  };
  const qtyCtl = x => {
    const q = extraQty(x.id), soldOut = x.stock != null && q >= x.stock;
    return <>
      <button className="mi" type="button" aria-label={`${p.remove} – ${x.name}`} disabled={!q} onClick={() => change(x, -1)}>−</button>
      <output aria-live="polite">{q}</output>
      <button className="pl" type="button" disabled={soldOut || q >= 20} aria-label={`${p.add} – ${x.name}`} onClick={() => change(x, 1)}>+</button>
    </>;
  };

  return (
    <>
      <main className="wrap wide">
        {!unitProducts.length && <p className="cursel">{s.none}</p>}
        <ul className="grid">
          {unitProducts.map(x => {
            const q = extraQty(x.id), out = x.stock === 0;
            return (
              <li key={x.id} className={`item${q > 0 ? " sel" : ""}`} data-id={x.id}><div className="sh">
                <Paper torn={5} className="card">
                  <button className="open-p" type="button" aria-label={`${p.details} – ${x.name}`} onClick={() => setPmId(x.id)}>
                    <span className="ph"><img src={x.images[0] || "/images/deco/visage-masque.webp"} alt="" loading="lazy" width="600" height="600" /><span className="qbadge">×{q}</span>
                      {out && <span className="outst">{t.outStock}</span>}</span>
                    <span className="brandp">{x.brand}</span>
                    <span className="name" title={x.name}>{x.name}</span>
                  </button>
                  <div className="pricerow">{x.price == null ? <span className="price tbd">{p.tbd}</span> : <span className="price">{money(x.price)}</span>}</div>
                  <button className="vplus" type="button" aria-label={`${p.more} – ${x.brand} ${x.name}`} aria-haspopup="dialog" onClick={() => setPmId(x.id)}>
                    <span className="vtxt">{p.more}</span><span className="varr" aria-hidden="true">→</span><Deco k="sparks" className="dc vs" />
                  </button>
                  <div className="qty">{qtyCtl(x)}</div>
                </Paper>
                <span className={`tape ${x.tape || "ging"}`} />
              </div></li>
            );
          })}
        </ul>
        <div className="note"><Torn torn={4}><span>{s.hint}</span></Torn></div>
        <p className="soins-back"><Link to={PATHS[2]}>{s.toMasks} →</Link></p>
      </main>

      <div className="bar"><div className="barin">
        <div className="mine"><Deco k="side" /><span>{s.mine(extrasCount)}</span></div>
        <button className="cta" type="button" disabled={!extrasCount} onClick={() => setCartOpen(true)}><span>{s.cta}</span></button>
      </div></div>

      {pmId != null && byId(pmId) && <ProductModal p={p} x={byId(pmId)} lang={uiLang} closeLabel={t.close} qtyCtl={qtyCtl} money={money} onClose={() => setPmId(null)} />}
    </>
  );
}


