import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useApiData } from "../hooks/useApiData";
import { api } from "../api/client";
import AppLayout from "../components/AppLayout";
import { PageShell, Card, Table, Field, TextInput, Select, Button, Banner } from "../components/ui";

export default function PurchasesPage() {
  const { token } = useAuth();
  const { data: invoices, error, loading, reload } = useApiData((t) => api.purchases.list(t));
  const { data: suppliers } = useApiData((t) => api.suppliers.list(t));
  const { data: branches } = useApiData((t) => api.branches.list(t));
  const { data: rawMaterials } = useApiData((t) => api.rawMaterials.list(t));

  const [supplierId, setSupplierId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [items, setItems] = useState([{ rawMaterialId: "", quantity: "", price: "" }]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [payingId, setPayingId] = useState(null);
  const [payAmount, setPayAmount] = useState("");

  const updateItem = (i, field, value) => {
    const next = [...items];
    next[i][field] = value;
    setItems(next);
  };
  const addRow = () => setItems([...items, { rawMaterialId: "", quantity: "", price: "" }]);
  const removeRow = (i) => setItems(items.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");
    try {
      await api.purchases.create(token, {
        supplierId,
        branchId,
        items: items.map((it) => ({ rawMaterialId: it.rawMaterialId, quantity: Number(it.quantity), price: Number(it.price) })),
      });
      setSupplierId("");
      setBranchId("");
      setItems([{ rawMaterialId: "", quantity: "", price: "" }]);
      reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const submitPayment = async (invoiceId) => {
    try {
      await api.payments.create(token, { purchaseInvoiceId: invoiceId, amount: Number(payAmount) });
      setPayingId(null);
      setPayAmount("");
      reload();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <AppLayout>
      <PageShell title="المشتريات" subtitle="فواتير شراء الخامات — بتزوّد المخزون تلقائيًا">
        <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 20, alignItems: "start" }}>
          <Card>
            <h3 style={{ marginTop: 0 }}>فاتورة شراء جديدة</h3>
            {formError && <Banner type="error">{formError}</Banner>}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Field label="المورد">
                <Select required value={supplierId} onChange={(e) => setSupplierId(e.target.value)}>
                  <option value="">اختر مورد</option>
                  {suppliers?.map((s) => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </Select>
              </Field>
              <Field label="الفرع المستلم">
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
                    <Select required value={item.rawMaterialId} onChange={(e) => updateItem(i, "rawMaterialId", e.target.value)}>
                      <option value="">الخامة</option>
                      {rawMaterials?.map((rm) => (
                        <option key={rm._id} value={rm._id}>{rm.name}</option>
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
                  { key: "supplier", label: "المورد", render: (r) => r.supplierId?.name || "—" },
                  { key: "branch", label: "الفرع", render: (r) => r.branchId?.name || "—" },
                  { key: "total", label: "الإجمالي" },
                  { key: "paidAmount", label: "المدفوع" },
                  { key: "due", label: "المتبقي", render: (r) => r.total - r.paidAmount },
                  {
                    key: "pay",
                    label: "",
                    render: (r) =>
                      r.total - r.paidAmount > 0 &&
                      (payingId === r._id ? (
                        <div style={{ display: "flex", gap: 6 }}>
                          <TextInput type="number" min="0" step="0.01" style={{ width: 90 }} value={payAmount} onChange={(e) => setPayAmount(e.target.value)} />
                          <Button onClick={() => submitPayment(r._id)}>تأكيد</Button>
                        </div>
                      ) : (
                        <Button variant="ghost" onClick={() => setPayingId(r._id)}>تسجيل دفعة</Button>
                      )),
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
