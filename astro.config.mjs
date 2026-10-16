import { defineConfig } from "astro/config";
import shirones from "shirones";
import {fileURLToPath} from "node:url";
export default defineConfig({
 integrations:[shirones({injectRoutes:false,pagefind:false}),{
  name:"archive-navigation",
  hooks:{"astro:config:setup":({updateConfig})=>updateConfig({vite:{resolve:{alias:[{find:/^@utils\/nav-utils(?:\.ts)?$/,replacement:fileURLToPath(new URL("./src/utils/nav-utils.ts",import.meta.url))}]}}})},
 }],
});
