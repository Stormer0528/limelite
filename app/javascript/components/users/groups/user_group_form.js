import {useCallback} from "react";
import PropTypes from "prop-types";
import cx from "clsx";
import isNull from "lodash/isNull";
import {makeStyles} from "@material-ui/core/styles";
import {useSnackbar} from "notistack";
import {useMutation} from "@apollo/react-hooks";

import {Formik, Form, Field} from "formik";
import {TextField} from "formik-material-ui";
import MUITextField from "@material-ui/core/TextField";

import LinearProgress from "@material-ui/core/LinearProgress";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import DialogActions from "@material-ui/core/DialogActions";
import InputAdornment from "@material-ui/core/InputAdornment";
import NumberFormat from "react-number-format";
import MenuItem from "@material-ui/core/MenuItem";

import ARCHIVE_USERS_QUERY from "@graphql/mutations/archive_user_group.gql";

// Icons
import AccountIcon from "@shared/icons/account_icon";
import BankAccountIcon from "@shared/icons/bank_account_icon";
import BatchUploadIcon from "@shared/icons/batch_upload_icon";
import CreditCardIcon from "@shared/icons/credit_card_icon";
import CustomerIcon from "@shared/icons/customer_icon";
import ReportIcon from "@shared/icons/report_icon";
import VendorIcon from "@shared/icons/vendor_icon";
import DeleteIcon from "@material-ui/icons/Delete";

const UserGroupForm = ({
  name = "",
  action = "",
  id,
  parentId,
  userGroups = [],
  approvalAmount = 0,
  modulePermissions = {},

  refetch = function () {},
  handleSubmit = function () {},
  handleClose = function () {},
}) => {
  const classes = useStyles();
  const {enqueueSnackbar} = useSnackbar();
  const permissions = [
    {label: "None", value: ""},
    {label: "Viewer", value: "Viewer"},
    {label: "Editor", value: "Editor"},
    {label: "Owner", value: "Owner"},
  ];

  const [archiveGroup] = useMutation(ARCHIVE_USERS_QUERY);
  const handleArchiveClick = useCallback(
    (e) => {
      e.preventDefault();

      const confirmClick = confirm(
        "Are you sure you want to destroy this group?"
      );

      if (confirmClick) {
        const callback = async () => {
          const response = await archiveGroup({variables: {id}});

          const {data: {archiveUserGroup: {success, errorMessages = []}} = {}} =
            response;

          if (success) {
            refetch();
            handleClose();
            window.location.reload();
          } else {
            errorMessages &&
              errorMessages.forEach((error) => {
                enqueueSnackbar(error, {
                  variant: "error",
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "center",
                  },
                });
              });
          }
        };

        callback();
      }
    },
    [archiveGroup, id, refetch, handleClose, enqueueSnackbar]
  );

  return (
    <Formik
      initialValues={{
        name,
        id,
        parentId,
        approvalAmount: approvalAmount / 100 || 0,
        modulePermissions: modulePermissions || {},
      }}
      onSubmit={handleSubmit}
    >
      {({submitForm, isSubmitting, values, handleChange}) => {
        const handleAmountChange = ({floatValue}) => {
          handleChange({
            target: {
              value: floatValue,
              name: "approvalAmount",
            },
          });
        };

        return (
          <Form className="react-inputs">
            {isSubmitting && <LinearProgress className={classes.progress} />}
            <Grid container spacing={3} className={classes.container}>
              <Grid item xs={6}>
                <Field
                  fullWidth
                  component={TextField}
                  name="name"
                  type="name"
                  label="Name"
                />
              </Grid>
              <Grid item xs={4}>
                <Field
                  fullWidth
                  select
                  component={TextField}
                  name="parentId"
                  type="parentId"
                  label="Parent Group"
                  disabled={isNull(parentId)}
                >
                  {(userGroups || []).map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Field>
              </Grid>
              <Grid item xs={4}>
                <NumberFormat
                  allowNegative={false}
                  customInput={MUITextField}
                  decimalScale={2}
                  fixedDecimalScale
                  label="Approval Amount"
                  margin="dense"
                  name={"approvalAmount"}
                  onValueChange={handleAmountChange}
                  prefix="$"
                  multiline
                  thousandSeparator
                  value={values.approvalAmount}
                />
              </Grid>
              <Grid item xs />
            </Grid>

            <Grid
              container
              spacing={3}
              className={cx(classes.container, classes.moduleContainer)}
            >
              <Grid item xs={12}>
                <h4 className={classes.moduleTitle}>MODULE PERMISSIONS</h4>
              </Grid>
              <Grid item xs={6}>
                <Field
                  select
                  fullWidth
                  component={TextField}
                  label="Account Permissions"
                  name="modulePermissions.Account"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountIcon />
                      </InputAdornment>
                    ),
                  }}
                >
                  {permissions.map((option) => (
                    <MenuItem
                      key={option.value || "None"}
                      value={option.value || ""}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </Field>
              </Grid>
              <Grid item xs={6}>
                <Field
                  select
                  fullWidth
                  component={TextField}
                  label="Bank Account Permissions"
                  name="modulePermissions.BankAccount"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BankAccountIcon />
                      </InputAdornment>
                    ),
                  }}
                >
                  {permissions.map((option) => (
                    <MenuItem
                      key={option.value || "None"}
                      value={option.value || ""}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </Field>
              </Grid>
              <Grid item xs={6}>
                <Field
                  select
                  fullWidth
                  component={TextField}
                  label="Batch Upload Permissions"
                  name="modulePermissions.BatchUpload"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BatchUploadIcon />
                      </InputAdornment>
                    ),
                  }}
                >
                  {permissions.map((option) => (
                    <MenuItem
                      key={option.value || "None"}
                      value={option.value || ""}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </Field>
              </Grid>
              <Grid item xs={6}>
                <Field
                  select
                  fullWidth
                  component={TextField}
                  label="Credit Card Permissions"
                  name="modulePermissions.CreditCard"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CreditCardIcon />
                      </InputAdornment>
                    ),
                  }}
                >
                  {permissions.map((option) => (
                    <MenuItem
                      key={option.value || "None"}
                      value={option.value || ""}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </Field>
              </Grid>
              <Grid item xs={6}>
                <Field
                  select
                  fullWidth
                  component={TextField}
                  label="Customer Permissions"
                  name="modulePermissions.Customer"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CustomerIcon />
                      </InputAdornment>
                    ),
                  }}
                >
                  {permissions.map((option) => (
                    <MenuItem
                      key={option.value || "None"}
                      value={option.value || ""}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </Field>
              </Grid>
              <Grid item xs={6}>
                <Field
                  select
                  fullWidth
                  component={TextField}
                  label="Report Permissions"
                  name="modulePermissions.Report"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ReportIcon />
                      </InputAdornment>
                    ),
                  }}
                >
                  {permissions.map((option) => (
                    <MenuItem
                      key={option.value || "None"}
                      value={option.value || ""}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </Field>
              </Grid>
              <Grid item xs={6}>
                <Field
                  select
                  fullWidth
                  component={TextField}
                  label="Vendor Permissions"
                  name="modulePermissions.Vendor"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <VendorIcon />
                      </InputAdornment>
                    ),
                  }}
                >
                  {permissions.map((option) => (
                    <MenuItem
                      key={option.value || "None"}
                      value={option.value || ""}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </Field>
              </Grid>
            </Grid>

            <DialogActions>
              {/* {!isNull(parentId) && action !== "new" && (
                <Button
                  onClick={handleArchiveClick}
                  className={classes.deleteBtn}
                  startIcon={<DeleteIcon />}
                >
                  Destroy
                </Button>
              )} */}
              <div className={classes.spacer} />
              <Button onClick={handleClose} color="secondary">
                Cancel
              </Button>
              <Button onClick={submitForm} color="primary" autoFocus>
                Submit
              </Button>
            </DialogActions>
          </Form>
        );
      }}
    </Formik>
  );
};
UserGroupForm.propTypes = {
  name: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  parentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  userGroups: PropTypes.array,
  action: PropTypes.string,
  approvalAmount: PropTypes.number,
  modulePermissions: PropTypes.object,
  refetch: PropTypes.func,
  handleClose: PropTypes.func,
  handleSubmit: PropTypes.func,
};

const useStyles = makeStyles((theme) => ({
  progress: {
    height: 2,
  },
  container: {
    padding: theme.spacing(2),
  },
  moduleTitle: {
    color: "#6B6B6B",
    fontSize: 12,
    fontVariant: "small-caps",
    margin: "-8px 0",
    fontWeight: "bold",
  },
  moduleContainer: {
    margin: 4,
    border: "1px solid #ccc",
    padding: "12px 8px",
    width: "inherit",
    borderRadius: 8,
  },
  deleteBtn: {
    ...theme.approvalBtns.denyBtn,
  },
  spacer: {
    minWidth: "3rem",
    flexGrow: 1,
  },
}));

export default UserGroupForm;
