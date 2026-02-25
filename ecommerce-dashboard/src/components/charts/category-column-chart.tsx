
import type{ CategoryColumnChartData} from "../../types/chart.types";
import type { Order, OrderData } from "../../types/data.types";
import data from "../../data/data.json" 
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "highcharts/modules/drilldown";

function prepareDrilldownData(orders: Order[]): CategoryColumnChartData {
  const categories: CategoryColumnChartData = {};

  orders.forEach(order => {
    const revenue = order.quantity * order.unitPrice;
    const { category, subcategory } = order;

    if (!categories[category]) {
      categories[category] = {
        revenue: 0,
        orders: 0,
        itemsOrdered: 0,
        subcategories: {}
      };
    }

    categories[category].revenue += revenue;
    categories[category].orders += 1;
    categories[category].itemsOrdered += order.quantity;

    if (!categories[category].subcategories[subcategory]) {
      categories[category].subcategories[subcategory] = {
        revenue: 0,
        orders: 0,
        itemsOrdered: 0
      };
    }

    const sub = categories[category].subcategories[subcategory];
    sub.revenue += revenue;
    sub.orders += 1;
    sub.itemsOrdered += order.quantity;
  });

  return categories;
}

function buildHighchartsSeries(categories: CategoryColumnChartData) {
  const mainSeries: Highcharts.PointOptionsObject[] = [];
  const drilldownSeries: any[] = [];

  Object.entries(categories).forEach(([category, data]) => {
    mainSeries.push({
      name: category,
      y: data.revenue,
      drilldown: category,
    });

    drilldownSeries.push({
      id: category,
      name: `${category} subcategories`,
      type: 'column',
      data: Object.entries(data.subcategories).map(([sub, subData]) => [
        sub,
        subData.revenue
      ])
    });
  });

  return { mainSeries, drilldownSeries };
}

export default function CategoryColumnChart() {
  const categories = prepareDrilldownData((data as OrderData).orders);
  const { mainSeries, drilldownSeries } = buildHighchartsSeries(categories);

  const options: Highcharts.Options = {
    chart: { type: "column" },
    title: { text: "Revenue by Category" },
    xAxis: { type: "category" },
    yAxis: { title: { text: "Revenue" } },

    tooltip: {
      formatter: function () {
        const point = this as any;
        return `<b>${point.name}</b><br/>
                Revenue: €${point.y.toFixed(2)}<br/>`;
      }
    },

    series: [
      {
        name: "Categories",
        type: "column",
        data: mainSeries
      }
    ],

    drilldown: {
      series: drilldownSeries
    }
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}