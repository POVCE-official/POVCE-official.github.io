import type { ProfileConfig } from "@/types/config";
import settings from "../../content/site.json";
export const profileConfig: ProfileConfig = {
 avatar: settings.avatar, name: settings.name, bio: settings.bio,
 links: [{ name: "GitHub", icon: "fa6-brands:github", url: settings.githubUrl }],
};
