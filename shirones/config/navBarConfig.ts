import type { NavBarConfig, NavBarLink } from "@/types/navBarConfig";
export const navBarConfig: NavBarConfig = { links: [
 {name:"首页",url:"/",icon:"material-symbols:home-outline-rounded",pageKey:"home"},
 {name:"音乐",url:"/music/",icon:"material-symbols:headphones-rounded",pageKey:"music"},
 {name:"影视",url:"/movies/",icon:"material-symbols:movie-outline-rounded",pageKey:"movies"},
 {name:"游戏",url:"/games/",icon:"material-symbols:sports-esports-outline-rounded",pageKey:"games"},
 {name:"关于",url:"/about/",icon:"material-symbols:person-outline-rounded",pageKey:"about"},
] };
export const LinkPresets: Record<string, NavBarLink> = Object.fromEntries(navBarConfig.links.map(link => [link.pageKey === "home" ? "Home" : link.pageKey === "about" ? "About" : link.pageKey === "games" ? "Games" : link.pageKey!, link]));
