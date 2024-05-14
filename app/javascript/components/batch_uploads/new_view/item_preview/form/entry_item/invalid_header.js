import PropTypes from "prop-types";

import {useCallback} from "react";
import {withStyles} from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import useAccountModal from "../../../../../accounts/account_modal/use_account_modal";
import useEntryForm from "../use_entry_form";

const InvalidHeader = ({itemName, value = {}, classes = {}, ...rest}) => {
  const {setAccount, setonAccountCreated, openModal} = useAccountModal();

  const {multiUpdate} = useEntryForm();
  const handleClick = useCallback(() => {
    const handleOnAccountCreated = (account) => {
      multiUpdate(
        itemName,
        /* value: */
        {...account, accountName: account.name}
      );
    };

    setAccount(value);
    setonAccountCreated(handleOnAccountCreated);
    openModal();
  }, [
    itemName,
    multiUpdate,
    openModal,
    setAccount,
    setonAccountCreated,
    value,
  ]);

  return (
    <Grid item className={classes.root}>
      <Grid container alignItems="center" justify="space-between" spacing={1}>
        <Grid item style={{flexGrow: 1}}>
          <Typography variant="subtitle1">
            <b style={{color: "#B71C1C"}}>Account Not Found</b>
          </Typography>
        </Grid>
        <Grid item>
          <Button
            color="primary"
            variant="outlined"
            className={classes.createBtn}
            onClick={handleClick}
          >
            + Create Account
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

InvalidHeader.propTypes = {
  /* itemName: (object path) to the currenty Entry item, same as name var in EntryItem */
  itemName: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  /* value: account codes passed to new account modal */
  value: PropTypes.shape({
    fundCode: PropTypes.string,
    resourceCode: PropTypes.string,
    yearCode: PropTypes.string,
    goalCode: PropTypes.string,
    functionCode: PropTypes.string,
    objectCode: PropTypes.string,
    locationCode: PropTypes.string,
  }),
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  root: {
    paddingLeft: "8px",
    color: "#B71C1C",
    backgroundColor: "#FCE4EC",
    gridArea: "hed / hed / hed / hed",
    marginBottom: "4px",
  },
  createBtn: {
    padding: ".125rem .5rem",
    margin: ".125rem 0",
    background: "#fef7f9",
    marginRight: ".125rem",
  },
});

export default withStyles(styles)(InvalidHeader);
