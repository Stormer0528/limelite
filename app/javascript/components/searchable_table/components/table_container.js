import connect from "../utils/connect";
import {setSortColumn, setSortDirection, setSortFunction} from "../actions";
import Table from "./table";

const mapStateToProps = (
  {
    data = [],
    selectedData = {},
    sort: {direction: sortDirection, column: sortColumn, customSortFunc} = {},
  },
  {storeKey, selectAll = true, handleItemSelectAll = function() {}, ...rest}
) => {
  return {
    storeKey,
    sortDirection,
    sortColumn,
    customSortFunc,
    selectedData,
    data,
    selectAll,
    handleItemSelectAll,
    rest,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleHeaderClick: ({columnData, dataKey: field}) => {
      dispatch(setSortColumn(field.column || field));
      dispatch(setSortDirection(columnData, field.column || field));
      dispatch(setSortFunction(field.customSortFunc || false));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Table);
