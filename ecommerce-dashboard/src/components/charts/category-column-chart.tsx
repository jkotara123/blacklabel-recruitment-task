import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "highcharts/modules/drilldown";
import useFilteredData from "../../data/useFilteredData";
import { transformByCategoryDrilldown } from "../../utils/data-transformers/transformer-category-drilldown";
import type { TimeRange } from "../../types/chart.types";
import type { Order } from "../../types/data.types";

export default function CategoryDrilldownChart({
  orders,
  timeRange,
}: {
  orders: Order[];
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
      title: { text: "Revenue" },
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
        Revenue: <b>{point.revenue:.2f} </b><br/>
        Orders: <b>{point.totalOrders}</b><br/>
        Items: <b>{point.totalItems}</b>
      `,
    },
    series: [mainSeries],
    drilldown: {
      series: drilldownSeries as Highcharts.SeriesOptionsType[],
    },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
