import { http, createConfig } from 'wagmi'
import { mantle, mantleSepoliaTestnet } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

// Get project ID from environment (optional for WalletConnect)
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || ''

export const config = createConfig({
  chains: [mantleSepoliaTestnet, mantle],
  connectors: [
    injected(),
    ...(projectId ? [walletConnect({ projectId })] : []),
  ],
  transports: {
    [mantleSepoliaTestnet.id]: http(
      import.meta.env.VITE_MANTLE_TESTNET_RPC_URL || 'https://rpc.sepolia.mantle.xyz'
    ),
    [mantle.id]: http(
      import.meta.env.VITE_MANTLE_MAINNET_RPC_URL || 'https://rpc.mantle.xyz'
    ),
  },
  ssr: true,
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
