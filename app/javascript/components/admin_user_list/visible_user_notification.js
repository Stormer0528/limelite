// Imports
//------------------------------------------------------------------------------
import {connect} from "react-redux";
import UserNotification from "./user_notification";

// Redux State
//------------------------------------------------------------------------------
const mapStateToProps = ({
  users: {ui: {notification: {visible, message, messageType} = {}} = {}},
}) => {
  return {visible, message, messageType};
};

const mapDispatchToProps = dispatch => {
  return {
    handleClose: () => {
      dispatch.users.hideUserMessage();
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserNotification);
