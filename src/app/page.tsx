'use client'

import { useState } from "react"
import { Navbar } from "@/components/Navbar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Home() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query) return
    const name = query.toLowerCase().replace(/\.pow$/, '').trim()
    if (name) {
      router.push(`/domain/${name}`)
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:px-24 sm:py-32">
        <div className="w-full max-w-3xl space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight lg:text-7xl bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
              Proof of Work <br/>
              Name Service
            </h1>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto">
              The first decentralized naming system secured by work. <br/>
              Mine your identity. Own it forever.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex gap-4 max-w-lg mx-auto mt-12 items-center">
            <div className="relative flex-1 group">
               <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="relative flex items-center">
                 <Input 
                   placeholder="Find your .pow name" 
                   className="h-14 pl-6 pr-16 text-lg rounded-full border-2 border-border/50 bg-background/80 backdrop-blur focus-visible:ring-0 focus-visible:border-primary transition-all"
                   value={query}
                   onChange={(e) => setQuery(e.target.value)}
                 />
                 <div className="absolute right-6 pointer-events-none text-muted-foreground font-medium">.pow</div>
               </div>
            </div>
            <Button className="h-14 w-14 rounded-full shrink-0 shadow-lg" type="submit">
               <Search className="h-6 w-6" />
            </Button>
          </form>

          <div className="pt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
             <Feature 
                title="Fair Distribution" 
                desc="No pre-mines. No reservations. Scarcity is defined by computational difficulty." 
                icon="⚡"
             />
             <Feature 
                title="Permissionless" 
                desc="Censorship-resistant. The registry implementation is immutable and ownerless." 
                icon="🛡️"
             />
             <Feature 
                title="On-Chain SVG" 
                desc="Your domain art is generated purely on-chain. No IPFS, no external servers." 
                icon="🎨"
             />
          </div>
        </div>
      </div>
    </main>
  )
}

function Feature({ title, desc, icon }: { title: string, desc: string, icon: string }) {
  return (
    <div className="p-6 border border-border/50 rounded-2xl bg-card/50 backdrop-blur hover:bg-card/80 transition-colors">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  )
}
