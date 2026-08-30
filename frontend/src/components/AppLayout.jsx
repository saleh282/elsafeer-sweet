import Sidebar from "./Sidebar";

export default function AppLayout({ children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--ivory-50)" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "32px 40px", minWidth: 0 }}>{children}</main>
    </div>
  );
}
