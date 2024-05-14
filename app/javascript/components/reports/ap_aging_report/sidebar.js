import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import SettingsIcon from "@material-ui/icons/Settings";

import Grid from "@material-ui/core/Grid";
import SvgIcon from "@material-ui/core/SvgIcon";
import Drawer from "@material-ui/core/Drawer";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

import Divider from "@material-ui/core/Divider";

const Sidebar = ({
  open = false,
  periods,
  daysPerPeriod,
  showActiveRows,
  showActiveColumns,
  /* Callbacks */
  handleChange = function() {},
  handlePeriodsChange = function() {},
  handleDaysPerPeriodChange = function() {},
  handleShowActiveRowsChange = function() {},
  handleShowActiveColumnsChange = function() {},
  classes = {},
  ...rest
}) => {
  return (
    <Drawer
      open={open}
      onClose={handleChange}
      anchor="right"
      classes={{paper: classes.sidebar}}
      {...rest}
    >
      <h3 className={classes.header}>
        <SvgIcon fontSize="large">
          <SettingsIcon />
        </SvgIcon>
        <span style={{flexGrow: 1}}>&nbsp; Report Settings</span>
      </h3>
      <Divider />
      <section className={"react-inputs"}>
        <Grid container spacing={1} direction="column">
          <Grid item container justify="space-between">
            <TextField
              id="periods"
              label="Periods"
              value={periods}
              onChange={handlePeriodsChange}
              type="number"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
            />
            <TextField
              id="days-per-period"
              label="Days Per Period"
              type="number"
              value={daysPerPeriod}
              onChange={handleDaysPerPeriodChange}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
            />
          </Grid>
          <Grid item container justify="space-between">
            <FormControlLabel
              control={
                <Checkbox
                  value="showActiveColumns"
                  checked={showActiveColumns}
                  onChange={handleShowActiveColumnsChange}
                />
              }
              label="Only Show Active Columns"
            />
            <FormControlLabel
              control={
                <Checkbox
                  value="showActiveRows"
                  checked={showActiveRows}
                  onChange={handleShowActiveRowsChange}
                />
              }
              label="Only Show Active Rows"
            />
          </Grid>
        </Grid>
      </section>
    </Drawer>
  );
};

Sidebar.propTypes = {
  open: PropTypes.bool,
  agingMethod: PropTypes.string,
  periods: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  daysPerPeriod: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  showActiveRows: PropTypes.bool,
  showActiveColumns: PropTypes.bool,
  handleChange: PropTypes.func.isRequired,
  handlePeriodsChange: PropTypes.func.isRequired,
  handleDaysPerPeriodChange: PropTypes.func.isRequired,
  handleShowActiveRowsChange: PropTypes.func.isRequired,
  handleShowActiveColumnsChange: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const styles = theme => ({
  reportPeriodControlContainer: {
    marginBottom: 0,
  },
  sidebar: {
    padding: "1em",
    width: "30vw",
    minWidth: "350px",
  },
  root: {
    display: "flex",
    background: "#f5f5f5",
    alignItems: "center",
    padding: ".25em",
  },
  header: {
    fontWeight: "300",
    margin: ".5em 0",
    display: "flex",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
  },
  btnContainer: {},
});

export default withStyles(styles)(Sidebar);
