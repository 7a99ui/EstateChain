"use client"

import { useState, useCallback, useEffect } from "react"
import { realEstateContract, type Property, type Transaction } from "@/lib/contract"

export function useContract() {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")

  const initialize = useCallback(async () => {
    try {
      setIsLoading(true)
      setError("")
      console.log("[v0] Initializing contract...")
      await realEstateContract.initialize()
      setIsInitialized(true)
      console.log("[v0] Contract hook initialized successfully")
    } catch (error: any) {
      setError(error.message || "Failed to initialize contract")
      console.error("[v0] Contract initialization error:", error)
      setIsInitialized(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    isInitialized,
    isLoading,
    error,
    initialize,
    contract: realEstateContract,
  }
}

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [isNotary, setIsNotary] = useState<boolean | null>(null) // null = non vérifié

  const ensureContractInitialized = useCallback(async () => {
    if (!realEstateContract.contract) {
      console.log("[v0] Contract not initialized, initializing now...")
      await realEstateContract.initialize()
    }
  }, [])

  // Vérifie si l'utilisateur est notaire dès que le hook est monté
  useEffect(() => {
    const checkNotary = async () => {
      try {
        await ensureContractInitialized()
        const status = await realEstateContract.isNotary()
        console.log("[v0][HOOK] isNotary:", status)
        setIsNotary(status)
      } catch (error) {
        console.error("[v0][HOOK] Error checking notary:", error)
        setIsNotary(false)
      }
    }
    checkNotary()
  }, [ensureContractInitialized])

  const loadProperties = useCallback(async () => {
    try {
      setIsLoading(true)
      setError("")
      await ensureContractInitialized()
      console.log("[v0] Loading properties...")
      const allProperties = await realEstateContract.getAllProperties()
      setProperties(allProperties)
      console.log("[v0] Loaded properties:", allProperties.length)
    } catch (error: any) {
      setError(error.message || "Failed to load properties")
      console.error("[v0] Error loading properties:", error)
    } finally {
      setIsLoading(false)
    }
  }, [ensureContractInitialized])

  const addProperty = useCallback(
    async (location: string, price: string) => {
      try {
        setIsLoading(true)
        setError("")
        await ensureContractInitialized()
        if (!isNotary) throw new Error("Only the notary can add properties")
        const txHash = await realEstateContract.addProperty(location, price)
        console.log("[v0] Property added, tx:", txHash)
        await loadProperties()
        return txHash
      } catch (error: any) {
        setError(error.message || "Failed to add property")
        console.error("[v0] Error adding property:", error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [loadProperties, ensureContractInitialized, isNotary]
  )

  const buyProperty = useCallback(
    async (propertyId: number) => {
      try {
        setIsLoading(true)
        setError("")
        await ensureContractInitialized()
        const txHash = await realEstateContract.buyProperty(propertyId)
        console.log("[v0] Property purchased, tx:", txHash)
        await loadProperties()
        return txHash
      } catch (error: any) {
        setError(error.message || "Failed to buy property")
        console.error("[v0] Error buying property:", error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [loadProperties, ensureContractInitialized]
  )

  const setPropertyForSale = useCallback(
    async (propertyId: number, price: string) => {
      try {
        setIsLoading(true)
        setError("")
        await ensureContractInitialized()
        const txHash = await realEstateContract.setPropertyForSale(propertyId, price)
        console.log("[v0] Property set for sale, tx:", txHash)
        await loadProperties()
        return txHash
      } catch (error: any) {
        setError(error.message || "Failed to set property for sale")
        console.error("[v0] Error setting property for sale:", error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [loadProperties, ensureContractInitialized]
  )

  return {
    properties,
    isLoading,
    error,
    isNotary,
    loadProperties,
    addProperty,
    buyProperty,
    setPropertyForSale,
  }
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")

  const ensureContractInitialized = useCallback(async () => {
    if (!realEstateContract.contract) {
      console.log("[v0] Contract not initialized for transactions, initializing now...")
      await realEstateContract.initialize()
    }
  }, [])

  const loadTransactions = useCallback(async () => {
    try {
      setIsLoading(true)
      setError("")
      await ensureContractInitialized()
      const history = await realEstateContract.getTransactionHistory()
      setTransactions(history)
      console.log("[v0] Loaded transactions:", history.length)
    } catch (error: any) {
      setError(error.message || "Failed to load transactions")
      console.error("[v0] Error loading transactions:", error)
    } finally {
      setIsLoading(false)
    }
  }, [ensureContractInitialized])

  const loadPropertyTransactions = useCallback(
    async (propertyId: number) => {
      try {
        setIsLoading(true)
        setError("")
        await ensureContractInitialized()
        const history = await realEstateContract.getTransactionHistory(propertyId)
        setTransactions(history)
        console.log("[v0] Loaded property transactions:", history.length)
      } catch (error: any) {
        setError(error.message || "Failed to load property transactions")
        console.error("[v0] Error loading property transactions:", error)
      } finally {
        setIsLoading(false)
      }
    },
    [ensureContractInitialized]
  )

  return {
    transactions,
    isLoading,
    error,
    loadTransactions,
    loadPropertyTransactions,
  }
}
