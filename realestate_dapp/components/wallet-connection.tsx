"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface WalletConnectionProps {
  isConnected: boolean
  account: string
  onConnect: (connected: boolean) => void
  onAccountChange: (account: string) => void
}

declare global {
  interface Window {
    ethereum?: any
  }
}

export function WalletConnection({ isConnected, account, onConnect, onAccountChange }: WalletConnectionProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    checkConnection()

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", () => window.location.reload())
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
      }
    }
  }, [])

  const checkConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length > 0) {
          onConnect(true)
          onAccountChange(accounts[0])
        }
      } catch (error) {
        console.error("Error checking connection:", error)
      }
    }
  }

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      onConnect(false)
      onAccountChange("")
    } else {
      onAccountChange(accounts[0])
    }
  }

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError("MetaMask is not installed. Please install MetaMask to continue.")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (accounts.length > 0) {
        onConnect(true)
        onAccountChange(accounts[0])
      }
    } catch (error: any) {
      setError(error.message || "Failed to connect wallet")
    } finally {
      setIsLoading(false)
    }
  }

  const disconnectWallet = () => {
    onConnect(false)
    onAccountChange("")
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (error) {
    return (
      <Alert className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="flex items-center gap-3">
      {isConnected ? (
        <>
          <Badge variant="secondary" className="bg-chart-1/10 text-chart-1 border-chart-1/20">
            Connected
          </Badge>
          <div className="text-sm text-muted-foreground">{formatAddress(account)}</div>
          <Button variant="outline" size="sm" onClick={disconnectWallet}>
            Disconnect
          </Button>
        </>
      ) : (
        <Button onClick={connectWallet} disabled={isLoading} className="flex items-center gap-2">
          <Wallet className="w-4 h-4" />
          {isLoading ? "Connecting..." : "Connect Wallet"}
        </Button>
      )}
    </div>
  )
}
