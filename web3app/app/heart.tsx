import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";

export default function HeartRateScreen() {
  const [hrValues, setHrValues] = useState<number[]>([]);
  const [timestamps, setTimestamps] = useState<number[]>([]);
  const [timeframe, setTimeframe] = useState<string>("last10");

  useEffect(() => {
    fetchHeartRate();
  }, []);


  const fetchHeartRate = async () => {
    try {
      const response = await axios.post("http://75.131.29.55:5100/fetch-medical", {
        type: "heart_rate",
      });

      console.log("Raw API Response:", response.data);

      const hrData = JSON.parse(response.data);

      if (hrData.length === 0) {
        console.log("No heart rate data received.");
        return;
      }

      console.log("Parsed Data:", hrData);

      // Extract and parse heart rate values
      const newHrValues = hrData.map((record: any) => parseFloat(record.value));

      // Extract and convert timestamps
      const newTimestamps = hrData.map((record: any) => {
        let timestamp = record.timestamp;
      
        if (typeof timestamp === "string") {
          timestamp = parseFloat(timestamp) * 1000; // Convert string float seconds to milliseconds
        } else if (typeof timestamp === "number") {
          timestamp = timestamp * 1000; // Convert seconds to milliseconds
        } else {
          console.warn("Invalid timestamp format:", timestamp);
          return NaN;
        }
      
        return timestamp;
      }).filter((ts: any) => !isNaN(ts)); // Remove NaN values
      

      console.log("Extracted Values:", newHrValues);
      console.log("Extracted Timestamps:", newTimestamps);

      setHrValues(newHrValues);
      setTimestamps(newTimestamps);
    } catch (error) {
      console.error("Error fetching heart rate data", error);
    }
  };

  const filterDataByTimeframe = (timeframe: string) => {
    const now = Date.now();
    let timeLimit: number;
  
    switch (timeframe) {
      case "last15":
        timeLimit = 15 * 60 * 1000; // 15 minutes
        break;
      case "last120":
        timeLimit = 120 * 60 * 1000; // 2 hours
        break;
      case "last1440":
        timeLimit = 1440 * 60 * 1000; // 24 hours
        break;
      default:
        timeLimit = 10 * 60 * 1000; // Default: 10 minutes
        break;
    }
  
    // Filter indices based on timeframe
    const filteredIndices = timestamps
      .map((timestamp, index) => (now - timestamp <= timeLimit ? index : -1))
      .filter((index) => index !== -1);
  
    const filteredHR = filteredIndices.map((index) => hrValues[index]);
    const filteredTimestamps = filteredIndices.map((index) =>
      new Date(timestamps[index]).toLocaleTimeString("en-US", { hour12: false })
    );
  
    // Limit the number of points to a maximum of 7
    const maxPoints = 7;
    if (filteredHR.length > maxPoints) {
      const step = Math.floor(filteredHR.length / maxPoints);
      const downsampledHR = filteredHR.filter((_, i) => i % step === 0);
      const downsampledTimestamps = filteredTimestamps.filter((_, i) => i % step === 0);
      return { filteredHR: downsampledHR, filteredTimestamps: downsampledTimestamps };
    }
  
    return { filteredHR, filteredTimestamps };
  };
  

  const { filteredHR, filteredTimestamps } = filterDataByTimeframe(timeframe);

  const averageHeartRate =
    filteredHR.length > 0
      ? (filteredHR.reduce((a, b) => a + b) / filteredHR.length).toFixed(1)
      : "No data";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Heart Rate Overview</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Current Heart Rate</Text>
        <Text style={styles.value}>
          {hrValues.length > 0 ? hrValues[hrValues.length - 1] : "No data"} bpm
        </Text>
        <Text style={styles.label}>Average Heart Rate</Text>
        <Text style={styles.averageValue}>{averageHeartRate} bpm</Text>
      </View>

      <Text style={styles.header}>Select Timeframe</Text>
      <Picker
        selectedValue={timeframe}
        style={styles.picker}
        onValueChange={(itemValue) => setTimeframe(itemValue)}
      >
        <Picker.Item label="Last 15 Minutes" value="last15" />
        <Picker.Item label="Last 2 Hours" value="last120" />
        <Picker.Item label="Last 24 Hours" value="last1440" />
      </Picker>

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
  picker: {
    width: 200,
    height: 40,
    marginBottom: 20,
  },
  averageValue: {
    fontSize: 22,
    fontWeight: "600",
    color: "#444",
    marginTop: 5,
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
