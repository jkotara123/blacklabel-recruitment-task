import { useState } from "react";
import type { TimeRange } from "../types/chart.types";
import CustomerChart from "./charts/customer-chart";
import CategoryDrilldownChart from "./charts/category-column-chart";
import DeliveryTimeBubbleMap from "./charts/bubble-map";
import useOrders from "../data/useOrders";

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>("all");
  // Dodajemy stan do wyboru pliku
  const [dataSource, setDataSource] = useState("generated-data.json");

  const { data, loading } = useOrders(dataSource);

  if (loading)
    return <div style={{ padding: "24px" }}>Ładowanie danych...</div>;
  if (!data)
    return <div style={{ padding: "24px" }}>Nie znaleziono danych</div>;

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#f5f7fa",
        minHeight: "100vh",
        display: "grid",
        // Definiujemy 2 kolumny (lewa szersza dla CustomerChart, prawa dla panelu/mapy)
        gridTemplateColumns: "1.2fr 0.8fr",
        gridTemplateRows: "auto 1fr", // Pierwszy wiersz dopasowany, drugi zajmuje resztę
        gap: "24px",
        gridTemplateAreas: `
          "customer header"
          "column map"
        `,
      }}
    >
      {/* PANEL STEROWANIA (Prawa Góra) */}
      <header
        style={{
          gridArea: "header",
          ...cardStyle,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "15px",
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            DATA SOURCE
          </label>
          <select
            value={dataSource}
            onChange={(e) => setDataSource(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ddd",
            }}
          >
            <option value="generated-data.json">Generated Data (Large)</option>
            <option value="data.json">Mock Data (Small)</option>
          </select>
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            TIME RANGE
          </label>
          <div
            style={{
              display: "flex",
              background: "#f0f2f5",
              padding: "4px",
              borderRadius: "8px",
            }}
          >
            {(["all", "year", "month"] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                style={{
                  flex: 1,
                  padding: "8px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  backgroundColor:
                    timeRange === range ? "#3498db" : "transparent",
                  color: timeRange === range ? "#fff" : "#555",
                  fontWeight: "bold",
                  fontSize: "12px",
                  transition: "all 0.2s",
                }}
              >
                {range !== "all" ? "LAST " : ""}
                {range.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* WYKRES CUSTOMER (Lewa Góra) */}
      <section style={{ ...cardStyle, gridArea: "customer" }}>
        <CustomerChart orders={data.orders} timeRange={timeRange} />
      </section>

      {/* WYKRES KOLUMNOWY (Lewy Dół) */}
      <section style={{ ...cardStyle, gridArea: "column" }}>
        <CategoryDrilldownChart orders={data.orders} timeRange={timeRange} />
      </section>

      {/* MAPA (Prawy Dół) */}
      <section style={{ ...cardStyle, gridArea: "map" }}>
        <DeliveryTimeBubbleMap orders={data.orders} timeRange={timeRange} />
      </section>
    </div>
  );
}
const cardStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
};
