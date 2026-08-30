import { useState } from "react";
import { useApiData } from "../hooks/useApiData";
import { api } from "../api/client";
import AppLayout from "../components/AppLayout";
import { PageShell, Card, Table, Banner } from "../components/ui";

const tabs = [
  { key: "products", label: "مخزون المنتجات" },
  { key: "rawMaterials", label: "مخزون الخامات" },
  { key: "lowStock", label: "تنبيهات نقص المخزون" },
];

export default function InventoryPage() {
  const [tab, setTab] = useState("products");

  const { data: productInventory, error: productsError, loading: productsLoading } = useApiData(
    (t) => api.inventory.products(t)
  );
  const { data: rawMaterialInventory, error: rawError, loading: rawLoading } = useApiData(
    (t) => api.inventory.rawMaterials(t)
  );
  const { data: lowStock, error: lowError, loading: lowLoading } = useApiData((t) => api.inventory.lowStock(t));

  return (
    <AppLayout>
      <PageShell title="المخزون" subtitle="مستويات المخزون الحالية في كل فرع">
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: "9px 16px",
                borderRadius: "var(--radius-md)",
                fontSize: 13.5,
                fontWeight: 700,
                background: tab === t.key ? "var(--cocoa-900)" : "var(--ivory-100)",
                color: tab === t.key ? "var(--ivory-50)" : "var(--cocoa-700)",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <Card>
          {tab === "products" && (
            <>
              {productsError && <Banner type="error">{productsError}</Banner>}
              {productsLoading ? (
                <p>جاري التحميل...</p>
              ) : (
                <Table
                  columns={[
                    { key: "branch", label: "الفرع", render: (r) => r.branchId?.name || "—" },
                    { key: "product", label: "المنتج", render: (r) => r.productId?.name || "—" },
                    { key: "unit", label: "الوحدة", render: (r) => r.productId?.unit || "—" },
                    { key: "quantity", label: "الكمية المتاحة" },
                  ]}
                  rows={productInventory}
                />
              )}
            </>
          )}

          {tab === "rawMaterials" && (
            <>
              {rawError && <Banner type="error">{rawError}</Banner>}
              {rawLoading ? (
                <p>جاري التحميل...</p>
              ) : (
                <Table
                  columns={[
                    { key: "branch", label: "الفرع", render: (r) => r.branchId?.name || "—" },
                    { key: "rawMaterial", label: "الخامة", render: (r) => r.rawMaterialId?.name || "—" },
                    { key: "unit", label: "الوحدة", render: (r) => r.rawMaterialId?.unit || "—" },
                    { key: "quantity", label: "الكمية المتاحة" },
                    { key: "minStockLevel", label: "الحد الأدنى", render: (r) => r.rawMaterialId?.minStockLevel ?? "—" },
                  ]}
                  rows={rawMaterialInventory}
                />
              )}
            </>
          )}

          {tab === "lowStock" && (
            <>
              {lowError && <Banner type="error">{lowError}</Banner>}
              {lowLoading ? (
                <p>جاري التحميل...</p>
              ) : lowStock && lowStock.length > 0 ? (
                <Table
                  columns={[
                    { key: "branch", label: "الفرع", render: (r) => r.branchId?.name || "—" },
                    { key: "rawMaterial", label: "الخامة", render: (r) => r.rawMaterialId?.name || "—" },
                    { key: "quantity", label: "المتاح حاليًا" },
                    { key: "minStockLevel", label: "الحد الأدنى", render: (r) => r.rawMaterialId?.minStockLevel },
                  ]}
                  rows={lowStock}
                />
              ) : (
                <Banner type="success">لا توجد خامات أوشكت على النفاد 🎉</Banner>
              )}
            </>
          )}
        </Card>
      </PageShell>
    </AppLayout>
  );
}
