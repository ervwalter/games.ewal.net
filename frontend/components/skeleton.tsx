import clsx from "clsx";
import { ReactNode } from "react";

type SkeletonProps = {
  className?: string;
  animate?: boolean;
  children: ReactNode;
};

type SkeletonRowProps = {
  className?: string;
};

export function Skeleton({
  className = "",
  animate = true,
  children,
}: SkeletonProps) {
  return (
    <div role="status" className={clsx(animate && "animate-pulse", className)}>
      {children}
    </div>
  );
}

export function SkeletonRow({ className = "" }: SkeletonRowProps) {
  return (
    <div
      className={clsx("mt-[0.7em] h-[0.8em] rounded-md bg-gray-200", className)}
    >
      &nbsp;
    </div>
  );
}
