import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, ScrollView } from "react-native";
import { Card } from "react-native-paper";
import { useAuth } from "../AuthContext";

const DevicesScreen = () => {
  const [deviceId, setDeviceId] = useState("");
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");

  const [measurement, setMeasurement] = useState("");

  const [devices, setDevices] = useState([]);
  const router = useRouter();
  const { walletInfo, logout } = useAuth();


  useEffect(() => {
    getDevice();
    }, []);

    const getDevice = async () => {
      try {
        const response = await axios.post(
          "http://129.74.152.201:5100/get-registered-devices",
          {
            wallet_id: walletInfo.address,
          }
        );

        console.log(response.data)
    
        setDevices(response.data.devices);
      } catch (error) {
        console.error("Error fetching devices:", error);
        setDevices([]); 
      }
    };
    
    const addDevice = async () => {
      const newEntry = {
        wallet_id: walletInfo.address,
        device_id: `${walletInfo.address}/${deviceId}/${category}/${name}`,
        name: name,
        category: category,
        measurement_unit: measurement,
      };
      console.log(`${walletInfo.address}/data_type`);
  
      try {
        const response = await fetch("http://129.74.152.201:5100/add-device", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newEntry),
        });
  
        const responseData = await response.json(); // Read response
        console.log(response);

        window.location.reload();
      } catch {
        console.log("Error adding data");
      }
    };
    

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>My Devices</Text>
      <Card style={styles.card}>
        <Text style={styles.header}>Add a Device</Text>
        <Text style={styles.formlabel}>Device ID</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Device ID (ex. apple_watch_1)"
          value={deviceId}
          onChangeText={setDeviceId}
        />
        <Text style={styles.formlabel}>Name of Data Type</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Name of Data Type"
          value={name}
          onChangeText={setName}
        />
        <Text style={styles.formlabel}>Category</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Category (ex. Home, Health)"
          value={category}
          onChangeText={setCategory}
        />
        <Text style={styles.formlabel}>Measurement Unit</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Measurement Unit (ex. bpm)"
          value={measurement}
          onChangeText={setMeasurement}
        />
        <Button title="Add Device" onPress={addDevice} color="#007AFF" />
      </Card>
      <Card style={styles.card}>
        <Text style={styles.header}>Added Devices</Text>
        {devices.length === 0 ? (
          <Text style={styles.noDevices}>No added devices</Text>
        ) : (
          <FlatList
            data={devices}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Card style={styles.deviceCard}>
                <Text style={styles.deviceText}>{item.device_id}</Text>
              </Card>
            )}
          />
        )}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginBottom: 20,
  },
  
  formlabel: {
    fontSize: 15,
    fontWeight: "bold",
    color: "gray",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  noDevices: {
    textAlign: "center",
    color: "gray",
  },
  deviceCard: {
    backgroundColor: "#e0e0e0e0",
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
  },
  deviceText: {
    fontSize: 16,
    color: "#000000",
  },
});

export default DevicesScreen;
