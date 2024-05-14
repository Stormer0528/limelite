import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import {formatNumber} from "humanize-plus";

// Material UI
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
      <div className={classes.adjustedRow}>
        {/* Ending Balance */}
        <h5>
          <small className={classes.balance}>{`$${formatNumber(
            ending_balance,
            2
          )}`}</small>
          <p className={classes.label}>Ending Balance</p>
        </h5>
        <div className={classes.operator}>&minus;</div>

        {/* Cleared Balance */}
        <h5>
          <small className={classes.balance}>{`$${formatNumber(
            clearedBalance,
            2
          )}`}</small>
          <p className={classes.label}>Cleared Balance</p>
        </h5>

        <div className={classes.operator}>&#61;</div>

        {/* Adjusted Difference */}
        <h5>
          <small className={classes.balance}>{`$${formatNumber(
            statement_balance,
            2
          )}`}</small>
          <p className={classes.label}>Adjusted Difference</p>
        </h5>
      </div>

      {/* Cleared Row */}
      <div className={classes.clearedRow}>
        <h5
          style={{
            alignSelf: "left",
            textAlign: "left",
            paddingRight: "1rem",
          }}
        >
          Cleared Balance:{" "}
        </h5>
        <h5>
          <small className={classes.balance}>${starting_balance}</small>
          <p className={classes.label}>Starting Balance</p>
        </h5>
        <div className={classes.operator}>&#43;</div>
        <div className={classes.operator}>&#40;</div>
        <h5>
          <small>{totalCredits}</small>
          <p className={classes.label}>Credits</p>
        </h5>
        <div className={classes.operator}>&minus;</div>
        <h5>
          <small>{totalDebits}</small>
          <p className={classes.label}>Debits</p>
        </h5>
        <div className={classes.operator}>&#41;</div>
      </div>
    </AppBar>
  );
};

// PropTypes
//------------------------------------------------------------------------------
Footer.propTypes = {
  itemCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  reconciledBalance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  adjustmentAmount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  remainingBalance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  starting_balance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ending_balance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  totalItemCount: PropTypes.number,
  totalCredits: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  totalDebits: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  statement_balance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  clearedBalance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  valid: PropTypes.bool,

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
    width: "100%",
    background: "#EEEEEE",
    boxShadow: "0 0 7.5px rgba(33,33,33,.25)",
    color: "#607D8B",
    padding: "0.5rem 0 0",
    display: "div",
    divTemplateRows: "1fr 1fr",
  },
  adjustedRow: {
    display: "grid",
    gridColumnGap: ".5em",
    gridTemplateColumns: "12.5rem 5rem 12.5rem 5rem 12.5rem",
    justifyContent: "center",

    "& h5": {
      margin: 0,
      fontSize: "1.35rem",
      textAlign: "center",

      "& > small": {
        fontWeight: "300",
      },
    },
    "& p": {
      margin: 0,
      fontSize: "1rem",
      fontWeight: "bold",
    },
  },

  clearedRow: {
    borderTop: "1px solid #B0BEC5",
    padding: ".25rem 1rem",
    alignItems: "center",
    borderRadius: 0,
    justifyContent: "center",
    backgroundColor: "#CFD8DC",
    display: "grid",
    gridTemplateColumns:
      "max-content minmax(max-content, max-content) minmax(min-content,1rem) minmax(min-content,1rem) minmax(max-content, max-content) minmax(min-content,3rem) minmax(max-content, max-content) minmax(min-content,1rem)",
    gridColumnGap: ".75rem",

    "&:after": {
      display: "block",
      height: "50px",
      width: "50px",
      background: "#f00",
      position: "absolute",
      left: "50%",
      zIndex: "9999",
      border: "2px solid #8b0000",
      transform: "rotate(45deg)",
    },
    "& h5": {
      margin: 0,
      fontSize: "1.35rem",
      textAlign: "center",

      "& > small": {
        fontWeight: "300",
      },
    },
    "& p": {
      margin: 0,
      fontSize: "1rem",
      fontWeight: "bold",
    },
  },
  centeredCell: {
    alignSelf: "center",
    textAlign: "center",
    padding: ".25rem .75rem",

    ["& input"]: {
      textAlign: "center",
    },
  },
  btnCell: {
    textAlign: "right",
    alignSelf: "center",
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
    display: "flex",
    justifyContent: "space-around",
    alignItems: "baseline",

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
  balanceRow: {
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "#CFD8DC",
    border: "1px solid #B0BEC5",
    borderRadius: "0px",
    padding: ".25rem 1rem",
  },
});

// Export
//------------------------------------------------------------------------------
export default withStyles(styles)(Footer);
