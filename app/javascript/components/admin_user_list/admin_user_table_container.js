import AdminUserTable from "./admin_user_table";
import {connect} from "react-redux";
import {compose} from "redux";
import {graphql} from "react-apollo";
import isEqual from "lodash/isEqual";

import UsersQuery from "../../graphql/queries/users.gql";

const mapStateToProps = (state, props) => {
  const {users: {filter} = {}} = state;
  const {
    usersQuery: {
      users = [],
      loading,
      refetch = function () {},
      variables: {cursor, first, ...restVars} = {},
    } = {},
  } = props;

  if (!isEqual(filter, restVars)) {
    refetch(filter);
  }

  const orgUsers = users.filter(({organizationAssignments}) => {
    return (
      organizationAssignments.filter(
        (assignment) => assignment.organizationId === filter.organization
      ).length > 0
    );
  });

  const nonOrgUsers = users.filter(({organizationAssignments}) => {
    return (
      organizationAssignments.filter(
        (assignment) => assignment.organizationId === filter.organization
      ).length === 0
    );
  });

  return {
    loading,
    users,
    orgUsers,
    nonOrgUsers,
    ...filter,
    userIds: users.map(({id}) => id),
    allSelected: false,
  };
};

const mapDispatchToProps = (
  dispatch,
  {usersQuery: {refetch = function () {}, variables = {}}, ...rest}
) => ({
  handleRefetchUsers: () => {
    refetch();
  },
  setUserRole: (id, orgId) => ({target: {value: role}}) => {
    dispatch({type: "SET_USER_ROLE", role, id, orgId, refetch, variables});
  },
  setUserType: (id, orgId) => ({target: {value: userType}}) => {
    dispatch({type: "SET_USER_TYPE", userType, id, orgId, refetch, variables});
  },
});

export default compose(
  graphql(UsersQuery, {name: "usersQuery"}),
  connect(mapStateToProps, mapDispatchToProps)
)(AdminUserTable);
