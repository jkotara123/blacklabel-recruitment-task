import type { CustomerChartData } from "../../types/chart.types";
import type { CustomerType, Order, OrderData } from "../../types/data.types";
import data from "../../data/data.json" 
import { toDayTimestamp } from "../../utils/date.utils";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";


function prepareData(orders: Order[]): CustomerChartData {
  const grouped: Record<CustomerType, Map<number, Order[]>> = {
    new: new Map(),
    returning: new Map()
  };

  orders.forEach(order => {
    const type = order.customerType as CustomerType;
    const day = toDayTimestamp(order.timestamp);
    if (!grouped[type].has(day)) grouped[type].set(day, []);
    grouped[type].get(day)!.push(order);
  });

  const result: CustomerChartData = { new: [], returning: [] };
  const cumulative = {
    new: { revenue: 0, orders: 0, itemsOrdered: 0 },
    returning: { revenue: 0, orders: 0, itemsOrdered: 0 }
  };

  (["new", "returning"] as CustomerType[]).forEach(type => {
    const days = Array.from(grouped[type].keys()).sort((a, b) => a - b);

    days.forEach(day => {
      const ordersInDay = grouped[type].get(day)!;
      ordersInDay.forEach(o => {
        cumulative[type].revenue += o.quantity * o.unitPrice;
        cumulative[type].orders += 1;
        cumulative[type].itemsOrdered += o.quantity;
      });

      result[type].push({
        x: day,
        revenue: cumulative[type].revenue,
        orders: cumulative[type].orders,
        itemsOrdered: cumulative[type].itemsOrdered
      });
    });
  });

  return result;
}

export default function CustomerChart() {
    const chartData = prepareData((data as OrderData).orders)

    const options: Highcharts.Options = {
        chart: {
            type: "line",
        },
        title: {
            text: "Cumulative Revenue: New vs Returning Customers"
        },
        xAxis: {
            type: "datetime",
            title: {text: "Date"}
        },
        yAxis: {
            title: {text: "Revenue"}
        },    
        tooltip: {
        formatter: function () {
            const point = this as any;
            return `<b>${this.series.name}</b><br/>
                    ${Highcharts.dateFormat("%Y-%m-%d", point.x)}<br/>
                    Revenue: €${point.y.toFixed(2)}<br/>
                    Total Orders: ${point.orders}<br/>
                    Total items ordered: ${point.itemsOrdered}`;
        },
        useHTML: true,
        },
        series: [
            {
                name: 'Returning Customers',
                data: chartData.returning.map(p => ({
                    x: p.x,
                    y: p.revenue,
                    orders: p.orders,
                    itemsOrdered: p.itemsOrdered
                }))
            },
            {
                name: 'New Customers',
                data: chartData.new.map(p => ({
                    x: p.x,
                    y: p.revenue,
                    orders: p.orders,
                    itemsOrdered: p.itemsOrdered
                }))
            }
        ]
    }
    return <HighchartsReact highcharts={Highcharts} options={options}/>;
}