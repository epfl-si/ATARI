import { PersonDetails } from "@/components/person";

export default async function PersonPage({ params }: { params: Promise<{ sciper: string }> }) {
  const { sciper } = await params;

  return <PersonDetails sciper={sciper} />;
}
