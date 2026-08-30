import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useApiData } from "../hooks/useApiData";
import { api } from "../api/client";
import AppLayout from "../components/AppLayout";
import { PageShell, Card, Table, Field, TextInput, Select, Button, Banner } from "../components/ui";

const roleOptions = [
  { value: "owner", label: "مالك" },
  { value: "manager", label: "مدير فرع" },
  { value: "cashier", label: "كاشير" },
  { value: "factory_staff", label: "عامل مصنع" },
  { value: "store_staff", label: "عامل فرع" },
];

const emptyForm = { name: "", email: "", password: "", roleName: "cashier", branchId: "" };

export default function UsersPage() {
  const { token, user } = useAuth();
  const { data: users, error, loading, reload } = useApiData((t) => api.users.list(t));
  const { data: branches } = useApiData((t) => api.branches.list(t));

  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  if (user && user.role !== "owner") {
    return (
      <AppLayout>
        <PageShell title="المستخدمون">
          <Banner type="error">هذه الصفحة متاحة للمالك فقط.</Banner>
        </PageShell>
      </AppLayout>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");
    try {
      await api.users.create(token, { ...form, branchId: form.branchId || undefined });
      setForm(emptyForm);
      reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (u) => {
    await api.users.update(token, u._id, { isActive: !u.isActive });
    reload();
  };

  return (
    <AppLayout>
      <PageShell title="المستخدمون" subtitle="إدارة حسابات العاملين وصلاحياتهم">
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20, alignItems: "start" }}>
          <Card>
            <h3 style={{ marginTop: 0 }}>إضافة مستخدم</h3>
            {formError && <Banner type="error">{formError}</Banner>}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Field label="الاسم">
                <TextInput required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </Field>
              <Field label="البريد الإلكتروني">
                <TextInput required type="email" dir="ltr" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </Field>
              <Field label="كلمة المرور">
                <TextInput required type="password" dir="ltr" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </Field>
              <Field label="الدور">
                <Select value={form.roleName} onChange={(e) => setForm({ ...form, roleName: e.target.value })}>
                  {roleOptions.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </Select>
              </Field>
              <Field label="الفرع (اختياري للمالك)">
                <Select value={form.branchId} onChange={(e) => setForm({ ...form, branchId: e.target.value })}>
                  <option value="">بدون فرع محدد</option>
                  {branches?.map((b) => (
                    <option key={b._id} value={b._id}>{b.name}</option>
                  ))}
                </Select>
              </Field>
              <Button type="submit" disabled={submitting}>
                {submitting ? "جاري الحفظ..." : "إضافة المستخدم"}
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
                  { key: "email", label: "البريد الإلكتروني" },
                  { key: "role", label: "الدور", render: (r) => r.roleId?.name || "—" },
                  { key: "branch", label: "الفرع", render: (r) => r.branchId?.name || "كل الفروع" },
                  { key: "isActive", label: "الحالة", render: (r) => (r.isActive ? "نشط" : "معطّل") },
                  {
                    key: "actions",
                    label: "",
                    render: (r) => (
                      <Button variant={r.isActive ? "danger" : "ghost"} onClick={() => toggleActive(r)}>
                        {r.isActive ? "تعطيل" : "تفعيل"}
                      </Button>
                    ),
                  },
                ]}
                rows={users}
              />
            )}
          </Card>
        </div>
      </PageShell>
    </AppLayout>
  );
}
