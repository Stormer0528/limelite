import connect from "../utils/connect";
import Table from "./table";

const mapStateToProps = (
  {
    data = [],
    selectedData = {},
    sort: {direction: sortDirection, column: sortColumn, customSortFunc} = {},
  },
  {storeKey, ...rest}
) => {
  return {
    storeKey,
    sortDirection,
    sortColumn,
    customSortFunc,
    selectedData,
    data,
    rest,
  };
};

export default connect(mapStateToProps)(Table);
