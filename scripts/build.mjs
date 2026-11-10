import { mkdir, cp, copyFile, readFile, rm, lstat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist');
// Only replace this project's generated directory, never a link or source folder.
if (path.resolve(output) !== path.resolve(root, 'dist') || path.dirname(output) !== root) throw new Error('Invalid build output path');
const previous = await lstat(output).catch(error => { if (error.code !== 'ENOENT') throw error; });
if (previous?.isSymbolicLink()) throw new Error('Build output cannot be a symbolic link');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
const pages = ['index.html', 'about.html', 'projects.html', 'blogs.html', 'credits.html'];
const images = new Set();
for (const file of pages) {
  const html = await readFile(path.join(root, file), 'utf8');
  for (const match of html.matchAll(/\bsrc=["'](img\/[^"']+)["']/g)) images.add(match[1]);
  await copyFile(path.join(root, file), path.join(output, file));
}
await copyFile(path.join(root, 'Resume-Liliana-Martinez.pdf'), path.join(output, 'Resume-Liliana-Martinez.pdf'));
for (const dir of ['css', 'js']) await cp(path.join(root, dir), path.join(output, dir), { recursive: true });
await mkdir(path.join(output, 'img'), { recursive: true });
for (const file of images) {
  const source = path.resolve(root, file);
  if (!source.startsWith(path.join(root, 'img') + path.sep)) throw new Error('Image path outside assets directory');
  await copyFile(source, path.join(output, file));
}
console.log('Built static portfolio in dist/');
