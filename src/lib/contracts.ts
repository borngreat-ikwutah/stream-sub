import { mantle, mantleSepoliaTestnet } from 'wagmi/chains'
import type { Address } from 'viem'

// Contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  [mantleSepoliaTestnet.id]: {
    zkTippingSubscriptions: (import.meta.env.VITE_CONTRACT_ADDRESS_TESTNET || '0x0000000000000000000000000000000000000000') as Address,
    usdc: (import.meta.env.VITE_USDC_ADDRESS_TESTNET || '0x0000000000000000000000000000000000000000') as Address,
  },
  [mantle.id]: {
    zkTippingSubscriptions: (import.meta.env.VITE_CONTRACT_ADDRESS_MAINNET || '0x0000000000000000000000000000000000000000') as Address,
    usdc: '0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9' as Address, // Mantle USDC
  },
} as const

export type SupportedChainId = keyof typeof CONTRACT_ADDRESSES

export function getContractAddress(
  chainId: number,
  contract: 'zkTippingSubscriptions' | 'usdc'
): Address {
  const addresses = CONTRACT_ADDRESSES[chainId as SupportedChainId]
  if (!addresses) {
    throw new Error(`Unsupported chain ID: ${chainId}`)
  }
  return addresses[contract]
}
