import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="flex flex-col justify-center space-y-6 items-center h-screen">
      <Link href="/init-data">init data</Link>
      <Link href={"/create-poker-room"}>create poker room</Link>
    </div>
  );
};

export default page;
