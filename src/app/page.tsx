import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="">
      <p className="flex justify-center items-center text-3xl">
        Welcome to poker game
      </p>
      <Link href="/init-data">init data</Link>
      <Link href={"/create-poker-room"}>create poker room</Link>
    </div>
  );
};

export default page;
