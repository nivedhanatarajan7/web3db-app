import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { LineChart } from "react-native-chart-kit";
import axios from "axios";

export default function ExerciseScreen() {
  const [steps, setSteps] = useState<number[]>([]);
  const [calories, setCalories] = useState<number[]>([]);
  const [timestamps, setTimestamps] = useState<number[]>([]);
  const [timeframe, setTimeframe] = useState<string>("last10");

  useEffect(() => {
    fetchExerciseData();
  }, []);

  const fetchExerciseData = async () => {
    const data = { type: "exercise" };
    try {
      const response = await axios.post("http://75.131.29.55:5100/fetch-medical", {
        type: "steps_cal",
      });
      const exerciseData = JSON.parse(response.data);
      if (exerciseData.length === 0) return;

      const stepsData = exerciseData.map((record: any) => parseFloat(record.steps));
      const caloriesData = exerciseData.map((record: any) => parseFloat(record.calories));
      const newTimestamps = exerciseData.map(() => Date.now());

      setSteps(stepsData);
      setCalories(caloriesData);
      setTimestamps(newTimestamps);
    } catch (error) {
      console.error("Error fetching exercise data", error);
    }
  };

  const averageSteps = steps.length > 0 ? (steps.reduce((a, b) => a + b) / steps.length).toFixed(1) : "No data";
  const averageCalories = calories.length > 0 ? (calories.reduce((a, b) => a + b) / calories.length).toFixed(1) : "No data";

  const filterDataByTimeframe = (timeframe: string) => {
    const now = Date.now();
    let timeLimit = timeframe === "last5" ? 5 * 60 * 1000 : timeframe === "last10" ? 10 * 60 * 1000 : 15 * 60 * 1000;
    
    const filteredIndices = timestamps.map((timestamp, index) => (now - timestamp <= timeLimit ? index : -1)).filter((index) => index !== -1);
    
    const filteredSteps = filteredIndices.map((index) => steps[index]);
    const filteredCalories = filteredIndices.map((index) => calories[index]);
    const filteredTimestamps = filteredIndices.map((index) => new Date(timestamps[index]).toLocaleTimeString()).filter((_, i) => i % 3 === 0);

    return { filteredSteps, filteredCalories, filteredTimestamps };
  };

  const { filteredSteps, filteredCalories, filteredTimestamps } = filterDataByTimeframe(timeframe);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Exercise Overview</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Current Steps</Text>
        <Text style={styles.value}>{steps.length > 0 ? steps[steps.length - 1] : "No data"}</Text>
        <Text style={styles.label}>Current Calories</Text>
        <Text style={styles.value}>{calories.length > 0 ? calories[calories.length - 1] : "No data"} kcal</Text>
        <Text style={styles.label}>Average Steps</Text>
        <Text style={styles.averageValue}>{averageSteps}</Text>
        <Text style={styles.label}>Average Calories</Text>
        <Text style={styles.averageValue}>{averageCalories} kcal</Text>
      </View>

      <Text style={styles.header}>Select Timeframe</Text>
      <Picker selectedValue={timeframe} style={styles.picker} onValueChange={(itemValue) => setTimeframe(itemValue)}>
        <Picker.Item label="Last 5 Minutes" value="last5" />
        <Picker.Item label="Last 10 Minutes" value="last10" />
        <Picker.Item label="Last 15 Minutes" value="last15" />
      </Picker>

      <Text style={styles.header}>Exercise Trends</Text>
      <Text style={styles.chartTitle}>Steps Over Time</Text>
      <LineChart data={{ labels: filteredTimestamps, datasets: [{ data: filteredSteps }] }} width={Dimensions.get("window").width * 0.92} height={280} chartConfig={chartConfig} bezier style={styles.chart} />

      <Text style={styles.chartTitle}>Calories Burned Over Time</Text>
      <LineChart data={{ labels: filteredTimestamps, datasets: [{ data: filteredCalories }] }} width={Dimensions.get("window").width * 0.92} height={280} chartConfig={chartConfig} bezier style={styles.chart} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#f9fafb", alignItems: "center" },
  header: { fontSize: 26, fontWeight: "bold", color: "#333", marginBottom: 15 },
  card: { backgroundColor: "#fff", width: "90%", padding: 20, borderRadius: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3, alignItems: "center", marginBottom: 20 },
  label: { fontSize: 18, color: "#666" },
  value: { fontSize: 28, fontWeight: "bold", color: "#0077b6", marginTop: 5 },
  averageValue: { fontSize: 22, fontWeight: "600", color: "#444", marginTop: 5 },
  chartTitle: { fontSize: 18, fontWeight: "bold", color: "#444", marginBottom: 10 },
  chart: { borderRadius: 12, marginVertical: 10 },
  picker: { width: 200, height: 40, marginBottom: 20 },
});

const chartConfig = {
  backgroundGradientFrom: "#f9fafb",
  backgroundGradientTo: "#f9fafb",
  color: (opacity = 1) => `rgba(0, 119, 182, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
  decimalPlaces: 0,
};
