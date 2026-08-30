import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import AppLayout from "../components/AppLayout";
import { PageShell, Card, Field, TextInput, Button, Banner } from "../components/ui";

const reportTypes = [
  { key: "sales", label: "تقرير المبيعات" },
  { key: "purchases", label: "تقرير المشتريات" },
  { key: "production", label: "تقرير الإنتاج" },
  { key: "returns", label: "تقرير المرتجعات" },
];

export default function ReportsPage() {
  const { token } = useAuth();
  const [type, setType] = useState("sales");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const runReport = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const query = new URLSearchParams();
      if (from) query.set("from", from);
      if (to) query.set("to", to);
      const qs = query.toString() ? `?${query.toString()}` : "";
      const data = await api.reports[type](token, qs);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <PageShell title="التقارير" subtitle="تقارير المبيعات، المشتريات، الإنتاج والمرتجعات">
        <Card style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "flex-end" }}>
            <Field label="نوع التقرير">
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={{ padding: "9px 12px", borderRadius: "var(--radius-md)", border: "1.5px solid var(--border)", fontSize: 14 }}
              >
                {reportTypes.map((r) => (
                  <option key={r.key} value={r.key}>{r.label}</option>
                ))}
              </select>
            </Field>
            <Field label="من تاريخ">
              <TextInput type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </Field>
            <Field label="إلى تاريخ">
              <TextInput type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </Field>
            <Button onClick={runReport} disabled={loading}>
              {loading ? "جاري التحميل..." : "عرض التقرير"}
            </Button>
          </div>
        </Card>

        {error && <Banner type="error">{error}</Banner>}

        {result && (
          <Card>
            <ReportResult type={type} result={result} />
          </Card>
        )}
      </PageShell>
    </AppLayout>
  );
}

function ReportResult({ type, result }) {
  if (type === "sales") {
    return (
      <div>
        <SummaryRow label="عدد الفواتير" value={result.invoiceCount} />
        <SummaryRow label="إجمالي المبيعات" value={result.totalSales} />
        {result.byProduct?.length > 0 && (
          <table style={{ width: "100%", marginTop: 14, borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr>
                <th style={thStyle}>معرّف المنتج</th>
                <th style={thStyle}>الكمية</th>
                <th style={thStyle}>الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              {result.byProduct.map((p) => (
                <tr key={p.productId}>
                  <td style={tdStyle}>{p.productId}</td>
                  <td style={tdStyle}>{p.quantity}</td>
                  <td style={tdStyle}>{p.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }

  if (type === "purchases") {
    return (
      <div>
        <SummaryRow label="عدد الفواتير" value={result.invoiceCount} />
        <SummaryRow label="إجمالي المشتريات" value={result.totalPurchases} />
        <SummaryRow label="إجمالي المدفوع" value={result.totalPaid} />
        <SummaryRow label="إجمالي المتبقي" value={result.totalDue} />
      </div>
    );
  }

  if (type === "production") {
    return (
      <div>
        <SummaryRow label="عدد دفعات الإنتاج" value={result.batchCount} />
        <SummaryRow label="إجمالي الكمية المنتجة" value={result.totalQuantityProduced} />
      </div>
    );
  }

  return (
    <div>
      <SummaryRow label="عدد فواتير المرتجعات" value={result.invoiceCount} />
      <SummaryRow label="إجمالي المرتجعات" value={result.totalReturns} />
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
      <span style={{ color: "var(--cocoa-500)", fontSize: 14 }}>{label}</span>
      <span className="numeral" style={{ fontWeight: 700, color: "var(--cocoa-900)" }}>{value}</span>
    </div>
  );
}

const thStyle = { textAlign: "start", padding: "8px 10px", color: "var(--cocoa-500)", fontSize: 12.5, borderBottom: "1.5px solid var(--border)" };
const tdStyle = { padding: "8px 10px", borderBottom: "1px solid var(--border)" };
