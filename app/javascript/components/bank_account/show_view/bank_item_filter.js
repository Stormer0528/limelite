import PropTypes from "prop-types";
import Toolbar from "@material-ui/core/Toolbar";
import {withStyles} from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import VisibleIcon from "@material-ui/icons/Visibility";
import InvisibleIcon from "@material-ui/icons/VisibilityOff";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import DateRangeToggle from "../../shared/date_range_toggle";
import AmountToggle from "../../shared/amount_toggle";
import VendorDropdown from "../../shared/vendor_selector_container";

const BankItemFilter = ({
  classes = {},
  type = "",
  start_date = "",
  end_date = "",
  memo = "",
  vendor_id = "",
  number = "",
  min_amount = "",
  max_amount = "",
  aasm_state = "",
  reconciled = false,
  dateFilter = "After",
  amountFilter,
  /* callbacks */
  handleMemoChange = function () {},
  handleTypeChange = function () {},
  handleReconciledChange = function () {},
  handleNumberChange = function () {},
  handleStateChange = function () {},
  handleVendorChange = function () {},
  handleFilterDateToggleChange = function () {},
  handleBeforeDateFilterChange = function () {},
  handleAfterDateFilterChange = function () {},
  handleFilterAmountToggleChange = function () {},
  handleMaxAmountFilterChange = function () {},
  handleMinAmountFilterChange = function () {},
}) => {
  const aasmState =
    typeof aasm_state === "string"
      ? aasm_state.split(",").filter((s) => s !== "" && s !== ",")
      : aasm_state;
  return (
    <div className={classes.containerContainer}>
      <Toolbar className={classes.searchContainer}>
        <Grid container className={classes.container} spacing={1}>
          <Grid item sm={2} className={classes.dropdownCell}>
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
                <MenuItem value="deposit">Deposit</MenuItem>
                <MenuItem value="check">Check</MenuItem>
                <MenuItem value="account_transfer">Transfer</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item style={{flexGrow: 1}} className={classes.dropdownCell}>
            <FormControl fullWidth>
              <InputLabel htmlFor="state">State</InputLabel>
              <Select
                multiple
                autoWidth
                value={aasmState}
                inputProps={{
                  className: "browser-default",
                }}
                onChange={handleStateChange}
              >
                <MenuItem
                  classes={{selected: classes.selectedItem}}
                  value="draft"
                >
                  Draft
                </MenuItem>
                <MenuItem
                  classes={{selected: classes.selectedItem}}
                  value="needs_approval"
                >
                  Needs Approval
                </MenuItem>
                <MenuItem
                  classes={{selected: classes.selectedItem}}
                  value="approved"
                >
                  Approved
                </MenuItem>
                <MenuItem
                  classes={{selected: classes.selectedItem}}
                  value="needs_revision"
                >
                  Needs Revision
                </MenuItem>
                <MenuItem
                  classes={{selected: classes.selectedItem}}
                  value="printed"
                >
                  Printed
                </MenuItem>
                <MenuItem
                  classes={{selected: classes.selectedItem}}
                  value="voided"
                >
                  Voided
                </MenuItem>
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
                  checked={reconciled}
                  onChange={handleReconciledChange}
                  value="reconciled"
                />
              }
              label="Cleared"
            />
          </Grid>
        </Grid>
      </Toolbar>
      <Toolbar style={{borderTop: "1px solid #e0e0e0"}}>
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
          <Grid item style={{flexGrow: 1}}>
            <TextField
              label="Check #"
              type="text"
              inputProps={{className: "browser-default"}}
              id="number"
              name="number"
              value={number}
              onChange={handleNumberChange}
              fullWidth
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

BankItemFilter.propTypes = {
  classes: PropTypes.object,
  memo: PropTypes.string,
  type: PropTypes.string,
  dateFilter: PropTypes.string,
  amountFilter: PropTypes.string,
  start_date: PropTypes.string,
  end_date: PropTypes.string,
  number: PropTypes.string,
  min_amount: PropTypes.string,
  max_amount: PropTypes.string,
  vendor_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  aasm_state: PropTypes.string,
  reconciled: PropTypes.bool,
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
  handleNumberChange: PropTypes.func.isRequired,
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
    paddingBottom: "8px !important",
  },
  selectedItem: {
    backgroundColor: "#E1F5FE !important",
    color: "#0277BD !important",
    fontWeight: "bold",
  },
});

export default withStyles(styles)(BankItemFilter);
