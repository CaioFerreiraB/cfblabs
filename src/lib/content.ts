import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import YAML from 'yaml';
import { z } from 'zod';

const localized = z.strictObject({ en: z.string().trim().min(1), pt: z.string().trim().min(1) });
const description = z.strictObject({
  en: z.union([z.string().trim().min(1), z.array(z.string().trim().min(1)).min(1)]),
  pt: z.union([z.string().trim().min(1), z.array(z.string().trim().min(1)).min(1)]),
});
const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Expected YYYY-MM');
const imagePath = z.string().regex(/^\/images\/[a-z0-9/_-]+\.(svg|png|jpg|jpeg|webp)$/i, 'Expected a local /images/ path');
const httpsUrl = z.url().refine((value) => value.startsWith('https://'), 'Expected an HTTPS URL');

const datedEntry = z.strictObject({
  id: z.string().regex(/^[a-z0-9-]+$/),
  institution: z.string().trim().min(1),
  start: month,
  end: month.nullable(),
  current: z.boolean(),
  description,
  logo: imagePath.optional(),
}).superRefine((entry, context) => {
  if (entry.current && entry.end !== null) {
    context.addIssue({ code: 'custom', path: ['end'], message: 'Current entries must have a null end date' });
  }
  if (!entry.current && entry.end === null) {
    context.addIssue({ code: 'custom', path: ['end'], message: 'Completed entries need an end date' });
  }
  if (entry.end && entry.end < entry.start) {
    context.addIssue({ code: 'custom', path: ['end'], message: 'End date must not precede start date' });
  }
});

const siteSchema = z.strictObject({
  brandName: z.string().trim().min(1),
  email: z.email(),
  linkedin: httpsUrl,
  github: httpsUrl,
  hero: z.strictObject({ title: localized, subtitle: localized, image: imagePath }),
});

const profileSchema = z.strictObject({
  name: z.string().trim().min(1),
  photo: imagePath,
  location: z.strictObject({ city: z.string().min(1), state: z.string().min(1), country: localized }),
  introduction: localized,
  focusAreas: z.array(z.strictObject({
    id: z.string().regex(/^[a-z0-9-]+$/),
    label: localized,
    detail: localized,
    icon: z.enum(['chart-no-axes-combined', 'trees', 'code-xml', 'users-round']),
    color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Expected a six-digit hex color'),
  })).min(1),
});

const educationSchema = z.strictObject({ entries: z.array(datedEntry.safeExtend({ title: localized })).min(1) });
const experienceSchema = z.strictObject({ entries: z.array(datedEntry.safeExtend({ role: localized })).min(1) });
const volunteeringSchema = z.strictObject({ entries: z.array(datedEntry.safeExtend({ role: localized })).min(1) });
const skillsSchema = z.strictObject({ groups: z.array(z.strictObject({
  id: z.string().regex(/^[a-z0-9-]+$/),
  label: localized,
  items: z.strictObject({
    en: z.array(z.string().trim().min(1)).min(1),
    pt: z.array(z.string().trim().min(1)).min(1),
  }),
})).min(1) });
const projectsSchema = z.strictObject({ projects: z.array(z.strictObject({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().trim().min(1),
  description: localized,
  cover: imagePath,
  tags: z.strictObject({
    en: z.array(z.string().trim().min(1)).min(1),
    pt: z.array(z.string().trim().min(1)).min(1),
  }),
  url: httpsUrl,
  featured: z.boolean(),
})).min(1) });

function loadData<T>(fileName: string, schema: z.ZodType<T>): T {
  let raw: unknown;
  try {
    raw = YAML.parse(readFileSync(resolve(process.cwd(), 'src/data', fileName), 'utf8'));
  } catch (error) {
    throw new Error(`${fileName}: ${error instanceof Error ? error.message : String(error)}`);
  }
  const result = schema.safeParse(raw);
  if (!result.success) {
    const details = result.error.issues.map((issue) => `${fileName}:${issue.path.join('.') || 'root'}: ${issue.message}`).join('\n');
    throw new Error(`Content validation failed:\n${details}`);
  }
  return result.data;
}

export const site = loadData('site.yml', siteSchema);
export const profile = loadData('profile.yml', profileSchema);
export const education = loadData('education.yml', educationSchema);
export const experience = loadData('experience.yml', experienceSchema);
export const volunteering = loadData('volunteering.yml', volunteeringSchema);
export const skills = loadData('skills.yml', skillsSchema);
export const projects = loadData('projects.yml', projectsSchema).projects;

for (const [fileName, path] of [
  ['site.yml', site.hero.image],
  ['profile.yml', profile.photo],
  ...education.entries.filter((entry) => entry.logo).map((entry) => ['education.yml', entry.logo!] as [string, string]),
  ...experience.entries.filter((entry) => entry.logo).map((entry) => ['experience.yml', entry.logo!] as [string, string]),
  ...volunteering.entries.filter((entry) => entry.logo).map((entry) => ['volunteering.yml', entry.logo!] as [string, string]),
  ...projects.map((project) => ['projects.yml', project.cover] as [string, string]),
]) {
  if (!existsSync(resolve(process.cwd(), 'public', path.slice(1)))) {
    throw new Error(`${fileName}: image path ${path} does not exist in public/`);
  }
}

export type Locale = 'en' | 'pt';
export type PageName = 'home' | 'about' | 'projects' | 'contact';
export type TimelineEntry = (typeof education.entries)[number] | (typeof experience.entries)[number];
