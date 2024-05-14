import PropTypes from "prop-types";
import {Fragment, useCallback} from "react";
import IconButton from "@material-ui/core/IconButton";
import ExportIcon from "@material-ui/icons/AssignmentReturned";
import ExportElementsIcon from "@material-ui/icons/Assignment";
import Tooltip from "@material-ui/core/Tooltip";
import {serializeParams} from "../../utils";

import {withStyles} from "@material-ui/core/styles";

const IndexPageHeader = ({values = {}, classes = {}}) => {
  const paramString = serializeParams({filter: values});
  const handleClick = useCallback(e => {
    e.preventDefault();
    e.stopPropagation();

    window.open(e.target.closest("a").href, "_blank");
  }, []);

  return (
    <Fragment>
      <Tooltip title="Export Chart of Accounts" placement="top">
        <IconButton
          className={classes.exportLink}
          href={`/export/accounts.xlsx?${paramString.replace(/Id/g, "Code")}`}
          onClick={handleClick}
        >
          <ExportIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Export Chart of Account Elements" placement="top">
        <IconButton
          className={classes.exportLink2}
          href={"/export/account-elements.xlsx"}
          onClick={handleClick}
        >
          <ExportElementsIcon />
        </IconButton>
      </Tooltip>
    </Fragment>
  );
};

IndexPageHeader.propTypes = {
  classes: PropTypes.object,
  values: PropTypes.object,
};

const styles = theme => ({
  exportLink: {
    position: "absolute",
    top: "8px",
    right: "2.5em",
    zIndex: "999",
    padding: "6px",
  },
  exportLink2: {
    position: "absolute",
    top: "8px",
    right: "4.25em",
    zIndex: "999",
    padding: "6px",
  },
});

export default withStyles(styles)(IndexPageHeader);
