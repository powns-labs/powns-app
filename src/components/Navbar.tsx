'use client'
import Link from 'next/link'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { Button } from './ui/button'

export function Navbar() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2 font-bold text-xl">
            PoWNS
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/dashboard" className="transition-colors hover:text-foreground/80">
              Dashboard
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {isConnected ? (
              <div className="flex items-center gap-4">
                  <span className="hidden sm:inline-block text-sm text-muted-foreground font-mono">
                    {address?.slice(0,6)}...{address?.slice(-4)}
                  </span>
                  <Button variant="outline" onClick={() => disconnect()}>Disconnect</Button>
              </div>
          ) : (
              <Button onClick={() => connect({ connector: injected() })}>Connect Wallet</Button>
          )}
        </div>
      </div>
    </nav>
  )
}
