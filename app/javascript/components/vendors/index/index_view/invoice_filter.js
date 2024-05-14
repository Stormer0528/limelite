import VendorFilter from "../../../shared/vendor_selector_container";
import Checkbox from "@material-ui/core/Checkbox";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Toolbar from "@material-ui/core/Toolbar";
import {withStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";

const InvoiceFilter = ({
  classes = {},
  aasm_state = "",
  number = "",
  invoiceable_id = "",
  showVendorFilter = true,
  showStateFilter = true,
  showNumberFilter = true,
  showPaidFilter = true,
  showVoidFilter = false,
  paid = false,
  voided = false,
  /* callbacks */
  handleFilterStateChange = function () {},
  handleFilterNumberChange = function () {},
  handleFilterVendorIdChange = function () {},
  handleFilterPaidChange = function () {},
  handleFilterVoidChange = function () {},
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
        {showVendorFilter && (
          <Grid item className={classes.gridItem}>
            <VendorFilter
              onChange={handleFilterVendorIdChange}
              value={invoiceable_id}
            />
          </Grid>
        )}
        {showStateFilter && (
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
        )}
        {showNumberFilter && (
          <Grid item className={classes.gridItem}>
            <TextField
              type="text"
              inputProps={{className: "browser-default"}}
              id="name"
              label="Number"
              value={number}
              onChange={handleFilterNumberChange}
            />
          </Grid>
        )}
        {showPaidFilter && (
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
                  id="paid"
                />
              }
              label="Paid"
              style={{
                position: "relative",
                top: ".75em",
              }}
            />
          </Grid>
        )}
        {showVoidFilter && (
          <Grid
            item
            className={classes.inputCelll}
            style={{alignSelf: "flex-end", position: "relative", top: "-7px"}}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={voided}
                  onChange={handleFilterVoidChange}
                  value="voided"
                  id="voided"
                />
              }
              label="Voided"
              style={{
                position: "relative",
                top: ".75em",
              }}
            />
          </Grid>
        )}
      </Grid>
    </Toolbar>
  );
};

InvoiceFilter.propTypes = {
  classes: PropTypes.object,
  loading: PropTypes.bool,
  aasm_state: PropTypes.string,
  show: PropTypes.bool,
  number: PropTypes.string,
  paid: PropTypes.bool,
  invoiceable_id: PropTypes.string,
  showVendorFilter: PropTypes.bool,
  showStateFilter: PropTypes.bool,
  showNumberFilter: PropTypes.bool,
  showPaidFilter: PropTypes.bool,
  handleFilterVendorIdChange: PropTypes.func.isRequired,
  handleFilterNumberChange: PropTypes.func.isRequired,
  handleFilterStateChange: PropTypes.func.isRequired,
  handleFilterPaidChange: PropTypes.func.isRequired,
};

const styles = (theme) => ({
  container: {
    alignItems: "flex-end",
    justifyContent: "flex-start",
    paddingLeft: "1rem",
  },
  gridItem: {
    marginRight: ".75rem",
  },
  vendorFilter: {
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
  menuButtonCell: {},
});

export default withStyles(styles)(InvoiceFilter);
