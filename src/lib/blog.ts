import { getCollection, type CollectionEntry } from 'astro:content';
import { blog, type Locale } from './content';
import { pageHref, postHref } from './i18n';

export type BlogCategory = (typeof blog.categories)[number];
export type BlogPost = CollectionEntry<'blog'> & {
  locale: Locale;
  slug: string;
  category: BlogCategory;
  readingMinutes: number;
};

const categories = new Map(blog.categories.map((category) => [category.id, category]));

/** Published posts, newest first. Drafts are only included by the dev server. */
export async function getPosts(locale?: Locale): Promise<BlogPost[]> {
  const entries = await getCollection('blog', ({ data }) => import.meta.env.DEV || !data.draft);
  return entries
    .map((entry) => {
      const [entryLocale, slug] = entry.id.split('/') as [Locale, string];
      const category = categories.get(entry.data.category);
      if (!category) {
        throw new Error(`${entry.filePath}: category "${entry.data.category}" is not defined in src/data/blog.yml`);
      }
      const words = (entry.body ?? '').split(/\s+/).filter(Boolean).length;
      return { ...entry, locale: entryLocale, slug, category, readingMinutes: Math.max(1, Math.round(words / 200)) };
    })
    .filter((post) => !locale || post.locale === locale)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf() || a.slug.localeCompare(b.slug));
}

/** URLs of every published language version of a post, keyed by locale. */
export async function getPostHrefs(slug: string): Promise<Partial<Record<Locale, string>>> {
  const versions = (await getPosts()).filter((post) => post.slug === slug);
  return Object.fromEntries(versions.map((post) => [post.locale, postHref(post.locale, slug)]));
}

const escapeXml = (value: string) => value.replace(/[<>&'"]/g, (char) => `&#${char.charCodeAt(0)};`);

/** RSS 2.0 feed with the published posts of one locale. */
export async function rssResponse(locale: Locale, site: URL): Promise<Response> {
  const absolute = (href: string) => new URL(href, site).toString();
  const items = (await getPosts(locale)).map((post) => {
    const link = absolute(postHref(locale, post.slug));
    return `<item><title>${escapeXml(post.data.title)}</title><link>${link}</link><guid>${link}</guid>`
      + `<description>${escapeXml(post.data.description)}</description><pubDate>${post.data.pubDate.toUTCString()}</pubDate>`
      + `<category>${escapeXml(post.category.label[locale])}</category></item>`;
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel>`
    + `<title>${escapeXml(`cfblabs · ${blog.hero.title[locale]}`)}</title><link>${absolute(pageHref(locale, 'blog'))}</link>`
    + `<description>${escapeXml(blog.hero.description[locale])}</description><language>${locale === 'pt' ? 'pt-BR' : 'en'}</language>`
    + `${items.join('')}</channel></rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
