import { SignupCta } from '@/components/ui/SignupCta'

export function SecondaryCtaSection() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
        <h2 className="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
          Ready to do your best work?
        </h2>
        <p className="mt-3 text-fg-muted">
          Sign up free in under a minute. No credit card required.
        </p>
        <div className="mt-8 flex justify-center">
          <SignupCta label="Get started free" />
        </div>
      </div>
    </section>
  )
}
