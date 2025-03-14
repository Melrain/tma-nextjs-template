import Welcome from "@/components/Welcome";
import React from "react";

const page = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-6">
      <Welcome />
    </div>
  );
};

export default page;
