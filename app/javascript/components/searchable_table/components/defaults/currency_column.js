import PropTypes from "prop-types";
import currency from "currency.js";
import {USD} from "../../../../utils";

const CurrencyColumn = (
  currencyCol,
  {
    disableSort = false,
    columnWidth = 100,
    flexGrow = 0,
    sortFunc = amountSortFunc(currencyCol),
  } = {}
) => {
  const renderFunc = ({rowData}) => {
    if (!rowData[currencyCol] || rowData[currencyCol] === "") {
      return null;
    }

    return <div style={{ textAlign: 'end', paddingRight: 5 }}>{ USD(rowData[currencyCol]).format() }</div>;
  };

  renderFunc.disableSort = disableSort;
  renderFunc.columnWidth = columnWidth;
  renderFunc.flexGrow = flexGrow;
  renderFunc.sortFunc = sortFunc;
  renderFunc.customSortFunc = sortFunc;

  renderFunc.propTypes = {
    rowData: PropTypes.shape({
      [currencyCol]: PropTypes.string.isRequired,
    }),
  };

  return renderFunc;
};

export default CurrencyColumn;

const amountSortFunc = currencyCol => ({[currencyCol]: amt}) => {
  return currency(amt).format();
};
