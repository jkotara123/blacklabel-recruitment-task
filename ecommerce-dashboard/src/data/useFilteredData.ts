import { useMemo } from "react";
import type { TimeRange } from "../types/chart.types";
import type { Order } from "../types/data.types";

export default function useFilteredData(
  orders: Order[] | undefined,
  timeRange: TimeRange,
): Order[] {
  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    if (timeRange === "all") return orders;

    const latestDateStr = orders.reduce(
      (max, o) => (o.timestamp > max ? o.timestamp : max),
      orders[0].timestamp,
    );

    const referenceDate = new Date(latestDateStr);
    const startDate = new Date(referenceDate);

    if (timeRange === "year") {
      startDate.setFullYear(startDate.getFullYear() - 1);
    } else if (timeRange === "month") {
      startDate.setMonth(startDate.getMonth() - 1);
    }

    const startTime = startDate.getTime();

    return orders.filter((o) => new Date(o.timestamp).getTime() >= startTime);
  }, [orders, timeRange]);

  return filteredOrders;
}
