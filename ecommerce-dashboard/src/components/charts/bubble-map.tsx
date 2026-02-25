import type { CountryChartData } from "../../types/chart.types";
import type { Order, OrderData } from "../../types/data.types";
import data from "../../data/data.json";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "highcharts/modules/map";
import "highcharts/highcharts-more";
import worldMap from "@highcharts/map-collection/custom/world.geo.json";


function prepareMapData(orders: Order[]): CountryChartData & { countries: Record<string, { lat: number, lon: number }> } {
  const agg: Record<string, {
    orders: number;
    revenue: number;
    itemsOrdered: number;
    totalDelivery: number;
    lat: number;
    lon: number;
  }> = {};
  
  orders.forEach(order => {
    if (!agg[order.country]) {
      agg[order.country] = {
        orders: 0,
        revenue: 0,
        itemsOrdered: 0,
        totalDelivery: 0,
        lat: order.lat,
        lon: order.lon,
      };
    }

    agg[order.country].orders += 1;
    agg[order.country].revenue += order.unitPrice * order.quantity;
    agg[order.country].itemsOrdered += order.quantity;
    agg[order.country].totalDelivery += order.deliveryDays;
  });

  const result: any = {};
  const countries: Record<string, { lat: number, lon: number }> = {};
  
  Object.entries(agg).forEach(([country, data]) => {
    result[country] = {
      orders: data.orders,
      revenue: data.revenue,
      itemsOrdered: data.itemsOrdered,
      avgDelivery: data.totalDelivery / data.orders
    };
    countries[country] = {
      lat: data.lat,
      lon: data.lon
    };
  });

  result.countries = countries;
  return result;
}

export default function DeliveryTimeBubbleMap() {
    const mapData = prepareMapData((data as OrderData).orders);
    const { countries, ...chartData } = mapData;

    // Przygotowanie danych do bubble chart z rzeczywistymi współrzędnymi
    const bubbleData = Object.entries(chartData).map(([country, data]) => ({
      name: country,
      lat: countries[country].lat,
      lon: countries[country].lon,
      z: data.orders, // Rozmiar bąbelka = liczba zamówień
      avgDelivery: data.avgDelivery, // Do koloru
      revenue: data.revenue,
      itemsOrdered: data.itemsOrdered
    }));

    console.log('Bubble data:', bubbleData);
const options: Highcharts.Options = {
      chart: {
        map: worldMap as any,
      },
      title: {
        text: 'Orders by Country: Size = Orders, Color = Avg Delivery Time'
      },
      mapNavigation: {
        enabled: true,
        buttonOptions: {
          alignTo: 'spacingBox'
        }
      },      colorAxis: {
        minColor: '#00ff00',    // Zielony - szybka dostawa
        maxColor: '#ff0000',     // Czerwony - wolna dostawa
        labels: {
          format: '{value:.1f} days'
        }
      },
      tooltip: {
        useHTML: true,
        formatter: function () {
          const point = this as any;
          if (point.z) { // Tylko dla bubble punktów
            return `<b>${point.name}</b><br/>
                    Orders: ${point.z}<br/>
                    Avg Delivery: ${point.avgDelivery.toFixed(1)} days<br/>
                    Revenue: €${point.revenue.toFixed(2)}<br/>
                    Items Ordered: ${point.itemsOrdered}`;
          }
          return false;
        }
      },      plotOptions: {
        mapbubble: {
          minSize: 30,
          maxSize: 100
        }
      },
      series: [
        {
          type: 'map',
          name: 'World',
          data: [] as any,
          nullColor: '#f0f0f0',
          borderColor: '#d0d0d0',
          borderWidth: 0.5,
          showInLegend: false
        },        {
          type: 'mapbubble',
          name: 'Countries',
          data: bubbleData.map(d => ({
            name: d.name,
            lat: d.lat,
            lon: d.lon,
            z: d.z,
            value: d.avgDelivery, // To jest klucz - value dla colorAxis
            avgDelivery: d.avgDelivery,
            revenue: d.revenue,
            itemsOrdered: d.itemsOrdered
          })) as any,
          minSize: 30,
          maxSize: 100,
          marker: {
            fillOpacity: 0.7,
            lineWidth: 2,
            lineColor: '#ffffff'
          },
          dataLabels: {
            enabled: true,
            format: '{point.name}',
            style: {
              fontSize: '10px',
              fontWeight: 'bold',
              textOutline: '2px white'
            }
          }
        } as any
      ]
    };

    return <HighchartsReact 
      highcharts={Highcharts} 
      constructorType={'mapChart'}
      options={options} 
    />;
}