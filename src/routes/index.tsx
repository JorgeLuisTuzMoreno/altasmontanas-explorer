import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect, type FormEvent } from "react";
import { Mountain, Search, Sparkles, Loader2, MapPin, Coffee, Trees, Landmark, UtensilsCrossed, ExternalLink } from "lucide-react";
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

const API_URL = "https://jorgetuz-api-turismo.hf.space";

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

const CATEGORIES = [
  {
    key: "cafes",
    label: "Cafés",
    description: "Tuestes locales y rincones acogedores",
    icon: Coffee,
    prompt: "Recomiéndame los mejores cafés de Córdoba y Orizaba",
    color: "text-amber-600",
    border: "border-amber-200",
    iconBg: "bg-amber-50",
    hoverBorder: "hover:border-amber-300",
    shadowColor: "shadow-amber-500/10",
  },
  {
    key: "naturaleza",
    label: "Naturaleza",
    description: "Cascadas, volcanes y senderos",
    icon: Trees,
    prompt: "Lugares naturales imperdibles cerca de Orizaba",
    color: "text-emerald-600",
    border: "border-emerald-200",
    iconBg: "bg-emerald-50",
    hoverBorder: "hover:border-emerald-300",
    shadowColor: "shadow-emerald-500/10",
  },
  {
    key: "historia",
    label: "Historia",
    description: "Monumentos, museos y leyendas",
    icon: Landmark,
    prompt: "Sitios históricos para visitar en Córdoba, Veracruz",
    color: "text-slate-600",
    border: "border-slate-200",
    iconBg: "bg-slate-50",
    hoverBorder: "hover:border-slate-300",
    shadowColor: "shadow-slate-500/10",
  },
  {
    key: "gastronomia",
    label: "Gastronomía",
    description: "Sabores típicos de la región",
    icon: UtensilsCrossed,
    prompt: "Qué platillos típicos debo probar en la región de las Altas Montañas",
    color: "text-rose-600",
    border: "border-rose-200",
    iconBg: "bg-rose-50",
    hoverBorder: "hover:border-rose-300",
    shadowColor: "shadow-rose-500/10",
  },
] as const;

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
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-background/30 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-1 ring-white/20">
              <Mountain className="h-5 w-5" strokeWidth={2.25} />
            </div>
            <div className="leading-tight">
              <p className="text-[15px] font-semibold tracking-tight text-white drop-shadow">
                Altas Montañas
              </p>
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/70">
                Explorer
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur sm:flex">
            <MapPin className="h-3.5 w-3.5 text-primary-foreground" />
            Córdoba · Orizaba, Veracruz
          </div>
        </div>
      </header>

      <main className="bg-background">
        <section className="relative -mt-[73px] flex min-h-[100svh] items-center overflow-hidden pt-[73px]">
          <div className="absolute inset-0 z-0">
            <img
              src={heroImage}
              alt="Sierra de las Altas Montañas con el Pico de Orizaba al fondo"
              width={1920}
              height={1280}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-background" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.45)_100%)]" />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-3xl px-4 pb-20 pt-12 sm:px-6 sm:pb-28 sm:pt-20">
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium text-white/95 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                Guía de viaje con IA
              </span>
              <h1 className="mt-5 text-balance text-5xl font-bold tracking-tight text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)] sm:text-6xl md:text-7xl">
                Explora las <span className="bg-gradient-to-r from-amber-200 via-orange-300 to-amber-400 bg-clip-text text-transparent">Altas Montañas</span>
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-pretty text-base text-white/85 drop-shadow sm:text-lg">
                Lugares, rutas y secretos locales de Córdoba y Orizaba, a un mensaje de distancia.
              </p>
            </div>

            <form
              onSubmit={onSubmit}
              className="mx-auto mt-10 flex w-full max-w-2xl items-center gap-2 rounded-2xl border border-white/30 bg-white/15 p-2 shadow-2xl shadow-black/40 backdrop-blur-2xl transition focus-within:border-white/60 focus-within:bg-white/20"
            >
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center text-white/80">
                <Search className="h-5 w-5" />
              </div>
              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={loading}
                placeholder="¿Qué lugar de Córdoba u Orizaba quieres explorar hoy?"
                className="min-w-0 flex-1 bg-transparent py-2 text-[15px] text-white placeholder:text-white/60 focus:outline-none disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-br from-primary to-primary/80 px-5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/40 transition hover:scale-[1.02] hover:shadow-primary/60 disabled:cursor-not-allowed disabled:opacity-50"
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

            <div className="mx-auto mt-6 flex max-w-2xl flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => submit(s)}
                  disabled={loading}
                  className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-md transition hover:border-white/50 hover:bg-white/20 disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section
          ref={resultsRef}
          className="relative -mt-16 pb-20 pt-12 sm:pb-24"
          style={{ backgroundColor: "#F1F3F5" }}
        >
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <div className="rounded-3xl border border-white/60 bg-white/60 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:p-8">
              {error && (
                <div className="mb-4 animate-fade-in rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              {messages.length === 0 && !loading && (
                <div className="animate-fade-in">
                  <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                      Explora por categoría
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Elige un tema y deja que tu guía local te inspire.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                    {CATEGORIES.map((c) => {
                      const Icon = c.icon;
                      return (
                        <button
                          key={c.key}
                          type="button"
                          onClick={() => submit(c.prompt)}
                          disabled={loading}
                          className={`group flex flex-col items-center gap-3 rounded-2xl border ${c.border} ${c.hoverBorder} bg-white/70 p-4 text-center shadow-sm ${c.shadowColor} backdrop-blur-sm transition-all hover:-translate-y-1 hover:bg-white hover:shadow-lg disabled:opacity-50 md:flex-row md:items-start md:text-left md:py-5 md:px-4`}
                        >
                          <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${c.iconBg} ring-1 ring-black/5`}>
                            <Icon className={`h-4 w-4 ${c.color}`} strokeWidth={2.25} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold tracking-tight text-foreground">
                              {c.label}
                            </p>
                            <p className="mt-0.5 hidden text-xs text-muted-foreground md:block">
                              {c.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {messages.map((m) => (
                  <div key={m.id} className="animate-fade-in">
                    <MessageBubble message={m} />
                  </div>
                ))}
                {loading && (
                  <div className="animate-fade-in">
                    <LoadingBubble />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 bg-background py-14">
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
  const place = extractPlace(message.text);
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
      {place ? (
        <InfoCard title={place.title} description={place.description} />
      ) : (
        <div className="whitespace-pre-wrap text-[15px] leading-relaxed text-card-foreground">
          {message.text}
        </div>
      )}
    </article>
  );
}

function extractPlace(text: string): { title: string; description: string } | null {
  const trimmed = text.trim();
  if (!trimmed) return null;
  // Heuristic: first short line as title, rest as description.
  const lines = trimmed.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  if (lines.length < 2) return null;
  const first = lines[0].replace(/^[#*•\-\d.\s]+/, "");
  if (first.length === 0 || first.length > 80) return null;
  const rest = lines.slice(1).join("\n");
  if (rest.length < 30) return null;
  return { title: first, description: rest };
}

function InfoCard({ title, description }: { title: string; description: string }) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    title + " Veracruz",
  )}`;
  return (
    <div className="overflow-hidden rounded-xl border border-border/70 bg-gradient-to-br from-background to-muted/40">
      <div className="flex items-start gap-4 p-5">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
          <MapPin className="h-5 w-5" strokeWidth={2.25} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
          <p className="mt-1.5 whitespace-pre-wrap text-[14.5px] leading-relaxed text-muted-foreground">
            {description}
          </p>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground shadow-sm transition hover:bg-accent"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Abrir en Maps
          </a>
        </div>
      </div>
    </div>
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
