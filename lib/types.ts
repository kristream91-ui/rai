export type TitleType = "movie" | "show";

export interface Title {
  /** Stable slug, also used as the Firestore document id. */
  id: string;
  title: string;
  type: TitleType;
  year: number;
  genres: string[];
  language: string;
  platform: string;
  releaseDate?: string;
  featured?: boolean;
  tagline?: string;
  sections: string[];
  synopsis: string;
  /** Optional real poster image. When absent the card draws a generated poster. */
  posterUrl?: string;
}

export interface Section {
  key: string;
  heading: string;
  blurb: string;
}
