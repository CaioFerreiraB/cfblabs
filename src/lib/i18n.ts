import type { Locale, PageName } from './content';

export const copy = {
  en: {
    navigation: { home: 'Home', about: 'About', projects: 'Projects', contact: 'Contact' },
    skip: 'Skip to content',
    heroPrimary: 'Explore my projects',
    heroSecondary: 'About me',
    featuredTitle: 'Featured projects',
    viewAll: 'View all projects',
    aboutTitle: 'About me',
    aboutLead: 'Hello, I am',
    onThisPage: 'On this page',
    focusTitle: 'Interests and areas of work',
    educationTitle: 'Education',
    experienceTitle: 'Professional experience',
    researchTitle: 'Research experience',
    volunteeringTitle: 'Volunteering',
    skillsTitle: 'Skills',
    projectsTitle: 'Projects',
    projectsLead: 'Selected work across environmental data, digital products, community, and AI.',
    contactTitle: 'Contact',
    contactLead: 'Have an idea, a collaboration, or a question? Let us talk.',
    email: 'Email',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    current: 'Present',
    openProject: 'Open the repository for',
    switchLanguage: 'Switch language to Portuguese',
    footerSocial: 'Contact and social links',
  },
  pt: {
    navigation: { home: 'Início', about: 'Sobre', projects: 'Projetos', contact: 'Contato' },
    skip: 'Ir para o conteúdo',
    heroPrimary: 'Conheça meus projetos',
    heroSecondary: 'Sobre mim',
    featuredTitle: 'Projetos em destaque',
    viewAll: 'Ver todos os projetos',
    aboutTitle: 'Sobre mim',
    aboutLead: 'Olá! Eu sou o',
    onThisPage: 'Nesta página',
    focusTitle: 'Interesses e áreas de atuação',
    educationTitle: 'Formação',
    experienceTitle: 'Experiência profissional',
    researchTitle: 'Experiência em pesquisa',
    volunteeringTitle: 'Voluntariado',
    skillsTitle: 'Habilidades',
    projectsTitle: 'Projetos',
    projectsLead: 'Uma seleção de projetos sobre dados ambientais, produtos digitais, comunidade e IA.',
    contactTitle: 'Contato',
    contactLead: 'Tem uma ideia, parceria ou pergunta? Vamos conversar.',
    email: 'E-mail',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    current: 'Atual',
    openProject: 'Abrir o repositório de',
    switchLanguage: 'Mudar idioma para inglês',
    footerSocial: 'Contato e redes sociais',
  },
} as const;

const pagePaths: Record<Locale, Record<PageName, string>> = {
  en: { home: '/', about: '/about/', projects: '/projects/', contact: '/contact/' },
  pt: { home: '/pt/', about: '/pt/about/', projects: '/pt/projects/', contact: '/pt/contact/' },
};

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function pageHref(locale: Locale, page: PageName): string {
  return `${base}${pagePaths[locale][page]}`;
}

export function assetHref(path: string): string {
  return `${base}${path}`;
}

export function formatMonth(value: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'pt' ? 'pt-BR' : 'en-US', {
    month: 'short', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(`${value}-01T00:00:00Z`));
}
