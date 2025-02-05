import React, { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import axios from "axios";
// import { AlertContext } from "../AlertContext";

export default function HeartRateScreen() {
  // const { heartAlertsEnabled } = useContext(AlertContext);
  const [hrValues, setHrValues] = useState<number[]>([]);
  const [timestamps, setTimestamps] = useState<number[]>([]);

  useEffect(() => {
    fetchHeartRate();
  }, []);

  const fetchHeartRate = async () => {
    try {
      const response = await axios.post("http://75.131.29.55:5100/fetch-medical", {
        type: "heart_rate",
      });

      const hrData = JSON.parse(response.data);

      if (hrData.length === 0) return;

      const newHrValues = hrData.map((record: any) => parseFloat(record.val));
      const newTimestamps = hrData.map(() => Date.now()); // Generate timestamps

      setHrValues(newHrValues);
      setTimestamps(newTimestamps);
    } catch (error) {
      console.error("Error fetching heart rate data", error);
    }
  };

  const filterData = () => {
    const now = Date.now();
    const timeLimit = 10 * 60 * 1000; // Last 10 minutes

    const filteredData = timestamps
      .map((timestamp, index) => ({ timestamp, bpm: hrValues[index] }))
      .filter((entry) => now - entry.timestamp <= timeLimit);

    const filteredHR = filteredData.map((entry) => entry.bpm);
    const filteredTimestamps = filteredData
      .map((entry) => new Date(entry.timestamp).toLocaleTimeString())
      .filter((_, i) => i % 3 === 0); // Show every 3rd timestamp

    return { filteredHR, filteredTimestamps };
  };

  const { filteredHR, filteredTimestamps } = filterData();

  const averageHeartRate =
    filteredHR.length > 0 ? (filteredHR.reduce((a, b) => a + b) / filteredHR.length).toFixed(1) : "No data";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Heart Rate Overview</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Average Heart Rate</Text>
        <Text style={styles.value}>{averageHeartRate} bpm</Text>
      </View>
      <Text style={styles.chartTitle}>Heart Rate Trends</Text>

      <LineChart
        data={{
          labels: filteredTimestamps.length > 0 ? filteredTimestamps : ["No Data"],
          datasets: [{ data: filteredHR.length > 0 ? filteredHR : [0] }],
        }}
        width={Dimensions.get("window").width * 0.92}
        height={280}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f9fafb",
    alignItems: "center",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#fff",
    width: "90%",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    alignItems: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: "#666",
  },
  value: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#e63946",
    marginTop: 5,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 10,
  },
  chart: {
    borderRadius: 12,
    marginVertical: 10,
  },
});

const chartConfig = {
  backgroundGradientFrom: "#f9fafb",
  backgroundGradientTo: "#f9fafb",
  color: (opacity = 1) => `rgba(230, 57, 70, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
  decimalPlaces: 0,
};
