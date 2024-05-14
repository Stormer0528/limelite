import PropTypes from "prop-types";
import {useFormikContext} from "formik";
import {withStyles} from "@material-ui/core/styles";

import Toolbar from "@material-ui/core/Toolbar";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";

import DateRangeToggle from "@shared/date_range_toggle";
import AmountToggle from "@shared/amount_toggle";
import VendorDropdown from "@shared/vendor_selector_container";

const BankItemFilter = ({classes = {}}) => {
  const {
    values: {
      afterDate,
      beforeDate,
      memo = "",
      vendor_id = "",
      number = "",
      minAmount = "",
      maxAmount = "",
      dateFilter,
      amountFilter,
    },
    handleChange = function () {},
  } = useFormikContext();

  const handleDateToggleChange = (e) => {
    handleChange({target: {name: "afterDate", value: null}});
    handleChange({target: {name: "beforeDate", value: null}});

    handleChange(e);
  };

  const handleStartDateChange = (value) => {
    handleChange({
      target: {
        name: "afterDate",
        value,
      },
    });
  };

  const handleEndDateChange = (value) => {
    handleChange({
      target: {
        name: "beforeDate",
        value,
      },
    });
  };

  const handleAmountToggleChange = (e) => {
    handleChange({target: {name: "maxAmount", value: null}});
    handleChange({target: {name: "minAmount", value: null}});

    handleChange(e);
  };

  const handleMinAmountChange = ({value}) => {
    handleChange({target: {name: "minAmount", value}});
  };

  const handleMaxAmountChange = ({value}) => {
    handleChange({target: {name: "maxAmount", value}});
  };

  const handleVendorChange = (_e, {id}) => {
    handleChange({target: {name: "vendor_id", value: id}});
  };

  return (
    <div className={classes.containerContainer}>
      <Toolbar className={classes.searchContainer}>
        <Grid container className={classes.container} spacing={1}>
          <Grid item className={`${classes.inputCell} ${classes.compoundCell}`}>
            <DateRangeToggle
              {...{
                afterDate,
                beforeDate,
                filterType: dateFilter,
                handleDateToggleChange: handleDateToggleChange,
                handleStartDateChange,
                handleEndDateChange,
              }}
            />
          </Grid>
          <Grid item className={`${classes.inputCell} ${classes.compoundCell}`}>
            <AmountToggle
              {...{
                min_amount: minAmount,
                max_amount: maxAmount,
                filterType: amountFilter,
                handleAmountToggleChange,
                handleMaxAmountChange,
                handleMinAmountChange,
              }}
            />
          </Grid>
        </Grid>
        <Grid
          container
          className={classes.container}
          spacing={1}
          style={{justifyContent: "stretch"}}
        >
          <Grid item style={{flexGrow: 1}}>
            <VendorDropdown
              className={classes.dropdownCell}
              autoWidth
              value={vendor_id}
              inputProps={{
                className: "browser-default",
                name: "vendor_id",
              }}
              onChange={handleVendorChange}
            />
          </Grid>
          <Grid item style={{flexGrow: 1}}>
            <TextField
              label="Check #"
              type="text"
              inputProps={{className: "browser-default", name: "number"}}
              id="number"
              value={number}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item className={classes.inputCell} style={{flexGrow: 3}}>
            <TextField
              label="Memo"
              type="text"
              inputProps={{className: "browser-default", name: "memo"}}
              id="memo"
              value={memo}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
        </Grid>
      </Toolbar>
    </div>
  );
};

BankItemFilter.propTypes = {
  classes: PropTypes.object,
  formik: PropTypes.object,

  vendors: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      name: PropTypes.string,
    })
  ),
};

const styles = (theme) => ({
  dateCell: {
    width: "100%",
  },
  textLabel: {
    textAlign: "right",
    marginRight: ".125em",
    marginBottom: ".45em",
  },
  typeCell: {
    marginTop: "-1em",
  },
  searchCell: {
    marginTop: "0.75em",
    marginLeft: " -1.125em",
    marginRight: "1.25em",
  },
  inputCell: {
    flexGrow: 1,
    flexShrink: 1,
    padding: "4px 4px 8px 8px",
  },
  compoundCell: {
    padding: "4px",
  },
  checkCell: {
    marginRight: 0,
  },
  container: {
    justifyContent: "space-between",
    flexWrap: "nowrap",
    alignItems: "flex-end",
  },
  searchContainer: {
    paddingLeft: "1.5em",
    paddingRight: ".35em",
  },
  containerContainer: {
    background: "#fcfcfc",
  },
  dropdownCell: {
    minWidth: "5em",
    padding: "4px",
  },
  selectedItem: {
    backgroundColor: "#E1F5FE !important",
    color: "#0277BD !important",
    fontWeight: "bold",
  },
});

export default withStyles(styles)(BankItemFilter);
