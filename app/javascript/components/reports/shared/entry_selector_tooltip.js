import PropTypes from "prop-types";

import HelpIcon from "@material-ui/icons/HelpOutline";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import {Fragment} from "react";

import {withStyles} from "@material-ui/core/styles";

function EntrySelectorTooltip({classes = {}}) {
  return (
    <div className={classes.root}>
      <Tooltip
        classes={{
          tooltip: classes.tooltip,
        }}
        placement="top"
        title={
          <Fragment>
            <h6>Account Help</h6>
            <div className={classes.helpList}>
              <ul>
                <li>
                  <b>Ranges:</b> A range of elements can be represented with
                  &lsquo;...&lsquo; or &rsquo;-&rsquo;
                  <br />
                  <span className="example-text">
                    (For Example: 4500...4750 or 4500-4570 would include all
                    funds from 4500 to 4570)
                  </span>
                </li>
                <br />
                <li>
                  <b>Lists:</b> A list of elements can be represented with
                  commas.
                  <br />
                  <span className="example-text">
                    (For Example: 1360,1890 would select both 1360 and 1890
                    funds)
                  </span>
                </li>
                <br />
                <li>
                  <b>Combinations:</b> You may also combine lists and ranges
                  <br />
                  <span className="example-text">
                    (For Example: 4500-5500,6500 would select everything between
                    4500 and 5500 as well as 6500)
                  </span>
                </li>
              </ul>
            </div>
          </Fragment>
        }
      >
        <IconButton aria-label="Help" size="small" edge={false}>
          <HelpIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
}

const styles = () => ({
  root: {
    display: "flex",
    alignItems: "center",
  },
  tooltip: {
    backgroundColor: "#616161",
  },
  iconButton: {
    color: "#bada55",
  },
  helpList: {
    backgroundColor: "white",
    color: "#333",
    margin: "0 -8px -13px",
    padding: "1em",

    "& span.example-text": {
      color: "#999",
    },

    ["& b"]: {
      color: "#000",
    },
  },
});

EntrySelectorTooltip.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EntrySelectorTooltip);
