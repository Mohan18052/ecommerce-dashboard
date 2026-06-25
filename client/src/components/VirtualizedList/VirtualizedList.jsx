import { memo, useMemo, useRef, useEffect, useState } from "react";
import { FixedSizeGrid } from "react-window";

function VirtualizedList({ items, renderItem }) {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(1200);
  const [height, setHeight] = useState(600);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setWidth(containerRef.current.offsetWidth);
        // Fill from top of this container to bottom of viewport
        setHeight(window.innerHeight - rect.top - 8);
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const columnCount = useMemo(() => {
    if (width < 640) return 1;
    if (width < 768) return 2;
    if (width < 1024) return 3;
    return 4;
  }, [width]);

  const columnWidth = Math.floor(width / columnCount);
  const rowHeight = 470;
  const rowCount = Math.ceil(items.length / columnCount);

  const Cell = ({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * columnCount + columnIndex;
    if (index >= items.length) return null;
    return (
      <div style={{ ...style, padding: 8, boxSizing: "border-box" }}>
        <div className="w-full h-full">
          {renderItem(items[index])}
        </div>
      </div>
    );
  };

  return (
    <div ref={containerRef} className="w-full">
      <FixedSizeGrid
        columnCount={columnCount}
        columnWidth={columnWidth}
        rowCount={rowCount}
        rowHeight={rowHeight}
        width={width}
        height={height}
      >
        {Cell}
      </FixedSizeGrid>
    </div>
  );
}

export default memo(VirtualizedList);
