"use client";

import { Dialog, Transition } from "@headlessui/react";
import { clsx } from "clsx";
import { RequireOnlyOne } from "lib/utility-types";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { Fragment, useCallback, useState } from "react";
import { IconType } from "react-icons";
import { AiFillHome } from "react-icons/ai";
import { ImBooks } from "react-icons/im";
import { IoPieChartSharp, IoRibbonSharp } from "react-icons/io5";
import { RiBarChartHorizontalFill, RiCloseLine, RiMenuLine } from "react-icons/ri";

interface NavItemBase {
  name: string;
  icon: IconType;
  href?: string;
  segment?: string;
}

// interface NavItemWithSegment extends NavItemBase {
//   href?: never;
//   segment: string;
// }

// interface NavItemWithHref extends NavItemBase {
//   href: string;
//   segment?: never;
// }

type NavItem = RequireOnlyOne<NavItemBase, "href" | "segment">;

const navigation: NavItem[] = [
  { name: "Overview", segment: "overview", icon: AiFillHome },
  { name: "Insights", segment: "insights", icon: IoPieChartSharp },
  { name: "Most Played", segment: "mostplayed", icon: RiBarChartHorizontalFill },
  { name: "Top 10", segment: "topten", icon: IoRibbonSharp },
  { name: "Collection", segment: "collection", icon: ImBooks },
];

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleClose = useCallback(() => setSidebarOpen(false), []);

  return (
    <>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 md:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full">
              <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0">
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}>
                      <span className="sr-only">Close sidebar</span>
                      <RiCloseLine className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="h-0 flex-1 space-y-3 overflow-y-auto pt-5 pb-4">
                  <Header />
                  <Tagline />
                  <nav className="mt-5 space-y-1 px-2">
                    {navigation.map((item) => (
                      <NavItem item={item} key={item.name} onClick={handleClose} />
                    ))}
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
            <div className="w-14 flex-shrink-0">{/* Force sidebar to shrink to fit close icon */}</div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-52 md:flex-col lg:w-64">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex flex-1 flex-col space-y-3 overflow-y-auto pt-5 pb-4">
            <Header />
            <Tagline />
            <nav className="mt-5 flex-1 space-y-1 bg-white px-2">
              {navigation.map((item) => (
                <NavItem item={item} key={item.name} onClick={handleClose} />
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="border-b border-gray-200 bg-gray-50 md:hidden">
          <div className="flex flex-row items-center">
            <button
              type="button"
              className="border-r border-gray-100 p-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={() => setSidebarOpen(true)}>
              <span className="sr-only">Open sidebar</span>
              <RiMenuLine className="h-6 w-6" aria-hidden="true" />
            </button>
            <Header />
          </div>
        </div>
      </div>
    </>
  );
}

function Header() {
  return (
    <div className="flex flex-shrink-0 items-center px-4 text-2xl">
      {"//"}&nbsp;<span className="text-primary">Ewal</span>
    </div>
  );
}

function Tagline() {
  return <div className="px-4 text-sm text-gray-400">Chronicles of a board game addict...</div>;
}

function NavItem({ item, onClick }: { item: NavItem; onClick: () => void }) {
  const segment = useSelectedLayoutSegment();
  if (item.segment) {
    const active = item.segment == segment;
    return <NavItemInternal active={active} item={item} href={`/${item.segment}`} onClick={onClick} />;
  } else if (item.href) {
    return <NavItemInternal active={false} item={item} href={item.href} onClick={onClick} />;
  } else {
    return null as never;
  }
}

interface NavItemInternalProps {
  href: string;
  item: NavItemBase;
  active: boolean;
  onClick: () => void;
}

function NavItemInternal({ item, href, active, onClick }: NavItemInternalProps) {
  return (
    <Link
      onClick={onClick}
      href={href}
      className={clsx(
        active ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
        "group flex items-center rounded-md px-2 py-2 text-base font-medium"
      )}>
      <item.icon
        className={clsx(
          active ? "text-gray-500" : "text-gray-400 group-hover:text-gray-500",
          "mr-4 h-6 w-6 flex-shrink-0"
        )}
        aria-hidden="true"
      />
      {item.name}
    </Link>
  );
}
