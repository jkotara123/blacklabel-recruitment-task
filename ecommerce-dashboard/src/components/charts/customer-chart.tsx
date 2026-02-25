import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import useFilteredData from "../../data/useFilteredData";
import { transformByCustomerType } from "../../utils/data-transformers/transformer-by-customer";
import { useState } from "react";
import type { Metric, TimeRange } from "../../types/chart.types";
import type { Order } from "../../types/data.types";

const metricLabels: Record<Metric, string> = {
  revenue: "Revenue (PLN)",
  totalOrders: "Number of Orders",
  totalItems: "Total Items Sold",
};

export default function CustomerChart({
  orders,
  timeRange,
}: {
  orders: Order[];
  timeRange: TimeRange;
}) {
  const [isCumulative, setIsCumulative] = useState(true);
  const [metric, setMetric] = useState<Metric>("totalOrders");

  const filteredOrders = useFilteredData(orders, timeRange);
  const chartData = transformByCustomerType(
    filteredOrders,
    isCumulative,
    metric,
    timeRange,
  );

  const options: Highcharts.Options = {
    chart: {
      type: "line",
    },
    title: {
      text: `${metricLabels[metric]}: New vs Returning Customers (${
        isCumulative ? "Cumulative" : "Daily"
      })`,
    },
    xAxis: {
      type: "datetime",
      title: { text: "Date" },
    },
    yAxis: {
      title: { text: metricLabels[metric] },
    },
    tooltip: {
      useHTML: true,
      headerFormat: "<b>{point.key}</b><br/>",
      pointFormat: `
        <span style="color:{series.color}">\u25CF</span> {series.name}:<br/>
        - Revenue: <b>{point.y:.2f} PLN</b><br/>
        - Orders: <b>{point.totalOrders}</b><br/>
        - Items: <b>{point.totalItems}</b><br/>
      `,
    },
    series: chartData,
  };
  return (
    <div
      style={{
        padding: "20px",
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          alignItems: "center", // Wyrównanie w pionie (do środka)
          justifyContent: "space-between", // Rozpycha elementy do krawędzi
          gap: "10px",
        }}
      >
        <div
          style={{
            marginBottom: "15px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <label
            style={{ fontSize: "14px", fontWeight: "bold", cursor: "pointer" }}
          >
            <input
              type="checkbox"
              checked={isCumulative}
              onChange={(e) => setIsCumulative(e.target.checked)}
              style={{ marginRight: "8px" }}
            />
            Show Cumulative Revenue
          </label>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label style={{ fontSize: "14px", fontWeight: "bold" }}>
            Metric:
            <select
              value={metric}
              onChange={(e) => setMetric(e.target.value as Metric)}
              style={{
                marginLeft: "8px",
                padding: "4px 8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            >
              <option value="revenue">Revenue</option>
              <option value="totalOrders">Total Orders</option>
              <option value="totalItems">Total Items</option>
            </select>
          </label>
        </div>
      </div>
      <HighchartsReact highcharts={Highcharts} options={options} />;
    </div>
  );
}
