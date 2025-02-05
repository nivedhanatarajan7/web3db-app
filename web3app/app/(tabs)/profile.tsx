import React, { useContext } from "react";
import { View, Text, StyleSheet, ScrollView, Switch, Button } from "react-native";
import { Card } from "react-native-paper";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { AlertContext } from '../AlertContext'; // Adjust the path as needed

export default function ProfilePage({ navigation }: any) {
  
  const { heartAlertsEnabled, setHeartAlertsEnabled } = useContext(AlertContext);
  const { bpAlertsEnabled, setBPAlertsEnabled } = useContext(AlertContext);

  const toggleHeartAlerts = () => setHeartAlertsEnabled(!heartAlertsEnabled);
  const toggleBPAlerts = () => setBPAlertsEnabled(!bpAlertsEnabled);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Profile</Text>

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

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="alert" size={30} color="#e74c3c" />
            <Text style={styles.cardTitle}>Alert Settings</Text>
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Heart Alerts</Text>
            <Switch value={heartAlertsEnabled} onValueChange={toggleHeartAlerts} />
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Blood Pressure Alerts</Text>
            <Switch value={bpAlertsEnabled} onValueChange={toggleBPAlerts} />
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
});
