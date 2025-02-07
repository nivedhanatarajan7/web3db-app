import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { LineChart } from "react-native-chart-kit";
import axios from "axios";

export default function SleepScreen() {
  const [sleepData, setSleepData] = useState<number[]>([]);
  const [timestamps, setTimestamps] = useState<string[]>([]);
  const [timeframe, setTimeframe] = useState<string>("last10");

  const currentSleep = sleepData.length > 0 ? sleepData[sleepData.length - 1] : "No data";
  const averageSleep = sleepData.length > 0 ? (sleepData.reduce((a, b) => a + b) / sleepData.length).toFixed(1) : "No data";

  useEffect(() => {
    fetchSleepData();
  }, []);

  const fetchSleepData = async () => {
    try {
      const response = await axios.post("http://75.131.29.55:5100/fetch-medical", { type: "sleep" }, {
        headers: { "Content-Type": "application/json" },
      });

      const data = JSON.parse(response.data);
      if (data.length === 0) return;

      const sleepHours = data.map((record: any) => parseFloat(record.hours));
      const sleepTimestamps = data.map((record: any) => new Date(record.timestamp).toLocaleDateString());

      setSleepData(sleepHours);
      setTimestamps(sleepTimestamps);
    } catch (error) {
      console.error("Error fetching sleep data", error);
    }
  };

  const filterDataByTimeframe = (timeframe: string) => {
    const lastN = timeframe === "last5" ? 5 : timeframe === "last10" ? 10 : 15;
    return {
      filteredSleep: sleepData.slice(-lastN),
      filteredTimestamps: timestamps.slice(-lastN),
    };
  };

  const { filteredSleep, filteredTimestamps } = filterDataByTimeframe(timeframe);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Sleep Overview</Text>
      
      <View style={styles.card}>
        <Text style={styles.label}>Last Recorded Sleep</Text>
        <Text style={styles.value}>{currentSleep} hrs</Text>
        <Text style={styles.label}>Average Sleep</Text>
        <Text style={styles.value}>{averageSleep} hrs</Text>
      </View>

      <Text style={styles.header}>Select Timeframe</Text>
      <Picker selectedValue={timeframe} style={styles.picker} onValueChange={(itemValue) => setTimeframe(itemValue)}>
        <Picker.Item label="Last 5 Days" value="last5" />
        <Picker.Item label="Last 10 Days" value="last10" />
        <Picker.Item label="Last 15 Days" value="last15" />
      </Picker>

      <Text style={styles.chartTitle}>Sleep Trends</Text>
      <LineChart
        data={{ labels: filteredTimestamps, datasets: [{ data: filteredSleep }] }}
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
  container: { flexGrow: 1, padding: 20, backgroundColor: "#f9fafb", alignItems: "center" },
  header: { fontSize: 26, fontWeight: "bold", color: "#333", marginBottom: 15 },
  card: { backgroundColor: "#fff", width: "90%", padding: 20, borderRadius: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3, alignItems: "center", marginBottom: 20 },
  label: { fontSize: 18, color: "#666" },
  value: { fontSize: 28, fontWeight: "bold", color: "#0077b6", marginTop: 5 },
  chartTitle: { fontSize: 18, fontWeight: "bold", color: "#444", marginBottom: 10 },
  chart: { borderRadius: 12, marginVertical: 10 },
  picker: { width: 200, height: 40, marginBottom: 20 },
});

const chartConfig = {
  backgroundGradientFrom: "#f9fafb",
  backgroundGradientTo: "#f9fafb",
  color: (opacity = 1) => `rgba(72, 61, 139, ${opacity})`, // Purple for sleep
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
  decimalPlaces: 0,
};
