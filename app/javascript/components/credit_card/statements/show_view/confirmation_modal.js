import PropTypes from "prop-types";

import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Button from "@material-ui/core/Button";

const ConfirmationModal = ({
  open = true,
  balance,
  statement_id,
  credit_card_id,
  statement_balance,
  aasm_action,
  createSubmitHandler = function () {},
  handleModalClose = function () {},
}) => (
  <Dialog open={open} onClose={handleModalClose}>
    <DialogTitle>Save Adjusted Balance?</DialogTitle>
    <DialogContent>
      <DialogContentText>
        You have an adjusted of balance of <b>{balance}</b>
        .
        <br />
        Do you really want to save this reconciliation?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleModalClose} color="primary">
        Cancel
      </Button>
      <Button
        onClick={createSubmitHandler({
          state_action: aasm_action,
          statement_id,
          credit_card_id,
          statement_balance,
        })}
        color="primary"
      >
        Submit
      </Button>
    </DialogActions>
  </Dialog>
);

ConfirmationModal.propTypes = {
  open: PropTypes.bool,
  balance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  statement_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  bank_account_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  aasm_action: PropTypes.string,
  statement_balance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  createSubmitHandler: PropTypes.func.isRequired,
  handleModalClose: PropTypes.func.isRequired,
};

export default ConfirmationModal;
