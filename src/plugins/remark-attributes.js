import { visit } from 'unist-util-visit';

const ATTR_RE = /^\{(\.?[\w][\w-]*)\}$/;

export function remarkAttributes() {
	return (tree) => {
		visit(tree, 'paragraph', (node, index, parent) => {
			if (!parent || typeof index !== 'number') return;
			const text = node.children?.[0]?.value;
			if (!text) return;
			const m = text.match(ATTR_RE);
			if (!m) return;
			if (node.children.length > 1) return;

			for (let i = index - 1; i >= 0; i--) {
				const prev = parent.children[i];
				if (!prev || prev.type === 'thematicBreak' || prev.type === 'heading') break;
				if (prev.type === 'text' && !prev.value?.trim()) continue;

				const attr = m[1];
				prev.data = prev.data || {};
				prev.data.hProperties = prev.data.hProperties || {};

				if (attr.startsWith('.')) {
					const cn = prev.data.hProperties.className || [];
					cn.push(attr.slice(1));
					prev.data.hProperties.className = cn;
				} else {
					prev.data.hProperties[attr] = '';
				}

				parent.children.splice(index, 1);
				return index;
			}
		});
	};
}
