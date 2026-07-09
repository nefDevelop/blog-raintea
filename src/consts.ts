export const SITE_TITLE = 'Raintea Blog';
export const SITE_DESCRIPTION = 'Un blog personal con el tema Ri';
export const SITE_URL = 'https://blog-raintea.pages.dev';

export type PageKey = 'home' | 'blog' | 'docs' | 'tags' | 'categories' | 'archive' | 'about';

export interface PageDef {
	key: PageKey;
	label: string;
	url: string;
	requires: 'blog' | 'docs' | 'about' | null;
}

export const ALL_PAGES: PageDef[] = [
	{ key: 'home', label: 'Home', url: '/', requires: null },
	{ key: 'blog', label: 'Blog', url: '/blog', requires: 'blog' },
	{ key: 'docs', label: 'Docs', url: '/docs', requires: 'docs' },
	{ key: 'tags', label: 'Tags', url: '/tags', requires: 'blog' },
	{ key: 'categories', label: 'Categories', url: '/categories', requires: 'blog' },
	{ key: 'archive', label: 'Archive', url: '/archive', requires: 'blog' },
	{ key: 'about', label: 'About', url: '/about', requires: 'about' },
];

export const SOCIAL_LINKS: { label: string; url: string; icon: string }[] = [
	{ label: 'GitHub', url: 'https://github.com', icon: 'github' },
	{ label: 'RSS', url: '/rss.xml', icon: 'rss' },
];

export const SUPPORT_LINKS = [
	{ label: 'Buy me a coffee', url: 'https://buymeacoffee.com', icon: 'coffee' },
	{ label: 'GitHub Sponsor', url: 'https://github.com/sponsors', icon: 'heart' },
];

export const SIDEBAR_WIDGETS = {
	docs: ['toc', 'categories', 'doc-tags'],
	blog: ['toc', 'author', 'calendar', 'tags'],
	post: ['toc', 'author', 'calendar'],
} as const;

export const TAG_DESCRIPTIONS: Record<string, string> = {
	test: 'Posts de prueba y experimentos con el tema.',
	code: 'Ejemplos de código en múltiples lenguajes.',
	markdown: 'Características y sintaxis de Markdown.',
	math: 'Contenido matemático con KaTeX.',
	mermaid: 'Diagramas y gráficos con Mermaid.',
	guide: 'Guías y tutoriales paso a paso.',
};

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
	dev: 'Desarrollo de software y programación.',
	design: 'Diseño UI/UX y recursos visuales.',
	guide: 'Guías y tutoriales.',
	media: 'Contenido multimedia y vídeos.',
};

export const GISCUS = {
	repo: 'nef734/astro-ri',
	repoId: '',
	category: 'General',
	categoryId: '',
};
