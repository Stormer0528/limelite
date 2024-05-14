/**
 * Default Text Cell Column --
 * You shouldn't have to use this column
 * you can simply put in the string name of the column and it will normally render the text
 *
 * DO USE when:
 * You need a standard way to render text and set cell properties
 * or you need a simple way to align text
 */

import PropTypes from "prop-types";
import {textSearch} from "../../utils/search_functions";

const TextColumn = (
  textcol,
  {
    disableSort = false,
    columnWidth = 150,
    flexGrow = 1,
    sortFunc = textSearch(textcol),
    align = "left",
  } = {}
) => {
  const renderFunc = ({rowData = {}}) => {
    return <div className={`${align}-align`}>{rowData[textcol]}</div>;
  };

  renderFunc.disableSort = disableSort;
  renderFunc.columnWidth = columnWidth;
  renderFunc.flexGrow = flexGrow;
  renderFunc.customSortFunc = sortFunc;

  renderFunc.propTypes = {
    rowData: PropTypes.shape({
      [textcol]: PropTypes.string.isRequired,
    }),
  };

  return renderFunc;
};

export default TextColumn;
