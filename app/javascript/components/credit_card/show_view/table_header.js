import PropTypes from "prop-types";

// Material UI
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Chip from "@material-ui/core/Chip";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";

import StorageIcon from "@material-ui/icons/Storage";
import PrintIcon from "@material-ui/icons/Print";
import ExcelIcon from "@material-ui/icons/GridOn";

import {withStyles} from "@material-ui/core/styles";

const TableHeader = ({
  loading = false,
  account: {balance = "$0.00", last_statement_balance = "$0.00"} = {},
  printPath = "./print",
  xlsxPath,
  classes = {},
  children,
}) => (
  <Paper id="TableHeader" className={`${classes.root} ledger`}>
    <Typography
      type="h5"
      component="h5"
      className={`page-header ${classes.header}`}
    >
      {!loading && (
        <StorageIcon
          style={{
            color: "90A4AE",
            marginRight: "0.25em",
          }}
        />
      )}
      {loading && (
        <CircularProgress
          size={24}
          className={classes.titleIcon}
          thickness={5}
          style={{color: "#546E7A", marginRight: "0.5em"}}
        />
      )}
      <span className={classes.ledgerText}>Ledger</span>
      <div className="last-statement-balance text-grey">
        <b>Last Statement Balance:</b>
        {"  "}
        {last_statement_balance}
      </div>
      <div style={{width: "0.75rem"}}>&nbsp;</div>
      <Chip
        label={
          <div className="balance">
            <b>Balance:</b>
            {"  "}
            {balance}
          </div>
        }
        className={classes.chip}
        variant="outlined"
      />
      <IconButton
        component="a"
        href={printPath}
        style={{
          borderRadius: "50%",
          margin: "0 .25rem",
        }}
        target="_blank"
      >
        <PrintIcon />
      </IconButton>
      <IconButton
        component="a"
        href={xlsxPath}
        style={{
          borderRadius: "50%",
          margin: "0 .25rem",
        }}
        target="_blank"
      >
        <ExcelIcon />
      </IconButton>
    </Typography>
    {children}
  </Paper>
);

// PropTypes
//------------------------------------------------------------------------------
TableHeader.propTypes = {
  storeKey: PropTypes.string,
  printPath: PropTypes.string,
  xlsxPath: PropTypes.string,
  account: PropTypes.shape({
    balance: PropTypes.string,
    starting_balance: PropTypes.string,
    lastMonthBalance: PropTypes.string,
  }),
  loading: PropTypes.bool,
  children: PropTypes.any,
  classes: PropTypes.object.isRequired,
};

// Styles
//------------------------------------------------------------------------------
const styles = (theme) => ({
  root: {
    flexBasis: " 500px",
    minHeight: "250px",
    flex: "auto",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    marginTop: "8px",

    ["& .ReactVirtualized__Table__headerColumn:nth-child(n+0):nth-child(-n+3)"]: {
      marginRight: 0,
      marginLeft: 0,
    },
    ["& .SearchableTable .ReactVirtualized__Table__headerRow .ReactVirtualized__Table_" +
    "_headerColumn:nth-child(3)"]: {
      marginLeft: "15px",
      marginRight: 0,
    },
    ["& .SearchableTable .ReactVirtualized__Table__headerRow .ReactVirtualized__Table_" +
    "_headerColumn:nth-child(n+4)"]: {
      justifyContent: "flex-start",
      marginLeft: "0",
      marginRight: 0,
    },
    ["& .SearchableTable .ReactVirtualized__Table__headerRow .ReactVirtualized__Table_" +
    "_headerColumn:nth-child(-n+6)"]: {
      justifyContent: "flex-start",
      marginLeft: "10px",
      marginRight: 0,
    },
    ["& .SearchableTable .ReactVirtualized__Table__headerRow .ReactVirtualized__Table_" +
    "_headerColumn:nth-child(n+7):nth-child(-n+8)"]: {
      placeContent: "center",
      marginLeft: "5px",
      marginRight: "5px",
    },
    ["& .ReactVirtualized__Table__headerColumn:nth-child(n+9)"]: {
      justifyContent: "flex-end",
      marginRight: "0px !important",
      marginLeft: "10px",
    },
    ["& .SearchableTable .ReactVirtualized__Table__headerRow .ReactVirtualized__Table_" +
    "_headerColumn:nth-child(7)"]: {
      textAlign: "center",
      placeContent: "center",
      marginRight: 0,
      marginLeft: "10px",
    },
    ["& .SearchableTable .ReactVirtualized__Table__headerRow .ReactVirtualized__Table_" +
    "_headerColumn:last-child"]: {
      marginLeft: 0,
    },
    ["& .ReactVirtualized__Table__rowColumn:nth-child(1)"]: {
      placeContent: "center",
      marginRight: 0,
    },
    ["& .ReactVirtualized__Table__rowColumn:nth-child(3)"]: {
      placeContent: "center",
      marginRight: 0,
    },
    ["& .ReactVirtualized__Table__rowColumn:nth-child(n+8)"]: {
      marginRight: 0,
      display: "flex",
      alignItems: "center",
      height: "100%",
      width: "100%",
    },
    ["& .ReactVirtualized__Table__rowColumn:nth-child(7)"]: {
      justifyContent: "center",
    },
    ["& .ReactVirtualized__Table__rowColumn:nth-child(8)"]: {
      justifyContent: "center",
    },
    ["& .ReactVirtualized__Table__rowColumn:nth-child(11)"]: {
      justifyContent: "center",
    },
  },
  header: {
    padding: `.5em ${theme.spacing(1)}px`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f5f5",
    color: "#546E7A",

    "& b": {
      color: "#607D8B",
    },
  },
  ledgerText: {
    fontSize: "1.75em",
    lineHeight: "1.25em",
    flexGrow: 2,
  },
  chip: {
    backgroundColor: "#fcfcfc",
    border: "1px solid #CFD8DC",
  },
});

export default withStyles(styles)(TableHeader);
