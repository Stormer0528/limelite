import PropTypes from "prop-types";
import Toolbar from "@material-ui/core/Toolbar";
import {withStyles} from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";

import FilterIcon from "@material-ui/icons/FilterList";

const VendorFilter = ({
  classes = {},
  aasm_state = "",
  number = "",
  name = "",
  show = true,
  /* callbacks */
  handleFilterStateChange = function() {},
  handleFilterNumberChange = function() {},
  handleFilterNameChange = function() {},
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
        <Grid item className={classes.menuButtonCell}>
          <IconButton
            className={classes.menuButton}
            color="inherit"
            variant={`${show ? "flat" : "raised"}`}
            aria-label="Menu"
          >
            <FilterIcon />
          </IconButton>
        </Grid>
        <Grid item className={classes.gridItem}>
          <TextField
            type="text"
            inputProps={{className: "browser-default"}}
            id="company-name"
            placeholder="Company Name"
            value={name}
            onChange={handleFilterNameChange}
            margin="normal"
          />
        </Grid>
        <Grid item className={classes.gridItem} style={{minWidth: "10.5em"}}>
          <FormControl fullWidth style={{minWidth: "10.5em"}}>
            <InputLabel htmlFor="state">State</InputLabel>
            <Select
              autoWidth
              id="state"
              value={aasm_state}
              inputProps={{
                className: "browser-default",
              }}
              onChange={handleFilterStateChange}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="needs_approval">Needs Approval</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="needs_revision">Needs Revision</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item className={classes.gridItem}>
          <TextField
            type="text"
            inputProps={{className: "browser-default"}}
            id="name"
            placeholder="Number"
            value={number}
            onChange={handleFilterNumberChange}
            margin="normal"
          />
        </Grid>
      </Grid>
    </Toolbar>
  );
};

VendorFilter.propTypes = {
  classes: PropTypes.object,
  aasm_state: PropTypes.string,
  show: PropTypes.bool,
  number: PropTypes.string,
  name: PropTypes.string,
  handleFilterNameChange: PropTypes.func.isRequired,
  handleFilterNumberChange: PropTypes.func.isRequired,
  handleFilterStateChange: PropTypes.func.isRequired,
};

const styles = theme => ({
  container: {
    justifyContent: "flex-start",
    alignItems: "baseline",
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
  menuButtonCell: {
    padding: "4px 16px !important",
    backgroundColor: "transparent",
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    alignSelf: "center",
  },
});

export default withStyles(styles)(VendorFilter);
