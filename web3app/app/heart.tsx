import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

export default function HeartRateScreen() {
  const [hrValues, setHrValues] = useState<number[]>([]);
  const [timestamps, setTimestamps] = useState<number[]>([]);
  const [timeframe, setTimeframe] = useState<string>("last24");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    fetchHeartRate();
    const interval = setInterval(() => fetchHeartRate(), 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchHeartRate = async () => {
    try {
      const response = await axios.post(
        "http://75.131.29.55:5100/fetch-medical",
        {
          type: "heart_rate",
        }
      );

      console.log("Raw API Response:", response.data);
      const hrData = JSON.parse(response.data);

      if (hrData.length === 0) {
        console.log("No heart rate data received.");
        return;
      }

      console.log("Parsed Data:", hrData);

      const newHrValues = hrData.map((record: any) => parseFloat(record.value));
      const newTimestamps = hrData
        .map((record: any) => {
          let timestamp = parseFloat(record.timestamp) * 1000;
          return isNaN(timestamp) ? NaN : timestamp;
        })
        .filter((ts) => !isNaN(ts));

      setHrValues(newHrValues);
      setTimestamps(newTimestamps);
    } catch (error) {
      console.error("Error fetching heart rate data", error);
    }
  };

  const filterDataByTimeframe = () => {
    const now = selectedDate.getTime();
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
  
    const startTime = now - timeLimit;
    let timeMap = new Map();
    let labelTimes = new Set();
  
    // Initialize time slots
    for (let t = startTime; t <= now; t += interval) {
      let timeLabel = new Date(t).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
  
      timeMap.set(timeLabel, []);
  
      if (t % labelInterval === 0) {
        labelTimes.add(timeLabel);
      }
    }
  
    // Assign actual data points to their nearest time slot
    timestamps.forEach((timestamp, index) => {
      if (timestamp >= startTime && timestamp <= now) {
        let timeLabel = new Date(timestamp).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
  
        if (!timeMap.has(timeLabel)) {
          timeMap.set(timeLabel, []);
        }
        timeMap.get(timeLabel).push(hrValues[index]);
      }
    });
  
    let finalHR = [];
    let finalTimestamps = [];
  
    // Ensure timestamps are sorted
    const sortedTimeEntries = Array.from(timeMap.entries()).sort((a, b) =>
      new Date(`1970-01-01T${a[0]}:00`).getTime() -
      new Date(`1970-01-01T${b[0]}:00`).getTime()
    );
  
    // Process and store data
    for (let [timeLabel, values] of sortedTimeEntries) {
      finalHR.push(
        values.length > 0
          ? consolidate
            ? values.reduce((a: any, b: any) => a + b, 0) / values.length
            : values[0]
          : 0
      );
      finalTimestamps.push(timeLabel);
    }
  
    return { finalHR, finalTimestamps };
  };
  
  

  const { finalHR, finalTimestamps } = filterDataByTimeframe();
  const validHRValues = finalHR.filter((val) => val > 0 && !isNaN(val));

  const averageHeartRate =
    validHRValues.length > 0
      ? (validHRValues.reduce((a, b) => a + b, 0) / validHRValues.length).toFixed(1)
      : "No data";
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Heart Rate Overview</Text>

      {/* Heart Rate Card */}
      <View style={styles.card}>
        <Text style={styles.label}>Current Heart Rate</Text>
        <Text style={styles.value}>
          {hrValues.length > 0 ? hrValues[hrValues.length - 1] : "No data"} bpm
        </Text>
        <Text style={styles.label}>Average Heart Rate</Text>
        <Text style={styles.averageValue}>{averageHeartRate} bpm</Text>
      </View>

      {/* Horizontal Date & Time Picker Bar */}
      <View style={styles.dateBar}>
        <TouchableOpacity
          onPress={() =>
            setSelectedDate(
              new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000)
            )
          }
        >
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateText}>{selectedDate.toDateString()}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            setSelectedDate(
              new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000)
            )
          }
        >
          <Ionicons name="chevron-forward" size={24} color="#333" />
        </TouchableOpacity>
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

      {/* Timeframe Selector */}
      <View style={styles.timeframeSelector}>
        {["last1", "last6", "last24"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.timeButton,
              timeframe === item && styles.timeButtonSelected,
            ]}
            onPress={() => setTimeframe(item)}
          >
            <Text style={styles.timeButtonText}>
              {item === "last1" ? "1h" : item === "last6" ? "6h" : "24h"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.chartTitle}>Heart Rate Trends</Text>

      <LineChart
  data={{
    labels: finalTimestamps, // Show hours & minutes when applicable
    datasets: [{ data: finalHR }],
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
  header: { fontSize: 26, fontWeight: "bold", color: "#333", marginBottom: 15 },
  card: {
    backgroundColor: "#fff",
    width: "90%",
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    alignItems: "center",
    marginBottom: 20,
  },
  dateBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  dateText: { fontSize: 18, marginHorizontal: 15, color: "#007AFF" },
  timeframeSelector: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  timeButton: {
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 6,
    backgroundColor: "#e0e0e0",
  },
  timeButtonSelected: { backgroundColor: "#007AFF" },
  timeButtonText: { color: "#fff", fontWeight: "bold" },
  chart: { borderRadius: 12, marginVertical: 10 },
  card: {
    backgroundColor: "#FFFFFF",
    width: "95%",
    padding: 20,
    borderRadius: 12,
    shadowColor: "rgba(0, 0, 0, 0.2)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  label: {
    fontSize: 18,
    color: "#555",
    fontWeight: "600",
    marginBottom: 4,
  },
  value: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#E63946",
    marginVertical: 8,
  },
  averageValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginTop: 5,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
});

const chartConfig = {
  backgroundGradientFrom: "#f9fafb",
  backgroundGradientTo: "#f9fafb",
  color: (opacity = 1) => `rgba(230, 57, 70, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};
