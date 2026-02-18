export default function Home() {
  return (
    <div className="flex min-h-screen bg-zinc-100 text-zinc-900 dark:bg-black dark:text-zinc-50">
      {/* Sidebar – conversation list */}
      <aside className="hidden w-72 border-r border-zinc-200 bg-white/70 p-4 dark:border-zinc-800 dark:bg-zinc-950/60 md:flex md:flex-col">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Conversations
          </span>
          <button className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-50 shadow-sm hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200">
            New chat
          </button>
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto text-sm">
          <button className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-left text-zinc-900 shadow-sm hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800">
            Brainstorm project ideas
          </button>
          <button className="w-full rounded-lg border border-transparent px-3 py-2 text-left text-zinc-600 hover:border-zinc-200 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:border-zinc-800 dark:hover:bg-zinc-900">
            Explain React server components
          </button>
          <button className="w-full rounded-lg border border-transparent px-3 py-2 text-left text-zinc-600 hover:border-zinc-200 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:border-zinc-800 dark:hover:bg-zinc-900">
            Debug my API request
          </button>
        </div>
      </aside>

      {/* Main chat area */}
      <main className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-zinc-200 bg-white/70 px-4 py-3 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/60">
          <div>
            <h1 className="text-base font-semibold tracking-tight">AI Chat Application</h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Static chat UI prototype (Assignment A2)
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
              Model: openrouter / local
            </span>
          </div>
        </header>

        {/* Message list */}
        <section className="flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-zinc-100/80 to-zinc-100 px-4 py-6 dark:from-black dark:to-zinc-950 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-2xl flex-col gap-4">
            {/* User message */}
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl border border-zinc-200 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 shadow-sm dark:border-zinc-700">
                Write a short intro section for my web dev project report.
              </div>
            </div>

            {/* AI message */}
            <div className="flex items-start gap-2">
              <div className="mt-1 h-6 w-6 rounded-full bg-gradient-to-br from-sky-500 to-emerald-400" />
              <div className="max-w-[80%] rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm leading-relaxed shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                Here&apos;s a possible introduction:
                <br />
                <br />
                <span className="font-medium">
                  “This project explores the design and implementation of an AI-powered chat
                  application built with modern web technologies.”
                </span>{" "}
                It demonstrates how to combine React, Next.js, and a streaming AI API to create a
                responsive, conversational user experience on the web.
              </div>
            </div>

            {/* Typing placeholder */}
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-zinc-400" />
              AI is thinking…
            </div>
          </div>
        </section>

        {/* Input area */}
        <footer className="border-t border-zinc-200 bg-white/70 px-4 py-3 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/60 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-2xl flex-col gap-2">
            <div className="flex items-end gap-2">
              <textarea
                className="min-h-[52px] flex-1 resize-none rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm shadow-sm outline-none ring-0 placeholder:text-zinc-400 hover:bg-white focus:border-zinc-400 focus:bg-white focus:ring-2 focus:ring-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:hover:bg-zinc-900 dark:focus:border-zinc-600 dark:focus:ring-zinc-700"
                placeholder="Send a message to your AI…"
                disabled
              />
              <button
                type="button"
                disabled
                className="inline-flex h-10 items-center justify-center rounded-full bg-zinc-900 px-4 text-xs font-medium text-zinc-50 shadow-sm opacity-60 hover:bg-zinc-800 disabled:cursor-not-allowed dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Send
              </button>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-500">
              This is a static prototype. In later assignments you&apos;ll connect it to OpenRouter
              or a local model via API routes.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
