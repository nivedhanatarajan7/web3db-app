import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "./AuthContext"; // Import useAuth hook

export default function LoginScreen() {
  const { walletInfo, connectWallet, logout } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Web3DB App</Text>

        {!walletInfo.connected ? (
          <TouchableOpacity style={styles.button} onPress={connectWallet}>
            <Text style={styles.buttonText}>Connect to MetaMask</Text>
          </TouchableOpacity>
        ) : (
          <>
            <Text style={styles.walletText}>Connected Wallet:</Text>
            <Text style={styles.address}>{walletInfo.address}</Text>

            <TouchableOpacity style={[styles.button, styles.disconnectButton]} onPress={logout}>
              <Text style={styles.buttonText}>Disconnect</Text>
            </TouchableOpacity>
          </>
        )}

        <Text style={styles.status}>{walletInfo.status}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  card: {
    width: "90%",
    maxWidth: 400,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 15,
    width: "100%",
    alignItems: "center",
  },
  disconnectButton: {
    backgroundColor: "#d9534f",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  walletText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    color: "#333",
  },
  address: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
    textAlign: "center",
  },
  status: {
    fontSize: 14,
    marginTop: 15,
    color: "#666",
    textAlign: "center",
  },
});
