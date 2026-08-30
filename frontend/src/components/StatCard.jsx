export default function StatCard({ label, value, accent = "var(--caramel-600)", suffix = "" }) {
  return (
    <div style={styles.card}>
      <span style={{ ...styles.bar, background: accent }} />
      <div style={styles.body}>
        <p style={styles.label}>{label}</p>
        <p className="numeral" style={styles.value}>
          {value}
          {suffix && <span style={styles.suffix}> {suffix}</span>}
        </p>
      </div>
    </div>
  );
}

const styles = {
  card: {
    position: "relative",
    background: "var(--white)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    padding: "20px 22px",
    overflow: "hidden",
    boxShadow: "var(--shadow-soft)",
  },
  bar: {
    position: "absolute",
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    width: 5,
  },
  body: { paddingInlineStart: 6 },
  label: { margin: "0 0 8px", fontSize: 13.5, fontWeight: 600, color: "var(--cocoa-500)" },
  value: { margin: 0, fontSize: 28, fontWeight: 800, color: "var(--cocoa-900)" },
  suffix: { fontSize: 14, fontWeight: 600, color: "var(--cocoa-500)" },
};
