import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useApiData } from "../hooks/useApiData";
import { api } from "../api/client";
import AppLayout from "../components/AppLayout";
import { PageShell, Card, Table, Field, TextInput, Button, Banner } from "../components/ui";

export default function CategoriesPage() {
  const { token } = useAuth();
  const { data: categories, error, loading, reload } = useApiData((t) => api.categories.list(t));
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");
    try {
      await api.categories.create(token, { name });
      setName("");
      reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("حذف هذا التصنيف؟")) return;
    await api.categories.remove(token, id);
    reload();
  };

  return (
    <AppLayout>
      <PageShell title="التصنيفات" subtitle="تصنيفات المنتجات">
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20, alignItems: "start" }}>
          <Card>
            <h3 style={{ marginTop: 0 }}>إضافة تصنيف</h3>
            {formError && <Banner type="error">{formError}</Banner>}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Field label="اسم التصنيف">
                <TextInput required value={name} onChange={(e) => setName(e.target.value)} />
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
                rows={categories}
              />
            )}
          </Card>
        </div>
      </PageShell>
    </AppLayout>
  );
}
