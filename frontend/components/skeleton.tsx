import clsx from "clsx";
import { ReactNode } from "react";

type SkeletonWrapperProps = {
  className?: string;
  animate?: boolean;
  children: ReactNode;
};

type SkeletonProps = {
  className?: string;
};

export function SkeletonWrapper({ className = "", animate = true, children }: SkeletonWrapperProps) {
  return (
    <div role="status" className={clsx(animate && "animate-pulse", className, "animate-delayed-fade-in opacity-0")}>
      {children}
    </div>
  );
}

export function SkeletonPieChart({ className }: SkeletonProps) {
  return (
    <div className={clsx("text-gray-200", className)}>
      <svg viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M0 7.49996C0 3.52583 3.09098 0.27365 7 0.0163574V4.0354C5.30385 4.27801 4 5.73672 4 7.49996C4 9.43295 5.567 11 7.5 11C8.28618 11 9.01181 10.7407 9.5961 10.3031L12.438 13.1451C11.1188 14.3 9.39113 15 7.5 15C3.35786 15 0 11.6421 0 7.49996Z"
          fill="currentColor"
        />
        <path
          d="M13.1451 12.438C14.3001 11.1187 15 9.39107 15 7.49996C15 6.46644 14.7909 5.48175 14.4128 4.58586L10.7552 6.21147C10.9132 6.61024 11 7.04496 11 7.49996C11 8.28611 10.7408 9.01174 10.3032 9.59602L13.1451 12.438Z"
          fill="currentColor"
        />
        <path
          d="M8 4.0354V0.0163574C10.5416 0.183645 12.7373 1.61699 13.9626 3.69166L10.2541 5.33986C9.71063 4.64791 8.91203 4.16585 8 4.0354Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

export function SkeletonBarChart({ className }: SkeletonProps) {
  return (
    <div className={clsx("text-gray-200", className)}>
      <svg viewBox="0 0 493.1 493.1" xmlns="http://www.w3.org/2000/svg">
        <g>
          <path
            d="M0,475.6v-231c0-9.2,7.5-16.7,16.7-16.7h95.7c9.2,0,16.7,7.5,16.7,16.7v231c0,9.2-7.5,16.7-16.7,16.7H16.8
			C7.5,492.4,0,484.9,0,475.6z M476.4,120.601c9.2,0,16.7,7.5,16.7,16.7v338.3c0,9.2-7.5,16.7-16.7,16.7h-95.7
			c-9.2,0-16.7-7.5-16.7-16.7v-338.3c0-9.2,7.5-16.7,16.7-16.7H476.4z M458.6,155.201h-60v302.5h60V155.201z M311.2,17.4v458.3
			c0,9.2-7.5,16.7-16.7,16.7h-95.7c-9.2,0-16.7-7.5-16.7-16.7V17.4c0-9.2,7.5-16.7,16.7-16.7h95.7C303.7,0.6,311.2,8.1,311.2,17.4z
			 M216.6,77l41.8-41.8h-41.8V77z M276.6,415.8l-42,42h42V415.8z M276.6,327.5l-60,60v42.7l60-60V327.5z M276.6,239.201l-60,60v42.7
			l60-60V239.201z M276.6,150.9l-60,60v42.7l60-60V150.9z M276.6,62.6l-60,60v42.7l60-60V62.6z"
            fill="currentColor"
          />
        </g>
      </svg>
    </div>
  );
}

export function SkeletonRow({ className = "" }: SkeletonProps) {
  return <div className={clsx("my-[0.35em] h-[0.8em] rounded-md bg-gray-200", className)}>&nbsp;</div>;
}

export function SkeletonText({ className = "" }: SkeletonProps) {
  return <div className={clsx("mt-[0.7em] h-[0.8em] rounded-md bg-gray-200", className)}>&nbsp;</div>;
}

export function SkeletonImage({ className = "" }: SkeletonProps) {
  return (
    <div className={clsx(className, "flex items-center justify-center rounded-sm bg-gray-300")}>
      <svg
        className="h-12 w-12 text-gray-200"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        fill="currentColor"
        viewBox="0 0 640 512">
        <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
      </svg>
    </div>
  );
}
