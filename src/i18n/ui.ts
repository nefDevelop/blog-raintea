export const languages = {
	es: 'Español',
	en: 'English',
};

export const defaultLang = 'es';

export const ui = {
	es: {
		'nav.home': 'Inicio',
		'nav.blog': 'Blog',
		'nav.docs': 'Docs',
		'nav.tags': 'Etiquetas',
		'nav.categories': 'Categorías',
		'nav.archive': 'Archivo',
		'nav.about': 'Sobre mí',
		
		'toc.title': 'Tabla de contenidos',
		'toc.mobile.button': 'Navegación',
		
		'blog.related': 'Temas relacionados',
		'blog.updated': 'Actualizado',
		'blog.backlinks': 'Enlaces entrantes',
		'blog.series.part': 'Parte',
		'blog.series.of': 'de',
		
		'sidebar.tags': 'Etiquetas',
		'sidebar.author': 'Sobre el autor',
		'sidebar.recent': 'Entradas recientes',
		'sidebar.docsTags': 'Etiquetas de Documentación',
		
		'action.backToTop': 'Volver arriba',
		'action.search': 'Buscar',
		'action.more': 'Más',
		'action.readBlog': 'Leer el Blog',
		'action.docs': 'Documentación',
		'action.viewAll': 'Ver todos los posts',
		
		'index.welcome': 'Bienvenido a',
		'index.featured': 'Post Destacado',
		'index.latest': 'Últimos Artículos',
		'index.empty': 'Aún no hay posts. Vuelve pronto.',
		
		'archive.title': 'Archivo',
		'archive.description': 'Todos los posts en orden cronológico.',
		
		'footer.rights': 'Todos los derechos reservados.',
		'footer.built': 'Construido con Astro.',
		
		'404.title': 'Página no encontrada',
		'404.subtitle': 'Parece que te has perdido',
		'404.text': 'La página que estás buscando no existe, ha sido movida o quizá nunca existió.',
		'404.home': 'Volver al inicio',
		'404.search': 'Buscar contenido',
	},
	en: {
		'nav.home': 'Home',
		'nav.blog': 'Blog',
		'nav.docs': 'Docs',
		'nav.tags': 'Tags',
		'nav.categories': 'Categories',
		'nav.archive': 'Archive',
		'nav.about': 'About',
		
		'toc.title': 'Table of contents',
		'toc.mobile.button': 'Navigation',
		
		'blog.related': 'Related topics',
		'blog.updated': 'Updated',
		'blog.backlinks': 'Backlinks',
		'blog.series.part': 'Part',
		'blog.series.of': 'of',
		
		'sidebar.tags': 'Tags',
		'sidebar.author': 'About author',
		'sidebar.recent': 'Recent posts',
		'sidebar.docsTags': 'Documentation Tags',
		
		'action.backToTop': 'Back to top',
		'action.search': 'Search',
		'action.more': 'More',
		'action.readBlog': 'Read the Blog',
		'action.docs': 'Documentation',
		'action.viewAll': 'View All Posts',
		
		'index.welcome': 'Welcome to',
		'index.featured': 'Featured Post',
		'index.latest': 'Latest Articles',
		'index.empty': 'No posts yet. Check back soon.',
		
		'archive.title': 'Archive',
		'archive.description': 'All posts in chronological order.',
		
		'footer.rights': 'All rights reserved.',
		'footer.built': 'Built with Astro.',
		
		'404.title': 'Page not found',
		'404.subtitle': 'Looks like you are lost',
		'404.text': 'The page you are looking for does not exist, has been moved, or never existed.',
		'404.home': 'Back to home',
		'404.search': 'Search content',
	},
} as const;
