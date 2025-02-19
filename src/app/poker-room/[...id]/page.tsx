import PokerRoom from "@/components/PokerRoom";
import Link from "next/link";
import React from "react";

interface Props {
  params: {
    id: string;
  };
}

const page = async ({ params }: Props) => {
  const { id } = await params;
  return (
    <div>
      <PokerRoom id={id} />
    </div>
  );
};

export default page;
