import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, ScrollView } from "react-native";
import { Card } from "react-native-paper";
import { useAuth } from "../AuthContext";

const ShareDeviceScreen = () => {
  const [deviceId, setDeviceId] = useState("");
  const [walletId, setWalletId] = useState("");

  const [users, setUsers] = useState([]);
  const router = useRouter();
  const { walletInfo, logout } = useAuth();

    const shareDevice = async () => {
      const newEntry = {
        subscriber_email: walletId,
        owner_id: walletInfo.address,
        device_id: `${deviceId}`,
      };
      console.log(`${walletInfo.address}/data_type`);
  
      try {
        const response = await fetch("http://129.74.152.201:5100/share-access", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newEntry),
        });
  
        const responseData = await response.json(); // Read response
  
  
      } catch {
        console.log("Error adding data");
      }
    };
    

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Share Data</Text>
      <Card style={styles.card}>
        <Text style={styles.header}>Share Data with Users</Text>
        <Text style={styles.formlabel}>User's Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Email Address"
          value={walletId}
          onChangeText={setWalletId}
        />
        <Text style={styles.formlabel}>Device ID</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Device ID"
          value={deviceId}
          onChangeText={setDeviceId}
        />
        <Button title="Share Data" onPress={shareDevice} color="#007AFF" />
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

export default ShareDeviceScreen;
