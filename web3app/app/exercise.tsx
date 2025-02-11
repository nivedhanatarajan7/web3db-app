import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";

export default function ExerciseScreen() {
  const [steps, setSteps] = useState<number[]>([]);
  const [calories, setCalories] = useState<number[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [timeframe, setTimeframe] = useState<string>("last7");

  useEffect(() => {
    fetchExerciseData();
  }, []);

  const fetchExerciseData = async () => {
    try {
      const response = await axios.post("http://75.131.29.55:5100/fetch-medical", {
        type: "exercise",
      });
  
      console.log("Raw Exercise Data Response:", response.data);
  
      const data = JSON.parse(response.data);
  
      if (data.length === 0) {
        console.log("No exercise data available.");
        return;
      }
  
      // Group data by date
      const dailyData: Record<string, { steps: number; calories: number }> = {};
  
      data.forEach((record: any) => {
        const date = new Date(record.timestamp).toLocaleDateString();
  
        if (!dailyData[date]) {
          dailyData[date] = { steps: 0, calories: 0 };
        }
  
        dailyData[date].steps += parseInt(record.steps);
        dailyData[date].calories += parseInt(record.calories);
      });
  
      // Sort dates in ascending order
      const sortedDates = Object.keys(dailyData).sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
      );
  
      // Extract sorted steps and calories
      const sortedSteps = sortedDates.map((date) => dailyData[date].steps);
      const sortedCalories = sortedDates.map((date) => dailyData[date].calories);
  
      console.log("Sorted Steps Data:", sortedSteps);
      console.log("Sorted Calories Data:", sortedCalories);
      console.log("Sorted Dates:", sortedDates);
  
      setSteps(sortedSteps);
      setCalories(sortedCalories);
      setDates(sortedDates);
    } catch (error) {
      console.error("Error fetching exercise data", error);
    }
  };
  
  const filterDataByTimeframe = (timeframe: string) => {
    const now = new Date();
    let daysLimit: number;

    switch (timeframe) {
      case "last7":
        daysLimit = 7;
        break;
      case "last30":
        daysLimit = 30;
        break;
      case "last90":
        daysLimit = 90;
        break;
      default:
        daysLimit = 7;
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(now.getDate() - daysLimit);

    const filteredIndices = dates
      .map((date, index) => (new Date(date) >= cutoffDate ? index : -1))
      .filter((index) => index !== -1);

    return {
      filteredSteps: filteredIndices.map((index) => steps[index]),
      filteredCalories: filteredIndices.map((index) => calories[index]),
      filteredDates: filteredIndices.map((index) => dates[index]),
    };
  };

  const { filteredSteps, filteredCalories, filteredDates } = filterDataByTimeframe(timeframe);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Exercise Overview</Text>

      {/* Steps Card */}
      <View style={styles.card}>
        <Text style={styles.label}>Total Steps</Text>
        <Text style={styles.value}>
          {steps.length > 0 ? steps[steps.length - 1] : "No data"} steps
        </Text>
      </View>

      {/* Calories Card */}
      <View style={styles.card}>
        <Text style={styles.label}>Calories Burned</Text>
        <Text style={styles.value}>
          {calories.length > 0 ? calories[calories.length - 1] : "No data"} kcal
        </Text>
      </View>

      <Text style={styles.header}>Select Timeframe</Text>
      <Picker
        selectedValue={timeframe}
        style={styles.picker}
        onValueChange={(itemValue) => setTimeframe(itemValue)}
      >
        <Picker.Item label="Last 7 Days" value="last7" />
        <Picker.Item label="Last 30 Days" value="last30" />
        <Picker.Item label="Last 90 Days" value="last90" />
      </Picker>

      {/* Steps Graph */}
      <Text style={styles.chartTitle}>Steps Over Time</Text>
      <LineChart
        data={{
          labels: filteredDates.length > 0 ? filteredDates : ["No Data"],
          datasets: [{ data: filteredSteps.length > 0 ? filteredSteps : [0] }],
        }}
        width={Dimensions.get("window").width * 0.92}
        height={280}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />

      {/* Calories Graph */}
      <Text style={styles.chartTitle}>Calories Burned Over Time</Text>
      <LineChart
        data={{
          labels: filteredDates.length > 0 ? filteredDates : ["No Data"],
          datasets: [{ data: filteredCalories.length > 0 ? filteredCalories : [0] }],
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
    color: "#007bff",
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
  color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
  decimalPlaces: 0,
};
