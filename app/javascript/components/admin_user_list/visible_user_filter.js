// Imports
//------------------------------------------------------------------------------
import {connect} from "react-redux";
import UserFilter from "./user_filter";

// Redux State
//------------------------------------------------------------------------------
const mapStateToProps = ({users: {filter = {}} = {}}) => {
  return {...filter};
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleNameChange: (e) => {
      dispatch.users.setName(e.target.value);
    },
    handleEmailChange: (e) => {
      dispatch.users.setEmail(e.target.value);
    },
    handleSchoolChange: ({target: {value}}) => {
      dispatch.users.selectSchool(parseInt(value));
    },
    handleRoleChange: ({target: {value}}) => {
      dispatch.users.selectRole(value);
    },
    handleTypeChange: ({target: {value}}) => {
      dispatch.users.setType(value);
    },
    handleAdminChange: (_e, value) => {
      dispatch.users.toggleAdmin(value);
    },
    handleArchivedChange: (_e, value) => {
      dispatch.users.toggleArchived(value);
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserFilter);
