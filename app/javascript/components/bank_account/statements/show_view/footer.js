import PropTypes from "prop-types";
import clsx from "clsx";
import {withStyles} from "@material-ui/core/styles";
import {formatNumber} from "humanize-plus";

// Material UI
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";

// Component
//------------------------------------------------------------------------------
const Footer = ({
  starting_balance = "$0.00",
  ending_balance = "$0.00",
  totalCredits = "$0.00",
  totalDebits = "$0.00",
  statement_balance = "$0.00",
  clearedBalance = "$0.00",
  classes = {},
}) => {
  return (
    <AppBar
      color="inherit"
      position="sticky"
      component="footer"
      className={classes.appBar}
    >
      <Grid className={classes.totalRow}>
        <h5 className={classes.endingBalance}>
          <small className={classes.balance}>{`$${formatNumber(
            ending_balance,
            2
          )}`}</small>
          <p className={classes.label}>Ending Balance</p>
        </h5>

        <div className={classes.operator}>&minus;</div>
        <h5>
          <small className={classes.balance}>{`$${formatNumber(
            clearedBalance,
            2
          )}`}</small>
          <p className={classes.label}>Cleared Balance</p>
        </h5>
        <div className={classes.operator}> &#61;</div>
        <h5>
          <small className={classes.balance}>{`$${formatNumber(
            statement_balance,
            2
          )}`}</small>
          <p className={classes.label}>Adjusted Difference</p>
        </h5>
      </Grid>
      <div className={classes.arrow}>&nbsp;</div>
      <Grid
        container
        alignContent="space-around"
        nowrap="nowrap"
        className={clsx(classes.totalRow, classes.balanceRow)}
      >
        <Grid item style={{flexGrow: 3}}>
          <h5 className={classes.clearedBalanceTitle}>Cleared&nbsp;Balance</h5>
        </Grid>
        <Grid item>
          <h5>
            <small className={classes.balance}>${starting_balance}</small>
            <p className={classes.label}>Starting Balance</p>
          </h5>
        </Grid>
        <Grid item className={classes.operator}>
          +
        </Grid>
        <Grid item>
          <h5>
            <small>{totalCredits}</small>
            <p className={classes.label}>Credits</p>
          </h5>
        </Grid>
        <Grid item className={classes.operator}>
          &minus;
        </Grid>
        <Grid item>
          <h5>
            <small>{totalDebits}</small>
            <p className={classes.label}>Debits</p>
          </h5>
        </Grid>
      </Grid>
    </AppBar>
  );
};

// PropTypes
//------------------------------------------------------------------------------
Footer.propTypes = {
  itemCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  reconciledBalance: PropTypes.string,
  adjustmentAmount: PropTypes.string,
  remainingBalance: PropTypes.string,
  starting_balance: PropTypes.string,
  ending_balance: PropTypes.string,
  totalItemCount: PropTypes.number,
  totalCredits: PropTypes.string,
  totalDebits: PropTypes.string,
  statement_balance: PropTypes.number,
  clearedBalance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  aasm_state: PropTypes.string,
  permissions: PropTypes.object,
  valid: PropTypes.bool,
  statement_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  bank_account_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /*  Callbacks  */
  createSubmitHandler: PropTypes.func.isRequired,
  handletoggleConfirmationModal: PropTypes.func.isRequired,
  /*  Styles  */
  classes: PropTypes.object.isRequired,
};

// Theme
//------------------------------------------------------------------------------
const styles = (theme) => ({
  appBar: {
    position: "fixed",
    bottom: "0",
    top: "inherit",
    left: "0",
    right: "0",
    background: "#EEEEEE",
    color: "#607D8B",
    padding: 0,
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    borderTop: "1px solid #bdbdbd",
    boxShadow: "none",
    overflow: "hidden",
  },
  operator: {
    fontSize: "2.125rem",
    fontWeight: "bold",
    margin: "0 1rem",
    alignSelf: "center",
  },
  label: {
    textVariant: "small-caps",
  },
  totalRow: {
    borderRight: "1px solid #bdbdbd",
    display: "grid",
    gridTemplateColumns:
      "1fr minmax(max-content, max-content) 50px minmax(max-content, max-content) 50px minmax(max-content, max-content) 1fr",

    ["& h5"]: {
      margin: 0,
      fontSize: "1.35rem",
      textAlign: "center",

      ["& > small"]: {
        fontWeight: "300",
      },
    },
    ["& p"]: {
      margin: 0,
      fontSize: "1rem",
      fontWeight: "bold",
    },
  },
  endingBalance: {
    gridColumn: 2,
  },
  balanceRow: {
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "#CFD8DC",
    borderRadius: "0px",
    padding: ".25rem 1rem",
    position: "relative",

    "& h5:first-child": {
      margin: 0,
      fontSize: "1.35rem",
    },
  },
  clearedBalanceTitle: {
    "&:first-child": {
      fontSize: "2.5rem",
      fontWeight: 400,
      opacity: 0.75,
      paddingRight: "2.5rem",
      textAlign: "right",
    },
  },
  arrow: {
    right: "calc(50% + -24px)",
    width: 44.5,
    height: 44.5,
    transform: "rotate(45deg)",
    top: 7,
    position: "absolute",
    background: "#cfd8db",
    border: "1px solid #bdbdbd",
    borderWidth: "0 0 1px 1px",

    "@media (max-width: 950px)": {
      display: "none",
    },
  },
});

// Export
//------------------------------------------------------------------------------
export default withStyles(styles)(Footer);
