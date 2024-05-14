import PropTypes from "prop-types";

// Material UI
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Chip from "@material-ui/core/Chip";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import Icon from "@mdi/react";
import {mdiFilePdf} from "@mdi/js";

import StorageIcon from "@material-ui/icons/Storage";
import ExcelIcon from "mdi-react/FileTableOutlineIcon";
import {withStyles} from "@material-ui/core/styles";

const TableHeader = ({
  loading = false,
  account: {balance = "$0.00", lastStatementBalance = "$0.00"} = {},
  print_path = "./print",
  xlsx_path,
  classes = {},
  children,
  ledgerView = "summary",
  handleToggleSetUiDetailView,
}) => {
  return (
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

        <FormControlLabel
          control={
            <Switch
              classes={{
                thumb: classes.thumb,
              }}
              checked={ledgerView === "detail"}
              onChange={handleToggleSetUiDetailView}
              value="checked"
            />
          }
          label={`${ledgerView === "detail" ? "Detail View" : "Summary View"}`}
        />
        <div className="last-statement-balance text-grey">
          <b>Last Statement Balance:</b>
          {"  "}
          {lastStatementBalance}
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
          href={print_path}
          style={{
            borderRadius: "50%",
            margin: "0 .25rem",
          }}
          target="_blank"
        >
          <Icon
            path={mdiFilePdf}
            size={1}
            horizontal
            vertical
            rotate={180}
            color="#707070"
          />
        </IconButton>
        <IconButton
          component="a"
          href={xlsx_path}
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
};

// PropTypes
//------------------------------------------------------------------------------
TableHeader.propTypes = {
  storeKey: PropTypes.string,
  print_path: PropTypes.string,
  xlsx_path: PropTypes.string,
  account: PropTypes.shape({
    balance: PropTypes.string,
    starting_balance: PropTypes.string,
    lastMonthBalance: PropTypes.string,
  }),
  loading: PropTypes.bool,
  ledgerView: PropTypes.string,
  handleToggleSetUiDetailView: PropTypes.func.isRequired,
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
  },
  header: {
    padding: `.5em ${theme.spacing(1)}px`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f5f5",
    color: "#546E7A",

    ["& b"]: {
      color: "#607D8B",
    },
  },
  thumb: {
    paddingLeft: "0 !important",
    lineHeight: "20px !important",
    height: "20px !important",
    "&:before": {
      display: "none",
    },
    "&:after": {
      display: "none",
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
