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
  timeRange,
}: {
  orders: Order[];
  timeRange: TimeRange;
}) {
  const [zoomLevel, setZoomLevel] = useState(3);

  const filteredOrders = useFilteredData(orders, timeRange);
  const mapData = transformMapData(filteredOrders, zoomLevel >= 5);

  const options: Highcharts.Options = {
    chart: {
      map: worldMap,
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
      center: [10, 50],
      zoom: 3,
      maxZoom: 5.5,
    },
    title: { text: "Global Orders Distribution" },
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
        Revenue: <b>{point.revenue:.2f} PLN</b>
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

    series: [
      {
        name: "Basemap",
        borderColor: "#E0E0E0",
        nullColor: "#f8f9fa",
        showInLegend: false,
      },
      {
        type: "mapbubble",
        name: "Order Locations",
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
    <div style={{ position: "relative" }}>
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={"mapChart"}
        options={options}
      />
    </div>
  );
}
