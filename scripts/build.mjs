import { mkdir, copyFile } from 'node:fs/promises';
const files = ['index.html', 'styles.css', 'app.js', 'favicon.svg'];
await mkdir('dist', { recursive: true });
for (const file of files) await copyFile(file, `dist/${file}`);
console.log(`Built ${files.length} files into dist/`);
