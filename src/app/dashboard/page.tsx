'use client'

import { Navbar } from "@/components/Navbar"
import { useAccount, useReadContract, useReadContracts } from 'wagmi'
import { pownsRegistryABI } from 'powns-sdk'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { Loader2, Plus, ExternalLink } from "lucide-react"

const REGISTRY_ADDRESS = (process.env.NEXT_PUBLIC_REGISTRY_ADDRESS || "0xc0ffee254729296a45a3885639AC7E10F9d54979") as `0x${string}`

// Extend ABI for dashboard needs
const extendedABI = [
  ...pownsRegistryABI,
  {
    inputs: [{name: "owner", type: "address"}],
    name: "balanceOf",
    outputs: [{name: "", type: "uint256"}],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{name: "owner", type: "address"}, {name: "index", type: "uint256"}],
    name: "tokenOfOwnerByIndex",
    outputs: [{name: "", type: "uint256"}],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{name: "", type: "uint256"}],
    name: "nameHashes",
    outputs: [{name: "", type: "bytes32"}],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{name: "", type: "bytes32"}],
    name: "names",
    outputs: [{name: "", type: "string"}],
    stateMutability: "view",
    type: "function"
  }
] as const

export default function Dashboard() {
    const { address, isConnected } = useAccount()

    const { data: balance, isLoading: loadingBalance } = useReadContract({
        address: REGISTRY_ADDRESS,
        abi: extendedABI,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        query: { enabled: !!address }
    })

    const count = balance ? Number(balance) : 0

    // 1. Get Token IDs
    const { data: tokenIds } = useReadContracts({
        contracts: Array.from({ length: count }).map((_, i) => ({
            address: REGISTRY_ADDRESS,
            abi: extendedABI,
            functionName: 'tokenOfOwnerByIndex',
            args: [address!, BigInt(i)]
        })),
        query: { enabled: count > 0 }
    })

    // 2. Get Name Hashes from Token IDs
    const { data: nameHashes } = useReadContracts({
        contracts: tokenIds?.map(t => ({
            address: REGISTRY_ADDRESS,
            abi: extendedABI,
            functionName: 'nameHashes',
            args: [t.result as bigint]
        })) || [],
        query: { enabled: !!tokenIds }
    })

    // 3. Get Names from Hashes
    const { data: names } = useReadContracts({
        contracts: nameHashes?.map(h => ({
            address: REGISTRY_ADDRESS,
            abi: extendedABI,
            functionName: 'names',
            args: [h.result as `0x${string}`]
        })) || [],
        query: { enabled: !!nameHashes }
    })

    const domains = names?.map((n) => n.result as string).filter(Boolean) || []

    return (
        <main className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <div className="container mx-auto px-4 py-12">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold">My Domains</h1>
                    <Button asChild>
                        <Link href="/"><Plus className="w-4 h-4 mr-2"/> Register New</Link>
                    </Button>
                </div>

                {!isConnected ? (
                    <div className="text-center py-20 border border-dashed rounded-lg">
                        <p className="text-muted-foreground mb-4">Connect your wallet to view your domains.</p>
                    </div>
                ) : loadingBalance ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    </div>
                ) : count === 0 ? (
                    <div className="text-center py-20 border border-dashed rounded-lg bg-muted/20">
                        <h3 className="font-semibold text-lg">No domains yet</h3>
                        <p className="text-muted-foreground mb-6">Start mining your first PoWNS domain today.</p>
                        <Button variant="outline" asChild>
                            <Link href="/">Search Domains</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {domains.map((domain, i) => (
                            <div key={i} className="group relative border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors bg-card">
                                <div className="aspect-[2/1] bg-gradient-to-br from-neutral-900 to-black flex items-center justify-center p-6 relative">
                                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                                    <h3 className="text-2xl font-bold text-white z-10">{domain}.pow</h3>
                                </div>
                                <div className="p-4 flex items-center justify-between">
                                    <span className="text-sm font-mono text-muted-foreground">Token ID: {tokenIds?.[i]?.result?.toString()}</span>
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link href={`/domain/${domain}`}>
                                            <ExternalLink className="w-4 h-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}
