import { cache } from "react";
import { collection, getDocs } from "firebase/firestore";
import localTitles from "@/data/titles.json";
import { db, TITLES_COLLECTION, useLocalData } from "./firebase";
import { SECTIONS } from "./sections";
import type { Title } from "./types";

const bundled = localTitles as Title[];

function sortTitles(titles: Title[]): Title[] {
  return [...titles].sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    return a.title.localeCompare(b.title);
  });
}

/**
 * Reads the catalogue from Firestore when it is configured, and falls back to the
 * bundled JSON on any error (missing rules, offline project, empty collection).
 */
export const getAllTitles = cache(async (): Promise<Title[]> => {
  if (useLocalData) return sortTitles(bundled);

  try {
    const snapshot = await getDocs(collection(db(), TITLES_COLLECTION));
    const titles = snapshot.docs.map((doc) => ({ ...(doc.data() as Title), id: doc.id }));
    if (!titles.length) return sortTitles(bundled);
    return sortTitles(titles);
  } catch (error) {
    console.warn("[rai] Firestore read failed, using bundled data:", error);
    return sortTitles(bundled);
  }
});

export async function getTitlesBySection(key: string): Promise<Title[]> {
  const titles = await getAllTitles();
  return titles.filter((title) => title.sections?.includes(key));
}

export async function getFeaturedTitles(): Promise<Title[]> {
  const titles = await getAllTitles();
  const featured = titles.filter((title) => title.featured);
  return featured.length ? featured.slice(0, 6) : titles.slice(0, 6);
}

export async function getTitleById(id: string): Promise<Title | undefined> {
  const titles = await getAllTitles();
  return titles.find((title) => title.id === id);
}

export async function getRelatedTitles(title: Title, limit = 6): Promise<Title[]> {
  const titles = await getAllTitles();
  return titles
    .filter((candidate) => candidate.id !== title.id)
    .map((candidate) => ({
      candidate,
      score:
        (candidate.platform === title.platform ? 2 : 0) +
        candidate.genres.filter((genre) => title.genres.includes(genre)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.candidate);
}

export async function searchTitles(query: string): Promise<Title[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const titles = await getAllTitles();
  return titles.filter((title) => {
    const haystack = [
      title.title,
      title.synopsis,
      title.platform,
      title.language,
      title.type,
      ...title.genres,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

export async function getAllGenres(): Promise<string[]> {
  const titles = await getAllTitles();
  const genres = new Set<string>();
  titles.forEach((title) => title.genres.forEach((genre) => genres.add(genre)));
  return [...genres].sort((a, b) => a.localeCompare(b));
}

export { SECTIONS };
