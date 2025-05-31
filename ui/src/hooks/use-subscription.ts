'use client'

import { useState, useEffect } from 'react'
import { 
  useReadSubscriptionModuleSubscriptions,
  useReadSubscriptionModuleSubscriptionCounter,
  useWatchSubscriptionModuleSubscriptionCreatedEvent,
  useWatchSubscriptionModuleRedeemedEvent
} from '@/generated'
import { 
  type Subscription,
  type SubscriptionCreatedEvent,
  type RedeemedEvent 
} from '@/types/subscription'

export function useSubscription(subscriptionId?: bigint) {
  // Read subscription data
  const { 
    data: subscriptionData, 
    isLoading, 
    error,
    refetch 
  } = useReadSubscriptionModuleSubscriptions({
    args: subscriptionId ? [subscriptionId] : undefined,
    query: {
      enabled: !!subscriptionId,
    },
  })

  // Parse subscription data
  const subscription: Subscription | null = subscriptionData ? {
    recipient: subscriptionData[0],
    amount: subscriptionData[1],
    lastRedeemed: subscriptionData[2],
    frequency: subscriptionData[3],
  } : null

  // Check if payment is due
  const isPaymentDue = subscription ? (() => {
    const now = BigInt(Math.floor(Date.now() / 1000))
    return subscription.lastRedeemed + subscription.frequency <= now
  })() : false

  return {
    subscription,
    isLoading,
    error,
    isPaymentDue,
    refetch,
  }
}

export function useSubscriptionCounter() {
  const { data: counter, isLoading, error } = useReadSubscriptionModuleSubscriptionCounter()

  return {
    counter: counter || BigInt(0),
    isLoading,
    error,
  }
}

export function useSubscriptionEvents() {
  const [subscriptionEvents, setSubscriptionEvents] = useState<SubscriptionCreatedEvent[]>([])
  const [redeemEvents, setRedeemEvents] = useState<RedeemedEvent[]>([])

  // Watch for SubscriptionCreated events
  useWatchSubscriptionModuleSubscriptionCreatedEvent({
    onLogs(logs) {
      const newEvents = logs.map(log => ({
        recipient: log.args.recipient!,
        subId: log.args.subId!,
        amount: log.args.amount!,
        frequency: log.args.frequency!,
        blockNumber: Number(log.blockNumber),
        transactionHash: log.transactionHash,
      }))
      setSubscriptionEvents(prev => [...prev, ...newEvents])
    },
  })

  // Watch for Redeemed events
  useWatchSubscriptionModuleRedeemedEvent({
    onLogs(logs) {
      const newEvents = logs.map(log => ({
        subId: log.args.subId!,
        recipient: log.args.recipient!,
        amount: log.args.amount!,
        blockNumber: Number(log.blockNumber),
        transactionHash: log.transactionHash,
      }))
      setRedeemEvents(prev => [...prev, ...newEvents])
    },
  })

  return {
    subscriptionEvents,
    redeemEvents,
  }
}

export function useSubscriptionList(startId = BigInt(1), endId?: bigint) {
  const { counter } = useSubscriptionCounter()
  const [subscriptions, setSubscriptions] = useState<(Subscription & { id: bigint })[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!counter || counter === BigInt(0)) return

    const fetchSubscriptions = async () => {
      setIsLoading(true)
      const maxId = endId || counter
      const subscriptionPromises: Promise<Subscription & { id: bigint } | null>[] = []

      for (let i = startId; i <= maxId; i++) {
        subscriptionPromises.push(
          fetch(`/api/subscription/${i}`)
            .then(res => res.json())
            .then(data => ({ ...data, id: i }))
            .catch(() => null)
        )
      }

      try {
        const results = await Promise.all(subscriptionPromises)
        const validSubscriptions = results.filter((sub): sub is Subscription & { id: bigint } => 
          sub !== null
        )
        setSubscriptions(validSubscriptions)
      } catch (error) {
        console.error('Error fetching subscriptions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubscriptions()
  }, [counter, startId, endId])

  return {
    subscriptions,
    isLoading,
    totalCount: counter,
  }
}