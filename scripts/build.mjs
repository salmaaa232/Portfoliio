import { mkdir, copyFile, cp } from 'node:fs/promises';
const files = ['index.html', 'styles.css', 'mobile.css', 'app.js', 'mobile.js', 'favicon.svg'];
await mkdir('dist', { recursive: true });
for (const file of files) await copyFile(file, `dist/${file}`);
await cp('assets', 'dist/assets', { recursive: true });
console.log(`Built ${files.length} files and project assets into dist/`);
