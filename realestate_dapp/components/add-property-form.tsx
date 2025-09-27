"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { useProperties } from "@/hooks/use-contract"

export function AddPropertyForm() {
  const { addProperty, isLoading, isNotary } = useProperties()
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    location: "",
    price: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Submitting form with data:", formData)

    try {
      const txHash = await addProperty(formData.location, formData.price)
      console.log("[v0] Transaction hash:", txHash)

      setFormData({ location: "", price: "" })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error("[v0] Failed to add property:", error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  if (isNotary === false) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              Access Restricted
            </CardTitle>
            <CardDescription>Only the notary can add new properties to the blockchain</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Connect with the notary wallet to add properties to the system.
            </p>
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Debug Info:</strong> Check the browser console for wallet and notary address details.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Make sure you're connected with the correct notary wallet and the contract address is correct.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Property
          </CardTitle>
          <CardDescription>Register a new property on the blockchain (Notary Only)</CardDescription>
        </CardHeader>
        <CardContent>
          {success && (
            <div className="mb-6 p-4 bg-chart-1/10 border border-chart-1/20 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-chart-1" />
              <span className="text-chart-1 font-medium">Property added successfully!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="location">Property Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="123 Main St, Downtown, City"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (ETH)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.5"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || isNotary === null}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Adding to Blockchain...
                </>
              ) : (
                "Add Property to Blockchain"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
