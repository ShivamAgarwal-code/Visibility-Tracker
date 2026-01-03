"use client"

import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { Button } from '@/components/ui/button'
 
export default function NotFound() {
  return (
    <div>
      <Navbar />
      <div className="flex flex-1 w-fullflex flex-col items-center justify-center min-h-screen">
        <h2 className="text-4xl font-bold mb-4">Not Found</h2>
        <p className="mb-6 text-lg">Could not find requested resource</p>
        <Link href="/" className="px-6 py-2 border border-white rounded hover:bg-white hover:text-black transition-colors"><Button > Return Home</Button></Link>
      </div>
    </div>
  )
}