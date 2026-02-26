import { useState, useEffect, useMemo } from "react";
import {
  type Order,
  type OrderData,
  type OrderDataRaw,
  type OrderItem,
} from "../types/data.types";

const processOrders = (rawOrders: OrderItem[]): Order[] => {
  const map = new Map<string, Order>();

  rawOrders.forEach((item) => {
    const existing = map.get(item.orderId);

    if (existing) {
      existing.totalPrice += item.unitPrice * item.quantity;
      existing.totalQuantity += item.quantity;
      existing.items.push(item);
    } else {
      map.set(item.orderId, {
        orderId: item.orderId,
        timestamp: item.timestamp,
        country: item.country,
        city: item.city,
        lat: item.lat,
        lon: item.lon,
        totalQuantity: item.quantity,
        totalPrice: item.unitPrice * item.quantity,
        paymentMethod: item.paymentMethod,
        customerType: item.customerType,
        device: item.device,
        deliveryDays: item.deliveryDays,
        items: [item],
      });
    }
  });

  return Array.from(map.values());
};

export default function useOrderData(fileName: string = "data.json") {
  const [data, setData] = useState<OrderDataRaw | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/data/${fileName}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load data:", err);
        setLoading(false);
      });
  }, [fileName]);

  const orderData: OrderData = useMemo(
    () => ({
      currency: data?.meta.currency ?? "",
      orders: processOrders(data?.orders ?? []),
    }),
    [data],
  );

  return { orderData, loading };
}
