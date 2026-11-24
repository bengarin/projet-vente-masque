import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { OverlayProvider } from "./ui/overlay.jsx";
import { ShopProvider } from "./shop/ShopContext.jsx";
import LangPage from "./shop/pages/LangPage.jsx";
import PackPage from "./shop/pages/PackPage.jsx";
import PickPage from "./shop/pages/PickPage.jsx";
import CheckoutPage from "./shop/pages/CheckoutPage.jsx";

// L'admin est chargé à part : les clientes ne téléchargent pas son code
const AdminApp = lazy(() => import("./admin/AdminApp.jsx"));

function Shop() {
  return (
    <OverlayProvider>
      <ShopProvider>
        <Routes>
          <Route index element={<LangPage />} />
          <Route path="pack" element={<PackPage />} />
          <Route path="masques" element={<PickPage />} />
          <Route path="commande" element={<CheckoutPage />} />
          {/* anciennes adresses du site statique */}
          <Route path="index.html" element={<Navigate to="/" replace />} />
          <Route path="etape-2.html" element={<Navigate to="/pack" replace />} />
          <Route path="etape-3.html" element={<Navigate to="/masques" replace />} />
          <Route path="checkout.html" element={<Navigate to="/commande" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ShopProvider>
    </OverlayProvider>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<Suspense fallback={<p style={{ padding: 20 }}>Chargement…</p>}><AdminApp /></Suspense>} />
      <Route path="/*" element={<Shop />} />
    </Routes>
  );
}
