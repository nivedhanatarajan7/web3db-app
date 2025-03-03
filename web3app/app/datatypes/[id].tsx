import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, Dimensions } from "react-native";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Card, Text, Button, IconButton } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import { LineChart } from "react-native-gifted-charts";

export default function DataScreen() {
  const params = useLocalSearchParams();

  const id = params.id as string;
  const measurementUnit = params.measurementUnit as string;
  const title = id?.replace(/-/g, " ") || "Unknown"; // Format for display

  const [values, setValues] = useState<number[]>([]);
  const [timestamps, setTimestamps] = useState<number[]>([]);
  const [timeframe, setTimeframe] = useState<string>("5 hours"); // Default to 5 hours
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [id, timeframe, selectedDate]);

  const fetchData = async () => {
    try {
      const requestBody = {
        time: timeframe,
        topic: id,
      };

      console.log("Sending API request with:", requestBody);

      const response = await axios.post(
        "http://129.74.152.201:5100/get-medical",
        requestBody
      );
      console.log("API Response:", response.data);

      if (!response.data || response.data.message === "No data available") {
        console.warn("No data received for:", timeframe);
        setValues([]);
        setTimestamps([]);
        return;
      }

      const rawData = response.data.data || [];
      const filteredData = rawData.filter(
        (record) => record.value !== undefined && record.timestamp
      );

      if (filteredData.length === 0) {
        console.warn("Filtered data is empty.");
        setValues([]);
        setTimestamps([]);
        return;
      }

      setValues(filteredData.map((record) => parseFloat(record.value)));
      setTimestamps(filteredData.map((record) => record.timestamp * 1000));
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const generateFullTimeRange = () => {
    const now = selectedDate.getTime();
    let startTime = now;

    if (timeframe === "1 hour") startTime -= 3600 * 1000;
    else if (timeframe === "5 hours") startTime -= 5 * 3600 * 1000;
    else if (timeframe === "24 hours") startTime -= 24 * 3600 * 1000;

    const timeRange = [];
    const totalPoints = 27; // Keep labels well-spaced
    const interval = (now - startTime) / totalPoints; // Dynamic spacing

    for (let t = startTime; t <= now; t += interval) {
      timeRange.push(Math.round(t)); // Round timestamps to prevent small drifts
    }

    return timeRange;
  };

  const mergedData = () => {
    const completeTimeRange = generateFullTimeRange();
    const mergedValues = completeTimeRange.map((time) => {
      const closestIndex = timestamps.findIndex(
        (t) => Math.abs(t - time) <= 30 * 60 * 1000
      ); // 5-minute tolerance
      return closestIndex !== -1 ? values[closestIndex] : 0; // Fill missing values with 0
    });

    const labelInterval = Math.ceil(completeTimeRange.length / 10);
    const formattedLabels = completeTimeRange.map((time, index) =>
      index % labelInterval === 0
        ? new Date(time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : ""
    );
    return { formattedLabels, mergedValues };
  };

  const fillMissingData = (timestamps: number[], values: number[]) => {
    if (timestamps.length === 0) return { timestamps: [], values: [] };

    const filledTimestamps: number[] = [];
    const filledValues: number[] = [];

    const startTime = timestamps[0];
    const endTime = timestamps[timestamps.length - 1];
    const interval = (endTime - startTime) / (timestamps.length - 1) || 60000; 

    for (let time = startTime; time <= endTime; time += interval) {
      const index = timestamps.indexOf(time);
      if (index !== -1) {
        filledTimestamps.push(time);
        filledValues.push(values[index]);
      } else {
        filledTimestamps.push(time);
        filledValues.push(0);
      }
    }

    return { timestamps: filledTimestamps, values: filledValues };
  };

  const { formattedLabels, mergedValues } = mergedData();



  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.date}>
        <IconButton
          icon="chevron-left"
          size={24}
          onPress={() =>
            setSelectedDate(new Date(selectedDate.getTime() - 86400000))
          }
        />
        <Button mode="outlined" onPress={() => setShowDatePicker(true)}>
          {selectedDate.toDateString()}
        </Button>
        <IconButton
          icon="chevron-right"
          size={24}
          onPress={() =>
            setSelectedDate(new Date(selectedDate.getTime() + 86400000))
          }
        />
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={(event, newDate) => newDate && setSelectedDate(newDate)}
        />
      )}

      <Text variant="headlineMedium" style={styles.title}>
        {title} Overview
      </Text>

      <View style={styles.row}>
        <Card style={styles.valuecard}>
          <Text variant="titleMedium" style={styles.valuetitle}>
            Current {title}
          </Text>
          <Text variant="displaySmall" style={styles.valueText}>
            {values.length > 0 ? values.at(-1) : "No data"} {measurementUnit}
          </Text>
        </Card>

        <Card style={styles.valuecard}>
          <Text variant="titleMedium" style={styles.valuetitle}>
            Average {title}
          </Text>
          <Text variant="displaySmall" style={styles.valueText}>
            {values.length > 0
              ? (values.reduce((a, b) => a + b) / values.length).toFixed(1)
              : "No data"}{" "}
            {measurementUnit}
          </Text>
        </Card>

        <Card style={styles.valuecard}>
          <Text variant="titleMedium" style={styles.valuetitle}>
            Highest {title}
          </Text>
          <Text variant="displaySmall" style={styles.valueText}>
            {values.length > 0 ? Math.max(...values) : "No data"}{" "}
            {measurementUnit}
          </Text>
        </Card>
      </View>

      <Text variant="titleLarge" style={styles.title}>
        {title} Data View
      </Text>

      <LineChart
        data={mergedValues.map((value, index) => ({
          value,
          label: formattedLabels[index] || "",
        }))}
        width={Dimensions.get("window").width * 0.92}
        height={300}
        color="rgba(0, 123, 255, 1)"
        yAxisTextStyle={{ color: "#4B164C" }}
        xAxisLabelTextStyle={{ color: "#4B164C", fontSize: 10 }} // Reduce font size if needed
        yAxisOffset={0} // Helps control the scale
        maxValue={250}
        startFillColor="rgba(20,105,81,0.3)"
          endFillColor="rgba(20,85,81,0.01)"
        noOfSections={3}
        areaChart
        curved
        showXAxisIndices={true} // Show vertical grid lines
        xAxisIndicesHeight={5} // Make index markers more visible
        pointerConfig={{
          pointerStripHeight: 160,
          pointerStripColor: 'lightgray',
          pointerStripWidth: 2,
          pointerColor: 'lightgray',
          radius: 6,
          pointerLabelWidth: 100,
          pointerLabelHeight: 90,
          activatePointersOnLongPress: true,
          autoAdjustPointerLabelPosition: false,
          pointerLabelComponent: items => {
            return (
              <View
                style={{
                  height: 90,
                  width: 100,
                  justifyContent: 'center',
                }}>
                <Text style={{color: 'white', fontSize: 14, marginBottom:6,textAlign:'center'}}>
                  {items[0].date}
                </Text>

                <View style={{paddingHorizontal:14,paddingVertical:6, borderRadius:16, backgroundColor:'white'}}>
                  <Text style={{fontWeight: 'bold',textAlign:'center'}}>
                    {items[0].value + ' bpm'}
                  </Text>
                </View>
              </View>
            );
          },
        }}
      />

      <View style={styles.row}>
        {["1 hour", "5 hours", "24 hours"].map((item) => (
          <Button
            key={item}
            mode={timeframe === item ? "contained" : "outlined"}
            style={styles.timeButton}
            onPress={() => setTimeframe(item)}
          >
            {item}
          </Button>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#FBFBFB", padding: 20 },
  title: { textAlign: "center", marginBottom: 10, color: "#4B164C" },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  date: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  valuecard: {
    flex: 1,
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "#D9EAFD",
    padding: 15,
    marginHorizontal: 10,
  },
  valueText: { color: "#4B164C", marginVertical: 8 },
  valuetitle: {
    alignItems: "center",
    textAlign: "center",
    color: "#4B164C",
    marginVertical: 8,
  },
  timeButton: {
    marginHorizontal: 5,
    backgroundColor: "#D9EAFD",
    color: "black",
  },
  chartContainer: { marginVertical: 10 },
});
