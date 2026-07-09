import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import satori from 'satori';
import sharp from 'sharp';
import { SITE_TITLE } from '../../consts';

export const prerender = true;

export async function getStaticPaths() {
	const posts = await getCollection('blog');
	return posts.filter((p) => !p.data.draft).map((post) => ({
		params: { slug: post.id },
		props: { post },
	}));
}

async function fetchFont(): Promise<{ regular: ArrayBuffer; bold: ArrayBuffer }> {
	try {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 5000);
		const css = await fetch('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap', { signal: controller.signal }).then(r => r.text());
		clearTimeout(timeout);
		const url = (weight: number) => {
			const match = css.match(new RegExp(`@font-face[^}]*font-weight:\\s*${weight}[^}]*url\\(([^)]+)\\)`));
			return match?.[1] ?? null;
		};
		const [rUrl, bUrl] = [url(400), url(700)];
		if (rUrl && bUrl) {
			const [rBuf, bBuf] = await Promise.all([
				fetch(rUrl).then(r => r.arrayBuffer()),
				fetch(bUrl).then(r => r.arrayBuffer()),
			]);
			return { regular: rBuf, bold: bBuf };
		}
	} catch {}
	// Fallback: use a simple sans-serif (no custom font)
	return { regular: new ArrayBuffer(0), bold: new ArrayBuffer(0) };
}

let fontCache: { regular: ArrayBuffer; bold: ArrayBuffer } | null = null;

export async function GET({ props }: APIContext<{ post: CollectionEntry<'blog'> }>) {
	const { post } = props;
	if (!fontCache) fontCache = await fetchFont();
	const { regular, bold } = fontCache;

	const primary = '#FF7800';
	const bg = '#1A1410';
	const text = '#F0ECE5';
	const muted = '#A09890';

	const pubDate = post.data.published.toLocaleDateString('en-US', {
		year: 'numeric', month: 'short', day: 'numeric',
	});

	// satori requires at least one font; if no Inter was fetched, skip generation
	if (!regular.byteLength || !bold.byteLength) {
		return new Response(null, { status: 404 });
	}

	const fonts = [
		{ name: 'Inter', data: regular, weight: 400, style: 'normal' as const },
		{ name: 'Inter', data: bold, weight: 700, style: 'normal' as const },
	];

	const svg = await satori(
		{
			type: 'div',
			props: {
				style: { height: '100%', width: '100%', display: 'flex', flexDirection: 'column', backgroundColor: bg, padding: '60px', fontFamily: 'Inter' },
				children: [
					{ type: 'div', props: { style: { display: 'flex', alignItems: 'center', gap: '16px' }, children: [{ type: 'div', props: { style: { fontSize: '32px', fontWeight: 700, color: primary }, children: SITE_TITLE } }] } },
					{ type: 'div', props: { style: { display: 'flex', flexDirection: 'column', justifyContent: 'center', flexGrow: 1, gap: '16px' }, children: [
						{ type: 'div', props: { style: { display: 'flex', alignItems: 'flex-start' }, children: [
							{ type: 'div', props: { style: { width: '8px', height: '64px', backgroundColor: primary, borderRadius: '4px', marginTop: '12px' } } },
							{ type: 'div', props: { style: { fontSize: '64px', fontWeight: 700, lineHeight: 1.2, color: text, marginLeft: '24px' }, children: post.data.title } },
						] } },
						post.data.description && { type: 'div', props: { style: { fontSize: '28px', lineHeight: 1.5, color: muted, paddingLeft: '32px' }, children: post.data.description } },
					] } },
					{ type: 'div', props: { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }, children: [
						{ type: 'div', props: { style: { display: 'flex', gap: '12px' }, children: (post.data.tags || []).map((tag: string) => ({ type: 'div', props: { style: { fontSize: '20px', color: muted, backgroundColor: 'rgba(255,120,0,0.15)', padding: '6px 14px', borderRadius: '20px' }, children: `#${tag}` } })) } },
						{ type: 'div', props: { style: { fontSize: '24px', color: muted }, children: pubDate } },
					] } },
				],
			},
		},
		{
			width: 1200, height: 630,
			fonts,
		},
	);

	const png = await sharp(Buffer.from(svg)).png().toBuffer();

	return new Response(new Uint8Array(png), {
		headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' },
	});
}
