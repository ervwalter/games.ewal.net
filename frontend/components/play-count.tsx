import React from "react";

const PlayCount = React.memo(function PlayCount({ plays }: { plays?: number }) {
  if (plays && plays > 0) {
    return (
      <span className="whitespace-nowrap">
        <span className="hidden lg:inline">Played </span>
        <b className="font-semibold">{plays}</b> time{plays > 1 ? "s" : ""}
      </span>
    );
  } else {
    return <span>—</span>;
  }
});

export default PlayCount;
