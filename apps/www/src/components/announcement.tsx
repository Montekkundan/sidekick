import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/registry/new-york/ui/badge";

export function Announcement() {
  return (
    <Badge asChild className="bg-transparent" variant="secondary">
      <Link href="/docs/builder/widget-builder">
        <span className="flex size-2 rounded-full bg-blue-500" title="New" />
        Builder to create widgets <ArrowRightIcon />
      </Link>
    </Badge>
  );
}
