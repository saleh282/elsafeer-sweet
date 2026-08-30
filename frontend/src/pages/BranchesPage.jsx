import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useApiData } from "../hooks/useApiData";
import { api } from "../api/client";
import AppLayout from "../components/AppLayout";
import { PageShell, Card, Table, Field, TextInput, Button, Banner } from "../components/ui";

export default function BranchesPage() {
  const { token } = useAuth();
  const { data: branches, error, loading, reload } = useApiData((t) => api.branches.list(t));
  const [form, setForm] = useState({ name: "", address: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");
    try {
      await api.branches.create(token, form);
      setForm({ name: "", address: "", phone: "" });
      reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const deactivate = async (id) => {
    await api.branches.remove(token, id);
    reload();
  };

  return (
    <AppLayout>
      <PageShell title="الفروع" subtitle="إدارة فروع النشاط">
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20, alignItems: "start" }}>
          <Card>
            <h3 style={{ marginTop: 0 }}>إضافة فرع جديد</h3>
            {formError && <Banner type="error">{formError}</Banner>}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Field label="اسم الفرع">
                <TextInput required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </Field>
              <Field label="العنوان">
                <TextInput value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </Field>
              <Field label="رقم الهاتف">
                <TextInput value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} dir="ltr" />
              </Field>
              <Button type="submit" disabled={submitting}>
                {submitting ? "جاري الحفظ..." : "إضافة الفرع"}
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
                  { key: "address", label: "العنوان" },
                  { key: "phone", label: "الهاتف" },
                  {
                    key: "isActive",
                    label: "الحالة",
                    render: (r) => (r.isActive ? "نشط" : "غير نشط"),
                  },
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
                rows={branches}
              />
            )}
          </Card>
        </div>
      </PageShell>
    </AppLayout>
  );
}
