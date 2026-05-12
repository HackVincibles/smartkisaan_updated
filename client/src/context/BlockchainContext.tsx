import React, { createContext, useState, ReactNode } from 'react';
// @ts-ignore - blockchainService will be added later
import blockchainService from '../services/blockchainService';

interface BlockchainContextType {
  account: string | null;
  chainId: number | null;
  isConnected: boolean;
  sbtTokens: any[];
  trustReceipts: any[];
  loading: boolean;
  connectWallet: () => Promise<{ account: string; chainId: number }>;
  issueTrustReceipt: (orderId: string, transactionHash: string) => Promise<any>;
  verifyTrustReceipt: (receiptId: string) => Promise<boolean>;
}

export const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

export const BlockchainProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [sbtTokens, setSbtTokens] = useState<any[]>([]);
  const [trustReceipts, setTrustReceipts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    setLoading(true);
    try {
      const { account, chainId } = await blockchainService.connectWallet();
      setAccount(account);
      setChainId(chainId);
      setIsConnected(true);
      await loadSBTs(account);
      return { account, chainId };
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loadSBTs = async (address: string) => {
    try {
      const tokens = await blockchainService.getFarmerSBTs(address);
      setSbtTokens(tokens);
    } catch (error) {
      console.error('Failed to load SBTs:', error);
    }
  };

  const issueTrustReceipt = async (orderId: string, transactionHash: string) => {
    setLoading(true);
    try {
      const receipt = await blockchainService.issueTrustReceipt(orderId, transactionHash);
      setTrustReceipts(prev => [receipt, ...prev]);
      return receipt;
    } catch (error) {
      console.error('Failed to issue trust receipt:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyTrustReceipt = async (receiptId: string) => {
    try {
      const isValid = await blockchainService.verifyTrustReceipt(receiptId);
      return isValid;
    } catch (error) {
      console.error('Failed to verify trust receipt:', error);
      return false;
    }
  };

  return (
    <BlockchainContext.Provider value={{
      account,
      chainId,
      isConnected,
      sbtTokens,
      trustReceipts,
      loading,
      connectWallet,
      issueTrustReceipt,
      verifyTrustReceipt
    }}>
      {children}
    </BlockchainContext.Provider>
  );
};
