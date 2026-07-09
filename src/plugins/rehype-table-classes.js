import { visit } from 'unist-util-visit';

const CLASS_RE = /^\{(\.\w[\w-]*)\}$/;

export function rehypeTableClasses() {
	return (tree) => {
		visit(tree, 'element', (node, index, parent) => {
			if (!parent || typeof index !== 'number') return;
			if (node.tagName !== 'p' || !node.children?.length) return;
			const text = node.children[0]?.value;
			if (!text) return;
			const m = text.match(CLASS_RE);
			if (!m) return;

			// Look backwards for a table
			for (let i = index - 1; i >= 0; i--) {
				const prev = parent.children[i];
				if (prev.type === 'text' && !prev.value?.trim()) continue;
				if (prev.tagName === 'table') {
					const cls = m[1];
					prev.properties = prev.properties || {};
					prev.properties.className = [
						...(prev.properties.className || []),
						cls,
					];
					parent.children.splice(index, 1);
					return index;
				}
				break;
			}
		});
	};
}
