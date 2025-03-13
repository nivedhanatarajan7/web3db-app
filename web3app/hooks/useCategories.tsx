import { useState, useEffect } from "react";
import axios from "axios";
import { Alert } from "react-native";
import { useAuth } from "../app/AuthContext";

interface DataType {
  value: string;
  measurement: string;
}

interface Categories {
  [key: string]: DataType[];
}

export const useCategories = () => {
  const { walletInfo } = useAuth();
  const [categories, setCategories] = useState<Categories>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDataTypes = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://129.74.152.201:5100/get-registered-devices",
        { wallet_id: walletInfo.address }
      );

      const responseData = response.data?.data;

      if (!Array.isArray(responseData) || responseData.length === 0) {
        setCategories({
          Health: [{ value: "Heart Rate", measurement: "bpm" }],
          Home: [{ value: "Temperature", measurement: "°C" }],
        });
        return;
      }

      const groupedData: Categories = {};
      responseData.forEach((item) => {
        if (!groupedData[item.category]) groupedData[item.category] = [];
        groupedData[item.category].push({
          value: item.value,
          measurement: item.measurement,
        });
      });

      setCategories(groupedData);
    } catch (err) {
      setError("Failed to fetch data types.");
      console.error("Error fetching data types:", err);
    } finally {
      setLoading(false);
    }
  };

  const addDataType = async (newDataType: string, category: string, measurement: string) => {
    const newEntry = {
      wallet_id: walletInfo.address,
      device_id: newDataType,
    };

    try {
      setLoading(true);
      const response = await fetch("http://129.74.152.201:5100/add-device", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry),
      });

      if (response.ok) {
        Alert.alert("Success", "New data type added!");

        setCategories((prevCategories) => {
          const updatedCategories = { ...prevCategories };
          if (!updatedCategories[category]) {
            updatedCategories[category] = [];
          }
          updatedCategories[category].push({ value: newDataType, measurement });
          return updatedCategories;
        });
      } else {
        Alert.alert("Error", "Failed to add data type.");
      }
    } catch (err) {
      console.error("Error adding data type:", err);
      setError("Failed to add data type.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataTypes();
  }, []);

  return { categories, loading, error, fetchDataTypes, addDataType };
};
