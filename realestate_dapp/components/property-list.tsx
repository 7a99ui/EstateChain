"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MapPin, DollarSign, Loader2, Home } from "lucide-react"
import { useProperties } from "@/hooks/use-contract"
import type { Property } from "@/lib/contract"

interface PropertyListProps {
  account: string
}

export function PropertyList({ account }: PropertyListProps) {
  const { properties, isLoading, error, loadProperties, buyProperty, setPropertyForSale } = useProperties()
  const [buyingProperty, setBuyingProperty] = useState<number | null>(null)
  const [settingForSale, setSettingForSale] = useState<number | null>(null)
  const [salePrice, setSalePrice] = useState("")

  useEffect(() => {
    loadProperties()
  }, [loadProperties])

  const handleBuyProperty = async (property: Property) => {
    try {
      setBuyingProperty(property.id)
      await buyProperty(property.id)
      console.log("[v0] Property purchased successfully")
    } catch (error) {
      console.error("[v0] Error buying property:", error)
    } finally {
      setBuyingProperty(null)
    }
  }

  const handleSetForSale = async (propertyId: number) => {
    if (!salePrice) return

    try {
      setSettingForSale(propertyId)
      await setPropertyForSale(propertyId, salePrice)
      setSalePrice("")
      console.log("[v0] Property set for sale successfully")
    } catch (error) {
      console.error("[v0] Error setting property for sale:", error)
    } finally {
      setSettingForSale(null)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const isOwner = (property: Property) => {
    return property.owner.toLowerCase() === account.toLowerCase()
  }

  const formatPrice = (price: string) => {
    try {
      return (BigInt(price) / 1000000000000000000n).toString()
    } catch {
      return "0"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading properties...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={loadProperties} variant="outline">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Property Portfolio</h2>
        <Badge variant="secondary">{properties.length} Properties</Badge>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-12">
          <Home className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Properties Found</h3>
          <p className="text-muted-foreground">Add your first property to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden">
              <div className="h-48 bg-muted flex items-center justify-center">
                <div className="text-muted-foreground">Property #{property.id}</div>
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">Property #{property.id}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {property.location}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge variant={property.forSale ? "default" : "secondary"}>
                      {property.forSale ? "For Sale" : "Owned"}
                    </Badge>
                    {isOwner(property) && (
                      <Badge variant="outline" className="text-xs">
                        Your Property
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-chart-1" />
                    <span className="font-bold text-chart-1">{formatPrice(property.price)} ETH</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Owner: {formatAddress(property.owner)}</div>
                </div>

                <div className="flex gap-2">
                  {property.forSale && !isOwner(property) ? (
                    <Button
                      className="flex-1"
                      onClick={() => handleBuyProperty(property)}
                      disabled={buyingProperty === property.id}
                    >
                      {buyingProperty === property.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Buying...
                        </>
                      ) : (
                        "Buy Property"
                      )}
                    </Button>
                  ) : isOwner(property) && !property.forSale ? (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="flex-1 bg-transparent">
                          Set for Sale
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Set Property for Sale</DialogTitle>
                          <DialogDescription>Set the sale price for Property #{property.id}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="salePrice">Sale Price (ETH)</Label>
                            <Input
                              id="salePrice"
                              type="number"
                              step="0.01"
                              value={salePrice}
                              onChange={(e) => setSalePrice(e.target.value)}
                              placeholder="0.5"
                            />
                          </div>
                          <Button
                            onClick={() => handleSetForSale(property.id)}
                            disabled={!salePrice || settingForSale === property.id}
                            className="w-full"
                          >
                            {settingForSale === property.id ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                Setting for Sale...
                              </>
                            ) : (
                              "Set for Sale"
                            )}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <Button variant="outline" className="flex-1 bg-transparent" disabled>
                      {isOwner(property) ? "Listed for Sale" : "Not Available"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
