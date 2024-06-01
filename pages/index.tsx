import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Navbar from '../components/Navbar';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import useContract from '../hooks/useContract';
import usdtContractABI from '../hooks/utils/usdt.json'
import { useAccount } from 'wagmi';


const Home: NextPage = () => {
  const [fromValue, setFromValue] = useState<string>('');
  const [toValue, setToValue] = useState<string>('');
  const [goldValue, setGoldValue] = useState<number>(1);
  const [tokenPrice, setTokenPrice] = useState<number | string>(1);
  const [exchangeRate, setExchangeRate]= useState<number|null>(null);

  const { address } = useAccount();

    //This JSON will be unnecesary after the API called is succesfully made
    const JSONtest = {
      "timestamp":1717178838,
      "metal":"XAU",
      "currency":"USD",
      "exchange":"FOREXCOM",
      "symbol":"FOREXCOM:XAUUSD",
      "prev_close_price":2343.2,
      "open_price":2343.2,
      "low_price":2324.025,
      "high_price":2359.74,
      "open_time":1717113600,
      "price":2325.65,
      "ch":-17.55,
      "chp":-0.75,
      "ask":2326.09,
      "bid":2325.46,
      "price_gram_24k":74.7714,
      "price_gram_22k":68.5404,
      "price_gram_21k":65.425,
      "price_gram_20k":62.3095,
      "price_gram_18k":56.0785,
      "price_gram_16k":49.8476,
      "price_gram_14k":43.6166,
      "price_gram_10k":31.1547,
      }

  const isFormValid = fromValue.trim() !== '' && toValue.trim() !== '';

  //This variable will be unnecesary after the API called is succesfully made
  const priceGram24K = JSONtest.price_gram_24k;



  const convertionToAcceptedValue = (value:number) =>{
      return Math.round(value * 10**9) 
    }
  

  useEffect( ()  => {
    //TokenPrice for the backend logic
    setTokenPrice(convertionToAcceptedValue(priceGram24K));

    //This Fetch for the API only functional till 100 request, a token is needed to be add at line 55
    
    //const apiHeaders = new Headers();
    //apiHeaders.append("x-access-token", "TOKEN TO BE ADD");
    //apiHeaders.append("Content-Type", "application/json");
    
    //const requestOptions: RequestInit = {
    //  method: 'GET',
    //  headers: apiHeaders,
    //  redirect: 'follow' as RequestRedirect
    //};
    
    //fetch("https://www.goldapi.io/api/XAU/USD", requestOptions)
    //  .then((response: Response) => response.json())
    //  .then((result: any) => {
    //    const priceGram24k = result.price_gram_24k;
    //    const tokenPrice = Math.round(priceGram24k * 10**9)
    //    setGoldValue(priceGram24k)
    //    setExchangeRate(1/priceGram24K)
    //  })
    //  .catch((error: any) => console.log('error', error));


    setGoldValue(priceGram24K)
    setExchangeRate(1/priceGram24K)
  }, []); 

    // Exchange function from Udst to Ngold
    const handleCurrencyExchangeToNGold = (value:number) => {
      try {
        if (exchangeRate == null) {
            throw new Error("Exchange rate cannot be null");
        } else {
            const exchangeCurrency = value * exchangeRate;
            setToValue(exchangeCurrency.toFixed(9));
        }
    } catch (error) {
        console.log(error);
    }
    
    };
    // Exchange function from Ngold to Udst
    const handleCurrencyExchangeToUdst = (value:number) => {
      try {
        if (exchangeRate == null) {
            throw new Error("Exchange rate cannot be null");
        } else {
          const exchangeCurrency = value / exchangeRate;
          setFromValue(exchangeCurrency.toString())
        }
    } catch (error) {
        console.log(error);
    }
    };


  const { getAvailableBalance, buyTokensFromP2P , web3, contract } = useContract();
  const [balance, setBalance] = useState<string | null>(null);

  const handleButtonClick = async () => {
    try {
      const availableBalance = await getAvailableBalance();
      setBalance(availableBalance);
    } catch (error) {
      console.error('Error fetching available balance', error);
    }
  };

  const usdtContractAddress = '0x1ca23a42D0c095748ebc43C3fdC219170181CD55';
  const priceTokenPitufo = tokenPrice;

  const handleApproveAndBuyTokens = async () => {
    if (web3 && contract && address) {
      try {
        // Primero, obtenemos el contrato USDT
        const usdtContract = new web3.eth.Contract(usdtContractABI, usdtContractAddress);

        // Luego, aprobamos la cantidad de tokens que el contrato puede mover
        await usdtContract.methods.approve(contract.options.address, convertionToAcceptedValue(parseFloat(fromValue))).send({ from: address });

        // Finalmente, compramos los tokens
        const result = await buyTokensFromP2P(convertionToAcceptedValue(parseFloat(toValue)), usdtContractAddress, convertionToAcceptedValue(parseFloat(fromValue)));
        const status = result.status;
        const statusNumber = Number(status); // Convertimos BigInt a número
        let url = `https://amoy.polygonscan.com/tx/${result.transactionHash}`;

        if (statusNumber === 1) {
            console.log('Transaction successful:', result.transactionHash);
            window.open(url, '_blank');
            setFromValue('')
            setToValue('')
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
  };

  const handleTest = () =>{
    console.log(convertionToAcceptedValue(parseFloat(fromValue)))
    console.log(tokenPrice)
    console.log(convertionToAcceptedValue(parseFloat(toValue)))
  }

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
            <Link href="/p2p" passHref>
              <button className={`${styles.buyP2PButton}`}>
                BUY P2P
              </button>
            </Link>
          </div>
        </div>
        <div className={styles.rightSection}>
          <div>
            <h2>Buy NGOLD</h2>
            <span>
              <span className={styles.goldPriceLabel}>London Gold Fix 1 gram:</span>{' '}
              <span className={styles.goldPriceValue}>${goldValue}</span>
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
                  <Image src="/images/usdt.png" alt="Polygon" width={20} height={20} />
                  <select id="chains">
                    <option value="USDT">USDT</option>
                  </select>
                </div>
              </div>
              <div className={styles.subContainerFooter}>Balance: {fromValue}</div>
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
                  onChange={(e) => {handleCurrencyExchangeToUdst(parseFloat(e.target.value)) ;setToValue(e.target.value)}} 
                />
                <div>
                  <Image src="/images/Ethereum.svg" alt="Ethereum" width={20} height={20} />
                  <select id="chains">
                    <option value="NGOLD">NGOLD</option>
                  </select>
                </div>
              </div>
              <div className={styles.subContainerFooter}>Balance: {toValue}</div>
            </div>
          </div>
          <div className={styles.priceContainer}>
            <span className={styles.priceText}>Price</span>
            <span className={styles.priceValue}>
            {exchangeRate} NGOLD per USDT <i className="bi bi-arrow-repeat"></i>
            </span>
          </div>
          <button 
            className={`${styles.buyButton} ${isFormValid ? styles.buyButtonActive : ''}`}
            disabled={!isFormValid}
            onClick={handleApproveAndBuyTokens}
          >
            {isFormValid ? 'BUY NGOLD' : 'Enter A Mount'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Home;
