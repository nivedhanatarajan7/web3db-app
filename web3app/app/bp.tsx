import React, { useState, useEffect } from "react";
import { View, ScrollView, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { Card, Text, Button, IconButton, Divider } from "react-native-paper";

export default function BloodPressureScreen() {
  const [sysValues, setSysValues] = useState<number[]>([]);
  const [diaValues, setDiaValues] = useState<number[]>([]);
  const [timestamps, setTimestamps] = useState<number[]>([]);
  const [timeframe, setTimeframe] = useState<string>("last24");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    fetchBloodPressure();
    const interval = setInterval(fetchBloodPressure, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchBloodPressure = async () => {
    try {
      const response = await axios.post(
        "http://75.131.29.55:5100/fetch-medical",
        {
          type: "blood_pressure",
        }
      );

      console.log("Raw API Response:", response.data);

      const bpData = JSON.parse(response.data);

      if (bpData.length === 0) {
        console.log("No BP data received.");
        return;
      }

      console.log("Parsed Data:", bpData);

      const newSysValues = bpData.map((record: any) => parseFloat(record.sys));
      const newDiaValues = bpData.map((record: any) => parseFloat(record.dia));

      const newTimestamps = bpData
        .map((record: any) => {
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
        })
        .filter((ts: any) => !isNaN(ts)); // Remove NaN values
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

  const filterDataByTimeframe = () => {
  const endTime = selectedDate.getTime();
  let timeLimit, interval, consolidate, labelInterval;

  switch (timeframe) {
    case "last1":
      timeLimit = 1 * 60 * 60 * 1000; // 1 hour
      interval = 5 * 60 * 1000; // 5 minutes
      labelInterval = 30 * 60 * 1000; // Label every 30 min
      consolidate = false;
      break;
    case "last6":
      timeLimit = 6 * 60 * 60 * 1000; // 6 hours
      interval = 30 * 60 * 1000; // 30 minutes
      labelInterval = 30 * 60 * 1000; // Label every 30 min
      consolidate = true; // Consolidate values
      break;
    case "last24":
      timeLimit = 24 * 60 * 60 * 1000; // 24 hours
      interval = 60 * 60 * 1000; // 1 hour
      labelInterval = 60 * 60 * 1000; // Label every hour
      consolidate = true;
      break;
    default:
      timeLimit = 1 * 60 * 60 * 1000;
      interval = 1 * 60 * 1000;
      labelInterval = 30 * 60 * 1000;
      consolidate = false;
      break;
  }

  const startTime = endTime - timeLimit;
  let sysTimeMap = new Map();
  let diaTimeMap = new Map();
  let labelTimes = new Set();

  // Initialize time slots for both systolic and diastolic
  for (let t = startTime; t <= endTime; t += interval) {
    let timeLabel = new Date(t).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    sysTimeMap.set(timeLabel, []);
    diaTimeMap.set(timeLabel, []);

    if (t % labelInterval === 0) {
      labelTimes.add(timeLabel);
    }
  }

  // Assign actual data points to their nearest time slot
  timestamps.forEach((timestamp, index) => {
    if (timestamp >= startTime && timestamp <= endTime) {
      let timeLabel = new Date(timestamp).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      if (!sysTimeMap.has(timeLabel)) {
        sysTimeMap.set(timeLabel, []);
      }
      sysTimeMap.get(timeLabel).push(sysValues[index]);

      if (!diaTimeMap.has(timeLabel)) {
        diaTimeMap.set(timeLabel, []);
      }
      diaTimeMap.get(timeLabel).push(diaValues[index]);
    }
  });

  let finalSbp: any = [];
  let finalDbp: any = [];
  let finalTimestamps: any = [];

  // Ensure timestamps are sorted
  const sortedSysEntries = Array.from(sysTimeMap.entries()).sort(
    (a, b) =>
      new Date(`1970-01-01T${a[0]}:00`).getTime() -
      new Date(`1970-01-01T${b[0]}:00`).getTime()
  );

  const sortedDiaEntries = Array.from(diaTimeMap.entries()).sort(
    (a, b) =>
      new Date(`1970-01-01T${a[0]}:00`).getTime() -
      new Date(`1970-01-01T${b[0]}:00`).getTime()
  );

  // Process and store systolic and diastolic data
  sortedSysEntries.forEach(([timeLabel, values]) => {
    finalSbp.push(
      values.length > 0
        ? consolidate
          ? values.reduce((a, b) => a + b, 0) / values.length
          : values[0]
        : 0
    );
    finalTimestamps.push(timeLabel);
  });

  sortedDiaEntries.forEach(([timeLabel, values]) => {
    finalDbp.push(
      values.length > 0
        ? consolidate
          ? values.reduce((a: any, b: any) => a + b, 0) / values.length
          : values[0]
        : 0
    );
  });

  return { finalDbp, finalSbp, finalTimestamps };
};


  const { finalDbp, finalSbp, finalTimestamps } = filterDataByTimeframe();
  const validSbp = finalSbp.filter((val: any) => val > 0 && !isNaN(val));
  const validDbp = finalDbp.filter((val: any) => val > 0 && !isNaN(val));

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text variant="headlineMedium" style={{ textAlign: "center", marginBottom: 10 }}>
        Blood Pressure Overview
      </Text>

      <Card style={{ padding: 15, marginBottom: 15 }}>
        <Text variant="titleMedium">Current BP</Text>
        <Text variant="displaySmall" style={{ color: "#E63946", marginVertical: 8 }}>
          {sysValues.length > 0 && diaValues.length > 0 ? `${sysValues.at(-1)}/${diaValues.at(-1)}` : "No data"} mmHg
        </Text>
        <Divider style={{ marginVertical: 10 }} />
        <Text variant="titleMedium">Average BP</Text>
        <Text variant="headlineSmall">
          {sysValues.length > 0 ? (sysValues.reduce((a, b) => a + b) / sysValues.length).toFixed(1) : "No data"}/{" "}
          {diaValues.length > 0 ? (diaValues.reduce((a, b) => a + b) / diaValues.length).toFixed(1) : "No data"} mmHg
        </Text>
      </Card>

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
        <IconButton icon="chevron-left" size={24} onPress={() => setSelectedDate((prevDate) => new Date(prevDate.getTime() - 86400000))} />
        <Button mode="outlined" onPress={() => setShowDatePicker(true)}>{selectedDate.toDateString()}</Button>
        <IconButton icon="chevron-right" size={24} onPress={() => setSelectedDate((prevDate) => new Date(prevDate.getTime() + 86400000))} />
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={(event, newDate) => {
            if (newDate) setSelectedDate(newDate);
            setShowDatePicker(false);
          }}
        />
      )}

      <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 15 }}>
        {["last1", "last6", "last24"].map((item) => (
          <Button
            key={item}
            mode={timeframe === item ? "contained" : "outlined"}
            style={{ marginHorizontal: 5 }}
            onPress={() => setTimeframe(item)}
          >
            {item === "last1" ? "1h" : item === "last6" ? "6h" : "24h"}
          </Button>
        ))}
      </View>

      <Text variant="titleLarge" style={{ textAlign: "center", marginBottom: 10 }}>
        Blood Pressure Trends
      </Text>

      <LineChart
        data={{
          labels: finalTimestamps.length > 0 ? finalTimestamps : ["No Data"],
          datasets: [
            { data: finalSbp.length > 0 ? finalSbp : [0], color: () => "#e63946", strokeWidth: 2 },
            { data: finalDbp.length > 0 ? finalDbp : [0], color: () => "#457b9d", strokeWidth: 2 },
          ],
        }}
        width={Dimensions.get("window").width * 0.92}
        height={280}
        chartConfig={{
          backgroundGradientFrom: "#f9fafb",
          backgroundGradientTo: "#f9fafb",
          color: (opacity = 1) => `rgba(230, 57, 70, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        bezier
        style={{ borderRadius: 12, marginVertical: 10 }}
      />
    </ScrollView>
  );
}
