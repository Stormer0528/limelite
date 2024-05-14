import PropTypes from "prop-types";
import ReactFilestack from "filestack-react";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import {withStyles} from "@material-ui/core/styles";

import FileLinkIcon from "@material-ui/icons/CloudDownload";
import ReplaceFileIcon from "@material-ui/icons/Autorenew";
import DeleteIcon from '@material-ui/icons/Delete';

const ViewFileBtn = ({
  value = "",
  apikey,
  options,
  security,
  security: {policy, signature},
  readOnly = false,
  disabled = false,
  classes = {},

  handleSuccess = function() {},
  handleError = function() {},
}) => {
  return (
    <ButtonGroup>
      <Tooltip title="Download File" placement="top">
        <Button
          component="a"
          href={`${value}?policy=${policy}&signature=${signature}`}
          target="_blank"
          className={classes.iconBtn}
        >
          <FileLinkIcon />
          &nbsp;&nbsp;View
        </Button>
      </Tooltip>
      {!readOnly && (
        <Tooltip title="Replace File" placement="top">
          <ReactFilestack
            {...{
              apikey,
              options,
              clientOptions: {security},
              action: "pick",
              componentDisplayMode: {
                type: Button,
              },
              customRender: ({onPick}) => (
                <Button
                  onClick={onPick}
                  disabled={disabled}
                  className={classes.middleBtn}
                >
                  <ReplaceFileIcon />
                </Button>
              ),
              onSuccess: handleSuccess,
              onError: handleError,
              buttonClass: null,
            }}
          />
        </Tooltip>
      )}
      {
        !readOnly && (
          <Button className={classes.iconBtn} onClick={() => handleSuccess({ filesUploaded: [{url: ''}] })}>
            <DeleteIcon />
          </Button>
        )
      }
    </ButtonGroup>
  );
};

ViewFileBtn.propTypes = {
  multiple: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  value: PropTypes.string,
  uploadIcon: PropTypes.node,
  apikey: PropTypes.string,
  inputId: PropTypes.string,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  options: PropTypes.object,
  security: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  buttonClass: PropTypes.string,
  handleSuccess: PropTypes.func.isRequired,
  handleError: PropTypes.func.isRequired,
};

const styles = () => ({
  middleBtn: {
    border: "1px solid #0000003b",
    borderRadius: "0 5px 5px 0",
    padding: ".35rem 0",
  },
  iconBtn: {
    padding: ".35rem 1rem",
    display: "flex",

    "& > span": {
      display: "flex",
      flexWrap: "nowrap",
    },
    "& svg": {color: "#424242"},
    "&:hover": {
      backgroundColor: "#00000014",
      "& svg": {color: "#212121"},
    },
  },
});

export default withStyles(styles)(ViewFileBtn);
