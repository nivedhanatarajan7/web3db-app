import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { LineChart } from "react-native-chart-kit";
import axios
 from "axios";
const auth = async () => {
  return {
    user: {
      name: "Jane Doe",
      email: "example@email.com",
    },
  };
};

export default function BloodPressureScreen() {
  const [sbp, setSbp] = useState<number[]>([]);
  const [dbp, setDbp] = useState<number[]>([]);
  const [timestamps, setTimestamps] = useState<number[]>([]);
  const [timeframe, setTimeframe] = useState<string>("last10");

  const averageSBP = sbp.length > 0 ? (sbp.reduce((a, b) => a + b) / sbp.length).toFixed(1) : "No data";
  const averageDBP = dbp.length > 0 ? (dbp.reduce((a, b) => a + b) / dbp.length).toFixed(1) : "No data";
  
  useEffect(() => {
    const fetchData = async () => {
      // Fetch blood pressure
      fetchBloodPressure();

    };

    fetchData();
  }, []);

  const fetchBloodPressure = async () => {
    const data = {
      type: "blood_pressure",
    };
  
    try {
      const response = await axios.post("http://75.131.29.55:5100/fetch-medical", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const bpData = JSON.parse(response.data); 
  
      if (bpData.length === 0) return; // Ensure data exists
  
      const sys = bpData.map((record: any) => parseFloat(record.sys)); 
      const dia = bpData.map((record: any) => parseFloat(record.dia)); 
      const newTimestamps = bpData.map(() => Date.now()); // Generate timestamps
  
      setSbp(sys);
      setDbp(dia);
      setTimestamps(newTimestamps); // Store timestamps
  
    } catch (error) {
      console.error("Error fetching BP data", error);
    }
  };
  

  // Function to filter data based on the selected timeframe
  const filterDataByTimeframe = (timeframe: string) => {
    const now = Date.now();
    let timeLimit: number;

    switch (timeframe) {
      case "last5":
        timeLimit = 5 * 60 * 1000; // 5 minutes
        break;
      case "last10":
        timeLimit = 10 * 60 * 1000; // 10 minutes
        break;
      case "last15":
        timeLimit = 15 * 60 * 1000; // 15 minutes
        break;
      default:
        timeLimit = 10 * 60 * 1000; // Default to 10 minutes
        break;
    }

    const filteredIndices = timestamps
      .map((timestamp, index) => (now - timestamp <= timeLimit ? index : -1))
      .filter((index) => index !== -1);

    const filteredSBP = filteredIndices.map((index) => sbp[index]);
    const filteredDBP = filteredIndices.map((index) => dbp[index]);
    const filteredTimestamps = filteredIndices
      .map((index) => new Date(timestamps[index]).toLocaleTimeString())
      .filter((_, i) => i % 3 === 0); // Show every 3rd timestamp

    return { filteredSBP, filteredDBP, filteredTimestamps };
  };

  const { filteredSBP, filteredDBP, filteredTimestamps } = filterDataByTimeframe(timeframe);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Blood Pressure Overview</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Average Blood Pressure</Text>
        <Text style={styles.value}>{averageSBP} / {averageDBP} mmHg</Text>
      </View>

      <Text style={styles.header}>Select Timeframe</Text>
      <Picker
        selectedValue={timeframe}
        style={styles.picker}
        onValueChange={(itemValue) => setTimeframe(itemValue)}
      >
        <Picker.Item label="Last 5 Minutes" value="last5" />
        <Picker.Item label="Last 10 Minutes" value="last10" />
        <Picker.Item label="Last 15 Minutes" value="last15" />
      </Picker>

      <Text style={styles.header}>Blood Pressure Trends</Text>

      <Text style={styles.chartTitle}>Systolic Blood Pressure</Text>
      <LineChart
        data={{
          labels: filteredTimestamps,
          datasets: [{ data: filteredSBP }],
        }}
        width={Dimensions.get("window").width * 0.92}
        height={280}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />

      <Text style={styles.chartTitle}>Diastolic Blood Pressure</Text>
      <LineChart
        data={{
          labels: filteredTimestamps,
          datasets: [{ data: filteredDBP }],
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
    color: "#0077b6",
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
});

const chartConfig = {
  backgroundGradientFrom: "#f9fafb",
  backgroundGradientTo: "#f9fafb",
  color: (opacity = 1) => `rgba(0, 119, 182, ${opacity})`, // Blue color for BP
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
  decimalPlaces: 0,
};
