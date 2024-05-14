import {Fragment, useState, useCallback} from "react";
import PropTypes from "prop-types";

import DenialModal from "@shared/auth_footer/denial_modal";
import DenyIcon from "@material-ui/icons/ThumbDown";
import Button from "@material-ui/core/Button";

function RejectBtn({
  index,
  isFileApproved,
  file = {},
  onSave = function () {},
  classes = {},
}) {
  const [denialModalOpen, setDenialModalOpen] = useState(false);
  const handleOpen = useCallback(() => {
    setDenialModalOpen(true);
  }, [setDenialModalOpen]);

  const handleClose = useCallback(() => {
    setDenialModalOpen(false);
  }, [setDenialModalOpen]);

  const denyItem = useCallback(
    ({variables: {reason = ""} = {}}) => {
      onSave({reason, index});
    },
    [index, onSave]
  );

  return (
    <Fragment>
      <DenialModal
        {...{
          open: denialModalOpen,
          handleClose: handleClose,
          handleSave: denyItem,
        }}
      />
      <Button
        fullWidth
        disabled={isFileApproved && file.invoiceNumber}
        onClick={handleOpen}
        className={classes.denyBtn}
        startIcon={<DenyIcon />}
      >
        Reject
      </Button>
    </Fragment>
  );
}

RejectBtn.propTypes = {
  index: PropTypes.number,
  isFileApproved: PropTypes.bool,
  file: PropTypes.shape({
    invoiceNumber: PropTypes.string,
  }),
  classes: PropTypes.object.isRequired,
};

export default RejectBtn;
