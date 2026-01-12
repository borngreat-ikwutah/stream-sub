import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { zkTippingSubscriptionsAbi } from '../lib/abis'
import { getContractAddress } from '../lib/contracts'
import type { Address } from 'viem'

/**
 * Hook to read subscription details
 */
export function useGetSubscription(subscriber?: Address, creator?: Address) {
  const { data: chainId } = useReadContract({
    abi: [{ type: 'function', name: 'admin', outputs: [{ type: 'address' }], stateMutability: 'view' }],
    functionName: 'admin',
  } as any)

  return useReadContract({
    address: getContractAddress(5003, 'zkTippingSubscriptions'), // Default to testnet
    abi: zkTippingSubscriptionsAbi,
    functionName: 'getSubscription',
    args: subscriber && creator ? [subscriber, creator] : undefined,
    query: {
      enabled: Boolean(subscriber && creator),
    },
  })
}

/**
 * Hook to check if subscription can be charged
 */
export function useCanCharge(subscriber?: Address, creator?: Address) {
  return useReadContract({
    address: getContractAddress(5003, 'zkTippingSubscriptions'),
    abi: zkTippingSubscriptionsAbi,
    functionName: 'canCharge',
    args: subscriber && creator ? [subscriber, creator] : undefined,
    query: {
      enabled: Boolean(subscriber && creator),
    },
  })
}

/**
 * Hook to get time until next charge
 */
export function useTimeUntilNextCharge(subscriber?: Address, creator?: Address) {
  return useReadContract({
    address: getContractAddress(5003, 'zkTippingSubscriptions'),
    abi: zkTippingSubscriptionsAbi,
    functionName: 'timeUntilNextCharge',
    args: subscriber && creator ? [subscriber, creator] : undefined,
    query: {
      enabled: Boolean(subscriber && creator),
      refetchInterval: 10000, // Refetch every 10 seconds
    },
  })
}

/**
 * Hook to check if user is verified
 */
export function useIsVerified(address?: Address) {
  return useReadContract({
    address: getContractAddress(5003, 'zkTippingSubscriptions'),
    abi: zkTippingSubscriptionsAbi,
    functionName: 'isVerified',
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address),
    },
  })
}

/**
 * Hook to check if user is a creator
 */
export function useIsCreator(address?: Address) {
  return useReadContract({
    address: getContractAddress(5003, 'zkTippingSubscriptions'),
    abi: zkTippingSubscriptionsAbi,
    functionName: 'isCreator',
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address),
    },
  })
}

/**
 * Hook to subscribe to a creator
 */
export function useSubscribe() {
  const { writeContract, data: hash, error, isPending } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const subscribe = (creator: Address, amount: bigint, interval: bigint) => {
    writeContract({
      address: getContractAddress(5003, 'zkTippingSubscriptions'),
      abi: zkTippingSubscriptionsAbi,
      functionName: 'subscribe',
      args: [creator, amount, interval],
    })
  }

  return {
    subscribe,
    hash,
    error,
    isPending,
    isConfirming,
    isSuccess,
  }
}

/**
 * Hook to update subscription
 */
export function useUpdateSubscription() {
  const { writeContract, data: hash, error, isPending } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const updateSubscription = (creator: Address, newAmount: bigint, newInterval: bigint) => {
    writeContract({
      address: getContractAddress(5003, 'zkTippingSubscriptions'),
      abi: zkTippingSubscriptionsAbi,
      functionName: 'updateSubscription',
      args: [creator, newAmount, newInterval],
    })
  }

  return {
    updateSubscription,
    hash,
    error,
    isPending,
    isConfirming,
    isSuccess,
  }
}

/**
 * Hook to cancel subscription
 */
export function useCancelSubscription() {
  const { writeContract, data: hash, error, isPending } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const cancelSubscription = (creator: Address) => {
    writeContract({
      address: getContractAddress(5003, 'zkTippingSubscriptions'),
      abi: zkTippingSubscriptionsAbi,
      functionName: 'cancelSubscription',
      args: [creator],
    })
  }

  return {
    cancelSubscription,
    hash,
    error,
    isPending,
    isConfirming,
    isSuccess,
  }
}

/**
 * Hook to charge a subscription
 */
export function useChargeSubscription() {
  const { writeContract, data: hash, error, isPending } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const chargeSubscription = (subscriber: Address, creator: Address) => {
    writeContract({
      address: getContractAddress(5003, 'zkTippingSubscriptions'),
      abi: zkTippingSubscriptionsAbi,
      functionName: 'chargeSubscription',
      args: [subscriber, creator],
    })
  }

  return {
    chargeSubscription,
    hash,
    error,
    isPending,
    isConfirming,
    isSuccess,
  }
}

/**
 * Hook to register as creator
 */
export function useRegisterAsCreator() {
  const { writeContract, data: hash, error, isPending } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const registerAsCreator = () => {
    writeContract({
      address: getContractAddress(5003, 'zkTippingSubscriptions'),
      abi: zkTippingSubscriptionsAbi,
      functionName: 'registerAsCreator',
    })
  }

  return {
    registerAsCreator,
    hash,
    error,
    isPending,
    isConfirming,
    isSuccess,
  }
}
