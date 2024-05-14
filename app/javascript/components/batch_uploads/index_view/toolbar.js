import {useState, useCallback} from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {makeStyles} from "@material-ui/core/styles";
import {titleCase} from "humanize-plus";
import {useFormikContext} from "formik";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import MenuItem from "@material-ui/core/MenuItem";

import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import StateIcon from "@shared/state_icon";

function Toolbar() {
  const classes = useStyles();
  const [stateState, setStateState] = useState(["needs_approval"]);
  const {handleChange: handleFormikChange} = useFormikContext();
  const handleChange = useCallback(
    ({target: {value}}) => {
      setStateState(value);
      handleFormikChange({
        target: {
          name: "aasmState",
          value,
        },
      });
    },
    [setStateState, handleFormikChange]
  );

  return (
    <Paper className={classes.root}>
      <Grid container alignContent="flex-end">
        <Grid item xs className={classes.label}>
          <b>Status:</b>
        </Grid>
        <Grid item xs={3} className={classes.dropdownCell}>
          <StateDropdown
            value={stateState}
            onChange={handleChange}
            states={["needs_approval", "needs_revision", "approved"]}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}

export default Toolbar;

const StateDropdown = ({
  value = [],
  onChange = function () {},
  MenuProps = {},
  states = ["draft", "needs_approval", "approved", "needs_revision"],
}) => {
  const classes = useDropdownStyles();
  return (
    <FormControl className={classes.formControl} fullWidth>
      <Select
        labelId="state-dropdown"
        id="state-dropdown"
        multiple
        autoWidth
        value={value}
        onChange={onChange}
        inputProps={{
          className: "browser-default",
        }}
        renderValue={(value) => {
          return value.map((val) => titleize(val)).join(", ");
        }}
        input={<Input />}
        MenuProps={MenuProps}
      >
        {states.map((name) => (
          <MenuItem key={name} value={name}>
            <Checkbox checked={value.indexOf(name) > -1} />
            <ListItemText
              primary={
                <div className={clsx(classes.listItem, name)}>
                  <StateIcon aasmState={name} />
                  {titleize(name)}
                </div>
              }
            />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

StateDropdown.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
  MenuProps: PropTypes.any,
  states: PropTypes.arrayOf(PropTypes.string),
};

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    padding: "4px 16px",
    background: "#0000",
    boxShadow: "none",
    alignItems: "flex-end",
    alignSelf: "flex-end",
    marginLeft: "auto",
    flexGrow: 1,
  },
  label: {
    display: "flex",
    justifyContent: "flex-end",
    marginRight: "1rem",
    alignItems: "center",
    fontSize: 16,
    paddingTop: 4,

    "& > b": {
      position: "relative",
      top: ".65rem",
    },
  },
  dropdownCell: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
}));

const useDropdownStyles = makeStyles((theme) => {
  return {
    root: {},
    listItem: {
      display: "flex",
      alignItems: "center",

      " & > svg": {
        height: "1em",
        width: "1em",
        marginRight: ".65rem",
      },

      "&.approved > svg": {color: theme.states.approved},
      "&.draft > svg": {color: theme.states.draft},
      "&.needs_approval > svg": {color: theme.states.needs_approval},
      "&.needs_revision > svg": {color: theme.states.needs_revision},
    },
  };
});

const titleize = (str = "") => titleCase(str.replace(/[-_]/g, " "));
