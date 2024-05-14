import {isFunction, isEmpty, has} from "lodash";
import {Column} from "react-virtualized";
import DefaultHeader from "./default_header";

const {defaultCellRenderer} = Column;

const renderColumns = ({
  headers = [],
  cells = [],
  handleHeaderClick = function() {},
}) => {
  const columns = headers.map((header, i) => {
    // Use function to render data if function given
    const cellRenderFunc = isFunction(cells[i])
      ? cells[i]
      : defaultCellRenderer;

    // Disable sort if header is blank string or property is set on function/obj
    const disableSort = has(headers[i], "disableSort")
      ? headers[i].disableSort
      : isEmpty(headers[i]);

    const {
      columnWidth = 100,
      flexGrow = 1,
      flexShrink = 0,
      maxWidth,
      minWidth,
      style = {},
      sortFunc,
    } = cells[i];

    return (
      <Column
        key={`${header}-${i}`}
        label={header}
        dataKey={cells[i]}
        flexGrow={flexGrow}
        width={columnWidth}
        disableSort={disableSort}
        cellRenderer={cellRenderFunc}
        headerRenderer={DefaultHeader({handleHeaderClick})}
        flexShrink={flexShrink}
        maxWidth={maxWidth}
        minWidth={minWidth}
        style={style}
        sortFunc={sortFunc}
      />
    );
  });

  // ... or return list of columns
  return columns;
};

export default renderColumns;
