'use client'

import { useParams } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { useReadContract, useAccount } from 'wagmi'
import { pownsRegistryABI } from '@/lib/abis'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { ArrowLeft, Cpu, Hash, User } from "lucide-react"

// Use environment variable in production
const REGISTRY_ADDRESS = (process.env.NEXT_PUBLIC_REGISTRY_ADDRESS || "0xc0ffee254729296a45a3885639AC7E10F9d54979") as `0x${string}`

export default function DomainPage() {
    const params = useParams()
    const name = params.name as string
    const { isConnected, address } = useAccount()

    const { data: available, isLoading: loadingAvail } = useReadContract({
        address: REGISTRY_ADDRESS,
        abi: pownsRegistryABI,
        functionName: 'isAvailable',
        args: [name]
    })

    const { data: target } = useReadContract({
        address: REGISTRY_ADDRESS,
        abi: pownsRegistryABI,
        functionName: 'computeTarget',
        args: [name]
    })

    const { data: owner } = useReadContract({
        address: REGISTRY_ADDRESS,
        abi: pownsRegistryABI,
        functionName: 'ownerOf',
        args: [name],
        query: { enabled: available === false }
    })

    const difficulty = target ? BigInt(target).toString(16).padStart(64, '0').slice(0, 12) + '...' : 'Loading...'

    return (
        <main className="min-h-screen bg-background flex flex-col">
            <Navbar />
            
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to search
                </Link>

                <div className="grid gap-8 md:grid-cols-2">
                    {/* Visual Card */}
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-neutral-900 to-black border border-border flex items-center justify-center p-8 relative overflow-hidden group">
                        {/* Simple grid pattern */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                        <div className="text-center z-10">
                            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 break-all leading-tight">
                                {name}
                            </h1>
                            <p className="mt-2 text-xl md:text-2xl text-muted-foreground font-medium">.pow</p>
                        </div>
                        
                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>

                    {/* Details */}
                    <div className="space-y-6">
                        <div>
                           <h2 className="text-3xl font-bold mb-2 break-all">{name}.pow</h2>
                           <div className="flex items-center gap-2">
                               <StatusBadge available={!!available} loading={loadingAvail} />
                           </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-border">
                             <DetailRow icon={<Hash className="w-4 h-4"/>} label="Target Difficulty" value={`0x${difficulty}`} mono />
                             <DetailRow icon={<Cpu className="w-4 h-4"/>} label="Difficulty Class" value={name.length < 4 ? "Extreme (Years)" : name.length < 6 ? "Hard (Days)" : "Medium (Hours)"} />
                             {!available && owner && (
                                 <DetailRow icon={<User className="w-4 h-4"/>} label="Owner" value={String(owner)} mono />
                             )}
                        </div>

                        <div className="pt-6">
                            {available ? (
                                <div className="space-y-4">
                                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                                        <h4 className="font-semibold mb-1 text-primary">Ready to mine?</h4>
                                        <p className="text-sm text-muted-foreground">
                                            This domain is available. You need to run the PoWNS CPU Miner to find a valid nonce.
                                        </p>
                                    </div>
                                    
                                    <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                                        <code className="text-xs font-mono whitespace-pre text-muted-foreground">
                                            {`# Run this command:\n` +
                                             `powns-miner mine --name "${name}" --owner ${isConnected && address ? address : '<your-address>'} --rpc <url>`}
                                        </code>
                                    </div>

                                    <Button className="w-full" asChild>
                                        <Link href="https://github.com/powns-labs/powns-miner" target="_blank">
                                            Download Miner
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="p-4 bg-muted rounded-lg">
                                    <p className="text-sm text-muted-foreground">
                                        This domain is already registered.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

function StatusBadge({ available, loading }: { available: boolean, loading: boolean }) {
    if (loading) return <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded text-xs">Loading...</span>
    if (available) return <span className="bg-green-500/15 text-green-500 px-2 py-0.5 rounded text-xs font-bold ring-1 ring-green-500/20">AVAILABLE</span>
    return <span className="bg-red-500/15 text-red-500 px-2 py-0.5 rounded text-xs font-bold ring-1 ring-red-500/20">REGISTERED</span>
}

function DetailRow({ icon, label, value, mono }: { icon: any, label: string, value: string, mono?: boolean }) {
    return (
        <div className="flex items-center justify-between py-2">
            <div className="flex items-center text-muted-foreground text-sm gap-2">
                {icon}
                <span>{label}</span>
            </div>
            <div className={`text-sm ${mono ? 'font-mono text-xs break-all' : 'font-medium'}`}>
                {value}
            </div>
        </div>
    )
}
