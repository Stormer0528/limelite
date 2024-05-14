import PropTypes from "prop-types";
import {format, parse} from "date-fns/esm";
import get from "lodash/get";

const DateColumn = (
  dateCol,
  {
    inputDateFormat = "yyyy-MM-dd",
    dateFormat = "MM/dd/yyyy",
    disableSort = false,
    columnWidth = 100,
    flexGrow = 0,
    textAlign = "center",
    style = {},
    sortFunc = dateSortFunc(dateCol),
  } = {}
) => {
  const renderFunc = ({rowData = {}}) => {
    const dateText = get(rowData, dateCol);
    if (!dateText || dateText === "") {
      return null;
    }
    const parsedDate = parse(
      dateText ? dateText.replace(/"/g, "").replace(/T.*$/g, "") : "",
      inputDateFormat,
      new Date()
    );
    return (
      <span style={{display: "block", textAlign, ...style}}>
        {format(parsedDate, dateFormat)}
      </span>
    );
  };

  renderFunc.disableSort = disableSort;
  renderFunc.columnWidth = columnWidth;
  renderFunc.flexGrow = flexGrow;
  renderFunc.sortFunc = sortFunc;
  renderFunc.customSortFunc = sortFunc;

  renderFunc.propTypes = {
    rowData: PropTypes.shape({
      [dateCol]: PropTypes.string,
    }),
  };

  return renderFunc;
};

export default DateColumn;

const dateSortFunc = (dateCol) => (props) => {
  try {
    const dateValue = get(props, dateCol);
    const dateStr = new Date(dateValue).toISOString();
    return dateStr;
  } catch {
    // Return far future string to put undefined items at the bottom
    const dateStr = "2099-03-18T18:05:52.342Z";
    return dateStr;
  }
};
