import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useApiData } from "../hooks/useApiData";
import { api } from "../api/client";
import AppLayout from "../components/AppLayout";
import { PageShell, Card, Table, Field, TextInput, Select, Button, Banner } from "../components/ui";

const emptyForm = { recipeId: "", branchId: "", quantityProduced: "" };

export default function ProductionPage() {
  const { token } = useAuth();
  const { data: batches, error, loading, reload } = useApiData((t) => api.production.list(t));
  const { data: recipes } = useApiData((t) => api.recipes.list(t));
  const { data: branches } = useApiData((t) => api.branches.list(t));

  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");
    try {
      await api.production.create(token, {
        ...form,
        quantityProduced: Number(form.quantityProduced),
      });
      setForm(emptyForm);
      reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <PageShell title="الإنتاج" subtitle="تسجيل دفعات الإنتاج — بتخصم الخامات وتضيف المنتج تلقائيًا">
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20, alignItems: "start" }}>
          <Card>
            <h3 style={{ marginTop: 0 }}>تسجيل دفعة إنتاج</h3>
            {formError && <Banner type="error">{formError}</Banner>}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Field label="الوصفة">
                <Select required value={form.recipeId} onChange={(e) => setForm({ ...form, recipeId: e.target.value })}>
                  <option value="">اختر وصفة</option>
                  {recipes?.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.productId?.name || r.name || r._id}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="الفرع / المصنع">
                <Select required value={form.branchId} onChange={(e) => setForm({ ...form, branchId: e.target.value })}>
                  <option value="">اختر فرع</option>
                  {branches?.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="الكمية المنتجة">
                <TextInput
                  required
                  type="number"
                  min="1"
                  value={form.quantityProduced}
                  onChange={(e) => setForm({ ...form, quantityProduced: e.target.value })}
                />
              </Field>
              <Button type="submit" disabled={submitting}>
                {submitting ? "جاري التسجيل..." : "تسجيل الإنتاج"}
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
                  { key: "branch", label: "الفرع", render: (r) => r.branchId?.name || "—" },
                  { key: "quantityProduced", label: "الكمية" },
                  {
                    key: "productionDate",
                    label: "التاريخ",
                    render: (r) => new Date(r.productionDate).toLocaleDateString("ar-EG"),
                  },
                ]}
                rows={batches}
              />
            )}
          </Card>
        </div>
      </PageShell>
    </AppLayout>
  );
}
