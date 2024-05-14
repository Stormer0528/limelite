import PropTypes from "prop-types";
import FILESTACK_PERMISSIONS_QUERY from "@graphql/queries/file_stack_permissions.gql";
import Button from "@material-ui/core/Button";
import UploadIcon from "@material-ui/icons/CloudUpload";
import ReactFilestack from "filestack-react";
import {useQuery} from "react-apollo";

const SaveBtn = ({
  onFileUploaded = function () {},
  disabled = false,
  ...props
}) => {
  const {data: {filestack: {apikey, security} = {}} = {}} = useQuery(
    FILESTACK_PERMISSIONS_QUERY,
    {
      pollInterval: 1000 * 60 * 5, // Refresh every 5 mins
      partialRefetch: true,
    }
  );

  if (disabled || !apikey) {
    return (
      <Button disabled>
        <UploadIcon />
        Upload Files
      </Button>
    );
  }

  return (
    <ReactFilestack
      clientOptions={{
        security,
      }}
      apikey={apikey}
      onSuccess={onFileUploaded}
      // eslint-disable-next-line no-console
      onError={(error, other) => console.error(error, other)}
      {...{
        action: "pick",
        actionOptions: {
          maxFiles: 50,
        },
        // eslint-disable-next-line react/prop-types
        customRender: ({onPick}) => (
          <Button onClick={onPick} {...props}>
            <UploadIcon />
            &nbsp; Upload Files
          </Button>
        ),
      }}
    />
  );
};

SaveBtn.propTypes = {
  onFileUploaded: PropTypes.func,
  disabled: PropTypes.bool,
};

export default SaveBtn;
