import { defineConfig } from "astro/config";
import shirones from "shirones";
import {fileURLToPath} from "node:url";
import {readFile} from "node:fs/promises";
import {patchInitialTheme} from "./scripts/initial-theme.mjs";
export default defineConfig({
 vite:{plugins:[{
  name:"archive-banner-restart-delay",
  enforce:"pre",
  async load(id){
   if(id.replaceAll("\\","/").endsWith("/layouts/Layout.astro")) return patchInitialTheme(await readFile(id,"utf8"));
   if(!id.replaceAll("\\","/").endsWith("/components/organisms/BannerStage.astro")) return;
   const source=await readFile(id,"utf8");
   const restart=/(textIndex = \(textIndex \+ 1\) % texts\.length;\s*runtime\.subtitleTimer = window\.setTimeout\(step, )speed(\);)/;
   if(!restart.test(source)) throw new Error("Banner subtitle restart timer was not found.");
   return source.replace(restart,"$1speed + 3000$2");
  },
 }]},
 integrations:[shirones({injectRoutes:false,pagefind:false}),{
  name:"archive-navigation",
  hooks:{"astro:config:setup":({updateConfig})=>updateConfig({vite:{resolve:{alias:[{find:/^@utils\/nav-utils(?:\.ts)?$/,replacement:fileURLToPath(new URL("./src/utils/nav-utils.ts",import.meta.url))}]}}})},
 }],
});
