import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useApiData } from "../hooks/useApiData";
import { api } from "../api/client";
import AppLayout from "../components/AppLayout";
import { PageShell, Card, Table, Field, Select, TextInput, Button, Banner } from "../components/ui";

export default function SalesPage() {
  const { token } = useAuth();
  const { data: invoices, error, loading, reload } = useApiData((t) => api.sales.list(t));
  const { data: branches } = useApiData((t) => api.branches.list(t));
  const { data: products } = useApiData((t) => api.products.list(t));

  const [branchId, setBranchId] = useState("");
  const [items, setItems] = useState([{ productId: "", quantity: "", price: "" }]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const updateItem = (i, field, value) => {
    const next = [...items];
    next[i][field] = value;
    if (field === "productId") {
      const product = products?.find((p) => p._id === value);
      if (product) next[i].price = product.price;
    }
    setItems(next);
  };
  const addRow = () => setItems([...items, { productId: "", quantity: "", price: "" }]);
  const removeRow = (i) => setItems(items.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");
    try {
      await api.sales.create(token, {
        branchId,
        items: items.map((it) => ({ productId: it.productId, quantity: Number(it.quantity), price: Number(it.price) })),
      });
      setBranchId("");
      setItems([{ productId: "", quantity: "", price: "" }]);
      reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <PageShell title="المبيعات" subtitle="فواتير البيع — بتخصم مخزون الفرع تلقائيًا">
        <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 20, alignItems: "start" }}>
          <Card>
            <h3 style={{ marginTop: 0 }}>فاتورة بيع جديدة</h3>
            {formError && <Banner type="error">{formError}</Banner>}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Field label="الفرع">
                <Select required value={branchId} onChange={(e) => setBranchId(e.target.value)}>
                  <option value="">اختر فرع</option>
                  {branches?.map((b) => (
                    <option key={b._id} value={b._id}>{b.name}</option>
                  ))}
                </Select>
              </Field>

              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "var(--cocoa-700)", marginBottom: 8 }}>الأصناف</p>
                {items.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                    <Select required value={item.productId} onChange={(e) => updateItem(i, "productId", e.target.value)}>
                      <option value="">المنتج</option>
                      {products?.map((p) => (
                        <option key={p._id} value={p._id}>{p.name}</option>
                      ))}
                    </Select>
                    <TextInput required type="number" min="0" placeholder="الكمية" style={{ width: 80 }} value={item.quantity} onChange={(e) => updateItem(i, "quantity", e.target.value)} />
                    <TextInput required type="number" min="0" step="0.01" placeholder="السعر" style={{ width: 90 }} value={item.price} onChange={(e) => updateItem(i, "price", e.target.value)} />
                    {items.length > 1 && (
                      <Button type="button" variant="danger" onClick={() => removeRow(i)}>✕</Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="ghost" onClick={addRow}>+ إضافة صنف</Button>
              </div>

              <Button type="submit" disabled={submitting}>
                {submitting ? "جاري الحفظ..." : "حفظ الفاتورة"}
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
                rows={invoices}
              />
            )}
          </Card>
        </div>
      </PageShell>
    </AppLayout>
  );
}
