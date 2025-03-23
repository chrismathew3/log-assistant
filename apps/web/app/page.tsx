import { Button } from "@workspace/ui/components/button"
import Link from 'next/link'

export default function Page() {

  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold typing-effect animate-typing animate-cursor">hello there 👋</h1>
        <h2 className="text-xl font-bold">welcome to your new logging assistant Hermes</h2>
        <Link href={'/log'}><Button size="lg" >let me in</Button></Link>
      </div>
    </div>
  )
}
