import { ethers } from "ethers"

export const REAL_ESTATE_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_notary",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "location",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
    ],
    name: "PropertyAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
    ],
    name: "PropertyForSale",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
    ],
    name: "PropertySold",
    type: "event",
  },
  {
    inputs: [],
    name: "contractOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "notary",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "properties",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "location",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "bool",
        name: "forSale",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "propertyCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_location",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
    ],
    name: "addProperty",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
    ],
    name: "setForSale",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
    ],
    name: "buyProperty",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
    ],
    name: "getProperty",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
    ],
    name: "getTransactionHistory",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "buyer",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "date",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "price",
            type: "uint256",
          },
        ],
        internalType: "struct RealEstate.Transaction[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPropertyCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "test",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
]

// IMPORTANT: Replace this with your actual deployed contract address from Ganache/Truffle
export const CONTRACT_ADDRESS = "0x2aEBF1036c6865a11858F444Ef1570D4EeCDf816"

export interface Property {
  id: number
  location: string
  price: string
  owner: string
  forSale: boolean
}

export interface Transaction {
  buyer: string
  date: number
  price: string
  propertyId?: number
  txHash?: string
  type?: "purchase" | "creation" | "listing"
}

export class RealEstateContract {
  private contract: ethers.Contract | null = null
  private provider: ethers.BrowserProvider | null = null
  private signer: ethers.Signer | null = null

  async initialize() {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed")
    }

    this.provider = new ethers.BrowserProvider(window.ethereum)
    this.signer = await this.provider.getSigner()
    this.contract = new ethers.Contract(CONTRACT_ADDRESS, REAL_ESTATE_ABI, this.signer)

    const currentAddress = await this.signer.getAddress()
    console.log("[v0] Contract initialized:")
    console.log("[v0] - Contract Address:", CONTRACT_ADDRESS)
    console.log("[v0] - Connected Wallet:", currentAddress)

    // Test contract connection
    try {
      const testResult = await this.contract.test()
      console.log("[v0] - Contract test result:", testResult)
    } catch (error) {
      console.error("[v0] - Contract test failed:", error)
    }
  }

  async getPropertiesCount(): Promise<number> {
    if (!this.contract) throw new Error("Contract not initialized")
    try {
      const count = await this.contract.getPropertyCount()
      return Number(count)
    } catch (error) {
      console.error("[v0] Error getting properties count:", error)
      return 0
    }
  }

  async getProperty(propertyId: number): Promise<Property | null> {
    if (!this.contract) throw new Error("Contract not initialized")
    try {
      const result = await this.contract.getProperty(propertyId)
      // Contract returns: (uint256, string, uint256, address, bool)
      /*return {
        id: Number(result[0]),
        location: result[1],
        price: ethers.formatEther(result[2]),
        owner: result[3],
        forSale: result[4],
      }*/
      


        return {
         id: Number(result[0]),
         location: result[1],
          price: (Number(result[2]) * 1e18).toString(), // 1 wei → 1 affiché
          owner: result[3],
         forSale: result[4],
        }

    } catch (error) {
      console.error("[v0] Error getting property:", error)
      return null
    }
  }

  async getAllProperties(): Promise<Property[]> {
    if (!this.contract) throw new Error("Contract not initialized")
    try {
      const count = await this.getPropertiesCount()
      const properties: Property[] = []
      for (let i = 1; i <= count; i++) {
        const property = await this.getProperty(i)
        if (property) {
          properties.push(property)
        }
      }
      return properties
    } catch (error) {
      console.error("[v0] Error getting all properties:", error)
      return []
    }
  }

  async getPropertiesByOwner(ownerAddress: string): Promise<Property[]> {
    const allProperties = await this.getAllProperties()
    return allProperties.filter((property) => property.owner.toLowerCase() === ownerAddress.toLowerCase())
  }

  async getPropertiesForSale(): Promise<Property[]> {
    const allProperties = await this.getAllProperties()
    return allProperties.filter((property) => property.forSale)
  }

  async addProperty(location: string, price: string): Promise<string> {
    if (!this.contract) throw new Error("Contract not initialized")
    try {
      const priceInWei = ethers.parseEther(price)
      const tx = await this.contract.addProperty(location, priceInWei)
      console.log("[v0] Property addition transaction sent:", tx.hash)
      await tx.wait()
      console.log("[v0] Property added successfully")
      return tx.hash
    } catch (error: any) {
      console.error("[v0] Error adding property:", error)
      throw new Error(error.message || "Failed to add property")
    }
  }

  async buyProperty(propertyId: number): Promise<string> {
    if (!this.contract) throw new Error("Contract not initialized")
    try {
      const prop = await this.contract.getProperty(propertyId)
      const forSale = prop[4]
      if (!forSale) throw new Error("Cette propriété n'est pas à vendre !")
      const priceInWei = ethers.parseEther(prop[2].toString())
      const tx = await this.contract.buyProperty(propertyId, { value: priceInWei })
      console.log("[v0] Property purchase transaction sent:", tx.hash)
      await tx.wait()
      console.log("[v0] Property purchased successfully")
      return tx.hash
    } catch (error: any) {
      console.error("[v0] Error buying property:", error)
      throw new Error(error.reason || error.message || "Failed to buy property")
    }
  }

  async setPropertyForSale(propertyId: number, price: string): Promise<string> {
    if (!this.contract) throw new Error("Contract not initialized")
    try {

      const priceInWei = BigInt(price) // si l’utilisateur tape "1", ça correspond à 1 wei
      const tx = await this.contract.setForSale(propertyId, priceInWei)

      //const priceInWei = ethers.parseEther(price)
      //const tx = await this.contract.setForSale(propertyId, priceInWei)
      console.log("[v0] Set for sale transaction sent:", tx.hash)
      await tx.wait()
      console.log("[v0] Property set for sale successfully")
      return tx.hash
    } catch (error: any) {
      console.error("[v0] Error setting property for sale:", error)
      throw new Error(error.message || "Failed to set property for sale")
    }
  }




async getTransactionHistory(propertyId?: number): Promise<Transaction[]> {
  if (!this.contract || !this.provider) throw new Error("Contract not initialized")
  try {
    const transactions: Transaction[] = []

    if (propertyId !== undefined) {
      const history = await this.contract.getTransactionHistory(propertyId)
      for (let i = 0; i < history.length; i++) {
        const tx = history[i]
        transactions.push({
          buyer: tx.buyer,
          date: Number(tx.date) || 0,
          price: tx.price ? (Number(ethers.formatEther(tx.price)) * 1e18).toString() : "0",
          propertyId,
          type: i === 0 ? "creation" : "purchase",
        })
      }
    } else {
      const latestBlock = await this.provider.getBlockNumber()
      const fromBlock = Math.max(0, latestBlock - 1000)

      const addedFilter = this.contract.filters.PropertyAdded()
      const addedEvents = await this.contract.queryFilter(addedFilter, fromBlock, latestBlock)
      for (const event of addedEvents) {
        const args = event.args
        const block = await this.provider.getBlock(event.blockNumber)
        transactions.push({
          buyer: "Notary",
          date: block?.timestamp || 0,
          price: args?.price ? (Number(ethers.formatEther(args.price))).toString() : "0",
          propertyId: Number(args?.id || 0),
          txHash: event.transactionHash,
          type: "creation",
        })
      }

      const soldFilter = this.contract.filters.PropertySold()
      const soldEvents = await this.contract.queryFilter(soldFilter, fromBlock, latestBlock)
      for (const event of soldEvents) {
        const args = event.args
        const block = await this.provider.getBlock(event.blockNumber)
        transactions.push({
          buyer: args?.newOwner || "",
          date: block?.timestamp || 0,
          price: args?.price ? (Number(ethers.formatEther(args.price)) * 1e18).toString() : "0",
          propertyId: Number(args?.id || 0),
          txHash: event.transactionHash,
          type: "purchase",
        })
      }
    }

    return transactions.sort((a, b) => b.date - a.date)
  } catch (error) {
    console.error("[v0] Error getting transaction history:", error)
    return []
  }
}




  /*
  async getTransactionHistory(propertyId?: number): Promise<Transaction[]> {
    if (!this.contract || !this.provider) throw new Error("Contract not initialized")
    try {
      const transactions: Transaction[] = []

      if (propertyId !== undefined) {
        const history = await this.contract.getTransactionHistory(propertyId)
        for (let i = 0; i < history.length; i++) {
          const tx = history[i]
          transactions.push({
            buyer: tx.buyer,
            date: Number(tx.date) || 0,
            price: tx.price ? ethers.formatEther(tx.price) : "0",
            propertyId,
            type: i === 0 ? "creation" : "purchase",
          })
        }
      } else {
        const latestBlock = await this.provider.getBlockNumber()
        const fromBlock = Math.max(0, latestBlock - 1000)

        const addedFilter = this.contract.filters.PropertyAdded()
        const addedEvents = await this.contract.queryFilter(addedFilter, fromBlock, latestBlock)
        for (const event of addedEvents) {
          const args = event.args
          const block = await this.provider.getBlock(event.blockNumber)
          transactions.push({
            buyer: "Notary",
            date: block?.timestamp || 0,
            price: args?.price ? ethers.formatEther(args.price) : "0",
            propertyId: Number(args?.id || 0),
            txHash: event.transactionHash,
            type: "creation",
          })
        }

        const soldFilter = this.contract.filters.PropertySold()
        const soldEvents = await this.contract.queryFilter(soldFilter, fromBlock, latestBlock)
        for (const event of soldEvents) {
          const args = event.args
          const block = await this.provider.getBlock(event.blockNumber)
          transactions.push({
            buyer: args?.newOwner || "",
            date: block?.timestamp || 0,
            price: args?.price ? ethers.formatEther(args.price) : "0",
            propertyId: Number(args?.id || 0),
            txHash: event.transactionHash,
            type: "purchase",
          })
        }
      }

      return transactions.sort((a, b) => b.date - a.date)
    } catch (error) {
      console.error("[v0] Error getting transaction history:", error)
      return []
    }
  }*/

  async isNotary(): Promise<boolean> {
    if (!this.contract || !this.signer) return false
    try {
      const notaryAddress = await this.contract.notary()
      const currentAddress = await this.signer.getAddress()
      console.log("[v0] Notary check:")
      console.log("[v0] - Notary address from contract:", notaryAddress)
      console.log("[v0] - Current wallet address:", currentAddress)
      console.log("[v0] - Addresses match:", notaryAddress.toLowerCase() === currentAddress.toLowerCase())
      return notaryAddress.toLowerCase() === currentAddress.toLowerCase()
    } catch (error) {
      console.error("[v0] Error checking notary status:", error)
      return false
    }
  }

  async getNotaryAddress(): Promise<string> {
    if (!this.contract) throw new Error("Contract not initialized")
    try {
      const notaryAddress = await this.contract.notary()
      console.log("[v0] Retrieved notary address:", notaryAddress)
      return notaryAddress
    } catch (error) {
      console.error("[v0] Error getting notary address:", error)
      return ""
    }
  }
}

// Singleton instance
export const realEstateContract = new RealEstateContract()