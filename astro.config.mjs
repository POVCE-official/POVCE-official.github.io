import { defineConfig } from "astro/config";
import shirones from "shirones";
export default defineConfig({integrations:[shirones({injectRoutes:false,pagefind:false})]});
