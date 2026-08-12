import { CheckAd } from "@/components/ad";
import { getActiveDirectoryInfo } from "@/services/ad";

export default async function CheckAdPage({ params }: { params: Promise<{ sciper: string }> }) {
  const { sciper } = await params;
  const info = await getActiveDirectoryInfo(sciper);

  return (
    <div className="flex flex-col items-center px-6 py-6">
      <CheckAd sciper={sciper} info={info} />
    </div>
  );
}
