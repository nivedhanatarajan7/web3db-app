import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet } from "react-native";
import { Card } from "react-native-paper";

const DevicesScreen = () => {
  const [deviceId, setDeviceId] = useState("");
  const [devices, setDevices] = useState([]);

  const addDevice = () => {
    if (deviceId.trim()) {
      setDevices([...devices, { id: deviceId }]);
      setDeviceId("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Devices</Text>
      <Card style={styles.card}>
        <Text style={styles.header}>Add a Device</Text>
        <Text style={styles.formlabel}>Device ID</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Device ID"
          value={deviceId}
          onChangeText={setDeviceId}
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
                <Text style={styles.deviceText}>{item.id}</Text>
              </Card>
            )}
          />
        )}
      </Card>
    </View>
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
