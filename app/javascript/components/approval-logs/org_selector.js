// Material UI
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import PropTypes from "prop-types";

const OrgSelector = ({
  organizations = [],
  organizationId = "",
  showAllOrgOption = true,
  // Callbacks
  setCurrentOrg = function () {},
  classes = {},
}) => {
  return (
    <FormControl fullWidth className={classes.formControl}>
      <InputLabel htmlFor="organization">Organization</InputLabel>

      <Select
        displayEmpty
        value={organizationId}
        onChange={setCurrentOrg}
        inputProps={{
          className: "browser-default",
          name: "organizationId",
        }}
      >
        {showAllOrgOption && (
          <MenuItem key="all" value={0}>
            All Organizations
          </MenuItem>
        )}
        {organizations.map((org) => {
          return (
            <MenuItem key={org.id} value={org.id}>
              {org.name}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

OrgSelector.propTypes = {
  classes: PropTypes.object,
  organizations: PropTypes.array,
  organizationId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  showAllOrgOption: PropTypes.bool,
  setCurrentOrg: PropTypes.func.isRequired,
};

export default OrgSelector;
