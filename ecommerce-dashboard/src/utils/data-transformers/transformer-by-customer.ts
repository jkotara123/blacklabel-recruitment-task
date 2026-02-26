import type {
  Metric,
  RevenueData,
  RevenueDataPoint,
  TimeRange,
} from "../../types/chart.types";
import { type CustomerType, type Order } from "../../types/data.types";

export const transformByCustomerType = (
  orders: Order[],
  isCumulative: boolean = false,
  metric: Metric = "totalOrders",
  timeRange: TimeRange,
) => {
  const grouped = orders.reduce(
    (acc, order) => {
      const date = new Date(order.timestamp);
      date.setHours(0, 0, 0, 0);
      if (timeRange !== "month") {
        date.setDate(Math.floor(date.getDate() / 7) * 7);
      }
      const timestamp = date.getTime();

      const type = order.customerType;

      if (!acc[timestamp]) {
        acc[timestamp] = {
          new: { revenue: 0, totalOrders: 0, totalItems: 0 },
          returning: { revenue: 0, totalOrders: 0, totalItems: 0 },
        };
      }

      acc[timestamp][type].revenue += order.totalPrice;
      acc[timestamp][type].totalOrders += 1;
      acc[timestamp][type].totalItems += order.totalQuantity;

      return acc;
    },
    {} as Record<number, Record<CustomerType, RevenueData>>,
  );

  const sortedTimestamps = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => a - b);

  const newCustomerData: RevenueDataPoint[] = [];
  const returningCustomerData: RevenueDataPoint[] = [];

  const cumulativeNew: RevenueData = {
    revenue: 0,
    totalOrders: 0,
    totalItems: 0,
  };
  const cumulativeRet: RevenueData = {
    revenue: 0,
    totalOrders: 0,
    totalItems: 0,
  };

  sortedTimestamps.forEach((ts) => {
    const revenueData = grouped[ts];
    cumulativeNew.revenue += grouped[ts].new.revenue;
    cumulativeNew.totalOrders += grouped[ts].new.totalOrders;
    cumulativeNew.totalItems += grouped[ts].new.totalItems;

    cumulativeRet.revenue += grouped[ts].returning.revenue;
    cumulativeRet.totalOrders += grouped[ts].returning.totalOrders;
    cumulativeRet.totalItems += grouped[ts].returning.totalItems;

    newCustomerData.push({
      x: ts,
      y: isCumulative ? cumulativeNew[metric] : revenueData.new[metric],
      ...(isCumulative ? cumulativeNew : revenueData.new),
    });
    returningCustomerData.push({
      x: ts,
      y: isCumulative ? cumulativeRet[metric] : revenueData.returning[metric],
      ...(isCumulative ? cumulativeRet : revenueData.returning),
    });
  });

  return [
    {
      name: "New Customers",
      data: newCustomerData,
      color: "#2ecc71",
    },
    {
      name: "Returning Customers",
      data: returningCustomerData,
      color: "#3498db",
    },
  ];
};
