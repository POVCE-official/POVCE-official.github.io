import storedSettings from "../../content/site.json";

// Pages CMS omits empty optional fields when saving. Supply their defaults
// before theme configuration or page rendering consumes them.
const optionalSettings = storedSettings as typeof storedSettings & {
  bannerDesktop?: string | null;
  bannerMobile?: string | null;
  aboutMore?: string | null;
};

export const settings = {
  ...storedSettings,
  bannerDesktop: optionalSettings.bannerDesktop ?? "",
  bannerMobile: optionalSettings.bannerMobile ?? "",
  aboutMore: optionalSettings.aboutMore ?? "",
};
