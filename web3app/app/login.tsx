import React from "react";
import { View, Button, Text, StyleSheet } from "react-native";
import { useAuth } from "./AuthContext"; // Import useAuth hook

export default function LoginScreen() {
  const { walletInfo, connectWallet, logout } = useAuth();

  return (
    <View style={styles.container}>
      {!walletInfo.connected ? (
        <Button title="Connect to MetaMask" onPress={connectWallet} />
      ) : (
        <>
          <Text style={styles.text}>Connected Wallet: {walletInfo.address}</Text>
          <Button title="Disconnect" onPress={logout} color="red" />
        </>
      )}
      <Text style={styles.text}>{walletInfo.status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
