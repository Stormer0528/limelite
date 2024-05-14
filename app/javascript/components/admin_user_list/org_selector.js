import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import {compose} from "redux";
import {connect} from "react-redux";
import {graphql} from "react-apollo";

import OrgQuery from "../../graphql/queries/organizations.gql";

// Material UI
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

const OrgSelector = ({
  organizations = [],
  organization_id = "",
  showAllOrgOption = true,
  // Callbacks
  setCurrentOrg = function () {},
  classes = {},
}) => {
  return (
    <FormControl fullWidth className={classes.formControl}>
      <InputLabel htmlFor="organization">
        {organization_id && "Organization"}
      </InputLabel>
      <Select
        displayEmpty
        value={organization_id}
        onChange={setCurrentOrg}
        inputProps={{
          className: "browser-default",
          id: "organization",
        }}
      >
        {
          showAllOrgOption && (
            <MenuItem key="all" value={""}>
              All Organizations
            </MenuItem>
          )
        }
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
  organization_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  showAllOrgOption: PropTypes.bool,
  setCurrentOrg: PropTypes.func.isRequired,
};

const styles = () => ({
  formControl: {},
});

// Redux State
//------------------------------------------------------------------------------
const mapStateToProps = (state) => {
  const {users: {filter: {organization: organization_id} = {}} = {}} = state;
  return {
    organization_id,
  };
};

const mapDispatchToProps = (dispatch) => ({
  setCurrentOrg: ({target: {value}}) => {
    dispatch({type: "users/setOrganization", payload: value});
  },
});

export { OrgSelector };
export default compose(
  graphql(OrgQuery, {
    name: "OrgQuery",
    props: ({ OrgQuery: { organizationSearch } }) => {
      return { organizations: organizationSearch };
    },
  }),
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles)
)(OrgSelector);
