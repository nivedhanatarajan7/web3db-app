import React, { useContext, useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, Switch, TouchableOpacity } from "react-native";
import { Card } from "react-native-paper";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { useAuth } from "../AuthContext";
import { AlertContext } from "../AlertContext";

export default function ProfileScreen() {
  const { walletInfo } = useAuth();
  const { heartAlertsEnabled, setHeartAlertsEnabled } = useContext(AlertContext);
  const { bpAlertsEnabled, setBPAlertsEnabled } = useContext(AlertContext);

  // Editable user information state
  const [userInfo, setUserInfo] = useState({
    Name: "Jane Doe",
    Email: "example@email.com",
    Height: "5'4''",
    Weight: "130 lbs",
    Age: "30",
    Gender: "Female",
    BMI: "22.3"
  });

  // Handle input changes
  const handleChange = (key: string, value: string) => {
    setUserInfo({ ...userInfo, [key]: value });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Profile</Text>

      {/* Wallet Information */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="wallet" size={30} color="#007bff" />
            <Text style={styles.cardTitle}>Wallet Information</Text>
          </View>
          <Text style={styles.label}>
            Status:  
            <Text style={walletInfo.connected ? styles.connected : styles.disconnected}>
              {walletInfo.connected ? " Connected ✅" : " Not Connected ❌"}
            </Text>
          </Text>
          <Text style={styles.label}>Address: {walletInfo.connected ? walletInfo.address : "N/A"}</Text>
        </Card.Content>
      </Card>

      {/* Personal Information (Editable) */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="account" size={30} color="#007bff" />
            <Text style={styles.cardTitle}>Personal Information</Text>
          </View>
          {Object.keys(userInfo).map((key) => (
            <View key={key} style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{key.replace(/([A-Z])/g, " $1")}</Text>
              <TextInput
                style={styles.input}
                value={userInfo[key as keyof typeof userInfo]}
                onChangeText={(text) => handleChange(key, text)}
                placeholder={`Enter ${key}`}
              />
            </View>
          ))}
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>

      {/* Alert Settings */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="alert" size={30} color="#e74c3c" />
            <Text style={styles.cardTitle}>Alert Settings</Text>
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Heart Alerts</Text>
            <Switch value={heartAlertsEnabled} onValueChange={() => setHeartAlertsEnabled(!heartAlertsEnabled)} />
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Blood Pressure Alerts</Text>
            <Switch value={bpAlertsEnabled} onValueChange={() => setBPAlertsEnabled(!bpAlertsEnabled)} />
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    marginBottom: 20,
    elevation: 2,
    backgroundColor: "#ffffff",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  label: {
    fontSize: 16,
    marginVertical: 4,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  saveButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  settingLabel: {
    fontSize: 16,
  },
  connected: {
    color: "green",
    fontWeight: "bold",
  },
  disconnected: {
    color: "red",
    fontWeight: "bold",
  },
});

