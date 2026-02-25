export type RevenueChartDataValues = {
    revenue: number,
    orders: number,
    itemsOrdered: number
}

export type RevenueChartDataPoint = RevenueChartDataValues & { x: number }

export type CustomerChartData = { 
    new: RevenueChartDataPoint[], 
    returning: RevenueChartDataPoint[] 
}

export type CategoryColumnChartData = Record<string, RevenueChartDataValues & {
    subcategories: Record<string, RevenueChartDataValues>;
}>;

export type CountryChartData = {
    [countryCode: string]: RevenueChartDataValues & { avgDelivery: number }
}