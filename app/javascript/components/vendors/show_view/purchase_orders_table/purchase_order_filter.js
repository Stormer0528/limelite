import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Toolbar from "@material-ui/core/Toolbar";

import {withStyles} from "@material-ui/core/styles";

const InvoiceFilter = ({
  classes = {},
  number = "",
  invoice_number = "",
  showNumberFilter = true,
  showInvoiceNumberFilter = true,
  /* callbacks */
  handleFilterNumberChange = function() {},
  handleFilterInvoiceNumberChange = function() {},
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
        {showNumberFilter && (
          <Grid item className={classes.gridItem} xs={3}>
            <TextField
              id="number"
              fullWidth
              inputProps={{className: "browser-default"}}
              margin="normal"
              onChange={handleFilterNumberChange}
              placeholder="PO #"
              type="text"
              value={number}
            />
          </Grid>
        )}
        {showInvoiceNumberFilter && (
          <Grid item className={classes.gridItem} xs={3}>
            <TextField
              id="invoice_number"
              fullWidth
              inputProps={{className: "browser-default"}}
              margin="normal"
              onChange={handleFilterInvoiceNumberChange}
              placeholder="Invoice #"
              type="text"
              value={invoice_number}
            />
          </Grid>
        )}
        <Grid item xs />
      </Grid>
    </Toolbar>
  );
};

InvoiceFilter.propTypes = {
  classes: PropTypes.object,
  number: PropTypes.string,
  invoice_number: PropTypes.string,

  showNumberFilter: PropTypes.bool,
  showInvoiceNumberFilter: PropTypes.bool,
  handleFilterNumberChange: PropTypes.func.isRequired,
  handleFilterInvoiceNumberChange: PropTypes.func.isRequired,
};

const styles = theme => ({
  container: {
    justifyContent: "flex-start",
    alignItems: "baseline",
  },
  gridItem: {
    marginRight: ".75rem",
  },
  root: {
    padding: 0,
    background: "#fcfcfc",
    borderTop: "1px solid #e3e4e3",
  },
  menuButton: {
    backgroundColor: "transparent",

    "&:focus": {
      backgroundColor: "transparent",
    },
  },
  menuButtonCell: {
    width: "1.5rem",
  },
});

export default withStyles(styles)(InvoiceFilter);
