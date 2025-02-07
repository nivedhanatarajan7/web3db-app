import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a context for authentication
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// AuthProvider to wrap your app and provide authentication state
export const AuthProvider = ({ children }) => {
  const [walletInfo, setWalletInfo] = useState({
    address: '',
    status: '🔗 Click to connect your wallet.',
    connected: false,
  });

  // Connect to MetaMask (used in login screen)
  const connectWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        setWalletInfo({
          address: accounts[0],
          status: `Wallet: ${accounts[0]} ✅`,
          connected: true,
        });
      } catch (error) {
        setWalletInfo({
          address: '',
          status: `❌ ${error.message}`,
          connected: false,
        });
      }
    } else {
      setWalletInfo({
        address: '',
        status: '⚠️ MetaMask not installed. Please install it to continue.',
        connected: false,
      });
    }
  };

  // Logout function to clear authentication
  const logout = () => {
    setWalletInfo({
      address: '',
      status: '🔗 Click to connect your wallet.',
      connected: false,
    });
  };

  return (
    <AuthContext.Provider value={{ walletInfo, connectWallet, logout }}>
      {children}
    </AuthContext.Provider>
  );
};