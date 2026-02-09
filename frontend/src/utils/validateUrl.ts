// Supported platforms
type Platform = "linkedin" | "instagram" | "tiktok" | "youtube";

// URL patterns for each platform
const socialMediaPatterns: Record<Platform, RegExp> = {
  linkedin:
    /^(https?:\/\/)?(www\.)?linkedin\.com\/(pub|in|profile|company)\/[A-Za-z0-9_-]+\/?$/i,
  instagram: /^(https?:\/\/)?(www\.)?instagram\.com\/[A-Za-z0-9._-]+\/?$/i,
  tiktok: /^(https?:\/\/)?(www\.)?tiktok\.com\/(@?[A-Za-z0-9._-]+)\/?$/i,
  youtube:
    /^(https?:\/\/)?(www\.)?(youtube\.com\/(channel|user|c)\/[A-Za-z0-9_-]+\/?|youtu\.be\/[A-Za-z0-9_-]+)\/?$/i,
};

// Validate social media URL
export const validateSocialMediaUrl = (
  platform: Platform,
  url: string
): boolean => {
  const pattern = socialMediaPatterns[platform];
  try {
    const parsedUrl = new URL(url);
    return pattern.test(parsedUrl.href);
  } catch {
    return false; // Invalid URL
  }
};

// export const validateUrl = (url: string) => {
//   const validVideoHosts = [
//     "youtube.com",
//     "youtu.be",
//     // "vimeo.com",
//     "tiktok.com",
//     // "dailymotion.com",
//     // "facebook.com",
//     "instagram.com",
//     "linkedin.com"
//     // "twitter.com",
//     // "x.com",
//     // "twitch.tv",
//     // "reddit.com",
//   ];

//   try {
//     const parsedUrl = new URL(url);
//     // return validVideoHosts.some((host) => parsedUrl.hostname.includes(host));
//     return validVideoHosts.some((host) => parsedUrl.hostname.endsWith(host));
//   } catch (e) {
//     return false; // Invalid URL
//   }
// };
