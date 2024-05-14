import PropTypes from "prop-types";
import Toolbar from "@material-ui/core/Toolbar";
import {withStyles} from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import AmountToggle from "../../../shared/amount_toggle";
import DateRangeToggle from "../../../shared/date_range_toggle";

const EntryFilter = ({
  classes = {},
  aasm_state = "",
  type = "",
  entry_type = "",
  memo = "",
  start_date,
  end_date,
  dateFilter,
  min_amount,
  max_amount,
  amountFilter,
  /* callbacks */
  handleTypeFilterChange = function() {},
  handleEntryTypeFilterChange = function() {},
  handleMemoFilterChange = function() {},
  handleStateFilterChange = function() {},
  handleBeforeDateFilterChange = function() {},
  handleAfterDateFilterChange = function() {},
  handleFilterDateToggleChange = function() {},
  handleMaxAmountFilterChange = function() {},
  handleMinAmountFilterChange = function() {},
  handleFilterAmountToggleChange = function() {},
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
        <Grid item className={classes.gridItem} style={{minWidth: "6.5em"}}>
          <FormControl fullWidth style={{minWidth: "10.5em"}}>
            <InputLabel htmlFor="type">Type</InputLabel>
            <Select
              autoWidth
              id="type"
              value={type}
              inputProps={{
                className: "browser-default",
              }}
              onChange={handleTypeFilterChange}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Credit">Credit</MenuItem>
              <MenuItem value="Debit">Debit</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item className={classes.gridItem} style={{minWidth: "6.5em"}}>
          <FormControl fullWidth style={{minWidth: "10.5em"}}>
            <InputLabel htmlFor="entryType">Entry Type</InputLabel>
            <Select
              autoWidth
              id="entryType"
              value={entry_type}
              inputProps={{
                className: "browser-default",
              }}
              onChange={handleEntryTypeFilterChange}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Transaction">Transaction</MenuItem>
              <MenuItem value="Journal Entry">Journal Entry</MenuItem>
              <MenuItem value="Payroll">Payroll</MenuItem>
              <MenuItem value="Accounts Payable">Accounts Payable</MenuItem>
              <MenuItem value="Accounts Receivable">
                Accounts Receivable
              </MenuItem>
              <MenuItem value="Beginning Balance">Beginning Balance</MenuItem>
              <MenuItem value="Payment">Payment</MenuItem>
              <MenuItem value="Revenue">Revenue</MenuItem>
            </Select>
          </FormControl>
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
              onChange={handleStateFilterChange}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="needs_approval">Needs Approval</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="needs_revision">Needs Revision</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item style={{position: "relative", top: "-0.35em", flexGrow: 2}}>
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
        <Grid item style={{position: "relative", top: "-0.35em", flexGrow: 2}}>
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
      </Grid>
      <Grid
        item
        className={classes.gridItem}
        style={{
          position: "relative",
          top: "-0.35em",
          minWidth: "10.5em",
          flexGrow: 2,
        }}
      >
        <TextField
          label="Memo"
          type="text"
          value={memo}
          onChange={handleMemoFilterChange}
          inputProps={{className: "browser-default"}}
          fullWidth
        />
      </Grid>
    </Toolbar>
  );
};

EntryFilter.propTypes = {
  classes: PropTypes.object,
  type: PropTypes.string,
  aasm_state: PropTypes.string,
  journalable_type: PropTypes.string,
  handleTypeFilterChange: PropTypes.func.isRequired,
  handleJournalTypeFilterChange: PropTypes.func.isRequired,
  handleStateFilterChange: PropTypes.func.isRequired,
  handleBeforeDateFilterChange: PropTypes.func.isRequired,
  handleAfterDateFilterChange: PropTypes.func.isRequired,
};

const styles = theme => ({
  container: {
    justifyContent: "flex-start",
    alignItems: "baseline",
    margin: "0 .5em",
  },
  gridItem: {
    marginRight: ".75rem",
  },
  root: {
    padding: 0,
    background: "#FAFAFA",
    borderTop: "1px solid #e3e4e3",
    overflow: "hidden",
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

export default withStyles(styles)(EntryFilter);
