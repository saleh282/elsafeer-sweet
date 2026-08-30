import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useApiData } from "../hooks/useApiData";
import { api } from "../api/client";
import AppLayout from "../components/AppLayout";
import { PageShell, Card, Table, Field, TextInput, Select, Button, Banner } from "../components/ui";

const emptyForm = { name: "", categoryId: "", price: "", unit: "", description: "", imageUrl: "" };

export default function ProductsPage() {
  const { token } = useAuth();
  const { data: products, error, loading, reload } = useApiData((t) => api.products.list(t));
  const { data: categories } = useApiData((t) => api.categories.list(t));
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");
    try {
      await api.products.create(token, { ...form, price: Number(form.price) });
      setForm(emptyForm);
      reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const deactivate = async (id) => {
    await api.products.remove(token, id);
    reload();
  };

  return (
    <AppLayout>
      <PageShell title="المنتجات" subtitle="المنتجات النهائية المعروضة للبيع">
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20, alignItems: "start" }}>
          <Card>
            <h3 style={{ marginTop: 0 }}>إضافة منتج</h3>
            {formError && <Banner type="error">{formError}</Banner>}
            {(!categories || categories.length === 0) && !formError && (
              <Banner type="info">أضف تصنيف واحد على الأقل قبل إضافة منتج.</Banner>
            )}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Field label="اسم المنتج">
                <TextInput required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </Field>
              <Field label="التصنيف">
                <Select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                  <option value="">اختر تصنيف</option>
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="السعر">
                <TextInput required type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </Field>
              <Field label="الوحدة">
                <TextInput required placeholder="قطعة، كيلو..." value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
              </Field>
              <Field label="الوصف (اختياري)">
                <TextInput value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </Field>
              <Field label="رابط صورة المنتج (اختياري)">
                <TextInput
                  dir="ltr"
                  placeholder="https://..."
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                />
              </Field>
              <Button type="submit" disabled={submitting}>
                {submitting ? "جاري الحفظ..." : "إضافة المنتج"}
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
                  {
                    key: "image",
                    label: "",
                    render: (r) =>
                      r.imageUrl ? (
                        <img
                          src={r.imageUrl}
                          alt={r.name}
                          style={{ width: 42, height: 42, objectFit: "cover", borderRadius: 8, display: "block" }}
                          onError={(e) => { e.currentTarget.style.display = "none"; }}
                        />
                      ) : (
                        <span style={{ fontSize: 20 }}>🍰</span>
                      ),
                  },
                  { key: "name", label: "الاسم" },
                  { key: "category", label: "التصنيف", render: (r) => r.categoryId?.name || "—" },
                  { key: "price", label: "السعر", render: (r) => r.price },
                  { key: "unit", label: "الوحدة" },
                  { key: "isActive", label: "الحالة", render: (r) => (r.isActive ? "متاح" : "غير متاح") },
                  {
                    key: "actions",
                    label: "",
                    render: (r) =>
                      r.isActive && (
                        <Button variant="danger" onClick={() => deactivate(r._id)}>
                          إيقاف
                        </Button>
                      ),
                  },
                ]}
                rows={products}
              />
            )}
          </Card>
        </div>
      </PageShell>
    </AppLayout>
  );
}
