import { visit } from 'unist-util-visit';

export function rehypeFigure() {
	return (tree) => {
		visit(tree, 'element', (node, index, parent) => {
			if (!node || node.tagName !== 'img' || !parent || typeof index !== 'number') return;
			const alt = node.properties?.alt || '';
			const src = node.properties?.src || '';

			const children = [{ ...node, properties: { ...node.properties, alt, src } }];
			if (alt) {
				children.push({
					type: 'element',
					tagName: 'figcaption',
					properties: {},
					children: [{ type: 'text', value: alt }],
				});
			}

			parent.children.splice(index, 1, {
				type: 'element',
				tagName: 'figure',
				properties: { class: 'image-figure' },
				children,
			});
			return index + 1;
		});
	};
}
