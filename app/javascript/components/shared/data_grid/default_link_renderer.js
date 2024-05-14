/* eslint-disable react/display-name */
import PropTypes from "prop-types";

import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import ShowIcon from "@material-ui/icons/FindInPage";

const DefaultLinkRenderer = ({row: {path, editPath} = {}}) => {
  const styles = {
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
    spacer: {
      width: 27,
      height: 27,
      display: "block",
    },
  };

  return (
    <div
      className="btn-group"
      style={{
        aligntItems: "center",
        justifyContent: "flex-end",
        flexGrow: 1,
      }}
    >
      <IconButton
        component="a"
        href={editPath}
        target="_blank"
        rel="nofollow"
        style={styles.edit}
      >
        <EditIcon />
      </IconButton>

      <span style={styles.spacer}>&nbsp;</span>
    </div>
  );
};

DefaultLinkRenderer.propTypes = {
  row: PropTypes.shape({
    path: PropTypes.string,
    editPath: PropTypes.string,
    permissions: PropTypes.shape({
      view: PropTypes.bool,
      edit: PropTypes.bool,
      delete: PropTypes.bool,
    }),
  }),
};

export default DefaultLinkRenderer;
