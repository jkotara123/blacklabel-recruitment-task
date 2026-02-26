import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "highcharts/modules/drilldown";
import useFilteredData from "../../data/useFilteredData";
import { transformByCategoryDrilldown } from "../../utils/data-transformers/transformer-category-drilldown";
import type { TimeRange } from "../../types/chart.types";
import type { Order } from "../../types/data.types";

export default function CategoryDrilldownChart({
  orders,
  currency,
  timeRange,
}: {
  orders: Order[];
  currency: string;
  timeRange: TimeRange;
}) {
  const filteredOrders = useFilteredData(orders, timeRange);
  const { mainSeries, drilldownSeries } =
    transformByCategoryDrilldown(filteredOrders);

  const options: Highcharts.Options = {
    chart: { type: "column" },
    title: { text: `Revenue by Category` },
    xAxis: { type: "category" },
    yAxis: {
      title: { text: `Revenue [${currency}]` },
    },
    legend: { enabled: false },
    plotOptions: {
      series: {
        dataLabels: { enabled: true, format: "{point.y:.0f}" },
      },
    },
    tooltip: {
      useHTML: true,
      pointFormat: `
        Revenue: <b>{point.revenue:.2f} ${currency} </b><br/>
        Orders: <b>{point.totalOrders}</b><br/>
        Items: <b>{point.totalItems}</b>
      `,
    },
    series: [mainSeries],
    drilldown: {
      series: drilldownSeries as Highcharts.SeriesOptionsType[],
    },
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ marginBottom: "20px", minHeight: "35px" }}>
        <h3 style={{ margin: 0, fontSize: "16px" }}>Orders by Category</h3>
      </div>

      <div style={{ flex: 1 }}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
}
