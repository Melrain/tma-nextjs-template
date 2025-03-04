"use client";

import React from "react";

interface playerTechnicalData {
  vpip: number;
  pfr: number;
  threeBet: number;
  wtsd: number;
}

const PlayerTechData = ({ vpip, pfr, threeBet, wtsd }: playerTechnicalData) => {
  return (
    <div className="rounded-full bg-black">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <div className="text-white">VPIP</div>
          <div className="text-white">{vpip}</div>
        </div>
        <div className="flex flex-col">
          <div className="text-white">PFR</div>
          <div className="text-white">{pfr}</div>
        </div>
        <div className="flex flex-col">
          <div className="text-white">3B</div>
          <div className="text-white">{threeBet}</div>
        </div>
        <div className="flex flex-col">
          <div className="text-white">WTSD</div>
          <div className="text-white">{wtsd}</div>
        </div>
      </div>
    </div>
  );
};

export default PlayerTechData;
