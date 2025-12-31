import { SidekickStandalone } from "@/registry/new-york/blocks/sidekick-01/components/sidekick-standalone"

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SidekickStandalone />
      </div>
    </div>
  )
}
