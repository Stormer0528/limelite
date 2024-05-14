/**
* State Cell Renderer - renders AASM state of an object. Assigns common colors
*       to states and makes states title case.
  @param data - object with shape rowData: { path = '#!', edit_path = '#!' }
*/

import PropTypes from "prop-types";
import {stateSearch} from "../../utils/search_functions";
import {titleCase} from "humanize-plus";

const StateCellRenderer = (
  state_property = "aasm_state",
  {disableSort = true, columnWidth = 125, flexGrow = 0} = {}
) => {
  const renderFunc = ({rowData: {[state_property]: state = ""} = {}}) => {
    const color = stateColor(state);
    return <b style={{color}}>{titleCase(state.replace(/_/g, " "))}</b>;
  };

  renderFunc.disableSort = disableSort;
  renderFunc.columnWidth = columnWidth;
  renderFunc.flexGrow = flexGrow;
  renderFunc.column = state_property;
  renderFunc.customSortFunc = stateSearch(state_property);

  renderFunc.propTypes = {
    rowData: PropTypes.shape({
      [state_property]: PropTypes.string.isRequired,
    }),
  };

  return renderFunc;
};

export const stateColor = (state = "") => {
  switch (state.toLowerCase()) {
    case "draft":
      return "#2196f3";
    case "needs_revision":
      return "#ffb300";
    case "needs_approval":
      return "#ffb300";
    case "needs_payment_approval":
      return "#ffb300";
    case "paid":
      return "#4caf50";
    case "approved":
      return "#4caf50";
    case "ready_to_print":
      return "#4caf50";
    case "reversal_proposed":
      return "#ffb300";
    case "reversed":
      return "#f44336";
    case "printed":
      return "#1B5E20";
    case "voided":
      return "#9e9e9e";
    default:
      return "#2196f3";
  }
};

export default StateCellRenderer;
