import { CheckInventory } from "@/components/inventory";

export default async function InventoryCodePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  return (
    <div className="flex flex-col items-center px-6 py-6">
      <CheckInventory initialCode={code} />
    </div>
  );
}
