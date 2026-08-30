import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import BranchesPage from "./pages/BranchesPage";
import CategoriesPage from "./pages/CategoriesPage";
import ProductsPage from "./pages/ProductsPage";
import RawMaterialsPage from "./pages/RawMaterialsPage";
import SuppliersPage from "./pages/SuppliersPage";
import RecipesPage from "./pages/RecipesPage";
import ProductionPage from "./pages/ProductionPage";
import PurchasesPage from "./pages/PurchasesPage";
import SalesPage from "./pages/SalesPage";
import ReturnsPage from "./pages/ReturnsPage";
import InventoryPage from "./pages/InventoryPage";
import UsersPage from "./pages/UsersPage";
import ReportsPage from "./pages/ReportsPage";

function Protected({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route path="/dashboard" element={<Protected><DashboardPage /></Protected>} />
          <Route path="/branches" element={<Protected><BranchesPage /></Protected>} />
          <Route path="/categories" element={<Protected><CategoriesPage /></Protected>} />
          <Route path="/products" element={<Protected><ProductsPage /></Protected>} />
          <Route path="/raw-materials" element={<Protected><RawMaterialsPage /></Protected>} />
          <Route path="/suppliers" element={<Protected><SuppliersPage /></Protected>} />
          <Route path="/recipes" element={<Protected><RecipesPage /></Protected>} />
          <Route path="/production" element={<Protected><ProductionPage /></Protected>} />
          <Route path="/purchases" element={<Protected><PurchasesPage /></Protected>} />
          <Route path="/sales" element={<Protected><SalesPage /></Protected>} />
          <Route path="/returns" element={<Protected><ReturnsPage /></Protected>} />
          <Route path="/inventory" element={<Protected><InventoryPage /></Protected>} />
          <Route path="/users" element={<Protected><UsersPage /></Protected>} />
          <Route path="/reports" element={<Protected><ReportsPage /></Protected>} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
