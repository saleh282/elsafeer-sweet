import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useApiData } from "../hooks/useApiData";
import { api } from "../api/client";
import AppLayout from "../components/AppLayout";
import { PageShell, Card, Table, Field, TextInput, Button, Banner } from "../components/ui";

const emptyForm = { name: "", unit: "", cost: "", minStockLevel: "" };

export default function RawMaterialsPage() {
  const { token } = useAuth();
  const { data: rawMaterials, error, loading, reload } = useApiData((t) => api.rawMaterials.list(t));
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");
    try {
      await api.rawMaterials.create(token, {
        ...form,
        cost: Number(form.cost) || 0,
        minStockLevel: Number(form.minStockLevel) || 0,
      });
      setForm(emptyForm);
      reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("حذف هذه الخامة؟")) return;
    await api.rawMaterials.remove(token, id);
    reload();
  };

  return (
    <AppLayout>
      <PageShell title="الخامات" subtitle="الخامات المستخدمة في التصنيع">
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20, alignItems: "start" }}>
          <Card>
            <h3 style={{ marginTop: 0 }}>إضافة خامة</h3>
            {formError && <Banner type="error">{formError}</Banner>}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Field label="اسم الخامة">
                <TextInput required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </Field>
              <Field label="وحدة القياس">
                <TextInput required placeholder="كيلو، لتر..." value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
              </Field>
              <Field label="التكلفة لكل وحدة">
                <TextInput type="number" min="0" step="0.01" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} />
              </Field>
              <Field label="الحد الأدنى للمخزون">
                <TextInput type="number" min="0" value={form.minStockLevel} onChange={(e) => setForm({ ...form, minStockLevel: e.target.value })} />
              </Field>
              <Button type="submit" disabled={submitting}>
                {submitting ? "جاري الحفظ..." : "إضافة"}
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
                  { key: "name", label: "الاسم" },
                  { key: "unit", label: "الوحدة" },
                  { key: "cost", label: "التكلفة" },
                  { key: "minStockLevel", label: "الحد الأدنى" },
                  {
                    key: "actions",
                    label: "",
                    render: (r) => (
                      <Button variant="danger" onClick={() => remove(r._id)}>
                        حذف
                      </Button>
                    ),
                  },
                ]}
                rows={rawMaterials}
              />
            )}
          </Card>
        </div>
      </PageShell>
    </AppLayout>
  );
}
