import Image from 'next/image'

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-semibold tracking-tight text-fg ${className}`}>
      <Image src="/icons/icon-192.png" alt="" width={28} height={28} />
      Willpwr
    </span>
  )
}
