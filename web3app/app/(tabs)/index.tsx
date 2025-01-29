import React, { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, Button } from "react-native";
import { Card } from "react-native-paper";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { LineChart } from "react-native-chart-kit";
import mqtt from "mqtt"; // Import mqtt library
import Toast from 'react-native-toast-message'; // Import toast library
import { AlertContext } from '../AlertContext'; // Adjust the path as needed

// Mocked auth function
const auth = async () => {
  return {
    user: {
      name: "Jane Doe",
      email: "example@email.com",
    },
  };
};

export default function HomePage({ navigation }: any) {
  const { heartAlertsEnabled } = useContext(AlertContext);
  const [hrValues, setHrValues] = useState<number[]>([0]);
  const [timestamps, setTimestamps] = useState<string[]>([]); // Store timestamps
  const [sbp, setSbp] = useState<number[]>([0]);
  const [dbp, setDbp] = useState<number[]>([0]);
  const [steps, setSteps] = useState(0);
  const [calories, setCalories] = useState(0);

  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    console.log("Heart Alerts Enabled (Initial):", heartAlertsEnabled); // Debug log for initial state

    const fetchData = async () => {
      const sessionData = await auth();
      setSession(sessionData);

      // Connect to the EMQX MQTT broker
      const client = mqtt.connect("wss://broker.emqx.io:8084/mqtt");

      client.on("connect", () => {
        console.log("Connected to MQTT Broker");

        client.subscribe("health/heart_rate");
        client.subscribe("health/blood_pressure");
        client.subscribe("health/steps_calories");
      });

      client.on("error", (error) => {
        console.error("MQTT Error:", error);
        Toast.show({
          type: 'error',
          text1: 'MQTT Error',
          text2: error.message || 'An error occurred with the MQTT connection.',
          position: 'top',
        });
      });

      client.on("message", (topic, message) => {
        if (topic === "health/heart_rate") {
          const heartRateData = JSON.parse(message.toString());
          const heartRates = heartRateData.map((record: any) => parseFloat(record.bpm));
          const currentTime = new Date().toLocaleTimeString(); // Get current time
          const exampleTimes = ['12:00 PM', '12:05 PM', '12:10 PM', '12:15 PM', '12:20 PM']; // Example times
          const times = exampleTimes.slice(0, -1).concat(currentTime); // Use example times and current time as the latest
          setHrValues(heartRates);
          setTimestamps(times);

          // Debug logs
          console.log("Heart Alerts Enabled:", heartAlertsEnabled);
          console.log("Heart Rate Data:", heartRates);
          console.log("Timestamps:", times);

          // Check if heart alerts are enabled and heart rate exceeds 120 or reaches 200
          if (heartAlertsEnabled) {
            if (heartRates.some((bpm: any) => bpm >= 120)) {
              console.log("Heart Rate Alert triggered at 120 bpm");
              Toast.show({
                type: 'info',
                text1: 'Heart Rate Alert',
                text2: 'Your heart rate has reached 120 bpm or more.',
                position: 'top',
              });
            }
            if (heartRates.some((bpm: any) => bpm >= 200)) {
              console.log("Critical Heart Rate Alert triggered at 200 bpm");
              Toast.show({
                type: 'error',
                text1: 'Critical Heart Rate Alert',
                text2: 'Your heart rate has reached 200 bpm. Please take immediate action!',
                position: 'top',
              });
            }
          }
        }

        if (topic === "health/blood_pressure") {
          const bpData = JSON.parse(message.toString());
          const sys = bpData.map((record: any) => parseFloat(record.sys));
          setSbp(sys);
          const dia = bpData.map((record: any) => parseFloat(record.dia));
          setDbp(dia);
        }

        if (topic === "health/steps_calories") {
          const stepsData = JSON.parse(message.toString());
          setSteps(stepsData.steps || 0);
          setCalories(stepsData.calories || 0);
        }
      });

      return () => {
        // Clean up when the component unmounts
        client.end();
      };
    };

    fetchData();
  }, [heartAlertsEnabled]); // Trigger the effect again if heartAlertsEnabled changes

  const testToast = () => {
    Toast.show({
      type: 'info',
      text1: 'Test Toast',
      text2: 'This is a test toast to check if Toast works.',
      position: 'top',
    });
  };

  const calculateAverage = (arr: any) => {
    if (arr.length === 0) {
      return 0;
    }
    const sum = arr.reduce((acc: any, val: any) => acc + val, 0);
    return sum / arr.length;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Heart Health */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={{ flexDirection: "row" }}>
            <MaterialCommunityIcons name="heart" size={30} color="red" />
            <Text style={styles.heartheader}> Heart Health</Text>
          </View>
          <Text style={styles.label}>
            Heart Rate Data:
            {hrValues.length > 0 ? ` ${calculateAverage(hrValues)} bpm` : "No data available"}
          </Text>
          <LineChart
            data={{
              labels: timestamps, // Use timestamps as labels
              datasets: [{ data: hrValues }],
            }}
            width={Dimensions.get("window").width * 0.90} // 90% of screen width
            height={300}
            yAxisSuffix=""
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </Card.Content>
      </Card>
      
      {/* Blood Pressure Information */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={{ flexDirection: "row" }}>
            <MaterialCommunityIcons name="water" size={30} color="blue" />
            <Text style={styles.bpheader}> Blood Pressure Information</Text>
          </View>
          <Text style={styles.label}>Systolic Blood Pressure: {calculateAverage(sbp)} mm Hg</Text>
          <Text style={styles.label}>Diastolic Blood Pressure: {calculateAverage(dbp)} mm Hg</Text>
        </Card.Content>
      </Card>

      {/* Exercise Information */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={{ flexDirection: "row" }}>
            <MaterialCommunityIcons name="walk" size={30} color="purple" />
            <Text style={styles.exerciseheader}> Exercise Information</Text>
          </View>
          <Text style={styles.label}>Total Steps: {steps} steps</Text>
          <Text style={styles.label}>Total Calories Burned: {calories} cal</Text>
          <LineChart
            data={{
              labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
              datasets: [{ data: [] }],
            }}
            width={Dimensions.get("window").width * 0.85} // 85% of screen width
            height={300}
            yAxisSuffix=""
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </Card.Content>
      </Card>

      {/* Toast Component */}
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </ScrollView>
  );
}

const chartConfig = {
  backgroundGradientFrom: "#f5f5f5",
  backgroundGradientTo: "#f5f5f5",
  color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.8,
  useShadowColorFromDataset: false
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 50,
    paddingTop: 50,
    backgroundColor: "#f5f5f5",
  },
  heartheader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "red",
  },
  bpheader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "blue",
  },
  exerciseheader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "purple",
  },
  card: {
    marginBottom: 20,
    elevation: 2,
    backgroundColor: "#ffffff",
  },
  label: {
    fontSize: 16,
    marginVertical: 4,
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "70%",
  },
  chart: {
    marginVertical: "5%",
    borderRadius: 16,
  },
});
