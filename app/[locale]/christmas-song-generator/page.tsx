import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ChevronRight, Home, Music2, PenLine, Sparkles, Snowflake } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ChristmasSongStartForm } from "@/components/seo/christmas-song-start-form";
import { SEO_TOOL_PAGE_PATHS } from "@/config/seo-pages";
import { locales, type Locale } from "@/i18n/routing";
import { absoluteLocaleUrl, localizedAlternates } from "@/lib/i18n/urls";
import { buildMarketingMetadata } from "@/lib/seo/metadata";

interface ChristmasSongGeneratorPageProps {
  params: Promise<{ locale: Locale }>;
}

const pageKey = "christmasSongGenerator";
const pagePath = SEO_TOOL_PAGE_PATHS[pageKey];

export async function generateMetadata({
  params,
}: ChristmasSongGeneratorPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: `seoPages.${pageKey}.seo`,
  });
  const url = absoluteLocaleUrl(locale, pagePath);

  return buildMarketingMetadata({
    title: t("title"),
    description: t("description"),
    url,
    locale,
    alternates: {
      canonical: url,
      languages: localizedAlternates(pagePath),
    },
  });
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function ChristmasSongGeneratorPage({
  params,
}: ChristmasSongGeneratorPageProps) {
  const { locale } = await params;
  const t = await getTranslations(`seoPages.${pageKey}`);
  const benefitKeys = ["name", "style", "scene"] as const;
  const stepKeys = ["personalize", "style", "generate"] as const;
  const faqKeys = ["one", "two", "three", "four", "five"] as const;
  const faqs = faqKeys.map((key) => ({
    question: t(`faq.${key}.question`),
    answer: t(`faq.${key}.answer`),
  }));
  const exampleKeys = ["gift", "card", "kids"] as const;
  const examples = exampleKeys.map((key) => ({
    label: t(`examples.${key}.label`),
    prompt: t(`examples.${key}.prompt`),
    style: t("form.styleDefault"),
  }));

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t("breadcrumb.home"),
        item: absoluteLocaleUrl(locale, "/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("breadcrumb.current"),
        item: absoluteLocaleUrl(locale, pagePath),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="min-h-screen bg-[#050509] text-white">
        <section className="border-b border-white/10 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px),#050509] bg-[size:56px_56px]">
          <div className="container px-4 py-12 md:px-6 md:py-16">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1.5 text-sm text-slate-400"
            >
              <Link href="/" className="inline-flex items-center gap-1 hover:text-white">
                <Home className="h-3.5 w-3.5" />
                {t("breadcrumb.home")}
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-slate-200">{t("breadcrumb.current")}</span>
            </nav>

            <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)] lg:items-center">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-sm font-semibold uppercase tracking-normal text-emerald-200">
                  <Snowflake className="h-4 w-4" />
                  {t("hero.eyebrow")}
                </p>
                <h1 className="mt-5 max-w-3xl text-4xl font-black leading-none tracking-normal md:text-5xl">
                  {t("hero.title")}
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
                  {t("hero.description")}
                </p>
              </div>

              <ChristmasSongStartForm
                labels={{
                  name: t("form.name"),
                  namePlaceholder: t("form.namePlaceholder"),
                  recipient: t("form.recipient"),
                  message: t("form.message"),
                  messagePlaceholder: t("form.messagePlaceholder"),
                  style: t("form.style"),
                  styleDefault: t("form.styleDefault"),
                  submit: t("form.submit"),
                  badge: t("form.badge"),
                  exampleLabel: t("form.exampleLabel"),
                  options: {
                    family: t("form.options.family"),
                    partner: t("form.options.partner"),
                    friend: t("form.options.friend"),
                    child: t("form.options.child"),
                    coworker: t("form.options.coworker"),
                    classic: t("form.options.classic"),
                    pop: t("form.options.pop"),
                    jazz: t("form.options.jazz"),
                    lofi: t("form.options.lofi"),
                    kids: t("form.options.kids"),
                  },
                }}
                examples={examples}
              />
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold tracking-normal md:text-4xl">
                {t("benefits.title")}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-400 md:text-base">
                {t("benefits.description")}
              </p>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {benefitKeys.map((key, index) => {
                const Icon = [PenLine, Music2, Sparkles][index % 3];
                return (
                  <article
                    key={key}
                    className="rounded-lg border border-white/10 bg-white/[0.045] p-5"
                  >
                    <Icon className="h-5 w-5 text-emerald-200" />
                    <h3 className="mt-4 text-lg font-semibold tracking-normal">
                      {t(`benefits.items.${key}.title`)}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {t(`benefits.items.${key}.description`)}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-white/[0.025] py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-[0.7fr_1fr] lg:items-start">
              <div>
                <h2 className="text-3xl font-bold tracking-normal md:text-4xl">
                  {t("steps.title")}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-400 md:text-base">
                  {t("steps.description")}
                </p>
              </div>
              <ol className="grid gap-3">
                {stepKeys.map((key, index) => (
                  <li
                    key={key}
                    className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.045] p-5 sm:grid-cols-[42px_1fr]"
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-md bg-white text-sm font-bold text-black">
                      {index + 1}
                    </span>
                    <span>
                      <strong className="text-base">
                        {t(`steps.items.${key}.title`)}
                      </strong>
                      <span className="mt-1 block text-sm leading-6 text-slate-400">
                        {t(`steps.items.${key}.description`)}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-normal md:text-4xl">
              {t("faq.title")}
            </h2>
            <div className="mt-6 grid gap-3">
              {faqs.map((item, index) => (
                <details
                  key={item.question}
                  open={index === 0}
                  className="rounded-lg border border-white/10 bg-white/[0.045] p-5"
                >
                  <summary className="cursor-pointer list-none font-semibold [&::-webkit-details-marker]:hidden">
                    {item.question}
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-normal md:text-4xl">
              {t("related.title")}
            </h2>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={SEO_TOOL_PAGE_PATHS.aiSongMaker}
                className="rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 text-sm text-slate-200 transition hover:border-white/25 hover:bg-white/[0.08]"
              >
                {t("related.links.songMaker")}
              </Link>
              <Link
                href={SEO_TOOL_PAGE_PATHS.aiTextToSong}
                className="rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 text-sm text-slate-200 transition hover:border-white/25 hover:bg-white/[0.08]"
              >
                {t("related.links.textToSong")}
              </Link>
              <Link
                href={SEO_TOOL_PAGE_PATHS.aiLyricsToSong}
                className="rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 text-sm text-slate-200 transition hover:border-white/25 hover:bg-white/[0.08]"
              >
                {t("related.links.lyricsToSong")}
              </Link>
              <Link
                href="/"
                className="rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 text-sm text-slate-200 transition hover:border-white/25 hover:bg-white/[0.08]"
              >
                {t("related.links.home")}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
