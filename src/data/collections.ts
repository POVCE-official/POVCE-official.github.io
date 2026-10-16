import {settings} from "./site-settings";
import {validateEntry} from "../../scripts/content-validation.mjs";
import {newestFirst} from "../../scripts/collection-order.mjs";
export {settings};
export type CollectionKind = "music" | "artists" | "movies" | "series" | "games";
export interface CollectionEntry {
 id: string; kind: CollectionKind; title: string; creator?: string;
 year?: string; status?: string; note?: string; tags?: string[];
 cover?: string; url?: string; date: string; draft?: boolean;
 artistType?: "Solo" | "Band"; photos?: string[];
}
const files = import.meta.glob<Record<string, unknown>>("../../content/{music,artists,movies,series,games}/*.json", {eager:true,import:"default"});
export const collections: CollectionEntry[] = Object.entries(files).map(([file,value])=>{
 const kind=file.split("/").at(-2) as CollectionKind;
 validateEntry(value,kind,file);
 return {...value,kind} as unknown as CollectionEntry;
}).filter(entry=>!entry.draft).sort(newestFirst);

export const shelves = [
 {kind:"music", title:"Music", english:"SOUND ROOM", href:"/music/", icon:"material-symbols:headphones-rounded", description:"Songs · Artists", kinds:["music","artists"]},
 {kind:"movies", title:"Media", english:"SCREEN ROOM", href:"/media/", icon:"material-symbols:movie-outline-rounded", description:"Movie · Series", kinds:["movies","series"]},
 {kind:"games", title:"Game", english:"PLAY ROOM", href:"/games/", icon:"material-symbols:sports-esports-outline-rounded", description:"走过的世界，和未完的冒险。", kinds:["games"]},
];
export const sectionConfig = {
 music:{title:"Music",sub:"Songs",description:"一首歌、一张专辑，和反复按下播放的瞬间。",href:"/music/",page:"albums" as const,statuses:["常听","在听","想听"],empty:"还没有收录歌曲",icon:"material-symbols:headphones-rounded"},
 artists:{title:"Music",sub:"Artists",description:"喜欢的艺人、团队，和想收藏的每一个瞬间。",href:"/music/artists/",page:"albums" as const,statuses:["Solo","Band"],empty:"还没有收录艺人",icon:"material-symbols:person-outline-rounded"},
 movies:{title:"Media",sub:"Movie",description:"留住电影散场后，仍想回看的故事。",href:"/media/",page:"anime" as const,statuses:["已看","在看","想看"],empty:"还没有收录电影",icon:"material-symbols:movie-outline-rounded"},
 series:{title:"Media",sub:"Series",description:"剧集与番剧，慢慢追完，也慢慢收藏。",href:"/media/series/",page:"anime" as const,statuses:["已看","在看","想看"],empty:"还没有收录剧集或番剧",icon:"material-symbols:live-tv-rounded"},
 games:{title:"Game",sub:"",description:"走过的世界、未完的冒险，和手柄里的时光。",href:"/games/",page:"games" as const,statuses:["在玩","已通关","想玩","搁置"],empty:"还没有收录游戏",icon:"material-symbols:sports-esports-outline-rounded"},
};
export const copy = {
 label:"PERSONAL ARCHIVE", title:settings.homeTitle, description:settings.homeDescription,
 browse:"进入收藏", unit:"条收藏", latest:"Recently collected", latestHint:"收藏室刚刚开门，等待第一份喜欢。", empty:"收藏夹还是空的", home:"Home", all:"All", search:"搜索标题、创作者或标签", noResults:"没有找到匹配的收藏", link:"查看详情", aboutTitle:settings.aboutTitle, aboutText:settings.aboutText, aboutMore:settings.aboutMore, works:"设计作品", worksText:"偶尔做点设计，把完成的东西留在这里。", worksEmpty:"作品正在整理中。", notFound:"这个角落还没有内容。", notFoundTitle:"页面未找到", noteLabel:"收藏笔记",
};
export interface DesignWork {id:string;title:string;description:string;url?:string;cover?:string;date?:string;draft?:boolean;}
const workFiles=import.meta.glob<Record<string,unknown>>("../../content/works/*.json",{eager:true,import:"default"});
export const works:DesignWork[]=Object.entries(workFiles).map(([file,value])=>{validateEntry(value,"works",file);return value as unknown as DesignWork;}).filter(work=>!work.draft).sort(newestFirst);
