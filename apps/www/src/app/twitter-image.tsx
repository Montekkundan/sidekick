import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/config";

export const alt = "Sidekick";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "edge";

export default function Image() {
  return new ImageResponse(
    (
      <div
        className="flex h-full w-full bg-black text-white"
        style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
      >
        <div className="absolute inset-y-0 left-16 flex w-[1px] border border-stone-700 border-dashed" />
        <div className="absolute inset-y-0 right-16 flex w-[1px] border border-stone-700 border-dashed" />
        <div className="absolute inset-x-0 top-16 flex h-[1px] border border-stone-700" />
        <div className="absolute inset-x-0 bottom-16 flex h-[1px] border border-stone-700" />
        <div className="absolute right-24 bottom-24 flex flex-row text-white">
          <svg
            height={48}
            viewBox="0 0 256 256"
            width={48}
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Sidekick</title>
            <rect fill="none" height="256" width="256" />
            <line
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="32"
              x1="208"
              x2="128"
              y1="128"
              y2="208"
            />
            <line
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="32"
              x1="192"
              x2="40"
              y1="40"
              y2="192"
            />
          </svg>
        </div>
        <div className="absolute inset-32 flex w-[896px] flex-col justify-center">
          <div
            className="flex flex-grow-1 flex-col justify-center leading-[1.1] tracking-tight"
            style={{
              textWrap: "balance",
              fontWeight: 600,
              fontSize: siteConfig.name.length > 20 ? 64 : 80,
              letterSpacing: "-0.04em",
            }}
          >
            {siteConfig.name}
          </div>
          <div
            className="flex-grow-1 text-[40px] text-stone-400 leading-[1.5]"
            style={{
              fontWeight: 500,
              textWrap: "balance",
            }}
          >
            {siteConfig.description}
          </div>
        </div>
      </div>
    ),
    size
  );
}
