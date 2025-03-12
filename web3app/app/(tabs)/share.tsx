import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet } from "react-native";
import { Card } from "react-native-paper";

const ShareDataScreen = () => {
  const [walletId, setWalletId] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [sharedUsers, setSharedUsers] = useState([]);

  const shareData = () => {
    if (walletId.trim() && deviceId.trim()) {
      setSharedUsers([...sharedUsers, { walletId, deviceId }]);
      setWalletId("");
      setDeviceId("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Share Data</Text>
      <Card style={styles.card}>
        <Text style={styles.header}>Share Data</Text>
        <Text style={styles.formlabel}>User's Wallet ID</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter User Wallet ID"
          value={walletId}
          onChangeText={setWalletId}
        />
                    <Text style={styles.formlabel}>User's Device ID</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter Device ID"
          value={deviceId}
          onChangeText={setDeviceId}
        />
        <Button title="Share Data" onPress={shareData} color="#007AFF" />
      </Card>
      <Card style={styles.card}>
        <Text style={styles.header}>Shared Users</Text>
        {sharedUsers.length === 0 ? (
          <Text style={styles.noSharedUsers}>No shared users</Text>
        ) : (
          <FlatList
            data={sharedUsers}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Card style={styles.deviceCard}>
                <Text style={styles.deviceText}>Wallet: {item.walletId}</Text>
                <Text style={styles.deviceText}>Device: {item.deviceId}</Text>
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

  formlabel: {
    fontSize: 15,
    fontWeight: "bold",
    color: "gray",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  noSharedUsers: {
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

export default ShareDataScreen;