import {useState} from "react";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import MoreIcon from "@material-ui/icons/MoreVert";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

import ReportPeriodControl from "../shared/report_period_control";
import Sidebar from "./sidebar_container";

const Control = ({classes = {}, ...rest}) => {
  const [open, setValue] = useState(false);
  function handleChange() {
    setValue(!open);
  }

  return (
    <div className={classes.root}>
      <ReportPeriodControl
        {...rest}
        classes={{container: classes.reportPeriodControlContainer}}
      />
      <div className={classes.btnContainer}>
        <Tooltip title="Advanced Settings" placement="top">
          <IconButton onClick={handleChange}>
            <MoreIcon />
          </IconButton>
        </Tooltip>
      </div>
      <Sidebar open={open} handleChange={handleChange} />
    </div>
  );
};

Control.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  reportPeriodControlContainer: {
    marginBottom: 0,
  },
  sidebar: {
    margin: "1em",
    width: "25vw",
    minWidth: "250px",
  },
  root: {
    display: "flex",
    background: "#f5f5f5",
    alignItems: "center",
    padding: ".25em",

    "& button:focus": {
      backgroundColor: "#00000014",
    },
  },
  btnContainer: {},
});

export default withStyles(styles)(Control);
