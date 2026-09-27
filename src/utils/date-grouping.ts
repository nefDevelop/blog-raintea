import type { CollectionEntry } from 'astro:content';

export function groupByDate(
	posts: CollectionEntry<'blog'>[],
): Record<string, string> {
	const byDate: Record<string, string> = {};

	for (const post of posts) {
		if (post.data.draft) continue;
		const key = post.data.published.toISOString().split('T')[0];
		byDate[key] = `/blog/${post.id}/`;
	}

	return byDate;
}
