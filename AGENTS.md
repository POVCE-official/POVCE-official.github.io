# POVCE archive

Personal Chinese-language collection site using the official Shirone npm package.

- Keep music, film/TV/anime, and games as the main navigation. Do not add a blog or essays section.
- Keep design work secondary, linked from the footer and About.
- Personal content lives in `content/` JSON files, editable through Pages CMS using `.pages.yml`. Interface labels and loading logic live in `src/data/collections.ts`. Never invent personal favorites or ratings.
- When adding multiple entries from the same film, anime, TV or game series, merge them using the existing collection group fields; retain each entry's own collection date, metadata and destination link.
- Theme overrides belong in `shirones/config`, `src/components`, or `src/layouts`; never edit `node_modules`.
- Use Shirone semantic color, shape, typography, and motion tokens. Honor reduced motion.
- Keep rendered content usable without JavaScript; verify direct loads and Swup navigation for interactive changes.
- Run `pnpm test`, `pnpm check` and `pnpm build` before publishing.
- Deployment is GitHub Pages through `.github/workflows/deploy.yml` on main.
- Use conventional commits. Publish only requested changes.
