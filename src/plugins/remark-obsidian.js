import { visit } from 'unist-util-visit';

const ALL_RE = /(!)?\[\[([^\]|]+)(?:\|([^\]|]+))?\]\]|==([^=]+)==/g;

function splitText(value) {
	const parts = [];
	let last = 0;
	for (const m of value.matchAll(ALL_RE)) {
		if (m.index > last) parts.push({ type: 'text', value: value.slice(last, m.index) });
		if (m[1] === '!') {
			parts.push({
				type: 'image',
				url: `/assets/${m[2]}`,
				alt: m[2],
				title: null,
			});
		} else if (m[1] === undefined && m[4] === undefined) {
			parts.push({
				type: 'link',
				url: `/blog/${m[2].toLowerCase().replace(/\s+/g, '-')}/`,
				title: null,
				children: [{ type: 'text', value: m[3] || m[2] }],
			});
		} else if (m[4] !== undefined) {
			parts.push({
				type: 'html',
				value: `<mark>${m[4]}</mark>`,
			});
		}
		last = m.index + m[0].length;
	}
	if (last < value.length) parts.push({ type: 'text', value: value.slice(last) });
	return parts;
}

export function remarkObsidian() {
	return (tree) => {
		visit(tree, 'text', (node, index, parent) => {
			if (!parent || typeof index !== 'number') return;
			if (!ALL_RE.test(node.value)) return;
			ALL_RE.lastIndex = 0;
			const parts = splitText(node.value);
			if (parts.length === 1 && parts[0] === node) return;
			parent.children.splice(index, 1, ...parts);
			return index + parts.length;
		});
	};
}
