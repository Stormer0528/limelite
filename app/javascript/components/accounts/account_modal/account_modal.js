import CREATE_ACCOUNT_MUTATION from "../../../graphql/mutations/create_new_account.gql";
import ACCOUNT_ELEMENTS_QUERY from "../../../graphql/queries/account_elements_by_code.gql";
import ValidationErrors from "../../new_entry_btn/validation_errors";
// Components
import PageHeader from "../../page_elements/page_header";
import useAccountModal from "./use_account_modal";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
// Material UI
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import {withStyles} from "@material-ui/core/styles";
// Icons
import FundIcon from "@material-ui/icons/AttachMoney";
import YearIcon from "@material-ui/icons/DateRange";
import FunctionIcon from "@material-ui/icons/Functions";
import LocationIcon from "@material-ui/icons/LocationOn";
import SaveIcon from "@material-ui/icons/Save";
import ResourceIcon from "@material-ui/icons/Vignette";
import ObjectIcon from "@material-ui/icons/WebAsset";
import GoalIcon from "@material-ui/icons/WifiTethering";
import SchoolIcon from "@shared/icons/school_icon";
import clsx from "clsx";
import capitalize from "lodash/capitalize";
import PropTypes from "prop-types";
import {Fragment, useState, useEffect} from "react";
import {useQuery, useMutation} from "react-apollo";
import NumberFormat from "react-number-format";

const AccountModal = ({classes = {}}) => {
  const {
    open = false,
    closeModal,
    resetAccount,
    account = {},
    onAccountCreated,
    handleOnAccountCreated = function () {},
  } = useAccountModal();

  const handleCloseModal = () => closeModal();

  const [errors, setErrors] = useState([]);
  const [budget, setBudget] = useState(0);
  const handleBudgetChange = ({floatValue}) => setBudget(floatValue);

  const {loading, data = {}} = useQuery(ACCOUNT_ELEMENTS_QUERY, {
    variables: account,
    fetchPolicy: "network-only",
  });

  // handleCreateAccount
  //--------------------------------------------------------------------------------------
  const [saveAccount] = useMutation(CREATE_ACCOUNT_MUTATION, {
    variables: {...account, budget},
  });

  const handleAccountSave = async () => {
    const response = await saveAccount();
    const {
      data: {
        createAccount: account,
        createAccount: {errors = []},
      },
    } = response;

    if (errors.length === 0) {
      closeModal();
      onAccountCreated(account);

      handleOnAccountCreated({
        account,
      }); /* Alternative setup for entryInput form */

      setTimeout(resetAccount, 500);
    } else {
      setErrors(errors);
    }
  };

  // Valid: if the validation query has returned and there are no null Elements
  const valid = !loading && !Object.values(data).some((v) => !v);

  const elements = [
    "fund",
    "resource",
    "year",
    "goal",
    "function",
    "object",
    "location",
  ];

  const elementIcons = [
    FundIcon,
    ResourceIcon,
    YearIcon,
    GoalIcon,
    FunctionIcon,
    ObjectIcon,
    SchoolIcon,
  ];

  // Focus budget input
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        const node = document.querySelector("input[name=budget]");
        node && node.select();
      }, 250);
    }
  }, [open]);

  return (
    <Dialog
      open={open || false}
      onClose={handleCloseModal}
      aria-labelledby="form-dialog-title"
      classes={{paperWidthSm: classes.dialogSm}}
      fullWidth
      maxWidth="xl"
    >
      <DialogTitle
        id="form-dialog-title"
        disableTypography={true}
        className={classes.dialogTitle}
        style={{paddingBottom: 0}}
      >
        <PageHeader
          page_name="Create Account"
          icon_type="account"
          icon_options="medium"
          tag_name="h4"
          style={{margin: 0}}
        />
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        {errors.length > 0 && (
          <Grid container spacing={2}>
            <Grid item sm={12}>
              <ValidationErrors errors={errors} />
            </Grid>
          </Grid>
        )}

        <Grid container spacing={2} className={classes.accountElementBox}>
          <Grid item sm={12}>
            <b>Account Number:&nbsp;</b>
            {elements.map((elem, i) => {
              const {name = elem, code = account[`${elem}Code`]} =
                data[`${elem}Object`] || {};
              return (
                <Fragment key={elem}>
                  <Tooltip placement="top" title={name}>
                    <span
                      className={clsx(classes.element, {
                        [classes.invalidElement]: name === elem,
                      })}
                    >
                      {code}
                    </span>
                  </Tooltip>
                  {elements.length - 1 !== i && (
                    <span>&nbsp;&ndash;&nbsp;</span>
                  )}
                </Fragment>
              );
            })}
          </Grid>
          <Grid item className={classes.inputCell}>
            <b>Name: &nbsp;</b>

            <TextField
              className={clsx(classes.textInput, classes.nameInput, {
                [classes.invalidElement]: !data["objectObject"],
              })}
              disabled
              fullWidth
              label={null}
              margin="dense"
              value={
                (data["objectObject"] && data["objectObject"].name) ||
                "Invalid Object Code"
              }
              inputProps={{
                className: "browser-default",
              }}
            />
          </Grid>

          <Grid item className={classes.inputCell}>
            <b>Budget: &nbsp;</b>
            <NumberFormat
              label={null}
              value={budget}
              margin="dense"
              name="budget"
              className={classes.textInput}
              onValueChange={handleBudgetChange}
              customInput={TextField}
              thousandSeparator
              prefix="$"
              decimalScale={2}
              fixedDecimalScale
              fullWidth
              inputProps={{
                className: "browser-default",
              }}
            />
          </Grid>
          <Grid container spacing={2}>
            <Grid item sm={12}>
              <List dense={true}>
                {elements.map((elem, i) => {
                  const text = elem === "location" ? "school" : elem;

                  const {
                    name = `Invalid ${capitalize(text)} Code`,
                    code = account[`${elem}Code`],
                  } = data[`${elem}Object`] || {};
                  const ElemIcon = elementIcons[i];
                  return (
                    <ListItem key={elem}>
                      <ListItemIcon>
                        <ElemIcon />
                      </ListItemIcon>
                      <ListItemText
                        className={clsx({
                          [classes.invalidElementRow]:
                            name === `Invalid ${capitalize(text)} Code`,
                        })}
                        primary={
                          <span>
                            <b style={{textTransform: "capitalize"}}>{text}:</b>
                            &nbsp;
                            {code}
                            &mdash;
                            {name}
                          </span>
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button color="primary" onClick={handleCloseModal}>
          Cancel
        </Button>

        <Button
          key="submit"
          color="primary"
          disabled={!valid}
          onClick={handleAccountSave}
        >
          <SaveIcon />
          &nbsp;&nbsp;Create Account
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AccountModal.propTypes = {
  classes: PropTypes.object,
  valid: PropTypes.bool,
  errors: PropTypes.arrayOf(PropTypes.string),
  open: PropTypes.bool,
  name: PropTypes.string,
  budget: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

const styles = (theme) => ({
  accountElementBox: {
    border: " 1px solid #B0BEC5",
    borderRadius: " 3px",
    backgroundColor: " #FAFAFA",
    marginTop: " .5rem",

    "& ul.MuiList-root": {
      maxWidth: "100%",
    },
  },
  inputCell: {
    display: "flex",
    alignItems: "baseline",
    width: "45%",
  },
  nameInput: {
    "& input": {
      color: "#6f8842 !important",
      fontWeight: 500,
    },
  },
  textInput: {
    paddingLeft: ".5em",

    "& input": {
      paddingLeft: ".25em !important",
    },
  },
  element: {
    fontWeight: "bold",
  },
  invalidElement: {
    color: "#e53935",
    textDecoration: "underline",

    "& input": {
      color: "#525a44bf !important",
    },
  },
  invalidElementRow: {
    color: "#C62828",
    border: "1px solid #C62828",
    backgroundColor: "#FFEBEE",
    borderRadius: "2px",
    fontWeight: "bold",
    padding: "0.25rem 16px",

    "& .MuiListItemText-primary.MuiListItemText-textDense": {
      color: "#C62828",
    },
  },
});

export default withStyles(styles)(AccountModal);
