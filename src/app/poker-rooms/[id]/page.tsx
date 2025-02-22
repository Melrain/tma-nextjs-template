import PokerRoom from "@/components/shared/PokerRoom";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return (
    <div>
      <PokerRoom id={id} />
    </div>
  );
}
