import PropTypes from "prop-types";
import DraftIcon from "./icons/states/draft_icon";
import ApprovedIcon from "./icons/states/approved_icon";
import NeedsApprovalIcon from "./icons/states/needs_approval_icon";
import NeedsRevisionIcon from "./icons/states/needs_revision_icon";
import PrintedIcon from "./icons/states/printed_icon";
import VoidedIcon from "./icons/states/voided_icon";

const StateIcon = ({aasmState = "draft", ...rest}) => {
  if (aasmState === "draft") {
    return <DraftIcon {...rest} />;
  }
  if (aasmState === "approved") {
    return <ApprovedIcon {...rest} />;
  }
  if (aasmState === "needs_approval") {
    return <NeedsApprovalIcon {...rest} />;
  }
  if (aasmState === "needs_revision") {
    return <NeedsRevisionIcon {...rest} />;
  }
  if (aasmState === "printed") {
    return <PrintedIcon {...rest} />;
  }
  if (aasmState === "voided") {
    return <VoidedIcon {...rest} />;
  }
  return null;
};

StateIcon.propTypes = {
  aasmState: PropTypes.string.isRequired,
};

export default StateIcon;
