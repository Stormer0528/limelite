import {isFunction, isEmpty, has} from "lodash";
import {Column} from "react-virtualized";
import {
  checkCellRenderFunc,
  checkCellheaderRenderFunc,
} from "./defaults/check_column";

const {defaultCellRenderer, defaultHeaderRenderer} = Column;

const renderColumns = ({headers = [], cells = [], selectRows = false}) => {
  const columns = headers.map((header, i) => {
    // Use function to render data if function given
    // const headerRenderFunc = isFunction(headers[i])
    //   ? headers[i]
    //   : defaultHeaderRenderer;
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
        flexShrink={flexShrink}
        maxWidth={maxWidth}
        minWidth={minWidth}
        style={style}
        sortFunc={sortFunc}
        // headerRenderer={headerRenderFunc}
      />
    );
  });

  // Add Checkbox columns if necessary
  if (selectRows) {
    return [
      <Column
        key={"header-00"}
        label={"header"}
        dataKey={""}
        width={52}
        disableSort={true}
        headerClassName="checkbox-header"
        cellRenderer={checkCellRenderFunc}
        headerRenderer={checkCellheaderRenderFunc}
      />,
      ...columns,
    ];
  }

  // ... or return list of columns
  return columns;
};

export default renderColumns;
