import PropTypes from "prop-types";
import {useSelector} from "react-redux";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Button from "@material-ui/core/Button";
import {withStyles} from "@material-ui/core/styles";
import StateBtns from "./state_btns";

const ConfirmationModal = ({
  open = true,
  balance,
  statement_id,
  bank_account_id,
  statement_balance,
  createSubmitHandler = function() {},
  handleModalClose = function() {},
  classes = {},
}) => {
  const submitHandler = btnAction =>
    createSubmitHandler({
      state_action: btnAction,
      statement_id,
      bank_account_id,
      statement_balance,
    });

  const {aasm_state, valid, permissions = {}} = useSelector(
    ({statement}) => statement
  );

  return (
    <Dialog open={open} onClose={handleModalClose} maxWidth="lg">
      <DialogTitle>Save Adjusted Balance?</DialogTitle>
      <DialogContent>
        <DialogContentText className={classes.text}>
          You have an adjusted of balance of{" "}
          <b style={{color: "#000"}}>{balance}</b>.
          <br />
          Do you really want to save this reconciliation?
        </DialogContentText>
      </DialogContent>
      <DialogActions className={classes.footer}>
        <Button onClick={handleModalClose} color="primary">
          Cancel
        </Button>
        <StateBtns {...{valid, aasm_state, permissions, submitHandler}} />
      </DialogActions>
    </Dialog>
  );
};

ConfirmationModal.propTypes = {
  open: PropTypes.bool,
  balance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  statement_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  bank_account_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  aasm_action: PropTypes.string,
  statement_balance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  createSubmitHandler: PropTypes.func.isRequired,
  handleModalClose: PropTypes.func.isRequired,
  classes: PropTypes.object,
};

const styles = theme => ({
  text: {
    "& b": {
      color: "#333",
    },
  },
  footer: {
    borderTop: "1px solid #CFD8DC",
    padding: "3px 8px",
    margin: "0",
    background: "#FAFAFA",
  },
});

export default withStyles(styles)(ConfirmationModal);
