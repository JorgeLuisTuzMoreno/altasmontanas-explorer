import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect, type FormEvent } from "react";
import { Mountain, Search, Sparkles, Loader2, MapPin } from "lucide-react";
import heroImage from "@/assets/hero-mountains.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Altas Montañas Explorer — Guía de Córdoba y Orizaba" },
      { name: "description", content: "Descubre lo mejor de Córdoba y Orizaba con una guía de viaje impulsada por IA." },
      { property: "og:title", content: "Altas Montañas Explorer" },
      { property: "og:description", content: "Descubre lo mejor de Córdoba y Orizaba con una guía de viaje impulsada por IA." },
    ],
  }),
  component: Index,
});

const API_URL = "https://jorgetuz-ras-api-backend.hf.space";

type Message = {
  id: number;
  role: "user" | "assistant";
  text: string;
};

const SUGGESTIONS = [
  "Mejores cafés en Córdoba",
  "Qué hacer en el Pico de Orizaba",
  "Ruta de un día por Orizaba",
  "Comida típica de la región",
];

function Index() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 0) {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [messages.length]);

  async function submit(value: string) {
    const q = value.trim();
    if (!q || loading) return;
    setError(null);
    const userMsg: Message = { id: Date.now(), role: "user", text: q };
    setMessages((m) => [...m, userMsg]);
    setPrompt("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: q }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const reply = data?.respuesta ?? "No se recibió respuesta.";
      setMessages((m) => [...m, { id: Date.now() + 1, role: "assistant", text: String(reply) }]);
    } catch (e) {
      setError("No pudimos conectar con el guía. Revisa la URL de la API e intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    submit(prompt);
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Mountain className="h-5 w-5" strokeWidth={2.25} />
            </div>
            <div className="leading-tight">
              <p className="text-[15px] font-semibold tracking-tight text-foreground">
                Altas Montañas
              </p>
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Explorer
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-1.5 rounded-full border border-border/70 bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground sm:flex">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            Córdoba · Orizaba, Veracruz
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <img
              src={heroImage}
              alt="Sierra de las Altas Montañas con el Pico de Orizaba al fondo"
              width={1920}
              height={1280}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
          </div>

          <div className="mx-auto max-w-3xl px-4 pb-16 pt-20 sm:px-6 sm:pb-24 sm:pt-28">
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card/80 px-3 py-1 text-xs font-medium text-foreground/80 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Guía de viaje con IA
              </span>
              <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                Explora las Altas Montañas
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
                Lugares, rutas y secretos locales de Córdoba y Orizaba, a un mensaje de distancia.
              </p>
            </div>

            <form
              onSubmit={onSubmit}
              className="mx-auto mt-8 flex w-full max-w-2xl items-center gap-2 rounded-2xl border border-border bg-card p-2 shadow-lg shadow-foreground/5 transition focus-within:border-primary/60 focus-within:shadow-xl"
            >
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center text-muted-foreground">
                <Search className="h-5 w-5" />
              </div>
              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={loading}
                placeholder="¿Qué lugar de Córdoba u Orizaba quieres explorar hoy?"
                className="min-w-0 flex-1 bg-transparent py-2 text-[15px] text-foreground placeholder:text-muted-foreground/80 focus:outline-none disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <span className="hidden sm:inline">Explorar</span>
                    <Search className="h-4 w-4 sm:hidden" />
                  </>
                )}
              </button>
            </form>

            <div className="mx-auto mt-5 flex max-w-2xl flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => submit(s)}
                  disabled={loading}
                  className="rounded-full border border-border bg-card/70 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur transition hover:border-primary/40 hover:text-foreground disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section ref={resultsRef} className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
          {error && (
            <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {messages.length === 0 && !loading && (
            <div className="rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Tus descubrimientos aparecerán aquí. Empieza con una pregunta arriba.
              </p>
            </div>
          )}

          <div className="space-y-4">
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
            {loading && <LoadingBubble />}
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-xs text-muted-foreground sm:px-6">
          Hecho con cariño para los viajeros de las Altas Montañas · Veracruz, México
        </div>
      </footer>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-sm">
          {message.text}
        </div>
      </div>
    );
  }
  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Sparkles className="h-3.5 w-3.5" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Guía local
        </span>
      </div>
      <div className="whitespace-pre-wrap text-[15px] leading-relaxed text-card-foreground">
        {message.text}
      </div>
    </article>
  );
}

function LoadingBubble() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <span>Consultando al guía local…</span>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 w-full animate-pulse rounded bg-muted" />
        <div className="h-3 w-[92%] animate-pulse rounded bg-muted" />
        <div className="h-3 w-[78%] animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}
