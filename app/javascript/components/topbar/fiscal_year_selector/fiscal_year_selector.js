import PropTypes from "prop-types";
import range from "lodash/range";
import {withStyles} from "@material-ui/core/styles";

import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

const FiscalYearSelector = ({
  fiscalYear,
  earliestFiscalYear,
  latestFiscalYear,
  handleYearChange = function () {},
  classes = {},
}) => {
  const yearRange = range(latestFiscalYear, earliestFiscalYear - 1, -1);

  return (
    <div className={`form-input ${classes.root}`}>
      <b className={classes.label}>Fiscal Year</b>
      <Select
        className={classes.select}
        value={fiscalYear}
        onChange={handleYearChange}
      >
        {yearRange.map((year) => {
          return (
            <MenuItem key={year} value={year} className={classes.menuItem}>
              {year + "–" + `${year + 1}`.slice(2, 4)}
            </MenuItem>
          );
        })}
      </Select>
    </div>
  );
};

FiscalYearSelector.propTypes = {
  fiscalYear: PropTypes.number.isRequired,
  earliestFiscalYear: PropTypes.number.isRequired,
  latestFiscalYear: PropTypes.number.isRequired,
  handleYearChange: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const styles = () => ({
  root: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "baseline",
  },
  select: {
    color: "#E0E0E0 !important",
    margin: "1.25em .5em 0",
    height: "2em",
    paddingLeft: ".5em",

    "&:before": {
      borderBottomColor: "#9E9E9E !important",
    },

    "&:hover:before": {
      borderBottomColor: "#E0E0E0 !important",
    },

    "& svg": {
      color: "#9e9e9e",
    },
  },
  label: {},
  menuItem: {},
});

const isNextYear = () => {
  const month = new Date().getMonth();
  return month >= 6;
};

const maxFiscalYear = () => {
  const currentYear = new Date().getFullYear();

  return isNextYear() ? currentYear + 1 : currentYear;
};

export default withStyles(styles)(FiscalYearSelector);
