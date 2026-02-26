import { useState, useEffect } from "react";
import { type OrderData } from "../types/data.types";

export default function useOrderData(fileName: string = "data.json") {
  const [data, setData] = useState<OrderData | null>(null);
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

  return { data, loading };
}
