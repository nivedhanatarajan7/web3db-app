import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Card } from "react-native-paper";
import axios from "axios";

// Mocked auth function
const auth = async () => {
  return {
    user: {
      name: "Jane Doe",
      email: "example@email.com",
    },
  };
};

export default function HomePage() {
  const [hr, setHr] = useState(0); // Heart rate state
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch session information
      const sessionData = await auth();
      setSession(sessionData);

      // Example: Fetch heart rate data and calculate average BPM
      try {
        const response = await axios.post("http://172.22.113.49:5000/fetch-medical", "heart_rate");
        const averageBpm = calculateAverageBpm(response.data);
        setHr(averageBpm);
      } catch (error) {
        console.error("Error fetching heart rate data", error);
      }
    };

    fetchData();
  }, []);

  // Function to calculate average BPM
  const calculateAverageBpm = (data: any) => {
    const totalBpm = data.reduce((sum: number, record: any) => sum + Number(record.bpm), 0);
    return totalBpm / data.length;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Personal Information */}
      <Text style={styles.header}>Personal Information</Text>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.label}>Name: {session?.user?.name || "Jane Doe"}</Text>
          <Text style={styles.label}>Email: {session?.user?.email || "example@email.com"}</Text>
        </Card.Content>
      </Card>

      {/* Heart Health */}
      <Text style={styles.header}>Heart Health</Text>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.label}>Heart Rate (bpm): {hr}</Text>
        </Card.Content>
      </Card>

      {/* Blood Pressure Information */}
      <Text style={styles.header}>Blood Pressure Information</Text>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.label}>Systolic Blood Pressure (mm Hg): --</Text>
          <Text style={styles.label}>Diastolic Blood Pressure (mm Hg): --</Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
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
});
