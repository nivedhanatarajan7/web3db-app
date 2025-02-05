import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
// import { AlertContext } from "../AlertContext";

export default function HeartRateScreen() {
  // const { heartAlertsEnabled } = useContext(AlertContext);
  const [hrValues, setHrValues] = useState<number[]>([75, 80, 85, 90, 95, 88, 92]); // Mock Data
  const [timestamps, setTimestamps] = useState<string[]>(["12:00", "12:05", "12:10", "12:15", "12:20", "12:25", "12:30"]); // Mock Times

  const averageHeartRate =
    hrValues.length > 0 ? (hrValues.reduce((a, b) => a + b) / hrValues.length).toFixed(1) : "No data";

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
          labels: timestamps,
          datasets: [{ data: hrValues }],
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

