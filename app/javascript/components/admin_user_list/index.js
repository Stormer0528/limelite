import {useState, useEffect} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";
import {useQuery} from "@apollo/react-hooks";

import Breadcrumb from "./breadcrumb";
import TopBar from "../topbar";
import Fab from "./fab";
import UserNotification from "./visible_user_notification";
import Tabs from "./tabs";
import NewGroupModal from "../users/groups/user_group_modal";

import {getSelectedUserCount} from "../../selectors/admin_user_filter_selector";
import ORGANIZATION_QUERY from "../../graphql/queries/organizations";

const AdminUserList = (props) => {
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const {
    loading,
    refetch,
    data: { organizationSearch = [] } = {},
  } = useQuery(ORGANIZATION_QUERY, { fetchPolicy: "cache-and-network" });

  // Adjust global body styling
  useStyles();
  return (
    <TopBar {...props} isAdminPage={true}>
      <Breadcrumb />
      <Tabs
        organizations={organizationSearch}
      />
      <UserNotification />
      <Fab onAddGroup={() => setGroupDialogOpen(true)} />

      {groupDialogOpen && (
        <NewGroupModal
          {...{
            parentId: null,
            open: groupDialogOpen,
            handleClose: () => setGroupDialogOpen(false),
            action: "new",
            refetch: () => window.location.reload()
          }}
        />
      )}
    </TopBar>
  );
};

AdminUserList.propTypes = {
  selected_user_count: PropTypes.number,
};

// Redux State
//------------------------------------------------------------------------------
const mapStateToProps = (state) => {
  return {
    selected_user_count: getSelectedUserCount(state),
  };
};

export default connect(mapStateToProps)(AdminUserList);

const useStyles = makeStyles((theme) => ({
  "@global": {
    "html > body": {
      gridTemplateRows: "64px 0 1fr",
    },
  },
}));
