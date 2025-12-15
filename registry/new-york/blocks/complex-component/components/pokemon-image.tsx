"use client";

/* eslint-disable @next/next/no-img-element */
import { usePokemonImage } from "@/registry/new-york/blocks/complex-component/hooks/use-pokemon";

export function PokemonImage({
  name,
  number,
}: {
  name: string;
  number: number;
}) {
  const imageUrl = usePokemonImage(number);

  if (!imageUrl) {
    return null;
  }

  return <img alt={name} src={imageUrl} />;
}
