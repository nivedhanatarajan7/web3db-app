import React, { useState } from 'react';
import { View, Button, Text, StyleSheet, Platform, Linking } from 'react-native';
import { useAuth } from '../AuthContext'; // Import useAuth hook

export default function LoginScreen() {
  const { walletInfo, connectWallet, logout } = useAuth(); // Use auth context

  const connect = async () => {
    if (Platform.OS === 'web') {
      // Web: Use window.ethereum
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        try {
          const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
          connectWallet(); // Update the state in AuthContext
        } catch (error: any) {
          console.error(error);
        }
      } else {
        console.log('MetaMask not installed');
      }
    } else {
      // Mobile: Use deep linking for MetaMask
      const metamaskAppDeepLink = 'https://metamask.app.link/dapp/uniswap.org';
      try {
        const supported = await Linking.canOpenURL(metamaskAppDeepLink);
        if (supported) {
          await Linking.openURL(metamaskAppDeepLink);
        } else {
          console.log('MetaMask not installed');
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <View style={styles.container}>
      {!walletInfo.connected ? (
        <Button title="Connect to MetaMask" onPress={connect} />
      ) : (
        <Button title="Connected" onPress={logout} color="green" />
      )}
      <Text style={styles.text}>{walletInfo.status}</Text>
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
  address: {
    marginTop: 10,
    fontSize: 14,
    color: 'gray',
  }
});


/* export default function LoginScreen() {
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
 */