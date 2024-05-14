import EntrySelectorTooltip from "./entry_selector_tooltip";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import {withStyles} from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import clsx from "clsx";
import find from "lodash/find";
import PropTypes from "prop-types";
import {useCallback} from "react";

const EntrySelector = ({
  functionCode = "",
  functions = [],
  fundCode = "",
  funds = [],
  goalCode = "",
  goals = [],
  label = "",
  locationCode = "",
  locations = [],
  objectCode = "",
  objects = [],
  resourceCode = "",
  resources = [],
  showHelp = false,
  yearCode = "",
  years = [],

  /* Callbacks */
  handleAccountFundChange = function () {},
  handleAccountResourceChange = function () {},
  handleAccountYearChange = function () {},
  handleAccountGoalChange = function () {},
  handleAccountFunctionChange = function () {},
  handleAccountObjectChange = function () {},
  handleAccountLocationChange = function () {},

  classes = {},
}) => {
  return (
    <div className={clsx(classes.root, "react-inputs")}>
      {label !== "" && (
        <div>
          <h6 className={classes.label}>{label}</h6>
        </div>
      )}
      <Grid container justifyContent="space-between" spacing={0} wrap="nowrap">
        {showHelp && (
          <Grid item className={classes.helpCell}>
            <EntrySelectorTooltip />
          </Grid>
        )}
        <Grid item className={classes.inputCell}>
          <BaseComplete
            classes={classes}
            label="Fund"
            name="account.fundCode"
            onChange={handleAccountFundChange}
            options={funds}
            value={fundCode}
          />
        </Grid>
        <Grid item className={classes.spacerCell}>
          <span className="dash-spacer">&ndash;</span>
        </Grid>
        <Grid item className={classes.inputCell}>
          <BaseComplete
            classes={classes}
            label="Resource"
            name="account.resourceCode"
            onChange={handleAccountResourceChange}
            options={resources}
            value={resourceCode}
          />
        </Grid>
        <Grid item className={classes.spacerCell}>
          <span className="dash-spacer">&ndash;</span>
        </Grid>
        <Grid item className={classes.inputCell}>
          <BaseComplete
            classes={classes}
            label="Year"
            name="account.yearCode"
            onChange={handleAccountYearChange}
            options={years}
            value={yearCode}
          />
        </Grid>
        <Grid item className={classes.spacerCell}>
          <span className="dash-spacer">&ndash;</span>
        </Grid>
        <Grid item className={classes.inputCell}>
          <BaseComplete
            classes={classes}
            label="Goal"
            name="account.goalCode"
            onChange={handleAccountGoalChange}
            options={goals}
            value={goalCode}
          />
        </Grid>
        <Grid item className={classes.spacerCell}>
          <span className="dash-spacer">&ndash;</span>
        </Grid>
        <Grid item className={classes.inputCell}>
          <BaseComplete
            classes={classes}
            label="Function"
            name="account.functionCode"
            onChange={handleAccountFunctionChange}
            options={functions}
            value={functionCode}
          />
        </Grid>
        <Grid item className={classes.spacerCell}>
          <span className="dash-spacer">&ndash;</span>
        </Grid>
        <Grid item className={classes.inputCell}>
          <BaseComplete
            classes={classes}
            label="Object"
            name="account.objectCode"
            onChange={handleAccountObjectChange}
            options={objects}
            value={objectCode}
          />
        </Grid>
        <Grid item className={classes.spacerCell}>
          <span className="dash-spacer">&ndash;</span>
        </Grid>
        <Grid item className={classes.inputCell}>
          <BaseComplete
            classes={classes}
            label={"School"}
            name="account.locationCode"
            onChange={handleAccountLocationChange}
            options={locations}
            value={locationCode}
          />
        </Grid>
      </Grid>
    </div>
  );
};

const BaseComplete = ({
  label = "",
  value = "",
  name = "",
  onChange = function () {},
  classes = {},
  options = [],
}) => {
  const handleChange = useCallback(
    (e, value) => {
      const code = value.split(" - ")[0];
      console.log({e, value, code});
      const {target: {name} = {}} = e || {};
      onChange({target: {name, value: code}});
    },
    [name]
  );
  return (
    <Autocomplete
      freeSolo
      autoComplete
      options={options.map((option) => option.code)}
      renderOption={(code) => {
        const option = find(options, {code});
        return option.code + " - " + option.name;
      }}
      disableClearable
      renderInput={({inputProps, ...params}) => {
        inputProps.className = classes.textField;

        return (
          <TextField
            {...params}
            label={label}
            margin="dense"
            variant="outlined"
            name={name}
            inputProps={inputProps}
          />
        );
      }}
      onInputChange={handleChange}
      value={value}
    />
  );
};

EntrySelector.propTypes = {
  showHelp: PropTypes.bool,
  label: PropTypes.string,
  funds: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      code: PropTypes.string,
    })
  ),
  resources: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      code: PropTypes.string,
    })
  ),
  years: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      code: PropTypes.string,
    })
  ),
  goals: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      code: PropTypes.string,
    })
  ),
  functions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      code: PropTypes.string,
    })
  ),
  objects: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      code: PropTypes.string,
    })
  ),
  locations: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      code: PropTypes.string,
    })
  ),
  fundCode: PropTypes.string,
  resourceCode: PropTypes.string,
  yearCode: PropTypes.string,
  goalCode: PropTypes.string,
  functionCode: PropTypes.string,
  objectCode: PropTypes.string,
  locationCode: PropTypes.string,
  handleAccountFundChange: PropTypes.func.isRequired,
  handleAccountResourceChange: PropTypes.func.isRequired,
  handleAccountYearChange: PropTypes.func.isRequired,
  handleAccountGoalChange: PropTypes.func.isRequired,
  handleAccountFunctionChange: PropTypes.func.isRequired,
  handleAccountObjectChange: PropTypes.func.isRequired,
  handleAccountLocationChange: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const styles = () => ({
  root: {
    backgroundColor: "#e6eaec",
    margin: "-1em -.25em 1em",
    padding: "0 .5em",
    borderTop: "1px solid #B0BEC5",
  },
  spacerCell: {
    flexGrow: 0,
    textAlign: "center",
    margin: "0 .5em",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    color: "#455a64",
  },
  helpCell: {
    display: "flex",
    paddingRight: ".5rem",
  },
  textField: {
    textAlign: "center",

    "&::-webkit-outer-spin-button": {
      appearance: "none",
      "-webkit-appearance": "none",
      "-moz-appearance": "none",
      margin: 0,
    },
    "&::-webkit-inner-spin-button": {
      appearance: "none",
      "-webkit-appearance": "none",
      margin: 0,
    },
  },
});

export default withStyles(styles)(EntrySelector);
