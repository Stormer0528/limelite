import PropTypes from "prop-types";
import Toolbar from "@material-ui/core/Toolbar";
import {withStyles} from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import SearchIcon from "@material-ui/icons/Search";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";

const ItemFilter = ({
  classes = {},
  type = "",
  start_date = "",
  end_date = "",
  number = "",
  name = "",
  show = true,
  /* callbacks */
  handleTypeChange = function () {},
  handleStartDateChange = function () {},
  handleEndDateChange = function () {},
  handleFilterNameChange = function () {},
  handleFilterNumberChange = function () {},
  handleFilterBtnClick = function () {},
}) => {
  return (
    <Toolbar className={classes.searchContainer}>
      <Grid
        container
        className={classes.container}
        spacing={1}
        alignItems="stretch"
        alignContent="space-around"
        justify="center"
        wrap="nowrap"
      >
        <Grid item>
          <IconButton
            className={classes.menuButton}
            color="inherit"
            variant={`${show ? "flat" : "raised"}`}
            aria-label="Menu"
            onClick={handleFilterBtnClick}
          >
            <SearchIcon />
          </IconButton>
        </Grid>
        <Grid item className={classes.gridItem}>
          <FormControl fullWidth style={{minWidth: "4.5em"}}>
            <InputLabel htmlFor="Type">Type</InputLabel>
            <Select
              autoWidth
              value={type}
              inputProps={{
                className: "browser-default",
              }}
              onChange={handleTypeChange}
            >
              <MenuItem value="ALL">All</MenuItem>
              <MenuItem value="deposit">Deposit</MenuItem>
              <MenuItem value="check">Check</MenuItem>
              <MenuItem value="account_transfer">Transfer</MenuItem>
            </Select>
            <FormHelperText>Filter by Type</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item className={classes.gridItem}>
          <TextField
            inputProps={{className: "browser-default"}}
            type="date"
            id="end_date"
            value={end_date}
            onChange={handleEndDateChange}
            helperText="Items after date"
            margin="normal"
          />
        </Grid>
        <Grid item className={classes.gridItem}>
          <TextField
            inputProps={{className: "browser-default"}}
            type="date"
            id="start_date"
            value={start_date}
            onChange={handleStartDateChange}
            helperText="Items before date"
            margin="normal"
          />
        </Grid>
        <Grid item className={classes.gridItem}>
          <TextField
            type="text"
            inputProps={{className: "browser-default"}}
            id="ChkNum"
            value={number}
            onChange={handleFilterNumberChange}
            placeholder="Check/Jrn #"
            helperText="Filter by Chk/Jrn #"
            margin="normal"
          />
        </Grid>
        <Grid item className={classes.gridItem}>
          <TextField
            type="text"
            inputProps={{className: "browser-default"}}
            id="name"
            placeholder="Payee"
            value={name}
            onChange={handleFilterNameChange}
            helperText="Filter by Payee"
            margin="normal"
          />
        </Grid>
      </Grid>
    </Toolbar>
  );
};

ItemFilter.propTypes = {
  classes: PropTypes.object,
  type: PropTypes.string,
  show: PropTypes.bool,
  start_date: PropTypes.string,
  end_date: PropTypes.string,
  number: PropTypes.string,
  name: PropTypes.string,
  handleTypeChange: PropTypes.func,
  handleStartDateChange: PropTypes.func,
  handleEndDateChange: PropTypes.func,
  handleFilterNameChange: PropTypes.func,
  handleFilterNumberChange: PropTypes.func,
  handleFilterBtnClick: PropTypes.func,
};

const styles = (theme) => ({
  container: {
    justifyContent: "stretch",
    alignItems: "center",
  },
  gridItem: {
    flexGrow: 1,
    marginRight: ".75rem",
  },
  searchContainer: {
    padding: 0,
  },
  menuButton: {
    "&:focus": {
      backgroundColor: "transparent",
    },
  },
});

export default withStyles(styles)(ItemFilter);
