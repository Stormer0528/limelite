/**
 * Default Text Cell Column --
 * DO NOT Normally use this column
 * you can simply put in the string name of the column and it will normally render the text
 *
 * DO USE when:
 * You need a standard way to render text and set cell properties
 */

import PropTypes from "prop-types";
import {textSearch} from "../../utils/search_functions";
import get from "lodash/get";

const TextColumn = (
  textcol,
  {
    format,
    align = "left",
    disableSort = false,
    columnWidth = 150,
    flexGrow = 1,
    sortFunc = textSearch(textcol),
  } = {}
) => {
  const renderFunc = ({rowData = {}}) => {
    const text = get(rowData, textcol);
    return (
      <div className={`${align}-align`} style={{ width: '80%' }}>
        {format ? format(text, rowData) : text}
      </div>
    );
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
