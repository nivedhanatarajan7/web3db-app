import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";

export default function BloodPressureScreen() {
  const [sysValues, setSysValues] = useState<number[]>([]);
  const [diaValues, setDiaValues] = useState<number[]>([]);
  const [timestamps, setTimestamps] = useState<number[]>([]);
  const [timeframe, setTimeframe] = useState<string>("last10");

 useEffect(() => {
    fetchBloodPressure(); // Fetch initially
  
    const interval = setInterval(() => {
      fetchBloodPressure();
    }, 10000); // Fetch data every 10 seconds
  
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const fetchBloodPressure = async () => {
    try {
      const response = await axios.post("http://75.131.29.55:5100/fetch-medical", {
        type: "blood_pressure",
      });

      console.log("Raw API Response:", response.data);

      const bpData = JSON.parse(response.data);

      if (bpData.length === 0) {
        console.log("No BP data received.");
        return;
      }

      console.log("Parsed Data:", bpData);

      const newSysValues = bpData.map((record: any) => parseFloat(record.sys));
      const newDiaValues = bpData.map((record: any) => parseFloat(record.dia));

      const newTimestamps = bpData.map((record: any) => {
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
      console.log("Extracted Sys:", newSysValues);
      console.log("Extracted Dia:", newDiaValues);
      console.log("Extracted Timestamps:", newTimestamps);

      setSysValues(newSysValues);
      setDiaValues(newDiaValues);
      setTimestamps(newTimestamps);
    } catch (error) {
      console.error("Error fetching BP data", error);
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
  
    // Filter and sort data
    let filteredData = timestamps
      .map((timestamp, index) => ({
        timestamp,
        sys: sysValues[index],
        dia: diaValues[index],
      }))
      .filter((data) => now - data.timestamp <= timeLimit && data.timestamp <= now) // Keep only valid data
      .sort((a, b) => a.timestamp - b.timestamp); // Sort timestamps in ascending order
  
    // Extract sorted data
    let filteredSys = filteredData.map((data) => data.sys);
    let filteredDia = filteredData.map((data) => data.dia);
    let filteredTimestamps = filteredData.map((data) =>
      new Date(data.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
    );
  
    // Ensure at most 7 points for a readable graph
    const maxPoints = 7;
    if (filteredSys.length > maxPoints) {
      const step = Math.floor(filteredSys.length / maxPoints);
      filteredSys = filteredSys.filter((_, i) => i % step === 0);
      filteredDia = filteredDia.filter((_, i) => i % step === 0);
      filteredTimestamps = filteredTimestamps.filter((_, i) => i % step === 0);
    }
  
    return { filteredSys, filteredDia, filteredTimestamps };
  };
  
  

  const { filteredSys, filteredDia, filteredTimestamps } = filterDataByTimeframe(timeframe);

  const averageSys =
    filteredSys.length > 0
      ? (filteredSys.reduce((a, b) => a + b) / filteredSys.length).toFixed(1)
      : "No data";

  const averageDia =
    filteredDia.length > 0
      ? (filteredDia.reduce((a, b) => a + b) / filteredDia.length).toFixed(1)
      : "No data";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Blood Pressure Overview</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Current BP</Text>
        <Text style={styles.value}>
          {sysValues.length > 0 && diaValues.length > 0
            ? `${sysValues[sysValues.length - 1]}/${diaValues[diaValues.length - 1]}`
            : "No data"}{" "}
          mmHg
        </Text>
        <Text style={styles.label}>Average BP</Text>
        <Text style={styles.averageValue}>
          {averageSys}/{averageDia} mmHg
        </Text>
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

      <Text style={styles.chartTitle}>Blood Pressure Trends</Text>

      <LineChart
        data={{
          labels: filteredTimestamps.length > 0 ? filteredTimestamps : ["No Data"],
          datasets: [
            { data: filteredSys.length > 0 ? filteredSys : [0], color: () => "#e63946", strokeWidth: 2 },
            { data: filteredDia.length > 0 ? filteredDia : [0], color: () => "#457b9d", strokeWidth: 2 },
          ],
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
