import { useAuth } from "../context/AuthContext";
import { useApiData } from "../hooks/useApiData";
import { api } from "../api/client";
import AppLayout from "../components/AppLayout";
import { PageShell, Banner } from "../components/ui";
import StatCard from "../components/StatCard";

function formatCurrency(n) {
  return new Intl.NumberFormat("ar-EG", { maximumFractionDigits: 0 }).format(n || 0);
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: summary, error, loading } = useApiData((t) => api.dashboard.summary(t));

  return (
    <AppLayout>
      <PageShell title={`أهلًا، ${user?.name || ""} 👋`} subtitle="نظرة سريعة على أداء النشاط اليوم">
        {loading && <p style={{ color: "var(--cocoa-500)" }}>جاري تحميل البيانات...</p>}

        {error && !loading && (
          <Banner type="error">
            تعذر تحميل لوحة التحكم: {error}
            <br />
            تأكد إن السيرفر (backend) شغال على <code dir="ltr">http://localhost:5000</code> وإن قاعدة البيانات متصلة.
          </Banner>
        )}

        {summary && !loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 18 }}>
            <StatCard label="صافي مبيعات اليوم" value={formatCurrency(summary.netSalesToday)} suffix="ج.م" accent="var(--caramel-600)" />
            <StatCard label="إجمالي مبيعات اليوم" value={formatCurrency(summary.todaySalesTotal)} suffix="ج.م" accent="var(--honey-400)" />
            <StatCard label="مرتجعات اليوم" value={formatCurrency(summary.todayReturnsTotal)} suffix="ج.م" accent="var(--brick-600)" />
            <StatCard label="دفعات إنتاج اليوم" value={summary.productionBatchesToday} accent="var(--pistachio-600)" />
            <StatCard label="مستحقات الموردين" value={formatCurrency(summary.totalSupplierDue)} suffix="ج.م" accent="var(--cocoa-700)" />
            <StatCard label="خامات أوشكت على النفاد" value={summary.lowStockRawMaterialsCount} accent="var(--brick-600)" />
            <StatCard label="الفروع النشطة" value={summary.activeBranches} accent="var(--caramel-500)" />
          </div>
        )}
      </PageShell>
    </AppLayout>
  );
}
