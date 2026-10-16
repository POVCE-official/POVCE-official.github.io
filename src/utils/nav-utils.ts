import {resolvePageKey as themePageKey} from "shirones/src/utils/nav-utils.ts";
export {resolveNavBarLinks, pruneUnavailableNavLinks} from "shirones/src/utils/nav-utils.ts";
export type {ResolvedNavBarLink} from "shirones/src/utils/nav-utils.ts";

export function resolvePageKey(url: Pick<URL, "pathname" | "searchParams">, baseUrlOverride?: string): string {
 const base = (baseUrlOverride ?? import.meta.env.BASE_URL ?? "/").replace(/\/+$/, "");
 const path = base && url.pathname.startsWith(base + "/") ? url.pathname.slice(base.length) : url.pathname;
 if (path === "/music" || path.startsWith("/music/")) return "music";
 if (path === "/media" || path.startsWith("/media/") || path === "/movies" || path === "/movies/") return "media";
 return themePageKey(url, baseUrlOverride);
}
