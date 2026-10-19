// Apply the monochrome palette before the first paint, using the theme's own roles.
export function patchInitialTheme(source) {
 const marker = "const theme = localStorage.getItem('theme') || DEFAULT_THEME;";
 if (!source.includes(marker)) throw new Error("Initial theme script was not found.");
 return source.replace('import { Font }', 'import { resolveScheme } from "@utils/mc-utils";\nimport { Font }')
  .replace('const configHue = siteConfig.themeColor.hue;', `const configHue = siteConfig.themeColor.hue;
const initialMonoPalettes = Object.fromEntries((["2021", "2025"] as const).map(spec => [spec, {
 light: resolveScheme(configHue, false, "monochrome", spec),
 dark: resolveScheme(configHue, true, "monochrome", spec),
}]));`)
  .replace('configHue, lightTheme, darkTheme,', 'configHue, initialMonoPalettes, initialStyle:siteConfig.themeColor.style, initialSpec:siteConfig.themeColor.spec, lightTheme, darkTheme,')
  .replace("document.documentElement.setAttribute('data-theme', isDark ? darkTheme : lightTheme);", `document.documentElement.setAttribute('data-theme', isDark ? darkTheme : lightTheme);
   if ((localStorage.getItem('mc-style') || initialStyle) === 'monochrome') {
    const spec = localStorage.getItem('mc-spec') || initialSpec;
    const palette = initialMonoPalettes[spec === '2021' ? '2021' : '2025'][isDark ? 'dark' : 'light'];
    for (const [role, value] of Object.entries(palette)) {
     if (value) document.documentElement.style.setProperty('--mc-' + role.replace(/[A-Z]/g, c => '-' + c.toLowerCase()), value);
    }
   }`);
}
