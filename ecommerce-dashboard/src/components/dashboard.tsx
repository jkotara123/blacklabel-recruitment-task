import { useState } from "react";
import type { TimeRange } from "../types/chart.types";
import CustomerChart from "./charts/customer-chart";
import CategoryDrilldownChart from "./charts/category-column-chart";
import DeliveryTimeBubbleMap from "./charts/bubble-map";
import useOrderData from "../data/useOrders";

// Style wspólne dla kart i etykiet
const cardStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
  minWidth: 0,
  boxSizing: "border-box" as const,
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "bold",
  fontSize: "14px",
  color: "#333",
};

const selectStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "6px",
  border: "1px solid #ddd",
  backgroundColor: "#fff",
  cursor: "pointer",
  fontSize: "14px",
  appearance: "none" as const, // Usuwa domyślny styl systemu
  backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23333%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px top 50%",
  backgroundSize: "12px auto",
};

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>("month");
  const [dataSource, setDataSource] = useState("generated-data.json");
  const { data, loading } = useOrderData(dataSource);

  if (loading || !data) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          width: "100%",
          color: "#555",
        }}
      >
        {loading ? "Ładowanie danych..." : "Nie znaleziono danych"}
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#f5f7fa",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "30px 20px",
        boxSizing: "border-box",
      }}
    >
      <div
        className="dashboard-grid"
        style={{
          width: "100%",
          maxWidth: "1200px",
          display: "grid",
          gap: "24px",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateAreas: `
          "header header"
          "customer column"
          "map map"
        `,
        }}
      >
        <header
          className="dashboard-header"
          style={{
            gridArea: "header",
            ...cardStyle,
            display: "flex",
            flexDirection: "row",
            gap: "24px",
            alignItems: "flex-end",
          }}
        >
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>DATA SOURCE</label>
            <select
              value={dataSource}
              onChange={(e) => setDataSource(e.target.value)}
              style={selectStyle}
            >
              <option value="generated-data.json">
                Generated Data (Large)
              </option>
              <option value="data.json">Mock Data (Small)</option>
            </select>
          </div>

          <div style={{ flex: 1 }}>
            <label style={labelStyle}>TIME RANGE</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
              style={selectStyle}
            >
              <option value="all">ALL TIME</option>
              <option value="year">LAST YEAR</option>
              <option value="month">LAST MONTH</option>
            </select>
          </div>
        </header>

        <section
          style={{ ...cardStyle, gridArea: "customer", minHeight: "400px" }}
        >
          <CustomerChart
            orders={data.orders}
            currency={data.meta.currency}
            timeRange={timeRange}
          />
        </section>

        <section
          style={{ ...cardStyle, gridArea: "column", minHeight: "400px" }}
        >
          <CategoryDrilldownChart
            orders={data.orders}
            currency={data.meta.currency}
            timeRange={timeRange}
          />
        </section>

        <section
          style={{
            ...cardStyle,
            gridArea: "map",
            minHeight: "450px",
          }}
        >
          <DeliveryTimeBubbleMap
            orders={data.orders}
            currency={data.meta.currency}
            timeRange={timeRange}
          />
        </section>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .dashboard-grid { 
            grid-template-columns: 1fr !important; 
            grid-template-areas: 
              "header" 
              "customer" 
              "column" 
              "map" !important; 
          }
          .dashboard-header {
            flex-direction: column !important;
            align-items: stretch !important;
          }
        }
        @media (max-width: 600px) { 
          .dashboard-grid { gap: 16px !important; } 
          div[style*="padding: 30px 20px"] { padding: 20px 10px !important; }
        }
      `}</style>
    </div>
  );
}
