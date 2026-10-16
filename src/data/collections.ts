import {settings} from "./site-settings";
import { validateEntry } from "../../scripts/content-validation.mjs";
export {settings};
export type CollectionKind = "music" | "movies" | "games";
export interface CollectionEntry {
 id: string; kind: CollectionKind; title: string; creator?: string;
 year?: string; status: string; note: string; tags?: string[];
 cover?: string; url?: string; date?: string; draft?: boolean;
}
const files = import.meta.glob<Record<string, unknown>>("../../content/{music,movies,games}/*.json", {eager:true,import:"default"});
export const collections: CollectionEntry[] = Object.entries(files).map(([file,value])=>{
 const kind=file.split("/").at(-2) as CollectionKind;
 validateEntry(value,kind,file);
 return {...value,kind} as unknown as CollectionEntry;
}).filter(entry=>!entry.draft).sort((a,b)=>(b.date??"").localeCompare(a.date??"")||a.id.localeCompare(b.id));
export const shelves = [
 {kind:"music" as const, title:"音乐", english:"SOUND ROOM", icon:"material-symbols:headphones-rounded", description:"一首歌、一张专辑，和反复按下播放的瞬间。", empty:"还没有收录音乐", hint:"等下一首舍不得切掉的歌，成为这里的第一条收藏。", statuses:["常听","在听","想听"]},
 {kind:"movies" as const, title:"影视", english:"SCREEN ROOM", icon:"material-symbols:movie-outline-rounded", description:"电影、剧集与动画，留住值得回看的故事。", empty:"还没有收录影视", hint:"电影散场之后，想留住的那些片段会放在这里。", statuses:["已看","在看","想看"]},
 {kind:"games" as const, title:"游戏", english:"PLAY ROOM", icon:"material-symbols:sports-esports-outline-rounded", description:"走过的世界、未完的冒险，和手柄里的时光。", empty:"还没有收录游戏", hint:"下一段冒险，从这里开始存档。", statuses:["在玩","已通关","想玩","搁置"]},
];
export const copy = {
 label:"PERSONAL ARCHIVE", title:settings.homeTitle, description:settings.homeDescription,
 browse:"进入收藏", unit:"部 / 条收藏", latest:"最近收录", latestHint:"收藏室刚刚开门，等待第一份喜欢。", empty:"收藏夹还是空的", home:"返回首页", all:"全部", search:"搜索标题、创作者或标签", noResults:"没有找到匹配的收藏", link:"查看作品", aboutTitle:settings.aboutTitle, aboutText:settings.aboutText, aboutMore:settings.aboutMore, works:"设计作品", worksText:"偶尔做点设计，把完成的东西留在这里。", worksEmpty:"作品正在整理中。", notFound:"这个角落还没有内容。", notFoundTitle:"页面未找到", noteLabel:"收藏笔记",
};
export interface DesignWork {id:string;title:string;description:string;url?:string;cover?:string;date?:string;draft?:boolean;}
const workFiles=import.meta.glob<Record<string,unknown>>("../../content/works/*.json",{eager:true,import:"default"});
export const works:DesignWork[]=Object.entries(workFiles).map(([file,value])=>{validateEntry(value,"works",file);return value as unknown as DesignWork;}).filter(work=>!work.draft).sort((a,b)=>(b.date??"").localeCompare(a.date??"")||a.id.localeCompare(b.id));
