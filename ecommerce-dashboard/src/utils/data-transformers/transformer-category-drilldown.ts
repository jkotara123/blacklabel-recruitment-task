import type {
  CategoryDataPoint,
  CategoryDrilldownData,
  DrilldownChartData,
  DrilldownSeries,
} from "../../types/chart.types";
import type { Order } from "../../types/data.types";

export const transformByCategoryDrilldown = (
  orders: Order[],
): DrilldownChartData => {
  const categoriesMap: CategoryDrilldownData = orders.reduce((acc, order) => {
    order.items.forEach((item) => {
      const cat = item.category;
      const sub = item.subcategory;
      const val = {
        revenue: item.unitPrice * item.quantity,
        totalItems: item.quantity,
      };

      if (!acc[cat]) {
        acc[cat] = {
          revenue: 0,
          totalOrders: new Set<string>(),
          totalItems: 0,
          subcategories: {},
        };
      }

      if (!acc[cat].subcategories[sub]) {
        acc[cat].subcategories[sub] = {
          revenue: 0,
          totalOrders: new Set<string>(),
          totalItems: 0,
        };
      }

      acc[cat].revenue += val.revenue;
      acc[cat].totalItems += val.totalItems;
      acc[cat].subcategories[sub].revenue += val.revenue;
      acc[cat].subcategories[sub].totalItems += val.totalItems;

      (acc[cat].totalOrders as unknown as Set<string>).add(order.orderId);
      (acc[cat].subcategories[sub].totalOrders as unknown as Set<string>).add(
        order.orderId,
      );
    });

    return acc;
  }, {} as any);

  const sortedCategoryEntries = Object.entries(categoriesMap).sort(
    ([, a], [, b]) => b.revenue - a.revenue,
  );

  const mainSeriesData: CategoryDataPoint[] = sortedCategoryEntries.map(
    ([name, data]) => ({
      name,
      y: data.revenue,
      drilldown: name,
      revenue: data.revenue,
      totalOrders: (data.totalOrders as unknown as Set<string>).size,
      totalItems: data.totalItems,
    }),
  );

  const drilldownSeries: DrilldownSeries[] = sortedCategoryEntries.map(
    ([catName, catData]) => {
      const sortedSubEntries = Object.entries(catData.subcategories).sort(
        ([, a], [, b]) => b.revenue - a.revenue,
      );
      return {
        name: catName,
        id: catName,
        data: sortedSubEntries.map(([subName, subData]) => ({
          name: subName,
          y: subData.revenue,
          revenue: subData.revenue,
          totalItems: subData.totalItems,
          totalOrders: (subData.totalOrders as unknown as Set<string>).size,
        })),
      };
    },
  );

  return {
    mainSeries: {
      name: "Categories",
      colorByPoint: true,
      data: mainSeriesData,
    },
    drilldownSeries,
  };
};
