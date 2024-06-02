// hooks/utils/useContract.ts

import { useState, useEffect } from 'react';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import contractABI from './utils/pitufo.json';
import { useAccount } from 'wagmi';

const useContract = () => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const { address } = useAccount();

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  useEffect(() => {
    if (window.ethereum && address) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
      const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
      setContract(contractInstance);
    } else {
      console.error('Ethereum provider not found');
    }
  }, [contractAddress, address]);

  const getAvailableBalance = async () => {
    if (contract && address) {
      try {
        const availableBalance = await contract.methods.availableBalance().call({ from: address });
        return availableBalance.toString();
      } catch (error) {
        console.error('Error getting available balance', error);
        throw error;
      }
    } else {
      throw new Error('Contract or account not available');
    }
  };

  const buyTokensFromP2P = async (tokenAmount, usdtContractAddress, priceTokenPitufo) => {
    if (contract && address) {
      try {
        const result = await contract.methods.buyTokensFromP2P(tokenAmount, usdtContractAddress, priceTokenPitufo).send({ from: address });
        return result;
      } catch (error) {
        console.error('Error buying tokens from P2P', error);
        throw error;
      }
    } else {
      throw new Error('Contract or account not available');
    }
  };

  return { web3, contract, getAvailableBalance, buyTokensFromP2P };
};

export default useContract;
