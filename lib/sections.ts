import type { Section } from "./types";

export const SECTIONS: Section[] = [
  {
    key: "talk-of-the-town",
    heading: "Talk Of The Town",
    blurb: "What everyone is watching and arguing about this week.",
  },
  {
    key: "editors-pick",
    heading: "Editor's Pick Of The Week",
    blurb: "Hand-picked by the Rai desk.",
  },
  {
    key: "prime",
    heading: "Worth Watching on Prime",
    blurb: "Prime Video titles that earn the subscription.",
  },
  {
    key: "crunchyroll",
    heading: "Worth Watching on Crunchyroll",
    blurb: "Anime worth clearing the weekend for.",
  },
  {
    key: "apple-tv",
    heading: "Worth Watching on Apple TV",
    blurb: "Apple's quality-over-quantity catalogue.",
  },
];

export const PLATFORMS = [
  "Prime Video",
  "Crunchyroll",
  "Apple TV",
  "Netflix",
  "Theatres",
] as const;

export const LANGUAGES = [
  "Hindi",
  "English",
  "Tamil",
  "Telugu",
  "Japanese",
] as const;

export function sectionByKey(key: string): Section | undefined {
  return SECTIONS.find((section) => section.key === key);
}
