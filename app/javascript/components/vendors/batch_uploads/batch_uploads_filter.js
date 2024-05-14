import PropTypes from "prop-types";

import Checkbox from "@material-ui/core/Checkbox";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Toolbar from "@material-ui/core/Toolbar";

import {withStyles} from "@material-ui/core/styles";

const BatchUploadFilter = ({
  classes = {},
  aasmState = "",
  /* callbacks */
  handleBatchUploadFilterStateChange = function() {},
}) => {
  return (
    <Toolbar className={classes.root}>
      <Grid
        container
        className={classes.container}
        spacing={1}
        alignItems="stretch"
        alignContent="space-around"
        justify="center"
        wrap="nowrap"
      >
        <Grid item className={classes.gridItem} style={{minWidth: "10.5em"}}>
          <FormControl fullWidth style={{minWidth: "10.5em"}}>
            <InputLabel htmlFor="state">State</InputLabel>
            <Select
              autoWidth
              id="state"
              value={aasmState}
              inputProps={{
                className: "browser-default",
              }}
              onChange={handleBatchUploadFilterStateChange}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="needs_approval">Needs Approval</MenuItem>
              <MenuItem value="needs_revision">Needs Revision</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Toolbar>
  );
};

BatchUploadFilter.propTypes = {
  classes: PropTypes.object,
  loading: PropTypes.bool,
  aasmState: PropTypes.string,
  handleBatchUploadFilterStateChange: PropTypes.func.isRequired,
};

const styles = theme => ({
  container: {
    alignItems: "flex-end",
    justifyContent: "flex-start",
    paddingLeft: "1rem",
  },
  gridItem: {
    marginRight: ".75rem",
  },
  root: {
    padding: 0,
    background: "#FAFAFA",
    borderTop: "1px solid #e3e4e3",
  },
  menuButton: {
    backgroundColor: "transparent",

    "&:focus": {
      backgroundColor: "transparent",
    },
  },
  menuButtonCell: {},
});

export default withStyles(styles)(BatchUploadFilter);
