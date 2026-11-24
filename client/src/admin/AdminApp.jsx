/* Espace d'administration : connexion + pages protégées */
import { useEffect, useRef, useState } from "react";
import { NavLink, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { api } from "../lib/api.js";
import { Logo } from "../ui/decor.jsx";
import { AuthCtx, ConfirmProvider, Field, useAuth } from "./common.jsx";
import { Ic } from "./icons.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProductsList from "./pages/ProductsList.jsx";
import ProductForm from "./pages/ProductForm.jsx";
import OrdersList from "./pages/OrdersList.jsx";
import OrderDetail from "./pages/OrderDetail.jsx";
import Settings from "./pages/Settings.jsx";
import "./admin.css";

const NAV = [
  { to: "/admin", label: "Tableau de bord", short: "Accueil", icon: "dashboard", end: true },
  { to: "/admin/commandes", label: "Commandes", short: "Commandes", icon: "orders" },
  { to: "/admin/produits", label: "Produits", short: "Produits", icon: "products" },
  { to: "/admin/parametres", label: "Paramètres", short: "Réglages", icon: "settings" },
];

export default function AdminApp() {
  const [admin, setAdmin] = useState(undefined);   // undefined = vérification en cours
  useEffect(() => {
    document.documentElement.lang = "fr"; document.documentElement.dir = "ltr";
    document.title = "Administration — mapetitecoree.ma";
    document.body.classList.add("admbody");
    api("/api/admin/auth/me").then(r => setAdmin(r.admin)).catch(() => setAdmin(null));
    return () => document.body.classList.remove("admbody");
  }, []);
  if (admin === undefined) return <div className="adm a-boot"><span className="a-spinner" aria-label="Chargement…" /></div>;
  return (
    <AuthCtx.Provider value={{ admin, setAdmin }}>
      {admin ? <ConfirmProvider><Layout /></ConfirmProvider> : <Login />}
    </AuthCtx.Provider>
  );
}

function Login() {
  const [f, setF] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);
  const { setAdmin } = useAuth();
  const submit = async e => {
    e.preventDefault(); setErr(null);
    if (!f.email || !f.password) return setErr({ message: "E-mail et mot de passe requis." });
    setBusy(true);
    try { const r = await api("/api/admin/auth/login", { method: "POST", body: f }); setAdmin(r.admin); }
    catch (e2) { setErr(e2); }
    finally { setBusy(false); }
  };
  return (
    <div className="adm a-login">
      <div className="a-login-card">
        <aside className="a-login-brand">
          <span className="a-tape" aria-hidden="true" />
          <Logo cls="a-login-logo" />
          <p className="a-login-tag">Espace d'administration</p>
          <ul>
            <li><Ic n="orders" size={16} />Suivi des commandes</li>
            <li><Ic n="products" size={16} />Produits, prix et stock</li>
            <li><Ic n="settings" size={16} />Livraison et paiement</li>
          </ul>
        </aside>
        <form className="a-login-form" onSubmit={submit} noValidate>
          <h1 className="a-title">Connexion</h1>
          <p className="a-subtitle">Accès réservé à l'équipe de la boutique.</p>
          {err && <div className="a-alert a-alert-err" role="alert"><Ic n="alert" /><span>{err.message}</span></div>}
          <Field label="E-mail" required><input type="email" autoComplete="username" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} autoFocus /></Field>
          <Field label="Mot de passe" required>
            <span className="a-input-wrap">
              <input type={show ? "text" : "password"} autoComplete="current-password" value={f.password} onChange={e => setF({ ...f, password: e.target.value })} />
              <button type="button" className="a-icon-btn a-icon-btn-sm a-input-btn" aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"} onClick={() => setShow(s => !s)}><Ic n={show ? "eyeOff" : "eye"} size={16} /></button>
            </span>
          </Field>
          <button className="a-btn a-btn-primary a-btn-lg a-btn-block" disabled={busy}>{busy ? "Connexion…" : "Se connecter"}</button>
        </form>
      </div>
    </div>
  );
}

function Layout() {
  const { admin, setAdmin } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();
  const [acct, setAcct] = useState(false);
  const acctRef = useRef(null);
  useEffect(() => { setAcct(false); window.scrollTo(0, 0); }, [loc.pathname]);
  useEffect(() => {
    if (!acct) return;
    const h = e => { if (!acctRef.current?.contains(e.target)) setAcct(false); };
    const k = e => { if (e.key === "Escape") setAcct(false); };
    document.addEventListener("pointerdown", h); document.addEventListener("keydown", k);
    return () => { document.removeEventListener("pointerdown", h); document.removeEventListener("keydown", k); };
  }, [acct]);
  const logout = async () => { await api("/api/admin/auth/logout", { method: "POST" }).catch(() => {}); setAdmin(null); navigate("/admin"); };
  const who = admin.name || admin.email;
  const initial = (who || "?").trim().charAt(0).toUpperCase();

  return (
    <div className="adm a-shell">
      {/* Menu latéral (ordinateur) */}
      <aside className="a-side">
        <NavLink to="/admin" className="a-side-brand"><span className="a-tape a-tape-sm" aria-hidden="true" /><Logo cls="a-side-logo" /><span className="a-side-label">Admin</span></NavLink>
        <nav className="a-side-nav" aria-label="Menu principal">
          {NAV.map(n => <NavLink key={n.to} to={n.to} end={n.end}><Ic n={n.icon} />{n.label}</NavLink>)}
        </nav>
        <div className="a-side-foot">
          <a className="a-side-link" href="/" target="_blank" rel="noopener"><Ic n="store" />Voir la boutique<Ic n="ext" size={14} className="a-push" /></a>
          <div className="a-user">
            <span className="a-avatar" aria-hidden="true">{initial}</span>
            <span className="a-user-txt"><b title={admin.email}>{who}</b><small>Compte admin</small></span>
            <button type="button" className="a-icon-btn" aria-label="Déconnexion" title="Déconnexion" onClick={logout}><Ic n="logout" /></button>
          </div>
        </div>
      </aside>

      {/* Barre du haut (téléphone / tablette) */}
      <header className="a-mtop">
        <NavLink to="/admin" className="a-mtop-brand"><Logo cls="a-side-logo" /><span className="a-side-label">Admin</span></NavLink>
        <div className="a-acct" ref={acctRef}>
          <button type="button" className="a-avatar-btn" aria-haspopup="menu" aria-expanded={acct} aria-label="Mon compte" onClick={() => setAcct(a => !a)}>
            <span className="a-avatar">{initial}</span></button>
          {acct && <div className="a-menu" role="menu">
            <div className="a-menu-head"><b>{who}</b><small>{admin.email}</small></div>
            <a role="menuitem" href="/" target="_blank" rel="noopener"><Ic n="store" />Voir la boutique</a>
            <button role="menuitem" type="button" onClick={logout}><Ic n="logout" />Déconnexion</button>
          </div>}
        </div>
      </header>

      <main className="a-main">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="produits" element={<ProductsList />} />
          <Route path="produits/nouveau" element={<ProductForm />} />
          <Route path="produits/:id" element={<ProductForm />} />
          <Route path="commandes" element={<OrdersList />} />
          <Route path="commandes/:id" element={<OrderDetail />} />
          <Route path="parametres" element={<Settings />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>

      {/* Onglets du bas (téléphone) */}
      <nav className="a-tabbar" aria-label="Menu principal">
        {NAV.map(n => <NavLink key={n.to} to={n.to} end={n.end}><Ic n={n.icon} size={20} /><span>{n.short}</span></NavLink>)}
      </nav>
    </div>
  );
}
