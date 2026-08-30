import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useApiData } from "../hooks/useApiData";
import { api } from "../api/client";
import AppLayout from "../components/AppLayout";
import { PageShell, Card, Table, Field, Select, TextInput, Button, Banner } from "../components/ui";

export default function ReturnsPage() {
  const { token } = useAuth();
  const { data: returns, error, loading, reload } = useApiData((t) => api.returns.list(t));
  const { data: sales } = useApiData((t) => api.sales.list(t));

  const [saleInvoiceId, setSaleInvoiceId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [items, setItems] = useState([{ productId: "", quantity: "", price: "", reason: "" }]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const selectedSale = sales?.find((s) => s._id === saleInvoiceId);

  const onSelectSale = (id) => {
    setSaleInvoiceId(id);
    const sale = sales?.find((s) => s._id === id);
    if (sale) {
      setBranchId(sale.branchId?._id || sale.branchId);
      setItems(sale.items.map((it) => ({ productId: it.productId?._id || it.productId, quantity: "", price: it.price, reason: "" })));
    }
  };

  const updateItem = (i, field, value) => {
    const next = [...items];
    next[i][field] = value;
    setItems(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");
    try {
      const filledItems = items.filter((it) => Number(it.quantity) > 0);
      if (filledItems.length === 0) throw new Error("أدخل كمية مرتجعة لصنف واحد على الأقل");

      await api.returns.create(token, {
        saleInvoiceId,
        branchId,
        items: filledItems.map((it) => ({
          productId: it.productId,
          quantity: Number(it.quantity),
          price: Number(it.price),
          reason: it.reason,
        })),
      });
      setSaleInvoiceId("");
      setBranchId("");
      setItems([{ productId: "", quantity: "", price: "", reason: "" }]);
      reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <PageShell title="المرتجعات" subtitle="مرتجعات مرتبطة بفواتير بيع سابقة">
        <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 20, alignItems: "start" }}>
          <Card>
            <h3 style={{ marginTop: 0 }}>مرتجع جديد</h3>
            {formError && <Banner type="error">{formError}</Banner>}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Field label="فاتورة البيع الأصلية">
                <Select required value={saleInvoiceId} onChange={(e) => onSelectSale(e.target.value)}>
                  <option value="">اختر فاتورة</option>
                  {sales?.map((s) => (
                    <option key={s._id} value={s._id}>
                      {new Date(s.invoiceDate).toLocaleDateString("ar-EG")} — {s.branchId?.name} — {s.total} ج.م
                    </option>
                  ))}
                </Select>
              </Field>

              {selectedSale && (
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "var(--cocoa-700)", marginBottom: 8 }}>حدد كمية كل صنف مرتجع (اتركه فارغًا لو مش مرتجع)</p>
                  {items.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 6, marginBottom: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 13, minWidth: 90 }}>{selectedSale.items[i]?.productId?.name || "منتج"}</span>
                      <TextInput type="number" min="0" placeholder="الكمية" style={{ width: 80 }} value={item.quantity} onChange={(e) => updateItem(i, "quantity", e.target.value)} />
                      <TextInput placeholder="السبب (اختياري)" style={{ flex: 1 }} value={item.reason} onChange={(e) => updateItem(i, "reason", e.target.value)} />
                    </div>
                  ))}
                </div>
              )}

              <Button type="submit" disabled={submitting || !saleInvoiceId}>
                {submitting ? "جاري الحفظ..." : "حفظ المرتجع"}
              </Button>
            </form>
          </Card>

          <Card>
            {error && <Banner type="error">{error}</Banner>}
            {loading ? (
              <p>جاري التحميل...</p>
            ) : (
              <Table
                columns={[
                  { key: "branch", label: "الفرع", render: (r) => r.branchId?.name || "—" },
                  { key: "total", label: "الإجمالي" },
                  {
                    key: "invoiceDate",
                    label: "التاريخ",
                    render: (r) => new Date(r.invoiceDate).toLocaleDateString("ar-EG"),
                  },
                ]}
                rows={returns}
              />
            )}
          </Card>
        </div>
      </PageShell>
    </AppLayout>
  );
}
