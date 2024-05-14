import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";

// Material-UI
import Grid from "@material-ui/core/Grid";
import Input from "@material-ui/core/Input";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import FilterIcon from "@material-ui/icons/FilterList";
import IconButton from "@material-ui/core/IconButton";
import NumberFormat from "react-number-format";

const SearchBar = ({
  show = false,
  starting_balance = "0.00",
  ending_balance = "0.00",
  setStartingBalance = function () {},
  setEndingBalance = function () {},
  handleFilterBtnClick = function () {},
  classes = {},
  editable = false,
  readOnly = false,
}) => {
  return (
    <div className={classes.root}>
      <Toolbar>
        <Grid container className={classes.container}>
          <Grid item className={classes.btnCell}>
            <Tooltip title="Filter Visible Items" enterDelay={300}>
              <IconButton
                className={classes.menuButton}
                color="inherit"
                variant={`${show ? "flat" : "contained"}`}
                aria-label="Menu"
                onClick={handleFilterBtnClick}
              >
                <FilterIcon />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item className={classes.cell}>
            <b>Starting Balance:</b>
          </Grid>
          <Grid item className={classes.cell}>
            <NumberFormat
              name="starting_balance"
              label="Starting Balance"
              margin="dense"
              className={classes.textInput}
              value={starting_balance}
              onValueChange={setStartingBalance}
              customInput={Input}
              thousandSeparator
              prefix="$"
              required={true}
              decimalScale={2}
              fixedDecimalScale
              disabled={!editable}
              readOnly={true}
            />
          </Grid>

          <Grid item className={classes.cell}>
            <b>Ending Balance:</b>
          </Grid>
          <Grid item className={classes.cell}>
            <NumberFormat
              className={classes.textInput}
              customInput={Input}
              decimalScale={2}
              disabled={!editable}
              fixedDecimalScale
              label="Ending Balance"
              margin="dense"
              name="ending_balance"
              onValueChange={setEndingBalance}
              prefix="$"
              readOnly={readOnly}
              required={true}
              thousandSeparator
              value={ending_balance}
            />
          </Grid>
        </Grid>
      </Toolbar>
    </div>
  );
};

SearchBar.propTypes = {
  show: PropTypes.bool,
  editable: PropTypes.bool,
  readOnly: PropTypes.bool,
  setStartingBalance: PropTypes.func,
  setEndingBalance: PropTypes.func,
  starting_balance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ending_balance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  handleFilterBtnClick: PropTypes.func,
  classes: PropTypes.object.isRequired,
};

const styles = () => ({
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
  },
  btnCell: {
    flexGrow: 1,
  },
  cell: {
    marginRight: "1rem",
    [" &:last-child"]: {
      marginRight: 0,
    },
  },
  menuButton: {
    "&:focus": {
      backgroundColor: "transparent",
    },
  },
});

export default withStyles(styles)(SearchBar);
