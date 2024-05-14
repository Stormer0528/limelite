/**
* Default State Button Renderer - Gives links to states available for item
  @param data - object with shape rowData: {[path_property] = '#!'}
*/

import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import {titleCase} from "humanize-plus";

const StateBtnRenderer = ({
  submissionPath = "",
  stateProperty = "aasm_state",
  states = {
    draft: ["save_draft", "make_ready_to_print"],
    printed: ["void"],
  },
  clickHandler = function() {},
  disableSort = true,
  columnWidth = 125,
  flexGrow = 0,
} = {}) => {
  const renderFunc = ({
    rowData: {[stateProperty]: currentState, id, permissions = {}},
  }) => {
    const curStates = states[currentState] || [];
    return (
      <form path={submissionPath}>
        <div className="btn-group">
          {curStates.map(
            val =>
              permissions[val] && (
                <Button
                  type="submit"
                  size="small"
                  key={val}
                  style={{
                    color: calcBtnColor(val),
                  }}
                  onClick={clickHandler({id, nextState: val})}
                >
                  {titleCase(val.replace(/_/g, " "))}
                </Button>
              )
          )}
        </div>
      </form>
    );
  };

  renderFunc.disableSort = disableSort;
  renderFunc.columnWidth = columnWidth;
  renderFunc.flexGrow = flexGrow;

  renderFunc.propTypes = {
    rowData: PropTypes.shape({
      // [path_property]: PropTypes.string.isRequired,
    }),
  };

  return renderFunc;
};

export default StateBtnRenderer;

// Helper Functions
//------------------------------------------------------------------------------

const calcBtnColor = (color = "") => {
  switch (color.toLowerCase()) {
    case "draft":
      return "#2196f3";
    case "needs_revision":
      return "#ffb300";
    case "needs_approval":
      return "#ffb300";
    case "needs_payment_approval":
      return "#ffb300";
    case "send_for_approval":
      return "#ffb300";
    case "paid":
      return "#4caf50";
    case "approve":
      return "#4caf50";
    case "approved":
      return "#4caf50";
    case "ready_to_print":
      return "#4caf50";
    case "reversal_proposed":
      return "#ffb300";
    case "reversal_approval":
      return "#ffb300";
    case "deny":
      return "#f44336";
    case "reversed":
      return "#f44336";
    default:
      return "#2196f3";
  }
};
