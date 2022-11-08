import React from "react";

export const Rating = React.memo(function Rating({ rating }: { rating?: number }) {
  if (rating && rating > 0) {
    //
    return (
      <div className="inline-block">
        <div className="font-semibold md:hidden">{rating}</div>
        <span className="relative hidden md:block" title={`Rating: ${rating}`}>
          <span className="flex flex-row text-gray-300">
            {/* using an icon font here since a individual svg elements for each star makes the page way to slow to render */}
            <i className="top-[1px] inline-block font-icons font-normal not-italic leading-[1] antialiased before:content-['\e9d9\e9d9\e9d9\e9d9\e9d9\e9d9\e9d9\e9d9\e9d9\e9d9']" />
          </span>
          <span
            className="absolute top-0 left-0 z-10 flex h-full w-full flex-row overflow-hidden text-orange-300"
            style={{ width: `${rating * 10}%` }}>
            {/* using an icon font here since a individual svg elements for each star makes the page way to slow to render */}
            <i className="top-[1px] inline-block font-icons font-normal not-italic leading-[1] antialiased before:content-['\e9d9\e9d9\e9d9\e9d9\e9d9\e9d9\e9d9\e9d9\e9d9\e9d9']" />
          </span>
        </span>
      </div>
    );
  } else {
    return <span>—</span>;
  }
});
