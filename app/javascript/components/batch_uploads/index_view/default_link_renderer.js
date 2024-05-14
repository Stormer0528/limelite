/* eslint-disable react/display-name */
import PropTypes from "prop-types";

import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

import {useMutation} from "@apollo/react-hooks";
import DESTROY_BATCH_UPLOAD_MUTATION from "@graphql/mutations/destroy_batch_upload.gql";

const DefaultLinkRenderer = ({
  refetch,
  row: {
    id,
    path,
    editPath,
    permissions: {edit: canEdit = false, delete: canDelete = false} = {},
  } = {},
}) => {
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

  const [destroyBatchUpload] = useMutation(DESTROY_BATCH_UPLOAD_MUTATION);
  const handleDeleteClick = (id) => (e) => {
    e.preventDefault();
    const shouldContinue = confirm(
      "Are you sure you want to delete Batch Upload?"
    );

    if (shouldContinue) {
      setTimeout(refetch, 300);
      destroyBatchUpload({
        variables: {id},
      });
    }
  };

  return (
    <div
      className="btn-group"
      style={{
        aligntItems: "center",
        justifyContent: "center",
        flexGrow: 1,
        width: "100%",
      }}
    >
      {canEdit && (
        <IconButton
          component="a"
          href={editPath}
          target="_blank"
          rel="nofollow"
          style={styles.edit}
        >
          <EditIcon />
        </IconButton>
      )}

      {canDelete && (
        <IconButton
          component="a"
          href={path}
          color="secondary"
          onClick={handleDeleteClick(id)}
          style={styles.delete}
        >
          <DeleteIcon />
        </IconButton>
      )}

      <span style={styles.spacer}>&nbsp;</span>
    </div>
  );
};

DefaultLinkRenderer.propTypes = {
  refetch: PropTypes.func.isRequired,
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
