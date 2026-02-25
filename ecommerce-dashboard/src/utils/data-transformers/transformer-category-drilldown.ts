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
    const cat = order.category;
    const sub = order.subcategory;
    const val = {
      revenue: order.unitPrice * order.quantity,
      totalOrders: 1,
      totalItems: order.quantity,
    };

    if (!acc[cat]) {
      acc[cat] = {
        revenue: 0,
        totalOrders: 0,
        totalItems: 0,
        subcategories: {},
      };
    }

    if (!acc[cat].subcategories[sub]) {
      acc[cat].subcategories[sub] = {
        revenue: 0,
        totalOrders: 0,
        totalItems: 0,
      };
    }

    acc[cat].revenue += val.revenue;
    acc[cat].totalOrders += val.totalOrders;
    acc[cat].totalItems += val.totalItems;

    // Sumujemy dla subkategorii
    acc[cat].subcategories[sub].revenue += val.revenue;
    acc[cat].subcategories[sub].totalOrders += val.totalOrders;
    acc[cat].subcategories[sub].totalItems += val.totalItems;

    return acc;
  }, {} as CategoryDrilldownData);

  const sortedCategoryEntries = Object.entries(categoriesMap).sort(
    ([, a], [, b]) => b.revenue - a.revenue,
  );

  const mainSeriesData: CategoryDataPoint[] = sortedCategoryEntries.map(
    ([name, data]) => ({
      name,
      y: data.revenue,
      drilldown: name,
      revenue: data.revenue,
      totalOrders: data.totalOrders,
      totalItems: data.totalItems,
    }),
  );

  const drilldownSeries: DrilldownSeries[] = sortedCategoryEntries.map(
    ([catName, catData]) => {
      // Subkategorie też warto posortować malejąco
      const sortedSubEntries = Object.entries(catData.subcategories).sort(
        ([, a], [, b]) => b.revenue - a.revenue,
      );
      return {
        name: catName,
        id: catName,
        data: sortedSubEntries.map(([subName, subData]) => ({
          name: subName,
          y: subData.revenue,
          ...subData,
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
