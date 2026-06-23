import { FixedSizeGrid } from "react-window";

function VirtualizedList({
  items,
  renderItem,
}) {
  // Updated column count to 4
  const columnCount = 4;

  const rowCount = Math.ceil(
    items.length / columnCount
  );

  const Cell = ({
    columnIndex,
    rowIndex,
    style,
  }) => {
    const index =
      rowIndex * columnCount +
      columnIndex;

    if (index >= items.length) {
      return null;
    }

    return (
      <div style={style}>
        {renderItem(items[index])}
      </div>
    );
  };

  return (
    <FixedSizeGrid
      columnCount={columnCount}
      columnWidth={310}
      rowCount={rowCount}
      rowHeight={500}
      height={window.innerHeight - 150}
      width={window.innerWidth - 20}
    >
      {Cell}
    </FixedSizeGrid>
  );
}

export default VirtualizedList;