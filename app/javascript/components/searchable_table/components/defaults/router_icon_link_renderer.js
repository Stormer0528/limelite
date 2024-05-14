/**
* Default Link Renderer - gives view/edit/delete links as material-ui icons
  @param data - object with shape rowData: { path = '#!', edit_path = '#!' }
*/

import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import compact from "lodash/compact";
import ShowIcon from "@material-ui/icons/FindInPage";

const RouterIconLinkRenderer = (
  path_property,
  {
    prefix = "",
    suffix = "",
    disableSort = false,
    icon: Icon = ShowIcon,
    permissionsProp = "view",
    permissionsDefault = false,
  } = {}
) => {
  const renderFunc = ({
    rowData = {},
    rowData: {
      permissions: {[permissionsProp]: canView = permissionsDefault} = {},
    },
  }) => {
    if (!canView) {
      return null;
    }

    return (
      <Link to={compact([prefix, rowData[path_property], suffix]).join("/")}>
        <Icon />
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

RouterIconLinkRenderer.propTypes = {
  rowData: PropTypes.shape({
    path: PropTypes.string,
    edit_path: PropTypes.string,
  }),
};

export default RouterIconLinkRenderer;
