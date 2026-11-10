// Checks the forge source links in law docs against the form law.template.md asks for.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const dirs = ['draft/law', 'knowledge/law'];
// GitHub renders these, so a #L anchor only reaches its line in the ?plain=1 view.
const rendered = /\.(md|mdx|markdown|rst|adoc|org)$/i;
const github = /https:\/\/github\.com\/[^/\s]+\/[^/\s]+\/(blob|tree)\/([^/\s]+)(\/[^\s)#?]*)(\?[^\s)#]*)?(#L[^\s)]*)?/g;
const gitlab = /https:\/\/gitlab\.com\/\S+?\/-\/(?:blob|tree)\/([^/\s]+)\//g;
const definition = /^\[[^\]]+\]: /;
// A run of hex mixing digits and letters, as a sha does.
const visibleSha = /(?<![\w/.-])(?=[0-9a-f]*\d)(?=[0-9a-f]*[a-f])[0-9a-f]{7,40}(?!\w)/;

const fullSha = (ref) => /^[0-9a-f]{40}$/.test(ref);
const problems = [];
for (const dir of dirs) {
  for (const name of readdirSync(dir).filter((entry) => entry.endsWith('.md'))) {
    const file = join(dir, name);
    readFileSync(file, 'utf8').split('\n').forEach((text, index) => {
      const at = `${file}:${index + 1}`;
      for (const [url, kind, ref, path, query = '', anchor] of text.matchAll(github)) {
        if (!fullSha(ref)) problems.push(`${at}: pin the full 40-character commit sha: ${url}`);
        if (kind === 'blob' && anchor && rendered.test(path) && !/[?&]plain=1/.test(query)) {
          problems.push(`${at}: put ?plain=1 before #L: ${url}`);
        }
      }
      for (const [url, ref] of text.matchAll(gitlab)) {
        if (!fullSha(ref)) problems.push(`${at}: pin the full 40-character commit sha: ${url}`);
      }
      if (!definition.test(text) && visibleSha.test(text)) {
        problems.push(`${at}: keep the commit sha in the link's URL, not its text`);
      }
    });
  }
}

for (const problem of problems) console.error(problem);
process.exitCode = problems.length ? 1 : 0;
