import React, { createContext, useContext, useState } from "react";
import { Linking, Platform } from "react-native";

interface WalletInfo {
  address: string | null;
  connected: boolean;
  status: string;
}

interface AuthContextType {
  walletInfo: WalletInfo;
  connectWallet: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [walletInfo, setWalletInfo] = useState<WalletInfo>({
    address: null,
    connected: false,
    status: "🔗 Click to connect your wallet.",
  });

  const connectWallet = async () => {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined" && (window as any).ethereum) {
        try {
          const accounts = await (window as any).ethereum.request({
            method: "eth_requestAccounts",
          });
          setWalletInfo({
            address: accounts[0],
            connected: true,
            status: "✅ Wallet connected successfully!",
          });
        } catch (error: any) {
          setWalletInfo({
            address: null,
            connected: false,
            status: `❌ ${error.message}`,
          });
        }
      } else {
        setWalletInfo({
          address: null,
          connected: false,
          status: "⚠️ MetaMask not installed. Please install it to continue.",
        });
      }
    } else {
      // Mobile: Open MetaMask via deep link
      const metamaskAppDeepLink = "https://metamask.app.link/dapp/example.com";
      try {
        const supported = await Linking.canOpenURL(metamaskAppDeepLink);
        if (supported) {
          await Linking.openURL(metamaskAppDeepLink);
        } else {
          setWalletInfo({
            address: null,
            connected: false,
            status: "⚠️ MetaMask not installed.",
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const logout = () => {
    setWalletInfo({
      address: null,
      connected: false,
      status: "🔗 Click to connect your wallet.",
    });
  };

  return (
    <AuthContext.Provider value={{ walletInfo, connectWallet, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
