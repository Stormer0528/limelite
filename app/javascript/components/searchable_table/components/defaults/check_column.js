import PropTypes from "prop-types";
import Checkbox from "@material-ui/core/Checkbox";

import connect from "../../utils/connect";
import {selectRow, toggleSelectAllRows} from "../../actions";

export const checkCellRenderFunc = ({
  rowData,
  rowData: {selected = false},
  parent: {
    props: {handleItemSelect = function() {}},
  },
}) => {
  // Wrap with internal redux store
  const mapStateToProps = state => {
    return {};
  };

  const mapDispatchToProps = dispatch => {
    return {
      handleCellClick: () => {
        handleItemSelect(rowData);
        dispatch(selectRow(rowData));
      },
    };
  };

  const CheckboxCallback = ({handleCellClick = function() {}}) => (
    <Checkbox checked={selected} onClick={handleCellClick} />
  );

  CheckboxCallback.propTypes = {
    handleCellClick: PropTypes.func,
  };

  const EnhancedCheckbox = connect(
    mapStateToProps,
    mapDispatchToProps
  )(CheckboxCallback);

  return <EnhancedCheckbox checked={selected} />;
};

checkCellRenderFunc.propTypes = {
  rowData: PropTypes.shape({
    selected: PropTypes.bool,
  }),
  parent: PropTypes.shape({
    props: PropTypes.shape({
      handleItemSelect: PropTypes.func,
      handleItemSelectAll: PropTypes.func,
    }),
  }),
};

export const checkCellheaderRenderFunc = () => {
  // Wrap with internal redux store
  const mapStateToProps = ({selectedData: {selectAll} = {}}) => {
    return {selectAll};
  };

  const mapDispatchToProps = dispatch => {
    return {
      handleCellClick: selectAll => {
        dispatch(toggleSelectAllRows(selectAll));
      },
    };
  };

  const CheckboxCallback = ({
    selectAll = false,
    handleCellClick = function() {},
  }) => {
    return null;
  };

  CheckboxCallback.propTypes = {
    selectAll: PropTypes.bool,
    handleCellClick: PropTypes.func,
  };

  const EnhancedCheckbox = connect(
    mapStateToProps,
    mapDispatchToProps
  )(CheckboxCallback);

  return <EnhancedCheckbox />;
};

checkCellheaderRenderFunc.propTypes = {
  rowData: PropTypes.shape({
    selected: PropTypes.bool,
  }),
};
