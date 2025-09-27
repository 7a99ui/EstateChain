"use client"

import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { History, ArrowDownLeft, Plus, Loader2, ExternalLink, TrendingUp } from "lucide-react"
import { useTransactions } from "@/hooks/use-contract"

export function TransactionHistory() {
  const { transactions, isLoading, error, loadTransactions } = useTransactions()

  useEffect(() => {
    loadTransactions()
  }, [loadTransactions])

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "purchase":
        return <ArrowDownLeft className="w-4 h-4 text-chart-1" />
      case "listing":
        return <TrendingUp className="w-4 h-4 text-chart-2" />
      case "creation":
        return <Plus className="w-4 h-4 text-chart-4" />
      default:
        return <History className="w-4 h-4" />
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "purchase":
        return "text-chart-1"
      case "listing":
        return "text-chart-2"
      case "creation":
        return "text-chart-4"
      default:
        return "text-foreground"
    }
  }

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case "purchase":
        return "Property Purchase"
      case "listing":
        return "Listed for Sale"
      case "creation":
        return "Property Created"
      default:
        return "Transaction"
    }
  }

  const formatAddress = (address: string) => {
    if (address === "Notary" || address === "Contract") return address
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatTxHash = (hash: string) => {
    if (!hash) return "N/A"
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  const openEtherscan = (txHash: string) => {
    if (!txHash) return
    // For Ganache/local development, you might want to adjust this URL
    console.log("[v0] Opening transaction:", txHash)
    window.open(`https://etherscan.io/tx/${txHash}`, "_blank")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading transaction history...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={loadTransactions} variant="outline">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Transaction History</h2>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{transactions.length} Transactions</Badge>
          <Button onClick={loadTransactions} variant="outline" size="sm">
            <History className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Transactions Found</h3>
          <p className="text-muted-foreground">Transaction history will appear here as you interact with properties</p>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction, index) => (
            <Card key={transaction.txHash || `tx-${index}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-muted rounded-full">
                      {getTransactionIcon(transaction.type || "creation")}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Property #{transaction.propertyId}</h3>
                      <p className="text-sm text-muted-foreground">
                        {getTransactionLabel(transaction.type || "creation")} • {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${getTransactionColor(transaction.type || "creation")}`}>
                      {transaction.price} ETH
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      completed
                    </Badge>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Buyer: </span>
                      <span className="text-foreground">{formatAddress(transaction.buyer)}</span>
                    </div>
                    {transaction.txHash && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Tx Hash: </span>
                        <span className="text-foreground">{formatTxHash(transaction.txHash)}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => openEtherscan(transaction.txHash!)}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {transaction.type === "purchase" && (
                  <div className="mt-3 p-3 bg-chart-1/10 border border-chart-1/20 rounded-lg">
                    <p className="text-sm text-chart-1">Property #{transaction.propertyId} successfully purchased</p>
                  </div>
                )}

                {transaction.type === "creation" && (
                  <div className="mt-3 p-3 bg-chart-4/10 border border-chart-4/20 rounded-lg">
                    <p className="text-sm text-chart-4">New property #{transaction.propertyId} added to blockchain</p>
                  </div>
                )}

                {transaction.type === "listing" && (
                  <div className="mt-3 p-3 bg-chart-2/10 border border-chart-2/20 rounded-lg">
                    <p className="text-sm text-chart-2">Property #{transaction.propertyId} listed for sale</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
