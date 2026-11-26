"use client";

import { type FormEvent, useState } from "react";
import { ArrowRight, Music2, Snowflake } from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SEO_TOOL_PAGE_PATHS } from "@/config/seo-pages";
import { defaultLocale, type Locale } from "@/i18n/routing";

const PENDING_DRAFT_STORAGE_PREFIX = "calyra:pendingDraft:";

interface ChristmasSongStartFormProps {
  labels: {
    name: string;
    namePlaceholder: string;
    recipient: string;
    message: string;
    messagePlaceholder: string;
    style: string;
    styleDefault: string;
    submit: string;
    badge: string;
    exampleLabel: string;
    options: {
      family: string;
      partner: string;
      friend: string;
      child: string;
      coworker: string;
      classic: string;
      pop: string;
      jazz: string;
      lofi: string;
      kids: string;
    };
  };
  examples: { label: string; prompt: string; style: string }[];
}

function localePrefix(locale: Locale) {
  return locale === defaultLocale ? "" : `/${locale}`;
}

export function ChristmasSongStartForm({
  labels,
  examples,
}: ChristmasSongStartFormProps) {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const [name, setName] = useState("");
  const [recipient, setRecipient] = useState(labels.options.family);
  const [style, setStyle] = useState(labels.styleDefault);
  const [message, setMessage] = useState("");

  const applyExample = (example: (typeof examples)[number]) => {
    setMessage(example.prompt);
    setStyle(example.style);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const prompt = [
      `Create an original Christmas song for ${name.trim()}.`,
      `Recipient: ${recipient}.`,
      message.trim()
        ? `Details to include: ${message.trim()}`
        : "Use warm holiday wishes, a memorable chorus, and a natural mention of the name.",
      "Make it an original holiday song, not a cover of any existing song.",
    ].join("\n");

    const nextPath = `${localePrefix(locale)}${SEO_TOOL_PAGE_PATHS.aiTextToSong}`;
    const pendingDraftKey = `${PENDING_DRAFT_STORAGE_PREFIX}${nextPath}`;
    window.sessionStorage.setItem(
      pendingDraftKey,
      JSON.stringify({
        prompt,
        style,
        title: `Christmas Song for ${name.trim()}`,
      }),
    );

    const params = new URLSearchParams({
      utm_campaign: "christmas_song_generator",
    });

    router.push(`${nextPath}?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border bg-card p-4 shadow-sm md:p-5"
    >
      <div className="flex items-center gap-2 text-sm font-medium text-primary">
        <Snowflake className="h-4 w-4" />
        {labels.badge}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="text-sm font-medium text-foreground">
          {labels.name}
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={labels.namePlaceholder}
            maxLength={80}
            required
            className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm font-normal outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>

        <label className="text-sm font-medium text-foreground">
          {labels.recipient}
          <select
            value={recipient}
            onChange={(event) => setRecipient(event.target.value)}
            className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm font-normal outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option>{labels.options.family}</option>
            <option>{labels.options.partner}</option>
            <option>{labels.options.friend}</option>
            <option>{labels.options.child}</option>
            <option>{labels.options.coworker}</option>
          </select>
        </label>
      </div>

      <label className="mt-3 block text-sm font-medium text-foreground">
        {labels.message}
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder={labels.messagePlaceholder}
          maxLength={1000}
          className="mt-2 min-h-24 w-full resize-y rounded-md border border-input bg-background px-3 py-3 text-sm font-normal outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
        />
      </label>

      <label className="mt-3 block text-sm font-medium text-foreground">
        {labels.style}
        <input
          value={style}
          onChange={(event) => setStyle(event.target.value)}
          maxLength={240}
          className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm font-normal outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
        />
      </label>

      <div className="mt-4">
        <p className="text-xs font-medium text-muted-foreground">
          {labels.exampleLabel}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {examples.map((example) => (
            <button
              key={example.label}
              type="button"
              onClick={() => applyExample(example)}
              className="rounded-full border bg-background px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary hover:text-primary"
            >
              {example.label}
            </button>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={name.trim().length < 1}
        className="mt-5 w-full gap-2"
      >
        <Music2 className="h-4 w-4" />
        {labels.submit}
        <ArrowRight className="h-4 w-4" />
      </Button>
    </form>
  );
}
