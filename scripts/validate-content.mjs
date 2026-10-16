import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateEntry, validateSite} from './content-validation.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
function read(file) { return JSON.parse(fs.readFileSync(path.join(root, file), 'utf8')); }
function mediaExists(value, source) {
  if (typeof value !== 'string' || !value.startsWith('/')) return;
  let target;
  try { target = path.resolve(root, 'public', decodeURIComponent(value).slice(1)); } catch { throw new Error(`${source}: 媒体路径编码不正确`); }
  const publicRoot = path.resolve(root, 'public') + path.sep;
  if (!target.startsWith(publicRoot) || !fs.existsSync(target) || !fs.statSync(target).isFile()) throw new Error(`${source}: 媒体文件不存在 ${value}`);
}

const settings = read('content/site.json');
validateSite(settings);
for (const key of ['avatar', 'bannerDesktop', 'bannerMobile']) mediaExists(settings[key], `site.${key}`);
let count = 0;
for (const kind of ['music', 'artists', 'movies', 'series', 'games', 'works']) {
  const ids = new Set();
  for (const file of fs.readdirSync(path.join(root, 'content', kind)).filter(file => file.endsWith('.json'))) {
    const source = `content/${kind}/${file}`;
    const value = read(source);
    validateEntry(value, kind, source);
    if (ids.has(value.id)) throw new Error(`${source}: 编号重复 ${value.id}`);
    ids.add(value.id);
    mediaExists(value.cover, source);
    for (const photo of value.photos ?? []) mediaExists(photo, source);
    count++;
  }
}
console.log(`内容校验通过：站点资料及 ${count} 条收藏 / 作品。`);
