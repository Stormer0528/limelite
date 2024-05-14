// Imports
//------------------------------------------------------------------------------
import PropTypes from "prop-types";

// Material UI
import Grid from "@material-ui/core/Grid";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {withStyles} from "@material-ui/core/styles";

import FilterIcon from "@material-ui/icons/Search";
import OrgSelector from "./org_selector";

// Component
//------------------------------------------------------------------------------
const UserFilter = ({
  name,
  email,
  admin = false,
  archived = false,
  // Callbacks
  handleNameChange = function () {},
  handleEmailChange = function () {},
  handleAdminChange = function () {},
  handleArchivedChange = function () {},
  classes = {},
}) => {
  return (
    <Grid container spacing={2} className={classes.container}>
      <Grid item style={{display: "flex", alignItems: "center"}}>
        <FilterIcon />
      </Grid>
      <Grid item md={3}>
        <TextField
          className={classes.formControl}
          fullWidth
          id="name"
          inputProps={{className: "browser-default"}}
          label="Filter by Name"
          margin="dense"
          onChange={handleNameChange}
          value={name}
          variant="outlined"
        />
      </Grid>
      <Grid item md={3}>
        <TextField
          className={classes.formControl}
          fullWidth
          id="email"
          inputProps={{className: "browser-default"}}
          label="Filter by Email"
          margin="dense"
          onChange={handleEmailChange}
          value={email}
          variant="outlined"
        />
      </Grid>
      <Grid item style={{display: "flex"}}>
        <FormControlLabel
          control={
            <Checkbox
              onChange={handleAdminChange}
              label="Admin"
              className="admin-checkbox"
              checked={admin === true}
            />
          }
          label="Admin"
        />
      </Grid>

      <Grid item style={{display: "flex"}}>
        <FormControlLabel
          control={
            <Checkbox
              onChange={handleArchivedChange}
              label="Archived"
              className="archived-checkbox"
              checked={archived === true}
            />
          }
          label="Archived"
        />
      </Grid>

      <Grid item xs />
      <Grid item sm={3}>
        <OrgSelector />
      </Grid>
    </Grid>
  );
};

// Props
//------------------------------------------------------------------------------
UserFilter.propTypes = {
  name: PropTypes.string,
  email: PropTypes.string,
  role: PropTypes.string,
  type: PropTypes.string,
  school: PropTypes.number,
  schools: PropTypes.array,
  admin: PropTypes.bool,
  handleNameChange: PropTypes.func,
  handleEmailChange: PropTypes.func,
  handleSchoolChange: PropTypes.func,
  handleTypeChange: PropTypes.func,
  handleRoleChange: PropTypes.func,
  handleAdminChange: PropTypes.func,
  classes: PropTypes.object,
};

const styles = (theme) => ({
  container: {
    flexWrap: "nowrap",
    width: "calc(100% - 2em)",
    margin: "0 1em",
  },
  formControl: {
    marginTop: 0,
  },
});

export default withStyles(styles)(UserFilter);
