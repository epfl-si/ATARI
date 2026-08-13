import type { Metadata } from "next";
import { PersonDetails } from "@/components/person";
import { getPersonBySciper } from "@/services/person";

export async function generateMetadata({ params }: { params: Promise<{ sciper: string }> }): Promise<Metadata> {
  const { sciper } = await params;
  const person = await getPersonBySciper(sciper);
  const name = person?.name || person?.display;

  return { title: name ? `ATARI - ${name} (${sciper})` : `ATARI - ${sciper}` };
}

export default async function PersonPage({ params }: { params: Promise<{ sciper: string }> }) {
  const { sciper } = await params;

  return <PersonDetails sciper={sciper} />;
}
