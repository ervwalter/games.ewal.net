export function Title({ quarters, dimes, nickels }: { quarters?: number; dimes?: number; nickels?: number }) {
  return (
    <h2 className="flex w-fit flex-col gap-4 md:flex-row md:items-center md:gap-6">
      <div className="flex-none text-xl font-semibold">Most Played Games</div>
      <div className="flex flex-none flex-row gap-4">
        <div className="flex flex-none flex-row items-center gap-2">
          <div className="flex-none rounded border border-gray-200 bg-nickels py-1 px-2 text-sm">
            {nickels ?? "..."}
          </div>
          <div>nickels</div>
        </div>
        <div className="flex flex-none flex-row items-center gap-2">
          <div className="flex-none rounded border border-gray-200 bg-dimes py-1 px-2 text-sm">{dimes ?? "..."}</div>
          <div>dimes</div>
        </div>
        <div className="flex flex-none flex-row items-center gap-2">
          <div className="flex-none rounded border border-gray-200 bg-quarters py-1 px-2 text-sm">
            {quarters ?? "..."}
          </div>
          <div>quarters</div>
        </div>
      </div>
    </h2>
  );
}
