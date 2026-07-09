// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import expressiveCode from 'astro-expressive-code';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeCallouts from 'rehype-callouts';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import remarkMath from 'remark-math';
import { defineConfig, fontProviders } from 'astro/config';
import { rehypeFigure } from './src/plugins/rehype-figure.js';
import { rehypeTableClasses } from './src/plugins/rehype-table-classes.js';
import { remarkAttributes } from './src/plugins/remark-attributes.js';
import { remarkMermaid } from './src/plugins/remark-mermaid';
import { remarkObsidian } from './src/plugins/remark-obsidian';
import { remarkReadingTime } from './src/plugins/remark-reading-time';

import { SITE_URL } from './src/consts';

// https://astro.build/config
export default defineConfig({
	site: SITE_URL,
	integrations: [
		expressiveCode({
			themes: ['github-dark', 'github-light'],
			useDarkModeMediaQuery: false,
			themeCssSelector: (theme) => `[data-theme='${theme.name}']`,
			plugins: [pluginLineNumbers(), pluginCollapsibleSections()],
			defaultProps: {
				wrap: false,
			},
			styleOverrides: {
				borderRadius: '0.5rem',
				codeFontSize: '0.875rem',
				codeFontFamily: "'JetBrains Mono Variable', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
			},
			frames: {
				showCopyToClipboardButton: true,
				showLanguage: true,
			},
		}),
		mdx(),
		sitemap(),
	],
	markdown: {
		remarkPlugins: [remarkMath, remarkMermaid, remarkObsidian, remarkReadingTime, remarkAttributes],
		rehypePlugins: [
			rehypeSlug,
			[rehypeAutolinkHeadings, { behavior: 'append', content: { type: 'text', value: '#' }, properties: { class: 'anchor', ariaHidden: 'true', tabIndex: -1 } }],
			rehypeFigure,
			rehypeTableClasses,
			[rehypeKatex, { output: 'mathml' }],
			[rehypeCallouts, {
				theme: 'obsidian',
				callouts: {
					defini: { title: 'Definición' },
					pill: { title: 'Pill' },
					infobox2: { title: 'Info' },
					'multi-column': { title: 'Multi-column' },
				},
			}],
		],
	},
	vite: {
		plugins: [tailwindcss()],
	},
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});
