// pages/_app.tsx

import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import type { AppProps } from 'next/app';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import {
  polygon,
} from 'wagmi/chains';
import { getDefaultConfig, RainbowKitProvider, Chain } from '@rainbow-me/rainbowkit';

const amoyTestnet = {
  id: 80002, // Chain ID for Polygon Mumbai Testnet
  name: 'Polygon Amoy Testnet',
  iconUrl: 'https://polygon.technology/media-kit/matic-token-icon.png',
  iconBackground: '#fff',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://rpc-amoy.polygon.technology/'] },
  },
  blockExplorers: {
    default: { name: 'Polygonscan', url: 'https://amoy.polygonscan.com/' },
  }
} as const satisfies Chain;

const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [
    polygon,
    amoyTestnet,
  ],
  ssr: true,
});

const client = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
