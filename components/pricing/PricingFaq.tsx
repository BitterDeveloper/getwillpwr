import { pricingFaq } from '@/content/pricing'
import { SALES_EMAIL } from '@/lib/site'

export function PricingFaq() {
  return (
    <section className="mt-24">
      <h2 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
        Frequently asked questions
      </h2>
      <div className="mt-8 space-y-4">
        {pricingFaq.map((entry) => (
          <details
            key={entry.question}
            className="rounded-lg border border-border bg-bg-elevated p-5 open:bg-bg"
          >
            <summary className="cursor-pointer text-base font-medium text-fg">
              {entry.question}
            </summary>
            <p className="mt-3 text-sm text-fg-muted">{entry.answer}</p>
          </details>
        ))}
      </div>
      <p className="mt-10 text-sm text-fg-muted">
        Sales inquiries?{' '}
        <a
          href={`mailto:${SALES_EMAIL}`}
          className="font-medium text-accent-fg underline underline-offset-2 hover:text-accent-hover"
        >
          {SALES_EMAIL}
        </a>
      </p>
    </section>
  )
}
