import PropTypes from "prop-types";
import Toolbar from "@material-ui/core/Toolbar";
import {withStyles} from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import isNull from "lodash/isNull";
import Checkbox from "@material-ui/core/Checkbox";
import SearchIcon from "@material-ui/icons/Search";
import VisibleIcon from "@material-ui/icons/Visibility";
import InvisibleIcon from "@material-ui/icons/VisibilityOff";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import DateRangeToggle from "../../shared/date_range_toggle";
import AmountToggle from "../../shared/amount_toggle";
import VendorDropdown from "../../shared/vendor_selector_container";

const CreditCardFilter = ({
  classes = {},
  type = "",
  start_date = "",
  end_date = "",
  memo = "",
  vendor_id = "",
  min_amount = "",
  max_amount = "",
  aasm_state = "",
  reconciled = false,
  dateFilter,
  amountFilter,
  /* callbacks */
  handleMemoChange = function () {},
  handleTypeChange = function () {},
  handleReconciledChange = function () {},
  handleStateChange = function () {},
  handleVendorChange = function () {},
  handleFilterDateToggleChange = function () {},
  handleBeforeDateFilterChange = function () {},
  handleAfterDateFilterChange = function () {},
  handleFilterAmountToggleChange = function () {},
  handleMaxAmountFilterChange = function () {},
  handleMinAmountFilterChange = function () {},
}) => {
  return (
    <div className={classes.containerContainer}>
      <Toolbar className={classes.searchContainer}>
        <div className={classes.searchCell}>
          <SearchIcon />
        </div>
        <Grid container className={classes.container} spacing={1}>
          <Grid item sm={2} className={classes.typeCell}>
            <FormControl fullWidth>
              <InputLabel htmlFor="Type">Type</InputLabel>
              <Select
                autoWidth
                value={type}
                inputProps={{
                  className: "browser-default",
                }}
                onChange={handleTypeChange}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="charge">Charge</MenuItem>
                <MenuItem value="payment">Payment</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item style={{flexGrow: 1}} className={classes.dropdownCell}>
            <FormControl fullWidth>
              <InputLabel htmlFor="state">State</InputLabel>
              <Select
                autoWidth
                value={aasm_state}
                inputProps={{
                  className: "browser-default",
                }}
                onChange={handleStateChange}
              >
                <MenuItem value="">All Items</MenuItem>
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="needs_approval">Needs Approval</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="needs_revision">Needs Revision</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item className={`${classes.inputCell} ${classes.compoundCell}`}>
            <DateRangeToggle
              {...{
                afterDate: start_date,
                beforeDate: end_date,
                filterType: dateFilter,
                handleDateToggleChange: handleFilterDateToggleChange,
                handleStartDateChange: handleAfterDateFilterChange,
                handleEndDateChange: handleBeforeDateFilterChange,
              }}
            />
          </Grid>
          <Grid item className={`${classes.inputCell} ${classes.compoundCell}`}>
            <AmountToggle
              {...{
                min_amount,
                max_amount,
                filterType: amountFilter,
                handleAmountToggleChange: handleFilterAmountToggleChange,
                handleMaxAmountChange: handleMaxAmountFilterChange,
                handleMinAmountChange: handleMinAmountFilterChange,
              }}
            />
          </Grid>
          <Grid item className={`${classes.inputCell} ${classes.checkCell}`}>
            <FormControlLabel
              control={
                <Checkbox
                  checkedIcon={<VisibleIcon />}
                  icon={<InvisibleIcon />}
                  checked={isNull(reconciled)}
                  onChange={handleReconciledChange}
                  value="reconciled"
                />
              }
              label="Reconciled"
            />
          </Grid>
        </Grid>
      </Toolbar>
      <Toolbar style={{borderTop: "1px solid #e0e0e0", paddingBottom: "1em"}}>
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
              }}
              onChange={handleVendorChange}
            />
          </Grid>
          <Grid item className={classes.inputCell} style={{flexGrow: 3}}>
            <TextField
              label="Memo"
              type="text"
              inputProps={{className: "browser-default"}}
              id="memo"
              value={memo}
              onChange={handleMemoChange}
              fullWidth
            />
          </Grid>
        </Grid>
      </Toolbar>
    </div>
  );
};

CreditCardFilter.propTypes = {
  classes: PropTypes.object,
  memo: PropTypes.string,
  type: PropTypes.string,
  start_date: PropTypes.string,
  end_date: PropTypes.string,
  number: PropTypes.string,
  min_amount: PropTypes.string,
  max_amount: PropTypes.string,
  vendor_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  aasm_state: PropTypes.string,
  reconciled: PropTypes.bool,
  dateFilter: PropTypes.any,
  amountFilter: PropTypes.any,
  handleFilterDateToggleChange: PropTypes.func.isRequired,
  handleBeforeDateFilterChange: PropTypes.func.isRequired,
  handleAfterDateFilterChange: PropTypes.func.isRequired,
  handleMemoChange: PropTypes.func.isRequired,
  handleTypeChange: PropTypes.func.isRequired,
  handleStateChange: PropTypes.func.isRequired,
  handleReconciledChange: PropTypes.func.isRequired,
  handleFilterAmountToggleChange: PropTypes.func.isRequired,
  handleMaxAmountFilterChange: PropTypes.func.isRequired,
  handleMinAmountFilterChange: PropTypes.func.isRequired,
  vendors: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      name: PropTypes.string,
    })
  ),
  handleVendorChange: PropTypes.func.isRequired,
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
});

export default withStyles(styles)(CreditCardFilter);
