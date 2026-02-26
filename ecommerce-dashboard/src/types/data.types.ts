export type OrderDataRaw = {
  meta: {
    currency: string;
    generatedAt: string;
    source: string;
  };
  orders: OrderItem[];
};

export type CustomerType = "new" | "returning";

export type OrderItem = {
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
  deliveryDays: number;
};

export type Order = {
  orderId: string;
  timestamp: string;
  country: string;
  city: string;
  lat: number;
  lon: number;
  totalQuantity: number;
  totalPrice: number;
  paymentMethod: string;
  customerType: CustomerType;
  device: string;
  deliveryDays: number;
  items: OrderItem[];
};

export type OrderData = {
  currency: string;
  orders: Order[];
};
