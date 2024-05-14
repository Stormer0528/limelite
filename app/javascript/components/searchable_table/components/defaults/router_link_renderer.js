/**
* Default Link Renderer - gives view/edit/delete links as material-ui icons
  @param data - object with shape rowData: { path = '#!', edit_path = '#!' }
*/

import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import compact from "lodash/compact";

const RouterLinkRenderer = (
  name_property,
  path_property,
  {prefix = "", suffix = "", disableSort = false} = {}
) => {
  const renderFunc = ({rowData = {}}) => {
    return (
      <Link to={compact([prefix, rowData[path_property], suffix]).join("/")}>
        {rowData[name_property]}
      </Link>
    );
  };

  renderFunc.propTypes = {
    field: PropTypes.string,
    rowData: PropTypes.shape({
      path: PropTypes.string,
    }),
  };

  renderFunc.disableSort = disableSort;

  return renderFunc;
};

RouterLinkRenderer.propTypes = {
  rowData: PropTypes.shape({
    path: PropTypes.string,
    edit_path: PropTypes.string,
  }),
};

export default RouterLinkRenderer;
