import { useState } from "react";
import useFilteredData from "../../data/useFilteredData";
import { transformMapData } from "../../utils/data-transformers/transformer-local-delivery-time";

import worldMap from "@highcharts/map-collection/custom/world.topo.json";
import Highcharts from "highcharts/highmaps";
import HighchartsReact from "highcharts-react-official";
import type { TimeRange } from "../../types/chart.types";
import type { Order } from "../../types/data.types";

export default function DeliveryTimeBubbleMap({
  orders,
  currency,
  timeRange,
}: {
  orders: Order[];
  currency: string;
  timeRange: TimeRange;
}) {
  const [zoomLevel, setZoomLevel] = useState(3);

  const filteredOrders = useFilteredData(orders, timeRange);
  const mapData = transformMapData(filteredOrders, zoomLevel >= 5);

  const options: Highcharts.Options = {
    chart: {
      map: worldMap,
      margin: [60, 10, 20, 10],
      events: {
        redraw: function () {
          const chart = this as Highcharts.MapChart;
          if (chart.mapView) {
            setZoomLevel(parseFloat(chart.mapView.zoom.toFixed(2)));
          }
        },
      },
    },
    mapView: {
      projection: { name: "WebMercator" },
      center: [10, 48],
      zoom: 3.7,
      maxZoom: 5.5,
    },
    title: { text: "Global Orders Distribution" },
    subtitle: { text: "Bubble Size - Number of Orders" },
    mapNavigation: {
      enabled: true,
      buttonOptions: { verticalAlign: "bottom" },
    },
    tooltip: {
      useHTML: true,
      pointFormat: `
        <b>{point.name}</b><br/>
        Avg. Delivery: <b>{point.avgDelivery:.1f} days</b><br/>
        Orders: <b>{point.totalOrders}</b><br/>
        Revenue: <b>{point.revenue:.2f} ${currency}</b>
      `,
    },

    colorAxis: {
      min: 0,
      max: 10,
      stops: [
        [0, "#2ecc71"],
        [0.5, "#f1c40f"],
        [1, "#e74c3c"],
      ],
      labels: {
        format: "{value} days",
      },
    },
    legend: {
      layout: "horizontal",
      align: "center",
      verticalAlign: "bottom",
      title: {
        text: "Avg. Delivery Days",
        style: {
          fontSize: "12px",
          fontWeight: "bold",
        },
      },
    },
    series: [
      {
        name: "Basemap",
        borderColor: "#E0E0E0",
        nullColor: "#f8f9fa",
        showInLegend: false,
      },
      {
        type: "mapbubble",
        name: "Total Orders",
        data: mapData,
        maxSize: "12%",
        minSize: "4%",
        colorKey: "avgDelivery",
        joinBy: ["iso-a2", "id"],
        marker: {
          lineWidth: 1,
          lineColor: "#fff",
          fillOpacity: 0.8,
        },
        stickyTracking: false,
      },
    ],
  };
  return (
    <div
      style={{
        flex: 1,
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        overflow: "hidden",
        backgroundColor: "#f8fafc",
        position: "relative",
      }}
    >
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={"mapChart"}
        options={options}
      />
    </div>
  );
}
