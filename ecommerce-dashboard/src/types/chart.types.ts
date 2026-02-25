export type TimeRange = "all" | "year" | "month";

export type Metric = "revenue" | "totalOrders" | "totalItems";

export type RevenueData = {
  revenue: number;
  totalOrders: number;
  totalItems: number;
};

export type RevenueDataPoint = {
  x: number;
  y: number;
} & RevenueData;

export type CategoryDrilldownData = Record<
  string,
  RevenueData & {
    subcategories: Record<string, RevenueData>;
  }
>;

export interface CategoryDataPoint extends RevenueData {
  name: string;
  y: number;
  drilldown: string;
}

export interface SubcategoryDataPoint extends RevenueData {
  name: string;
  y: number;
}

export interface DrilldownSeries {
  name: string;
  id: string;
  data: SubcategoryDataPoint[];
}

export type DrilldownChartData = {
  mainSeries: {
    name: string;
    colorByPoint: boolean;
    data: CategoryDataPoint[];
  };
  drilldownSeries: DrilldownSeries[];
};

export interface CountryMapPoint extends RevenueData {
  id: string;
  name: string;
  avgDelivery: number;
  lat: number;
  lon: number;
  z: number;
}
