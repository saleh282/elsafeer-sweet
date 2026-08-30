import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const roleLabels = {
  owner: "المالك",
  manager: "مدير فرع",
  cashier: "كاشير",
  factory_staff: "عامل مصنع",
  store_staff: "عامل فرع",
};

const links = [
  { to: "/dashboard", label: "📊 الرئيسية" },
  { to: "/branches", label: "🏬 الفروع" },
  { to: "/categories", label: "🏷️ التصنيفات" },
  { to: "/products", label: "🍰 المنتجات" },
  { to: "/raw-materials", label: "🥛 الخامات" },
  { to: "/suppliers", label: "🚚 الموردين" },
  { to: "/recipes", label: "📋 الوصفات" },
  { to: "/production", label: "🏭 الإنتاج" },
  { to: "/purchases", label: "🛒 المشتريات" },
  { to: "/sales", label: "🧾 المبيعات" },
  { to: "/returns", label: "🔄 المرتجعات" },
  { to: "/inventory", label: "📦 المخزون" },
  { to: "/reports", label: "📈 التقارير" },
  { to: "/users", label: "👥 المستخدمون" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside style={styles.sidebar}>
      <div style={styles.scrollArea}>
        <div style={styles.brandRow}>
          <div style={styles.logoMark}>🍮</div>
          <div>
            <p style={styles.brandTitle}>حلواني السفير</p>
            <p style={styles.brandSubtitle}>ELSAFEER PASTRY</p>
          </div>
        </div>

        <nav style={styles.nav}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              style={({ isActive }) => ({
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {}),
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div style={styles.userBox}>
        <div style={styles.userMeta}>
          <p style={styles.userName}>{user?.name}</p>
          <p style={styles.userRole}>{roleLabels[user?.role] || user?.role}</p>
        </div>
        <button onClick={logout} style={styles.logoutBtn}>
          خروج
        </button>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: 240,
    height: "100vh",
    position: "sticky",
    top: 0,
    background: "var(--cocoa-900)",
    color: "var(--ivory-50)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "26px 20px",
    flexShrink: 0,
  },
  scrollArea: { overflowY: "auto", flex: 1 },
  brandRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 30 },
  logoMark: {
    width: 40,
    height: 40,
    borderRadius: "var(--radius-md)",
    background: "linear-gradient(135deg, var(--caramel-500), var(--honey-400))",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    flexShrink: 0,
  },
  brandTitle: { margin: 0, fontSize: 15.5, fontWeight: 800 },
  brandSubtitle: { margin: "2px 0 0", fontSize: 12, color: "#C9B8A8" },
  nav: { display: "flex", flexDirection: "column", gap: 2 },
  navItem: {
    padding: "9px 12px",
    borderRadius: "var(--radius-md)",
    fontSize: 14,
    fontWeight: 600,
    color: "#C9B8A8",
    textDecoration: "none",
    display: "block",
  },
  navItemActive: {
    background: "rgba(255,255,255,0.1)",
    color: "var(--ivory-50)",
    fontWeight: 700,
  },
  userBox: {
    borderTop: "1px solid rgba(255,255,255,0.12)",
    paddingTop: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  userMeta: { overflow: "hidden" },
  userName: { margin: 0, fontSize: 14, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  userRole: { margin: "2px 0 0", fontSize: 12, color: "#C9B8A8" },
  logoutBtn: {
    background: "rgba(255,255,255,0.1)",
    color: "var(--ivory-50)",
    padding: "7px 12px",
    borderRadius: "var(--radius-md)",
    fontSize: 12.5,
    fontWeight: 700,
    flexShrink: 0,
  },
};
