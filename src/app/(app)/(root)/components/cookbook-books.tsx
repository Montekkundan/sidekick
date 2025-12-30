"use client";

import { Book } from "@/components/book";
import { HandHelping } from "lucide-react";
import Image from "next/image";

export function CookbookBooks() {
  return (
    <div className="flex justify-center items-center gap-8 mt-16 flex-wrap">
        <Book
            color="#9D2127"
            textColor="#ece4db"
            textured
            title="Design Engineering at Vercel"
            variant="simple"
          />
           <Book color="#7DC1C1" textured title="Design Engineering at Vercel" />
 <Book
            color="#7DC1C1"
            textColor="white"
            textured
            title="Design Engineering at Vercel"
            variant="simple"
          />
 
     <Book color="#7DC1C1" textured title="Design Engineering at Vercel" />
      <Book color="#7DC1C1" textured title="Design Engineering at Vercel" />
    </div>
  );
}
