const stats = [
  { value: '12,000+', label: 'users' },
  { value: '3,400+', label: 'tasks logged daily' },
  { value: '95%', label: 'satisfaction' },
  { value: '4.9/5', label: 'rating' },
]

const testimonials = [
  {
    quote:
      "I used to bounce between Notion, Todoist, and Gmail all day. Willpwr put it in one place — and the AI actually knows the context.",
    author: 'Sarah K.',
    role: 'Product manager',
  },
  {
    quote:
      "The 90-day planning + focus sessions combo is what finally got me to ship the side project I'd been putting off for two years.",
    author: '@devmarcus',
    role: 'Indie developer',
  },
]

export function Testimonials() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((s) => (
            <li key={s.label} className="text-center">
              <div className="text-2xl font-semibold text-fg sm:text-3xl">
                {s.value}
              </div>
              <div className="mt-1 text-xs uppercase tracking-wider text-fg-muted">
                {s.label}
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {testimonials.map((t) => (
            <figure
              key={t.author}
              className="rounded-lg border border-border bg-bg-elevated p-6"
            >
              <blockquote className="text-fg">"{t.quote}"</blockquote>
              <figcaption className="mt-4 text-sm text-fg-muted">
                — {t.author}, {t.role}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
