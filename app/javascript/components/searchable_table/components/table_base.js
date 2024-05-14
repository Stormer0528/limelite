import PropTypes from "prop-types";
import isNil from "lodash/isNil";
import sortBy from "lodash/sortBy";
import {Table, SortDirection} from "react-virtualized";
import renderColumns from "./render_columns";

// Base Table
//------------------------------------------------------------------------------
const TableBase = ({
  storeKey,
  headers,
  data,
  selectedData,
  cells,
  width,
  height = 500,
  selectRows,
  sortColumn,
  headerHeight = 45,
  rowHeight = 30,
  overscan = 10,
  sortDirection,
  customSortFunc = false,
  handleHeaderClick = () => {},
  handleItemSelect = () => {},
  handleItemSelectAll = () => {},
  registerChild,
  onRowsRendered,
}) => {
  const sortColumnVal = sortColumnValue(sortColumn, sortDirection);
  const direction = sortDirectionValue(sortDirection);
  const dataVal = sortedData({
    column: sortColumnVal,
    direction,
    data,
    customSortFunc,
  });
  const rowFunc = rowRenderer(dataVal);

  return (
    <Table
      data={data} /* Keep to help with rerenders */
      {...{
        headerHeight,
        rowHeight,
        overscan,
        storeKey,
        width,
        selectedData,

        handleItemSelect,
        handleItemSelectAll,
      }}
      height={Math.max(height, 350)}
      sortBy={sortColumnVal}
      sortDirection={direction}
      onHeaderClick={handleHeaderClick}
      rowCount={data.length}
      rowGetter={rowFunc}
      onRowsRendered={onRowsRendered}
      ref={elem => {
        elem && elem.forceUpdateGrid();
        registerChild(elem);
      }}
    >
      {renderColumns({headers, cells, selectRows})}
    </Table>
  );
};

TableBase.propTypes = {
  cells: PropTypes.array.isRequired,
  customSortFunc: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  headerHeight: PropTypes.number,
  headers: PropTypes.arrayOf(PropTypes.string),
  height: PropTypes.number,
  overscan: PropTypes.number,
  registerChild: PropTypes.func,
  rowHeight: PropTypes.number,
  selectedData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  selectRows: PropTypes.bool,
  sortColumn: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  sortDirection: PropTypes.string,
  storeKey: PropTypes.string,
  width: PropTypes.number,
  /* Callbacks */
  onRowsRendered: PropTypes.func,
  /* Event Handlers */
  handleHeaderClick: PropTypes.func,
  handleItemSelect: PropTypes.func,
  handleItemSelectAll: PropTypes.func,
};

// Utils
//------------------------------------------------------------------------------
const rowRenderer = data => {
  return ({index}) => {
    return data[index];
  };
};

function sortDirectionValue(direction) {
  switch (direction) {
    case "ASC":
      return SortDirection.ASC;
    case "DESC":
      return SortDirection.DESC;
    default:
      return null;
  }
}

function sortColumnValue(column, direction) {
  if (isNil(direction) || column === "") {
    return null;
  }
  return column;
}

function sortedData({column, direction, data, customSortFunc}) {
  if (isNil(column) || column === "") {
    return data;
  }
  const sortFunc = customSortFunc ? [customSortFunc] : [column];

  const newData = sortBy(data, sortFunc);
  return direction === "DESC" ? newData : newData.reverse();
}

export default TableBase;
