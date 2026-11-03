import HeroCarousel from "@/components/HeroCarousel";
import Row from "@/components/Row";
import { getAllTitles, getFeaturedTitles, getTitlesBySection } from "@/lib/content";
import { SECTIONS } from "@/lib/sections";

export const revalidate = 300;

export default async function HomePage() {
  const [featured, ...rows] = await Promise.all([
    getFeaturedTitles(),
    ...SECTIONS.map(async (section) => ({
      section,
      titles: await getTitlesBySection(section.key),
    })),
  ]);

  const all = await getAllTitles();

  return (
    <div className="animate-fade-up">
      <HeroCarousel titles={featured} />

      {rows.map(({ section, titles }) => (
        <Row
          key={section.key}
          heading={section.heading}
          blurb={section.blurb}
          titles={titles}
          href={`/browse?section=${section.key}`}
        />
      ))}

      <p className="mt-12 text-center text-xs text-muted">
        {all.length} titles in the Rai catalogue. Data comes from Firestore when it is
        configured, otherwise from the bundled seed file.
      </p>
    </div>
  );
}
