import PropTypes from "prop-types";
import {Component} from "react";

import empty from "lodash/isEmpty";

import {withStyles} from "@material-ui/core/styles";

import NewFileBtn from "./new_file_btn";
import ViewFileBtn from "./view_file_btn";
import Notification from "./notification";

import {blue} from "@material-ui/core/colors";

class FilestackUploadBtn extends Component {
  state = {
    loading: false,
    snackbarOpen: false,
    snackbarMessage: "",
    value: this.props.value,
  };

  handleUploadSuccess = (multiple = false, onChange = function () {}) => (
    response
  ) => {
    if (multiple) {
      const {filesUploaded = []} = response;
      this.setState({values: filesUploaded});
    } else {
      const {
        filesFailed = [],
        filesUploaded: [uploadedFile],
        filesUploaded: [{url} = {}],
      } = response;
      this.setState({value: url});
      onChange(url);

      // Return file on success
      const {onFileUploaded: callback = function () {}} = this.props;
      callback(uploadedFile);

      filesFailed.forEach(({filename}) =>
        this.handleError({error: `Upload failed for ${filename}`})
      );
    }
  };

  handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({snackbarOpen: false});
  };

  handleSnackbarOpen = () => {
    this.setState({snackbarOpen: true});
  };

  handleError = (e = {}) => {
    console.error(e);

    this.setState({
      snackbarOpen: true,
      snackbarMessage: <span className="errorMessage">{e.error}</span>,
    });
    this.handleSnackbarOpen();
  };

  handleUploadError = (file, error) => {
    const {name, message} = error;
    console.error("Upload Error", error);

    this.setState({
      snackbarOpen: true,
      snackbarMessage: (
        <p className="errorMessage">
          {name && <b>{name}:</b>}
          &nbsp;
          {message}
        </p>
      ),
    });
  };

  render() {
    const {
      name,
      inputId,
      security = {},
      apikey = "",
      multiple = false,
      disabled = false,
      readOnly = false,
      buttonText = multiple ? "Upload Files" : "Upload File",
      className: buttonClass = "",
      options = {
        maxFiles: multiple ? 100 : 1,
        startUploadingWhenMaxFilesReached: true,
        onFileUploadFailed: this.handleUploadError,
      },
      onChange = function () {},
      classes = {},
    } = this.props;

    const {value = this.props.value, values = []} = this.state;
    const BtnComponent = !empty(value) ? ViewFileBtn : NewFileBtn;

    if (apikey === "") {
      return null;
    }

    return (
      <div>
        <BtnComponent
          {...{
            apikey,
            options,
            security,
            value,
            disabled,
            readOnly,
            mode: "pick",
            buttonText,
            handleSuccess: this.handleUploadSuccess(multiple, onChange),
            handleError: this.handleUploadError,
            buttonClass,
            inputId,
            multiple,
          }}
        />
        {!empty(value) && !multiple && (
          <input
            type="hidden"
            name={name}
            id={inputId}
            value={`${this.state.value}`}
          />
        )}
        {!empty(values) &&
          multiple &&
          values.map((value) => {
            const {
              url,
              handle,
              originalFile: {name: filename},
            } = value;
            return (
              <ul className="browser-default" key={handle} style={{margin: 0}}>
                <li>
                  <b>{filename}</b>
                  <input
                    key={value}
                    type="hidden"
                    name={name}
                    id={inputId}
                    value={`${url}`}
                  />
                </li>
              </ul>
            );
          })}

        <Notification
          open={this.state.snackbarOpen}
          handleClose={this.handleSnackbarClose}
          message={this.state.snackbarMessage}
        />
      </div>
    );
  }
}

FilestackUploadBtn.propTypes = {
  multiple: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  name: PropTypes.string,
  value: PropTypes.string,
  inputId: PropTypes.string,
  apikey: PropTypes.string,
  buttonText: PropTypes.string,
  className: PropTypes.string,
  options: PropTypes.object,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  onChange: PropTypes.func,
  onSuccess: PropTypes.func,
  security: PropTypes.shape({
    policy: PropTypes.string,
    signature: PropTypes.string,
  }),
  classes: PropTypes.object,
};

const styles = (theme) => ({
  btnInner: {
    display: "flex",
    alignItems: "center",
    alignContent: "space-between",
    justifyContent: "space-between",
  },
  progress: {
    color: blue[500],
  },
  btnGroup: {
    border: "1px solid #f0f0f0;",
    borderRadius: "3px",
    display: "inline-flex",
  },
  btnGroupLink: {
    borderRight: "1px solid #f0f0f0;",
    display: "inline-flex",
  },
  btnGroupBtn: {
    display: "flex",
    minHeight: "40px",
    borderRadius: "0 3px 0 3px",
  },
  snackbar: {
    "& > div": {
      backgroundColor: "#C62828",
      color: "#fff",

      "& h5": {
        fontWeight: 200,
      },

      "& button": {
        position: "absolute",
        top: 0,
        right: 0,
      },
    },
  },
});

export default withStyles(styles)(FilestackUploadBtn);
