import PropTypes from "prop-types";
import {useFormikContext} from "formik";
import {withStyles} from "@material-ui/core/styles";

// Material UI
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

import StorageIcon from "@material-ui/icons/Storage";

const TableHeader = ({loading = false, classes = {}, children}) => {
  const {
    values: {bankAccounts = [], bank_account_id},
    handleChange = function() {},
  } = useFormikContext();

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
        <span className={classes.ledgerText}>Check Register</span>
        <div className={classes.dropdown}>
          <TextField
            select
            fullWidth
            variant="outlined"
            id="bank_account_id"
            label="Bank Account"
            inputProps={{
              name: "bank_account_id",
              // className: "browser-default",
            }}
            onChange={handleChange}
            value={bank_account_id || ""}
          >
            {bankAccounts.map(({id, name}) => (
              <MenuItem value={id} key={id}>
                {name}
              </MenuItem>
            ))}
          </TextField>
        </div>
      </Typography>
      {children}
    </Paper>
  );
};

// PropTypes
//------------------------------------------------------------------------------
TableHeader.propTypes = {
  loading: PropTypes.bool,
  children: PropTypes.any,
  classes: PropTypes.object.isRequired,
};

// Styles
//------------------------------------------------------------------------------
const styles = theme => ({
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
  ledgerText: {
    fontSize: "1.75em",
    lineHeight: "1.25em",
    flexGrow: 2,
  },
  chip: {
    backgroundColor: "#fcfcfc",
    border: "1px solid #CFD8DC",
  },
  dropdown: {
    width: "15rem",

    "& > div > div": {
      padding: ".35em .75em",
    },

    "& > div > div > div": {
      paddingTop: ".25em",
      paddingBottom: ".25em",
    },

    "& > div > div > svg": {
      top: "calc(50% - 10px)",
    },

    "& label": {
      transform: "translate(10px, 12px) scale(1)",
    },
  },
});

export default withStyles(styles)(TableHeader);
