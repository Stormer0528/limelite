import {useState, useCallback} from "react";
import PropTypes from "prop-types";
import ReactFilestack from "filestack-react";

import CircularProgress from "@material-ui/core/CircularProgress";
import Avatar from "@material-ui/core/Avatar";
import {makeStyles} from "@material-ui/core/styles";

import FILESTACK_PERMISSIONS_QUERY from "../../graphql/queries/file_stack_permissions.gql";
import {useQuery} from "react-apollo";

const NewFileBtn = ({
  value: initialValue = "",
  options,
  name = "",
  onChange = function () {},
}) => {
  const response = useQuery(FILESTACK_PERMISSIONS_QUERY, {
    pollInterval: 1000 * 60 * 5, // Refresh every 5 mins
    partialRefetch: true,
  });
  const classes = useStyles();
  const [src, setValue] = useState(initialValue);

  const handleSuccess = useCallback(
    ({filesUploaded: [{url}]}) => {
      setValue(url);
      onChange({target: name, value: url});
    },
    [name, onChange]
  );
  const handleError = useCallback((e) => console.error(e), []);

  const {
    loading,
    data: {
      filestack: {apikey, security, security: {policy, signature} = ""} = {},
    } = {},
  } = response;

  if (loading) {
    return <CircularProgress color="secondary" />;
  }

  return (
    <ReactFilestack
      {...{
        apikey,
        options,
        clientOptions: {security},
        action: "pick",
        customRender: ({onPick}) => (
          <Avatar
            src={src ? `${src}?policy=${policy}&signature=${signature}` : null}
            alt="upload user image"
            className={classes.avatar}
            onClick={onPick}
          />
        ),
        onSuccess: handleSuccess,
        onError: handleError,
      }}
    />
  );
};

const useStyles = makeStyles(() => ({
  avatar: {
    height: 60,
    width: 60,
    cursor: "pointer",

    "&:after": {
      content: "'Update'",
      top: 0,
      color: "#fff",
      position: "absolute",
      background: "#212121",
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      justifyContent: "center",
      flexDirection: "column",
      alignItems: "center",
      opacity: 0,
      transition: "opacity .3s ease-in",
    },

    "&:hover:after": {
      fontSize: ".9em",
      opacity: 0.85,
    },
  },
  btn: {
    background: "transparent",
    border: "none",
  },
}));

NewFileBtn.propTypes = {
  value: PropTypes.string,
  name: PropTypes.string,
  options: PropTypes.object,
  onChange: PropTypes.func,
};

export default NewFileBtn;
