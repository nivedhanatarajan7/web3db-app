import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";

export default function RespiratoryRateScreen() {
  const [respValues, setRespValues] = useState<number[]>([]);
  const [timestamps, setTimestamps] = useState<number[]>([]);
  const [timeframe, setTimeframe] = useState<string>("last10");

  useEffect(() => {
    fetchRespiratoryRate();
  }, []);

  useEffect(() => {
    const sendRespiratoryRateData = async () => {
      try {
        const respRateValue = Math.floor(Math.random() * (25 - 12 + 1)) + 12; // Random RR between 12-25
        const timestamp = new Date().toISOString();

        const data = {
          type: "resp_rate_new",
          timestamp: timestamp,
          value: respRateValue,
        };

        console.log("Sending Respiratory Rate Data:", data);
        await axios.post("http://75.131.29.55:5100/add-medical", data);
        console.log("Respiratory rate data sent successfully.");
      } catch (error) {
        console.error("Error sending respiratory rate data:", error);
      }
    };

    sendRespiratoryRateData();
    const intervalId = setInterval(sendRespiratoryRateData, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchRespiratoryRate = async () => {
    try {
      const response = await axios.post("http://75.131.29.55:5100/fetch-medical", {
        type: "resp_rate_new",
      });

      console.log("Raw API Response:", response.data);
      const respData = JSON.parse(response.data);

      if (respData.length === 0) {
        console.log("No respiratory rate data received.");
        return;
      }

      console.log("Parsed Data:", respData);
      const newRespValues = respData.map((record: any) => parseFloat(record.value));
      const newTimestamps = respData.map((record: any) => {
        let timestamp = record.timestamp;
        if (typeof timestamp === "string") {
          timestamp = Date.parse(timestamp);
        } else if (typeof timestamp === "number" && timestamp.toString().length === 10) {
          timestamp *= 1000;
        }
        return timestamp;
      });

      console.log("Extracted Values:", newRespValues);
      console.log("Extracted Timestamps:", newTimestamps);

      setRespValues(newRespValues);
      setTimestamps(newTimestamps);
    } catch (error) {
      console.error("Error fetching respiratory rate data", error);
    }
  };

  const filterDataByTimeframe = (timeframe: string) => {
    const now = Date.now();
    let timeLimit: number;

    switch (timeframe) {
      case "last15":
        timeLimit = 15 * 60 * 1000;
        break;
      case "last120":
        timeLimit = 120 * 60 * 1000;
        break;
      case "last1440":
        timeLimit = 1440 * 60 * 1000;
        break;
      default:
        timeLimit = 10 * 60 * 1000;
        break;
    }

    const filteredIndices = timestamps
      .map((timestamp, index) => (now - timestamp <= timeLimit ? index : -1))
      .filter((index) => index !== -1);

    const filteredResp = filteredIndices.map((index) => respValues[index]);
    const filteredTimestamps = filteredIndices.map((index) =>
      new Date(timestamps[index]).toLocaleTimeString("en-US", { hour12: false })
    );

    const maxPoints = 7;
    if (filteredResp.length > maxPoints) {
      const step = Math.floor(filteredResp.length / maxPoints);
      return {
        filteredResp: filteredResp.filter((_, i) => i % step === 0),
        filteredTimestamps: filteredTimestamps.filter((_, i) => i % step === 0),
      };
    }

    return { filteredResp, filteredTimestamps };
  };

  const { filteredResp, filteredTimestamps } = filterDataByTimeframe(timeframe);
  const averageRespRate =
    filteredResp.length > 0
      ? (filteredResp.reduce((a, b) => a + b) / filteredResp.length).toFixed(1)
      : "No data";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Respiratory Rate Overview</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Current Respiratory Rate</Text>
        <Text style={styles.value}>
          {respValues.length > 0 ? respValues[respValues.length - 1] : "No data"} bpm
        </Text>
        <Text style={styles.label}>Average Respiratory Rate</Text>
        <Text style={styles.averageValue}>{averageRespRate} bpm</Text>
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

      <Text style={styles.chartTitle}>Respiratory Rate Trends</Text>

      <LineChart
        data={{
          labels: filteredTimestamps.length > 0 ? filteredTimestamps : ["No Data"],
          datasets: [{ data: filteredResp.length > 0 ? filteredResp : [0] }],
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
 