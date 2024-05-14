/**
* Default Link Renderer - gives view/edit/delete links as material-ui icons
  @param data - object with shape rowData: { path = '#!', edit_path = '#!' }
*/

import PropTypes from "prop-types";
import IconButton from "@material-ui/core/IconButton";
import get from "lodash/get";

import Delete from "@material-ui/icons/Delete";
import Edit from "@material-ui/icons/Edit";
import Show from "@material-ui/icons/FindInPage";

const DefaultLinkRenderer = ({
  pathProperty = "path",
  editPathProperty = "edit_path",
  target = "_self",
  disableSort = true,
  columnWidth = 115,
  justifyContent = "center",
  flexGrow = 0,
  showView = false,
  showEdit = true,
  showDelete = true,
  defaultView = true,
  defaultEdit = true,
  defaultDelete = false,
  ShowIcon = Show,
  EditIcon = Edit,
  DeleteIcon = Delete,
} = {}) => {
  const renderFunc = ({
    rowData,
    rowData: {
      permissions: {
        view: canView = defaultView,
        edit: canEdit = defaultEdit,
        delete: canDelete = defaultDelete,
      } = {},
      styles = {
        show: {
          color: "#00BCD4",
          height: "auto",
          width: "auto",
          borderRadius: "5px",
          padding: "3px",
        },
        edit: {
          color: "#8BC34A",
          height: "auto",
          width: "auto",
          borderRadius: "5px",
          padding: "3px",
        },
        delete: {
          color: "#E53935",
          height: "auto",
          width: "auto",
          borderRadius: "5px",
          padding: "3px",
        },
      },
    } = {},
  }) => {
    const path = get(rowData, pathProperty) || "#!";
    const edit_path = get(rowData, editPathProperty) || "#!";

    return (
      <div
        className="btn-group"
        style={{
          placeContent: "center",
          justifyContent: "space-around",
        }}
      >
        {canView && showView && (
          <IconButton
            component="a"
            href={path}
            rel="nofollow"
            style={styles.show}
            target={target}
          >
            <ShowIcon />
          </IconButton>
        )}
        {canEdit && showEdit && (
          <IconButton
            component="a"
            href={edit_path}
            target={target}
            rel="nofollow"
            style={styles.edit}
          >
            <EditIcon />
          </IconButton>
        )}
        {canDelete && showDelete && (
          <IconButton
            component="a"
            href={path}
            color="secondary"
            data-confirm="Are you sure?"
            data-method="delete"
            rel="nofollow"
            style={styles.delete}
            target={target}
          >
            <DeleteIcon />
          </IconButton>
        )}
      </div>
    );
  };

  renderFunc.disableSort = disableSort;
  renderFunc.columnWidth = columnWidth;
  renderFunc.flexGrow = flexGrow;
  renderFunc.justifyContent = justifyContent;

  renderFunc.propTypes = {
    rowData: PropTypes.shape({
      [pathProperty]: PropTypes.string,
      [editPathProperty]: PropTypes.string,
    }),
  };

  // const styles = theme => ({});
  // return withStyles(styles, {withTheme: true})(renderFunc);
  return renderFunc;
};

export default DefaultLinkRenderer;
