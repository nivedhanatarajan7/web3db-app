import React, { useState } from 'react';
import { View, Button, Text, StyleSheet, Platform } from 'react-native';

export default function LoginScreen() {
  const [walletInfo, setWalletInfo] = useState<{ address: string; status: string ; connected: boolean }>({
    address: '',
    status: '🔗 Click to connect your wallet.',
    connected: false,
  });

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        setWalletInfo({
          address: accounts[0],
          status: '✅ Wallet connected successfully!',
          connected: true,
        });
      } catch (error: any) {
        setWalletInfo({
          address: '',
          status: `❌ ${error.message}`,
          connected: false
        });
      }
    } else {
      setWalletInfo({
        address: '',
        status: '⚠️ MetaMask not installed. Please install it to continue.',
        connected:false,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Button title={walletInfo.connected ? "Connected" : "Connect to MetaMask"} onPress={connectWallet} />
      {walletInfo.address ? (
        <Text style={styles.text}>Connected Wallet: {walletInfo.address}</Text>
      ) : (
        <Text style={styles.text}>{walletInfo.status}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
