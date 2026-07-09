import { describe, it, expect } from 'vitest';
import { remark } from 'remark';
import { remarkObsidian } from './remark-obsidian.js';

describe('remarkObsidian', () => {
  const processor = remark().use(remarkObsidian);

  it('transforms obsidian links correctly', async () => {
    const file = await processor.process('Check this [[My Note]] out.');
    expect(String(file)).toContain('[My Note](/blog/my-note/)');
  });

  it('handles malicious script tags in highlight', async () => {
    const ast = processor.parse('==<script>alert(1)</script>==');
    const transformed = await processor.run(ast);
    const paragraph = transformed.children.find((node: any) => node.type === 'paragraph');
    const htmlNode = paragraph.children.find((node: any) => node.type === 'html');
    expect(htmlNode.value).toBe('<mark><script>alert(1)</script></mark>');
  });

  it('handles malicious obsidian links', async () => {
    const ast = processor.parse('[[javascript:alert(1)|Click me]]');
    const transformed = await processor.run(ast);
    const linkNode = transformed.children.find((node: any) => node.type === 'paragraph').children[0];
    
    expect(linkNode.type).toBe('link');
    // Notice how it prepends /blog/, which neuters the javascript: protocol, 
    // making it a 404 relative link instead of executable XSS.
    expect(linkNode.url).toBe('/blog/javascript:alert(1)/');
  });

  it('resists basic ReDoS (long unclosed patterns)', async () => {
    const start = performance.now();
    const badInput = '=='.repeat(10000) + 'test';
    const ast = processor.parse(badInput);
    await processor.run(ast);
    const end = performance.now();
    expect(end - start).toBeLessThan(100); // Should be very fast, no catastrophic backtracking
  });
});
