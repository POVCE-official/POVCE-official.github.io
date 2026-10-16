import type { NavBarConfig, NavBarLink } from "@/types/navBarConfig";
export const navBarConfig: NavBarConfig = { links: [
 {name:"Home",url:"/",icon:"material-symbols:home-outline-rounded",pageKey:"home"},
 {name:"Music",url:"/music/",icon:"material-symbols:headphones-rounded",pageKey:"music"},
 {name:"Media",url:"/media/",icon:"material-symbols:movie-outline-rounded",pageKey:"media"},
 {name:"Game",url:"/games/",icon:"material-symbols:sports-esports-outline-rounded",pageKey:"games"},
 {name:"About",url:"/about/",icon:"material-symbols:person-outline-rounded",pageKey:"about"},
] };
export const LinkPresets: Record<string, NavBarLink> = Object.fromEntries(navBarConfig.links.map(link => [link.pageKey === "home" ? "Home" : link.pageKey === "about" ? "About" : link.pageKey === "games" ? "Games" : link.pageKey!, link]));
