import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useApiData } from "../hooks/useApiData";
import { api } from "../api/client";
import AppLayout from "../components/AppLayout";
import { PageShell, Card, Table, Field, TextInput, Select, Button, Banner } from "../components/ui";

export default function RecipesPage() {
  const { token } = useAuth();
  const { data: recipes, error, loading, reload } = useApiData((t) => api.recipes.list(t));
  const { data: products } = useApiData((t) => api.products.list(t));
  const { data: rawMaterials } = useApiData((t) => api.rawMaterials.list(t));

  const [productId, setProductId] = useState("");
  const [items, setItems] = useState([{ rawMaterialId: "", quantity: "" }]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const updateItem = (i, field, value) => {
    const next = [...items];
    next[i][field] = value;
    setItems(next);
  };

  const addRow = () => setItems([...items, { rawMaterialId: "", quantity: "" }]);
  const removeRow = (i) => setItems(items.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");
    try {
      await api.recipes.create(token, {
        productId,
        items: items.map((it) => ({ rawMaterialId: it.rawMaterialId, quantity: Number(it.quantity) })),
      });
      setProductId("");
      setItems([{ rawMaterialId: "", quantity: "" }]);
      reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <PageShell title="الوصفات" subtitle="خامات وكميات كل منتج">
        <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 20, alignItems: "start" }}>
          <Card>
            <h3 style={{ marginTop: 0 }}>إضافة وصفة</h3>
            {formError && <Banner type="error">{formError}</Banner>}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Field label="المنتج">
                <Select required value={productId} onChange={(e) => setProductId(e.target.value)}>
                  <option value="">اختر منتج</option>
                  {products?.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </Select>
              </Field>

              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "var(--cocoa-700)", marginBottom: 8 }}>الخامات المطلوبة</p>
                {items.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                    <Select required value={item.rawMaterialId} onChange={(e) => updateItem(i, "rawMaterialId", e.target.value)}>
                      <option value="">اختر خامة</option>
                      {rawMaterials?.map((rm) => (
                        <option key={rm._id} value={rm._id}>
                          {rm.name} ({rm.unit})
                        </option>
                      ))}
                    </Select>
                    <TextInput
                      required
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="الكمية"
                      style={{ width: 100 }}
                      value={item.quantity}
                      onChange={(e) => updateItem(i, "quantity", e.target.value)}
                    />
                    {items.length > 1 && (
                      <Button type="button" variant="danger" onClick={() => removeRow(i)}>
                        ✕
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="ghost" onClick={addRow}>
                  + إضافة خامة
                </Button>
              </div>

              <Button type="submit" disabled={submitting}>
                {submitting ? "جاري الحفظ..." : "حفظ الوصفة"}
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
                  { key: "product", label: "المنتج", render: (r) => r.productId?.name || "—" },
                  {
                    key: "items",
                    label: "الخامات",
                    render: (r) =>
                      r.items?.map((it) => `${it.rawMaterialId?.name || "?"} (${it.quantity})`).join("، "),
                  },
                ]}
                rows={recipes}
              />
            )}
          </Card>
        </div>
      </PageShell>
    </AppLayout>
  );
}
