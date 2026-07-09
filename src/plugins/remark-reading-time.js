import { toString } from 'mdast-util-to-string';
import { visit } from 'unist-util-visit';

const WORDS_PER_MIN = 200;

export function remarkReadingTime() {
	return (tree, { data }) => {
		const text = toString(tree);
		const words = text.split(/\s+/g).filter(Boolean).length;
		const minutes = Math.max(1, Math.ceil(words / WORDS_PER_MIN));
		data.astro.frontmatter.readingTime = { text: `${minutes} min read`, minutes, words };
	};
}
