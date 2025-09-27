"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, Home, Plus, History, TrendingUp, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { WalletConnection } from "@/components/wallet-connection"
import { PropertyList } from "@/components/property-list"
import { AddPropertyForm } from "@/components/add-property-form"
import { TransactionHistory } from "@/components/transaction-history"
import { useContract, useProperties, useTransactions } from "@/hooks/use-contract"

export default function RealEstateDApp() {
  const [activeTab, setActiveTab] = useState("properties")
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState<string>("")

  const { initialize, isInitialized, isLoading: contractLoading, error: contractError } = useContract()
  const { properties, loadProperties } = useProperties()
  const { transactions, loadTransactions } = useTransactions()

  useEffect(() => {
    if (isConnected && account && !isInitialized && !contractLoading) {
      console.log("[v0] Wallet connected, initializing contract...")
      initialize()
    }
  }, [isConnected, account, isInitialized, contractLoading, initialize])

  useEffect(() => {
    if (isInitialized && isConnected) {
      console.log("[v0] Contract initialized, loading data...")
      loadProperties()
      loadTransactions()
    }
  }, [isInitialized, isConnected, loadProperties, loadTransactions])

  const totalProperties = properties.length
  const propertiesForSale = properties.filter((p) => p.forSale).length
  const totalValue = properties.reduce((sum, p) => sum + Number.parseFloat(p.price), 0).toFixed(2)
  const recentTransactions = transactions.length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <Home className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">RealEstate dApp</h1>
                <p className="text-sm text-muted-foreground">Blockchain Property Management</p>
              </div>
            </div>
            <WalletConnection
              isConnected={isConnected}
              account={account}
              onConnect={setIsConnected}
              onAccountChange={setAccount}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
              <Wallet className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              Connect your MetaMask wallet to start managing properties on the blockchain
            </p>
          </div>
        ) : (
          <>
            {contractError && (
              <Alert className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Contract Error: {contractError}
                  <Button variant="outline" size="sm" className="ml-2 bg-transparent" onClick={initialize}>
                    Retry
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {contractLoading && (
              <Alert className="mb-6">
                <AlertDescription>Initializing smart contract connection...</AlertDescription>
              </Alert>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
                  <Home className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-chart-1">{totalProperties}</div>
                  <p className="text-xs text-muted-foreground">On blockchain</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">For Sale</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-chart-2">{propertiesForSale}</div>
                  <p className="text-xs text-muted-foreground">Available now</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalValue} ETH</div>
                  <p className="text-xs text-muted-foreground">Portfolio value</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                  <History className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-chart-4">{recentTransactions}</div>
                  <p className="text-xs text-muted-foreground">Total transactions</p>
                </CardContent>
              </Card>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 mb-6">
              <Button
                variant={activeTab === "properties" ? "default" : "outline"}
                onClick={() => setActiveTab("properties")}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Properties
              </Button>
              <Button
                variant={activeTab === "add" ? "default" : "outline"}
                onClick={() => setActiveTab("add")}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Property
              </Button>
              <Button
                variant={activeTab === "history" ? "default" : "outline"}
                onClick={() => setActiveTab("history")}
                className="flex items-center gap-2"
              >
                <History className="w-4 h-4" />
                History
              </Button>
            </div>

            {/* Tab Content */}
            {activeTab === "properties" && <PropertyList account={account} />}
            {activeTab === "add" && <AddPropertyForm />}
            {activeTab === "history" && <TransactionHistory />}
          </>
        )}
      </main>
    </div>
  )
}
