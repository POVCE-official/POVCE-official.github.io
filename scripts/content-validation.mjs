export const statuses = {
  music: ['常听', '在听', '想听'],
  movies: ['已看', '在看', '想看'],
  games: ['在玩', '已通关', '想玩', '搁置'],
};

function fail(source, message) { throw new Error(`${source}: ${message}`); }
function object(value, source) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(source, '内容必须是对象');
}
function text(value, source, required = false) {
  if (!required && (value === undefined || value === null || value === '')) return;
  if (typeof value !== 'string' || (required && !value.trim())) fail(source, '请填写有效文字');
}

/** Allow web links and site-local media paths, never executable URL schemes. */
export function validateUrl(value, source, local = false, required = false) {
  text(value, source, required);
  if (value === undefined || value === null || value === '') return;
  if (local && typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')) {
    if (value.includes('\\') || value.split('/').includes('..') || /[?#]/.test(value)) fail(source, '请使用站内媒体文件路径');
    return;
  }
  let url;
  try { url = new URL(value); } catch { fail(source, '请使用有效的 http(s) 链接'); }
  if (!['https:', 'http:'].includes(url.protocol) || !url.hostname || url.username || url.password) fail(source, '请使用有效的 http(s) 链接');
}

export function validateEntry(value, kind, source) {
  object(value, source);
  if (!(kind in statuses) && kind !== 'works') fail(source, '未知的收藏类型');
  text(value.id, `${source}.id`, true);
  if (!/^[a-zA-Z0-9_-]+$/.test(value.id)) fail(source, '编号只能包含字母、数字、短横线和下划线');
  text(value.title, `${source}.title`, true);
  text(value.date, `${source}.date`, true);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value.date) || !Number.isFinite(Date.parse(value.date)) || new Date(value.date).toISOString().slice(0, 10) !== value.date) fail(source, '收录日期须为有效的 YYYY-MM-DD 日期');
  if (value.draft !== undefined && typeof value.draft !== 'boolean') fail(source, '暂不展示必须是开关值');
  for (const key of ['creator', 'year', 'note', 'description']) text(value[key], `${source}.${key}`);
  if (kind !== 'works' && !statuses[kind].includes(value.status)) fail(source, '收藏状态与分类不匹配');
  if (value.tags != null && (!Array.isArray(value.tags) || value.tags.some(tag => typeof tag !== 'string'))) fail(source, '标签必须为文字列表');
  validateUrl(value.url, `${source}.url`);
  validateUrl(value.cover, `${source}.cover`, true);
}

export function validateSite(value, source = 'content/site.json') {
  object(value, source);
  for (const key of ['title', 'subtitle', 'bannerTitle', 'bannerSubtitle', 'name', 'bio', 'homeTitle', 'homeDescription', 'aboutTitle', 'aboutText']) text(value[key], `${source}.${key}`, true);
  text(value.aboutMore, `${source}.aboutMore`);
  if (typeof value.themeHue !== 'number' || !Number.isFinite(value.themeHue) || value.themeHue < 0 || value.themeHue > 360) fail(source, '主题色相必须在 0–360 之间');
  validateUrl(value.avatar, `${source}.avatar`, true, true);
  validateUrl(value.bannerDesktop, `${source}.bannerDesktop`, true);
  validateUrl(value.bannerMobile, `${source}.bannerMobile`, true);
  validateUrl(value.githubUrl, `${source}.githubUrl`, false, true);
  if (new URL(value.githubUrl).hostname !== 'github.com') fail(source, 'GitHub 主页须使用 github.com');
}
