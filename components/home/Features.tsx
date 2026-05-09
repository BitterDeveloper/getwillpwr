interface Feature {
  title: string
  description: string
  icon: string
}

const features: Feature[] = [
  {
    title: 'Task management',
    description:
      'Capture, prioritize, and complete work in one place. Sync with your calendar so the day plans itself.',
    icon: '✓',
  },
  {
    title: 'AI assistant',
    description:
      'Ask the assistant to plan your week, break down a goal, or draft an email. It knows your full context.',
    icon: '✦',
  },
  {
    title: 'Weekly planning',
    description:
      '90-day goals turn into weekly priorities and time-blocked sessions automatically.',
    icon: '◷',
  },
  {
    title: 'Focus sessions',
    description:
      'Block distractions, pin a task, and track deep work time. Notifications stay quiet.',
    icon: '◉',
  },
]

export function Features() {
  return (
    <section className="border-b border-border bg-bg-elevated">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
          One place for the work that matters.
        </h2>
        <p className="mt-3 max-w-2xl text-fg-muted">
          Stop stitching together five productivity apps. Willpwr brings your tasks,
          email, calendar, planning, and focus together.
        </p>
        <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <li
              key={f.title}
              className="rounded-lg border border-border bg-bg p-6"
            >
              <div
                aria-hidden
                className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-accent/10 text-accent"
              >
                {f.icon}
              </div>
              <h3 className="text-lg font-medium text-fg">{f.title}</h3>
              <p className="mt-2 text-sm text-fg-muted">{f.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
