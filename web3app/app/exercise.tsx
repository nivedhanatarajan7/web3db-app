import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";

export default function ExerciseScreen() {
  const [stepsData, setStepsData] = useState<{ date: string; value: number }[]>([]);
  const [caloriesData, setCaloriesData] = useState<{ date: string; value: number }[]>([]);
  const [timeframe, setTimeframe] = useState<string>("last7");

  useEffect(() => {
    fetchExerciseData();
  }, []);

  const fetchExerciseData = async () => {
    try {
      const response = await axios.post("http://75.131.29.55:5100/fetch-medical", {
        type: "exercise_new",
      });

      console.log("Raw API Response:", response.data);

      const exerciseData = JSON.parse(response.data);

      if (exerciseData.length === 0) {
        console.log("No exercise data received.");
        return;
      }

      console.log("Parsed Data:", exerciseData);

      // Process data: Extract steps & calories, group by date (only one per day)
      const groupedData: { [date: string]: { steps: number; calories: number } } = {};

      exerciseData.forEach((record: any) => {
        const date = new Date(record.timestamp).toISOString().split("T")[0]; // Extract YYYY-MM-DD
        if (!groupedData[date]) {
          groupedData[date] = { steps: 0, calories: 0 };
        }
        if (record.steps) groupedData[date].steps = record.steps;
        if (record.calories) groupedData[date].calories = record.calories;
      });

      const stepsArray = Object.keys(groupedData).map((date) => ({
        date,
        value: groupedData[date].steps,
      }));

      const caloriesArray = Object.keys(groupedData).map((date) => ({
        date,
        value: groupedData[date].calories,
      }));

      console.log("Processed Steps Data:", stepsArray);
      console.log("Processed Calories Data:", caloriesArray);

      setStepsData(stepsArray);
      setCaloriesData(caloriesArray);
    } catch (error) {
      console.error("Error fetching exercise data", error);
    }
  };

  // Function to filter and limit data points
  const filterDataByTimeframe = (data: { date: string; value: number }[], days: number) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Set time to start of the day

    return data
      .filter((entry) => {
        const entryDate = new Date(entry.date);
        return now.getTime() - entryDate.getTime() <= days * 24 * 60 * 60 * 1000;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort by date
  };

  const getFilteredData = (timeframe: string) => {
    switch (timeframe) {
      case "last14":
        return { steps: filterDataByTimeframe(stepsData, 14), calories: filterDataByTimeframe(caloriesData, 14) };
      case "last30":
        return { steps: filterDataByTimeframe(stepsData, 30), calories: filterDataByTimeframe(caloriesData, 30) };
      default:
        return { steps: filterDataByTimeframe(stepsData, 7), calories: filterDataByTimeframe(caloriesData, 7) };
    }
  };

  const { steps, calories } = getFilteredData(timeframe);

  const avgSteps = steps.length > 0 ? (steps.reduce((sum, d) => sum + d.value, 0) / steps.length).toFixed(0) : "No data";
  const avgCalories = calories.length > 0 ? (calories.reduce((sum, d) => sum + d.value, 0) / calories.length).toFixed(0) : "No data";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Exercise Overview</Text>

      {/* Steps Card */}
      <View style={styles.card}>
        <Text style={styles.label}>Steps Taken</Text>
        <Text style={styles.value}>{steps.length > 0 ? steps[steps.length - 1].value : "No data"} steps</Text>
        <Text style={styles.label}>Average Steps</Text>
        <Text style={styles.averageValue}>{avgSteps} steps</Text>
      </View>

      {/* Calories Card */}
      <View style={styles.card}>
        <Text style={styles.label}>Calories Burned</Text>
        <Text style={styles.value}>{calories.length > 0 ? calories[calories.length - 1].value : "No data"} kcal</Text>
        <Text style={styles.label}>Average Calories</Text>
        <Text style={styles.averageValue}>{avgCalories} kcal</Text>
      </View>

      {/* Timeframe Picker */}
      <Text style={styles.header}>Select Timeframe</Text>
      <Picker selectedValue={timeframe} style={styles.picker} onValueChange={(itemValue) => setTimeframe(itemValue)}>
        <Picker.Item label="Last 7 Days" value="last7" />
        <Picker.Item label="Last 14 Days" value="last14" />
        <Picker.Item label="Last 30 Days" value="last30" />
      </Picker>

      {/* Steps Graph */}
      <Text style={styles.chartTitle}>Steps Trend</Text>
      <LineChart
        data={{
          labels: steps.map((d) => d.date.split("-").slice(1).join("/")), // Show MM/DD
          datasets: [{ data: steps.map((d) => d.value) }],
        }}
        width={Dimensions.get("window").width * 0.92}
        height={280}
        chartConfig={chartConfigSteps}
        bezier
        style={styles.chart}
      />

      {/* Calories Graph */}
      <Text style={styles.chartTitle}>Calories Burned Trend</Text>
      <LineChart
        data={{
          labels: calories.map((d) => d.date.split("-").slice(1).join("/")), // Show MM/DD
          datasets: [{ data: calories.map((d) => d.value) }],
        }}
        width={Dimensions.get("window").width * 0.92}
        height={280}
        chartConfig={chartConfigCalories}
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
    color: "#3498db",
    marginTop: 5,
  },
  averageValue: {
    fontSize: 22,
    fontWeight: "600",
    color: "#444",
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

const chartConfigSteps = {
  color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
};

const chartConfigCalories = {
  color: (opacity = 1) => `rgba(230, 126, 34, ${opacity})`,
};
