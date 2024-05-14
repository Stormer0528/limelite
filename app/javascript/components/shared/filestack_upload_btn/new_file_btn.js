import PropTypes from "prop-types";
import ReactFilestack from "filestack-react";
import Button from "@material-ui/core/Button";
import UploadIcon from "@material-ui/icons/CloudUpload";

import FILESTACK_PERMISSIONS_QUERY from "../../../graphql/queries/file_stack_permissions.gql";
import {useQuery} from "@apollo/react-hooks";

const NewFileBtn = ({
  buttonText = "Upload",
  value = "",
  options,
  readOnly = false,
  disabled = false,
  classes = {},

  handleSuccess = function () {},
  handleError = function () {},
}) => {
  const {
    loading,
    data: {filestack: {apikey = "", security = ""} = {}} = {},
  } = useQuery(FILESTACK_PERMISSIONS_QUERY, {
    pollInterval: 1000 * 60 * 5, // Refresh every 5 mins
    partialRefetch: true,
  });

  if (loading || security === "") {
    return null;
  }

  return (
    <ReactFilestack
      {...{
        apikey,
        options,
        clientOptions: {security},
        action: "pick",
        customRender: ({onPick}) => (
          <Button
            style={{display: "flex", color: "#424242CC"}}
            onClick={onPick}
          >
            <UploadIcon />
            &nbsp;
            {buttonText}
          </Button>
        ),
        onSuccess: handleSuccess,
        onError: handleError,
      }}
    />
  );
};

NewFileBtn.propTypes = {
  multiple: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  loading: PropTypes.string,
  fileUrl: PropTypes.string,
  buttonText: PropTypes.string,
  uploadIcon: PropTypes.node,
  apikey: PropTypes.string,
  options: PropTypes.object,
  security: PropTypes.object.isRequired,
  buttonClass: PropTypes.string,
  handleSuccess: PropTypes.func.isRequired,
  handleError: PropTypes.func.isRequired,
};

export default NewFileBtn;
