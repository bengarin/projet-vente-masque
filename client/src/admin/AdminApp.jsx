/* Espace d'administration : connexion + pages protégées */
import { useEffect, useState } from "react";
import { NavLink, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { api } from "../lib/api.js";
import { Logo } from "../ui/decor.jsx";
import { AuthCtx, Field, useAuth } from "./common.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProductsList from "./pages/ProductsList.jsx";
import ProductForm from "./pages/ProductForm.jsx";
import OrdersList from "./pages/OrdersList.jsx";
import OrderDetail from "./pages/OrderDetail.jsx";
import Settings from "./pages/Settings.jsx";
import "./admin.css";

export default function AdminApp() {
  const [admin, setAdmin] = useState(undefined);   // undefined = vérification en cours
  useEffect(() => {
    document.documentElement.lang = "fr"; document.documentElement.dir = "ltr";
    document.title = "Administration — mapetitecoree.ma";
    document.body.classList.add("admbody");
    api("/api/admin/auth/me").then(r => setAdmin(r.admin)).catch(() => setAdmin(null));
    return () => document.body.classList.remove("admbody");
  }, []);
  if (admin === undefined) return <p className="adm-loading">Chargement…</p>;
  return (
    <AuthCtx.Provider value={{ admin, setAdmin }}>
      {admin ? <Layout /> : <Login />}
    </AuthCtx.Provider>
  );
}

function Login() {
  const [f, setF] = useState({ email: "", password: "" });
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
    <div className="adm login">
      <form className="card loginbox" onSubmit={submit} noValidate>
        <Logo cls="adm-logo" />
        <h1>Administration</h1>
        {err && <p className="alert err" role="alert">{err.message}</p>}
        <Field label="E-mail" required><input type="email" autoComplete="username" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} autoFocus /></Field>
        <Field label="Mot de passe" required><input type="password" autoComplete="current-password" value={f.password} onChange={e => setF({ ...f, password: e.target.value })} /></Field>
        <button className="btn primary" disabled={busy}>{busy ? "Connexion…" : "Se connecter"}</button>
      </form>
    </div>
  );
}

function Layout() {
  const { admin, setAdmin } = useAuth();
  const navigate = useNavigate();
  const [menu, setMenu] = useState(false);
  const logout = async () => { await api("/api/admin/auth/logout", { method: "POST" }).catch(() => {}); setAdmin(null); navigate("/admin"); };
  const link = (to, label, end) => <NavLink to={to} end={end} onClick={() => setMenu(false)}>{label}</NavLink>;
  return (
    <div className="adm">
      <header className="atop">
        <button className="btn ghost menu-btn" type="button" onClick={() => setMenu(m => !m)} aria-expanded={menu}>☰</button>
        <NavLink to="/admin" className="abrand"><Logo cls="adm-logo" /><span>Admin</span></NavLink>
        <nav className={menu ? "open" : ""}>
          {link("/admin", "Tableau de bord", true)}
          {link("/admin/commandes", "Commandes")}
          {link("/admin/produits", "Produits")}
          {link("/admin/parametres", "Paramètres")}
          <a href="/" target="_blank" rel="noopener">Voir la boutique ↗</a>
        </nav>
        <div className="awho"><span title={admin.email}>{admin.name || admin.email}</span><button className="btn ghost" type="button" onClick={logout}>Déconnexion</button></div>
      </header>
      <main className="amain">
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
    </div>
  );
}
