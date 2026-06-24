import { memo, useMemo } from "react";
import { FixedSizeGrid } from "react-window";

function VirtualizedList({ items, renderItem, containerHeight }) {
  // Responsive column count based on container width
  const columnCount = useMemo(() => {
    if (typeof window === "undefined") return 4;
    const width = window.innerWidth;
    if (width < 640) return 1;
    if (width < 768) return 2;
    if (width < 1024) return 3;
    return 4;
  }, []);

  const rowCount = Math.ceil(items.length / columnCount);
  const columnWidth = Math.floor(
    (Math.min(window.innerWidth, 1280) - 64) / columnCount
  );
  const rowHeight = 460;

  const Cell = ({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * columnCount + columnIndex;
    if (index >= items.length) return null;

    return (
      <div style={{ ...style, padding: "8px" }}>
        {renderItem(items[index])}
      </div>
    );
  };

  return (
    <FixedSizeGrid
      columnCount={columnCount}
      columnWidth={columnWidth}
      rowCount={rowCount}
      rowHeight={rowHeight}
      height={containerHeight || window.innerHeight - 300}
      width={Math.min(window.innerWidth - 32, 1280)}
    >
      {Cell}
    </FixedSizeGrid>
  );
}

export default memo(VirtualizedList);