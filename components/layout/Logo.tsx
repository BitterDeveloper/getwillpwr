export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`font-semibold tracking-tight text-fg ${className}`}>
      <span className="text-accent">●</span> Willpwr
    </span>
  )
}
