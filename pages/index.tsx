import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Navbar from '../components/Navbar';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import useContract from '../hooks/useContract';
import usdtContractABI from '../hooks/utils/usdt.json';
import { useAccount } from 'wagmi';

const Home: NextPage = () => {
  const [fromValue, setFromValue] = useState<string>('');
  const [toValue, setToValue] = useState<string>('');
  const [goldValue, setGoldValue] = useState<number>(1);
  const [tokenPrice, setTokenPrice] = useState<number | string>(1);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [walletBalance, setWalletBalance] = useState<string>('0.00');
  const [dexBalance, setDexBalance] = useState('0');
  const [usdtBalance, setUsdtBalance] = useState('0');
  const [isBuying, setIsBuying] = useState<boolean>(true); // Estado para el tipo de operación
  const [fetched, setFetched] = useState(false);

  const { address } = useAccount();
  const { getAvailableBalance, buyTokensFromDex, sellTokensToDex, web3, contract, getDexBalance, getUSDTBalance} = useContract();
  const [balance, setBalance] = useState<string | null>(null);

  const JSONtest = {
    "timestamp": 1717178838,
    "metal": "XAU",
    "currency": "USD",
    "exchange": "FOREXCOM",
    "symbol": "FOREXCOM:XAUUSD",
    "prev_close_price": 2343.2,
    "open_price": 2343.2,
    "low_price": 2324.025,
    "high_price": 2359.74,
    "open_time": 1717113600,
    "price": 2325.65,
    "ch": -17.55,
    "chp": -0.75,
    "ask": 2326.09,
    "bid": 2325.46,
    "price_gram_24k": 74.7714,
    "price_gram_22k": 68.5404,
    "price_gram_21k": 65.425,
    "price_gram_20k": 62.3095,
    "price_gram_18k": 56.0785,
    "price_gram_16k": 49.8476,
    "price_gram_14k": 43.6166,
    "price_gram_10k": 31.1547,
  };

  const isFormValid = fromValue.trim() !== '' && toValue.trim() !== '';

  const priceGram24K = JSONtest.price_gram_24k;


  // This value have to be calculated in the useEffect where the API to the goldValue is called
  const exchangeTax = JSONtest.price_gram_24k * 0.05;
  const goldValueTaxed = priceGram24K + exchangeTax;

  const convertionToAcceptedValue = (value: number) => {
    return Math.round(value * 10 ** 9);
  };

  useEffect(() => {
    setTokenPrice(convertionToAcceptedValue(priceGram24K));

    const fetchBalance = async () => {
      if (web3 && address) {
        const balance = await web3.eth.getBalance(address);
        setWalletBalance(web3.utils.fromWei(balance, 'ether'));
      }
    };

    if (address && web3) {
      fetchBalance();
    }

    setGoldValue(priceGram24K);
    setExchangeRate(1 / goldValueTaxed);
  }, [address, web3]);

  const handleCurrencyExchangeToNGold = (value: number) => {
    try {
      if (exchangeRate == null) {
        throw new Error("Exchange rate cannot be null");
      } else {
        if(isBuying){
          const exchangeCurrency = value * exchangeRate;
          setToValue(exchangeCurrency.toFixed(9));
        }else{
          const exchangeCurrency = value / exchangeRate;
          setToValue(exchangeCurrency.toFixed(9));
        }
        
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCurrencyExchangeToUdst = (value: number) => {
    try {
      if (exchangeRate == null) {
        throw new Error("Exchange rate cannot be null");
      } else {
        if(isBuying){
          const exchangeCurrency = value / exchangeRate;
          setFromValue(exchangeCurrency.toString());
        }else{
          const exchangeCurrency = value * exchangeRate;
          setFromValue(exchangeCurrency.toString());
        }
        
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleButtonClick = async () => {
    try {
      const availableBalance = await getAvailableBalance();
      setBalance(availableBalance);
    } catch (error) {
      console.error('Error fetching available balance', error);
    }
  };

  const fetchBalances = async () => {
    if (address && contract && !fetched) {
      try {
        const dexBal = await getDexBalance(address);
        const dexBalInEther = dexBal / (10 ** 9);
        setDexBalance(dexBalInEther);

        const usdtBal = await getUSDTBalance(address);
        const usdtBalInEther = usdtBal / (10 ** 9); // Asumiendo que USDT tiene 18 decimales
        setUsdtBalance(usdtBalInEther);
        setFetched(true)
      } catch (error) {
        console.error('Error fetching balances:', error);
      }
    }
  };

  const fetchBalancesAux = async () => {
    try {
      const dexBal = await getDexBalance(address);
      const dexBalInEther = dexBal / (10 ** 9);
      setDexBalance(dexBalInEther);

      const usdtBal = await getUSDTBalance(address);
      const usdtBalInEther = usdtBal / (10 ** 9); // Asumiendo que USDT tiene 18 decimales
      setUsdtBalance(usdtBalInEther);
      setFetched(true)
    } catch (error) {
      console.error('Error fetching balances:', error);
    }
  };

  useEffect(() => {
    fetchBalances();
  }, [contract, address, fetched]);

  const usdtContractAddress = '0x66f45494f187Cf21cA5b6d0586e934EC38ff0bBB';

  const handleApproveAndBuyTokens = async () => {
    if(isBuying){
      if (web3 && contract && address) {
        try {
          const usdtContract = new web3.eth.Contract(usdtContractABI, usdtContractAddress);
          await usdtContract.methods.approve(contract.options.address, convertionToAcceptedValue(parseFloat(fromValue))).send({ from: address });
  
          const result = await buyTokensFromDex(convertionToAcceptedValue(parseFloat(toValue)), usdtContractAddress, convertionToAcceptedValue(parseFloat(fromValue)));
          const status = result.status;
          const statusNumber = Number(status);
          fetchBalancesAux()
          let url = `https://amoy.polygonscan.com/tx/${result.transactionHash}`;
  
          if (statusNumber === 1) {
            console.log('Transaction successful:', result.transactionHash);
            window.open(url, '_blank');
            setFromValue('');
            setToValue('');
          } else {
            console.log('Transaction failed:', result);
            window.open(url, '_blank');
          }
        } catch (error) {
          console.error('Error approving tokens and buying tokens from P2P', error);
        }
      } else {
        throw new Error('Web3, contract or account not available');
      }
    }else{
      if (web3 && contract && address) {
        try {
          const tokenAmount = convertionToAcceptedValue(parseFloat(fromValue));
          const priceTokenPitufo = convertionToAcceptedValue(parseFloat(toValue));
          const result = await sellTokensToDex(tokenAmount, priceTokenPitufo, usdtContractAddress);
          const status = result.status;
          const statusNumber = Number(status);
          let url = `https://amoy.polygonscan.com/tx/${result.transactionHash}`;
          fetchBalancesAux()
          if (statusNumber === 1) {
            console.log('Transaction successful:', result.transactionHash);
            window.open(url, '_blank');
            setFromValue('');
            setToValue('');
          } else {
            console.log('Transaction failed:', result);
            window.open(url, '_blank');
          }
        } catch (error) {
          console.error('Error approving tokens and buying tokens from P2P', error);
        }
      } else {
        throw new Error('Web3, contract or account not available');
      }
    }
  };

  const handleSwitch = () => {
    setIsBuying(!isBuying);
    setFromValue('')
    setToValue('')
  };

  return (
    <div>
      <Head>
        <title>RainbowKit App</title>
        <meta content="Generated by @rainbow-me/create-rainbowkit" name="description" />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <Navbar goldValue={goldValue} />

      <main className={styles.mainContent}>
        <div className={styles.leftSection}>
          <h1 className={styles.textPrimary}>NGOLD</h1>
          <h2>
            <span className={styles.textPrimary}>Decentralized Digital</span>{' '}
            <span className={styles.highlightPrimary}>Gold Token</span>
          </h2>
          <p>
            <span className={styles.textSecondary}>Invest in gold with NGOLD, where </span>
            <span className={styles.textPrimary}>each token represents 1 gram of gold </span>
            <span className={styles.textSecondary}>
              priced by London Gold Fixing. Earn up to 2.5% rewards buying NGOLD on
              DEX-P2P. Note: P2P purchases can't be sold on www.ngold.io/dex, promoting higher transaction volumes and usability.
            </span>
          </p>
          <div className={styles.buttonContainer}>
            <button className={`${styles.whitePaperButton}`}>
              WHITE PAPER <i className="bi bi-download"></i>
            </button>
          </div>
        </div>
        <div className={styles.rightSection}>
          <div>
            {!isBuying ? <h2>Sell Gold</h2> : <h2>Buy Gold</h2> }
            <span>
              <span className={styles.goldPriceLabel}>London Gold Fix 1 gram:</span>{' '}
              <span className={styles.goldPriceValue}>${goldValue}</span>
            </span>
            <br />
            <span>
              <span className={styles.goldPriceLabel}>London Gold Fix 1 gram with the exchange Tax applied:</span>{' '}
              <span className={styles.goldPriceValue}>${goldValueTaxed}</span>
            </span>
          </div>
          
          <div className={styles.inputContainer}>
            <div className={styles.subContainer}>
              <div className={styles.subContainerHeader}>
                <span className={styles.fromText}>From</span>
                <button className={styles.useMaxText}>Use Max</button>
              </div>
              <div className={styles.subContainerContent}>
                <input 
                  type="number" 
                  placeholder="0" 
                  value={fromValue} 
                  onChange={(e) => {handleCurrencyExchangeToNGold(parseFloat(e.target.value)) ; setFromValue(e.target.value) ; }}
                />
                <div>
                  {isBuying ? <Image src="/images/usdt.png" alt="Polygon" width={20} height={20} /> : <Image src="/images/Ethereum.svg" alt="Ethereum" width={20} height={20} /> }
                  <select id="chains" disabled>
                    <option value="USDT">{isBuying ? 'USDT' : 'NGOLD'}</option>
                  </select>
                </div>
              </div>
              <div className={styles.subContainerFooter}>Balance: {isBuying ? usdtBalance : dexBalance}</div>
            </div>
            <div className={styles.switchButtoncontainer}>
            <button className={styles.switchButton} onClick={handleSwitch}>
              <i className="bi bi-arrow-down-up"></i>
            </button>
            </div>
            <div className={styles.subContainer}>
              <div className={styles.subContainerHeader}>
                <span className={styles.fromText}>To</span>
              </div>
              <div className={styles.subContainerContent}>
                <input 
                  type="number" 
                  placeholder="0" 
                  value={toValue} 
                  onChange={(e) => {handleCurrencyExchangeToUdst(parseFloat(e.target.value)) ; setToValue(e.target.value)}} 
                />
                <div>
                  {isBuying ? <Image src="/images/Ethereum.svg" alt="Ethereum" width={20} height={20} /> : <Image src="/images/usdt.png" alt="Polygon" width={20} height={20} /> }
                  <select id="chains" disabled>
                    <option value="NGOLD">{isBuying ? 'NGOLD' : 'USDT'}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.priceContainer}>
            <span className={styles.priceText}>Impuesto</span>
            <span className={styles.priceValue}>
            0.5% <i className="bi bi-arrow-repeat"></i>
            </span>
          </div>
          <button 
            className={`${styles.buyButton} ${isFormValid ? styles.buyButtonActive : ''}`}
            disabled={!isFormValid}
            onClick={handleApproveAndBuyTokens}
          >
            {isFormValid ? (isBuying ? 'BUY NGOLD' : 'SELL NGOLD') : 'Enter A Mount'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Home;
