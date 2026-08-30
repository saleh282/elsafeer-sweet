export function PageShell({ title, subtitle, actions, children }) {
  return (
    <div>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>{title}</h1>
          {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
        </div>
        {actions && <div>{actions}</div>}
      </header>
      {children}
    </div>
  );
}

export function Card({ children, style }) {
  return <div style={{ ...styles.card, ...style }}>{children}</div>;
}

export function Table({ columns, rows, emptyLabel = "لا توجد بيانات بعد" }) {
  if (!rows || rows.length === 0) {
    return <p style={styles.emptyLabel}>{emptyLabel}</p>;
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={styles.th}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row._id || i} style={styles.tr}>
              {columns.map((col) => (
                <td key={col.key} style={styles.td}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <label style={styles.field}>
      <span style={styles.fieldLabel}>{label}</span>
      {children}
    </label>
  );
}

export function TextInput(props) {
  return <input {...props} style={{ ...styles.input, ...(props.style || {}) }} />;
}

export function Select({ children, ...props }) {
  return (
    <select {...props} style={{ ...styles.input, ...(props.style || {}) }}>
      {children}
    </select>
  );
}

export function Button({ variant = "primary", style, ...props }) {
  const variantStyle = variant === "primary" ? styles.btnPrimary : variant === "danger" ? styles.btnDanger : styles.btnGhost;
  return <button {...props} style={{ ...styles.btnBase, ...variantStyle, ...style }} />;
}

export function Banner({ type = "info", children }) {
  const map = {
    info: { bg: "#F3ECE1", color: "var(--cocoa-700)" },
    error: { bg: "#FBEAE8", color: "var(--brick-600)" },
    success: { bg: "#EAF3E7", color: "var(--pistachio-600)" },
  };
  const c = map[type];
  return <div style={{ background: c.bg, color: c.color, padding: "10px 14px", borderRadius: "var(--radius-md)", fontSize: 13.5, fontWeight: 600, marginBottom: 16 }}>{children}</div>;
}

const styles = {
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22, gap: 16, flexWrap: "wrap" },
  title: { margin: 0, fontSize: 22, fontWeight: 800, color: "var(--cocoa-900)" },
  subtitle: { margin: "6px 0 0", fontSize: 14, color: "var(--cocoa-500)" },
  card: { background: "var(--white)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 22, boxShadow: "var(--shadow-soft)" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 14 },
  th: { textAlign: "start", padding: "10px 12px", color: "var(--cocoa-500)", fontWeight: 700, fontSize: 12.5, borderBottom: "1.5px solid var(--border)", whiteSpace: "nowrap" },
  tr: { borderBottom: "1px solid var(--border)" },
  td: { padding: "12px 12px", color: "var(--cocoa-900)" },
  emptyLabel: { color: "var(--cocoa-500)", fontSize: 14, padding: "18px 0" },
  field: { display: "flex", flexDirection: "column", gap: 6, fontSize: 13.5, fontWeight: 600, color: "var(--cocoa-700)" },
  fieldLabel: { fontSize: 13 },
  input: { padding: "9px 12px", borderRadius: "var(--radius-md)", border: "1.5px solid var(--border)", fontSize: 14, background: "var(--ivory-50)", color: "var(--cocoa-900)", width: "100%" },
  btnBase: { padding: "9px 16px", borderRadius: "var(--radius-md)", fontSize: 13.5, fontWeight: 700 },
  btnPrimary: { background: "var(--cocoa-900)", color: "var(--ivory-50)" },
  btnDanger: { background: "#FBEAE8", color: "var(--brick-600)" },
  btnGhost: { background: "var(--ivory-100)", color: "var(--cocoa-700)" },
};
