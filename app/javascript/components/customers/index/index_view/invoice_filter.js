import PropTypes from "prop-types";
import isNull from "lodash/isNull";
import Toolbar from "@material-ui/core/Toolbar";
import {withStyles} from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";

import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import CustomerFilter from "../../../shared/customer_selector_container";

const InvoiceFilter = ({
  // loading = false,
  classes = {},
  aasm_state = "",
  number = "",
  invoiceable_id = "",
  // show = true,
  paid = false,
  showCustomerFilter = true,
  /* callbacks */
  handleFilterStateChange = function() {},
  handleFilterNumberChange = function() {},
  handleFilterCustomerIdChange = function() {},
  handleFilterPaidChange = function() {},
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
        <Grid item className={classes.menuButtonCell} />
        {showCustomerFilter && (
          <Grid
            item
            className={`${classes.gridItem} ${classes.customerFilter}`}
          >
            <CustomerFilter
              onChange={handleFilterCustomerIdChange}
              value={invoiceable_id}
            />
          </Grid>
        )}
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
        <Grid
          item
          className={classes.inputCelll}
          style={{alignSelf: "flex-end", position: "relative", top: "-7px"}}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={paid}
                onChange={handleFilterPaidChange}
                value="paid"
              />
            }
            label="Paid"
            style={{
              position: "relative",
              top: ".75em",
            }}
          />
        </Grid>
      </Grid>
    </Toolbar>
  );
};

InvoiceFilter.propTypes = {
  // loading: PropTypes.bool,
  classes: PropTypes.object,
  aasm_state: PropTypes.string,
  show: PropTypes.bool,
  number: PropTypes.string,
  vendor_name: PropTypes.string,
  paid: PropTypes.bool,
  showCustomerFilter: PropTypes.bool,
  invoiceable_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  handleFilterCustomerIdChange: PropTypes.func.isRequired,
  handleFilterNumberChange: PropTypes.func.isRequired,
  handleFilterStateChange: PropTypes.func.isRequired,
  handleFilterPaidChange: PropTypes.func.isRequired,
};

const styles = theme => ({
  container: {
    justifyContent: "flex-start",
    alignItems: "baseline",
  },
  gridItem: {
    marginRight: ".75rem",
  },
  customerFilter: {
    alignSelf: "center",
    position: "relative",
    top: "4px",
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

export default withStyles(styles)(InvoiceFilter);
