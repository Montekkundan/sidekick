import { ImageResponse } from "next/og";

async function loadAssets(): Promise<
  { name: string; data: Buffer; weight: 400 | 600; style: "normal" }[]
> {
  const [
    { base64Font: normal },
    { base64Font: mono },
    { base64Font: semibold },
  ] = await Promise.all([
    import("./geist-regular-otf.json").then((mod) => mod.default || mod),
    import("./geistmono-regular-otf.json").then((mod) => mod.default || mod),
    import("./geist-semibold-otf.json").then((mod) => mod.default || mod),
  ]);

  return [
    {
      name: "Geist",
      data: Buffer.from(normal, "base64"),
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "Geist Mono",
      data: Buffer.from(mono, "base64"),
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "Geist",
      data: Buffer.from(semibold, "base64"),
      weight: 600 as const,
      style: "normal" as const,
    },
  ];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title");
  const description = searchParams.get("description");

  const [fonts] = await Promise.all([loadAssets()]);

  return new ImageResponse(
    <div
      className="flex h-full w-full bg-black text-white"
      style={{ fontFamily: "Geist Sans" }}
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
            fontSize: title && title.length > 20 ? 64 : 80,
            letterSpacing: "-0.04em",
          }}
        >
          {title}
        </div>
        <div
          className="flex-grow-1 text-[40px] text-stone-400 leading-[1.5]"
          style={{
            fontWeight: 500,
            textWrap: "balance",
          }}
        >
          {description}
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 628,
      fonts,
    }
  );
}
