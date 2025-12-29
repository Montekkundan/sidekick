"use client";

import { useState } from "react";
import { AskAIButton, AskAILabel } from "@/registry/new-york/blocks/ask-ai";

export default function AskAIDemo() {
  const [clicked, setClicked] = useState(false);

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <AskAILabel />
      <AskAIButton
        onClick={() => {
          setClicked(!clicked);
          // eslint-disable-next-line no-console
          console.log("Ask AI clicked!");
        }}
      />
      {clicked === true && (
        <p className="text-center text-muted-foreground text-sm">
          AI chat interface would open here
        </p>
      )}
    </div>
  );
}
