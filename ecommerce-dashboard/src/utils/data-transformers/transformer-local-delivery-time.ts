import type { CountryMapPoint, RevenueData } from "../../types/chart.types";
import type { Order } from "../../types/data.types";

export const transformMapData = (
  orders: Order[],
  groupByCities: boolean = false,
): CountryMapPoint[] => {
  const groupingMetric = groupByCities ? "city" : "country";

  const localizationMap = orders.reduce(
    (acc, order) => {
      const metric = order[groupingMetric];
      if (!acc[metric]) {
        acc[metric] = {
          revenue: 0,
          totalOrders: 0,
          totalItems: 0,
          totalDeliveryDays: 0,
          latSum: 0,
          lonSum: 0,
          count: 0,
        };
      }

      acc[metric].revenue += order.unitPrice * order.quantity;
      acc[metric].totalOrders += 1;
      acc[metric].totalItems += order.quantity;
      acc[metric].totalDeliveryDays += order.deliveryDays;
      acc[metric].latSum += order.lat;
      acc[metric].lonSum += order.lon;
      acc[metric].count += 1;

      return acc;
    },
    {} as Record<
      string,
      RevenueData & {
        totalDeliveryDays: number;
        latSum: number;
        lonSum: number;
        count: number;
      }
    >,
  );

  return Object.entries(localizationMap).map(([name, data]) => ({
    id: name,
    name: name,
    revenue: data.revenue,
    totalOrders: data.totalOrders,
    totalItems: data.totalItems,
    avgDelivery: data.totalDeliveryDays / data.count,
    z: Math.sqrt(data.totalOrders),
    lat: data.latSum / data.count,
    lon: data.lonSum / data.count,
  }));
};
