import { memo } from "react";
import { connectionIdToColor } from "../../utils";

const Cursor = memo(
  ({
    x,
    y,
    name,
  }: {
    x: number;
    y: number;
    name?: string;
  }) => {
    return (
      <foreignObject
        style={{
          transform: `translateX(${x}px) translateY(${y}px)`,
        }}
        height={50}
        width={100}
        className="relative drop-shadow-md"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          <path d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z" />
        </svg>
        <div
          className="absolute left-5 top-5 select-none rounded-md bg-blue-500 px-2 py-1 text-xs font-semibold text-white"
          style={{
            backgroundColor: connectionIdToColor(
              parseInt(name?.substring(name.length - 2) ?? "0", 16),
            ),
          }}
        >
          {name ?? "Anonymous"}
        </div>
      </foreignObject>
    );
  },
);

Cursor.displayName = "Cursor";

export default Cursor;
