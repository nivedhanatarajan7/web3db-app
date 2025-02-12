import React, { useContext } from "react";
import { View, Text, StyleSheet, ScrollView, Switch } from "react-native";
import { Card } from "react-native-paper";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { useAuth } from "../AuthContext";
import { AlertContext } from "../AlertContext";

export default function ProfileScreen() {
  const { walletInfo } = useAuth();
  const { heartAlertsEnabled, setHeartAlertsEnabled } = useContext(AlertContext);
  const { bpAlertsEnabled, setBPAlertsEnabled } = useContext(AlertContext);

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
          <Text style={styles.label}>Status:  
            <Text style={walletInfo.connected ? styles.connected : styles.disconnected}>
              {walletInfo.connected ? " Connected ✅" : " Not Connected ❌"}
            </Text>
          </Text>
          <Text style={styles.label}>Address: {walletInfo.connected ? walletInfo.address : "N/A"}</Text>
        </Card.Content>
      </Card>

      {/* Personal Information */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="account" size={30} color="#007bff" />
            <Text style={styles.cardTitle}>Personal Information</Text>
          </View>
          <Text style={styles.label}>Name: Jane Doe</Text>
          <Text style={styles.label}>Email: example@email.com</Text>
          <Text style={styles.label}>Height: 5'4''</Text>
          <Text style={styles.label}>Gender: Female</Text>
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
