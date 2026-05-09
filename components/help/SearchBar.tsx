'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

interface PagefindResult {
  id: string
  url: string
  meta: { title?: string }
  excerpt: string
}

interface PagefindModule {
  search: (query: string) => Promise<{
    results: { data: () => Promise<PagefindResult> }[]
  }>
}

declare global {
  interface Window {
    __pagefindStatus?: 'loading' | 'ready' | 'unavailable'
  }
}

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<PagefindResult[] | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'unavailable'>('loading')
  const moduleRef = useRef<PagefindModule | null>(null)

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (status === 'loading') setStatus('unavailable')
    }, 5000)

    const load = async () => {
      try {
        const url = ['', 'pagefind', 'pagefind.js'].join('/')
        const mod = (await import(/* @vite-ignore */ /* webpackIgnore: true */ url)) as PagefindModule
        moduleRef.current = mod
        setStatus('ready')
      } catch {
        setStatus('unavailable')
      }
    }

    void load()
    return () => clearTimeout(timeout)
  }, [status])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!moduleRef.current || !query.trim()) return
    const search = await moduleRef.current.search(query)
    const data = await Promise.all(search.results.slice(0, 10).map((r) => r.data()))
    setResults(data)
  }

  return (
    <div>
      <form role="search" onSubmit={onSubmit} className="flex gap-2">
        <label htmlFor="help-search" className="sr-only">
          Search the help center
        </label>
        <input
          id="help-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles…"
          className="flex-1 rounded-md border border-border bg-bg-elevated px-4 py-2 text-fg placeholder:text-fg-muted"
        />
        <button
          type="submit"
          disabled={status !== 'ready'}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50"
        >
          Search
        </button>
      </form>

      {status === 'unavailable' && (
        <p className="mt-3 text-sm text-fg-muted">
          Search unavailable — browse categories below.
        </p>
      )}

      {results && results.length === 0 && (
        <p className="mt-3 text-sm text-fg-muted">
          No results found for "{query}".{' '}
          <Link href="/contact" className="text-accent hover:text-accent-hover">
            Contact support
          </Link>
          .
        </p>
      )}

      {results && results.length > 0 && (
        <ul className="mt-4 space-y-2">
          {results.map((r) => (
            <li
              key={r.id}
              className="rounded-md border border-border bg-bg-elevated p-3"
            >
              <a
                href={r.url}
                className="block text-sm font-medium text-fg hover:text-accent"
              >
                {r.meta.title ?? r.url}
              </a>
              <p
                className="mt-1 text-xs text-fg-muted"
                dangerouslySetInnerHTML={{ __html: r.excerpt }}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
