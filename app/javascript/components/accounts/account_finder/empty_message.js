// Account Finder --> EmptyMessage
import PropTypes from "prop-types";
import useAccountModal from "../account_modal/use_account_modal";
import {withStyles} from "@material-ui/core/styles";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const EmptyMessage = ({
  handleOnAccountCreated = function() {},
  values = {},
  classes = {},
}) => {
  const {setAccount, setonAccountCreated, openModal} = useAccountModal();

  const handleClick = () => {
    setAccount(values);
    setonAccountCreated(handleOnAccountCreated);
    openModal();
  };

  return (
    <section className={classes.root}>
      <Typography className={classes.message}>
        No Matching Accounts Exist
      </Typography>
      <Button color="primary" onClick={handleClick}>
        + Create Account
      </Button>
    </section>
  );
};

EmptyMessage.propTypes = {
  values: PropTypes.object,
  handleOnAccountCreated: PropTypes.func,
  classes: PropTypes.object.isRequired,
};

const styles = theme => ({
  root: {
    textAlign: "center",
    border: "1px solid #c8c8c8",
    padding: "1rem",
    borderRadius: "3px",
    margin: "0 .5rem .5rem",
    background: "#ECEFF1",
  },
  message: {
    fontSize: "1.5rem",
    color: "#455A64",
  },
});

export default withStyles(styles)(EmptyMessage);
