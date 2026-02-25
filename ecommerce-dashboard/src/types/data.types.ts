export type OrderData = {
  meta: {
    currency: string,
    generatedAt: string,
    source: string,
  },
  orders: Order[]
}

export type CustomerType = "new" | "returning";

export type Order = {
  orderId: string;
  timestamp: string;
  country: string;
  city: string;
  lat: number;
  lon: number;
  category: string;
  subcategory: string;
  product: string;
  quantity: number;
  unitPrice: number;
  paymentMethod: string;
  customerType: CustomerType;
  device: string;
  deliveryDays: 2;
};
