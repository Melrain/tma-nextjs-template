import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className=" ">
      <p className="flex justify-center items-center">Welcome to poker game</p>
      <Link href="/init-data">init data</Link>
    </div>
  );
};

export default page;
