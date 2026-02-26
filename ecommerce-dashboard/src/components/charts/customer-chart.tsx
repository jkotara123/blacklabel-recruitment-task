import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import useFilteredData from "../../data/useFilteredData";
import { transformByCustomerType } from "../../utils/data-transformers/transformer-by-customer";
import { useState } from "react";
import type { Metric, TimeRange } from "../../types/chart.types";
import type { Order } from "../../types/data.types";

const metricLabels: Record<Metric, string> = {
  revenue: "Revenue",
  totalOrders: "Number of Orders",
  totalItems: "Total Items Sold",
};

export default function CustomerChart({
  orders,
  currency,
  timeRange,
}: {
  orders: Order[];
  currency: string;
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
      text: `${metricLabels[metric]}: New vs Returning Customers ${
        isCumulative ? "(Cumulative)" : ""
      }`,
    },
    xAxis: {
      type: "datetime",
      title: { text: "Date" },
    },
    yAxis: {
      title: {
        text:
          metric === "revenue"
            ? `${metricLabels[metric]} [${currency}]`
            : metricLabels[metric],
      },
    },
    tooltip: {
      useHTML: true,
      headerFormat: "<b>{point.key}</b><br/>",
      pointFormat: `
        <span style="color:{series.color}">\u25CF</span> {series.name}:<br/>
        - Revenue: <b>{point.y:.2f} ${currency}</b><br/>
        - Orders: <b>{point.totalOrders}</b><br/>
        - Items: <b>{point.totalItems}</b><br/>
      `,
    },
    series: chartData,
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "10px",
          minHeight: "35px",
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
          Show Cumulative
        </label>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "14px", fontWeight: "bold" }}>Metric:</span>
          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value as Metric)}
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          >
            <option value="revenue">Revenue</option>
            <option value="totalOrders">Orders</option>
            <option value="totalItems">Items</option>
          </select>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
}
