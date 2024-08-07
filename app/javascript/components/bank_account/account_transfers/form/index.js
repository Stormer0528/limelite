import PropTypes from "prop-types";
import clsx from "clsx";
import {useCurrentRoute} from "react-navi";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import TextFieldWithCounter from "../../../shared/text_field_with_limit";
import UploadBtn from "../../../shared/upload_btn_container";
import {Formik, Form, ErrorMessage} from "formik";
import ApprovalFooter from "../../../shared/approval_footer";
import {calculateDebitsBalance} from "../../deposits/form/index";
import {RecoilRoot} from "recoil";

import EntryForm from "../../../entries/form/entry_form";
import {defaultEntryState} from "../../../entries/form/use_entry_form";
import SubmissionBar from "./submission_bar";
import {validationSchema} from "./account_transfer.schema";
import {withStyles} from "@material-ui/core/styles";
import DirectionIcon from "@material-ui/icons/ArrowForward";

const FormikForm = ({
  bankAccountId,
  bankAccounts,
  initialToBankAccountName,
  initialToBankAccountId,
  accountTransfer = {
    fromBankAccountName: "",
    fromBankAccountId: "",
    toBankAccountId: initialToBankAccountId,
    toBankAccountName: initialToBankAccountName,
    memo: "",
    fileUrl: "",
    entry: defaultEntryState,
  },
  accountObjectCode,
  isInitialValid = false,
  readOnly = false,
  disabled: formDisabled = false,
  hideAccountFinder = false,
  hideSubmissionBar = false,
  onSubmit = function () {},
  classes = {},
}) => {
  const {
    data: {cashAccounts = []},
  } = useCurrentRoute();

  const cashAccountCodes = cashAccounts.map((acc) => acc.code);

  return (
    <RecoilRoot>
      <section className={classes.root}>
        <Formik
          initialValues={{
            ...accountTransfer,
            bankAccountId,
          }}
          validationSchema={validationSchema.meta({accountObjectCode})}
          validateOnChange={false}
          isInitialValid={isInitialValid}
          onSubmit={onSubmit}
        >
          {({
            values,
            values: {
              fromBankAccountName,
              toBankAccountName,
              memo,
              fileUrl,
              entry,
              aasmState,
              creatorId,
            },
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            setValues,
            setFieldValue,
            isSubmitting,
          }) => {
            const disabled = formDisabled || isSubmitting;
            const entryItems = (entry && entry.entryItems) || [];
            const onAccountFinderUpdate = (account) => {
              if (account) {
                const bank = bankAccounts.find(
                  ({accountObject: {code}}) => code === account.objectCode
                );
                const {
                  entry: {
                    currentEntryIndex = 0,
                    entryItems: {
                      [currentEntryIndex]: {type: entryType},
                    },
                  },
                } = values;

                if (bank) {
                  if (entryType === "Credit") {
                    setFieldValue(
                      "fromBankAccountName",
                      `${bank.name} - ${account.objectCode}`
                    );
                    setFieldValue("fromBankAccountId", bank.id);
                  } else {
                    setFieldValue(
                      "toBankAccountName",
                      `${bank.name} - ${account.objectCode}`
                    );
                    setFieldValue("toBankAccountId", bank.id);
                  }
                }
              }
            };

            const toItem =
              entryItems.find(
                (item) =>
                  item.accountId &&
                  item.debit &&
                  cashAccountCodes.includes(item.objectCode)
              ) || {};

            const fromItem =
              entryItems.find(
                (item) =>
                  item.accountId &&
                  item.credit &&
                  cashAccountCodes.includes(item.objectCode)
              ) || {};

            const fromAccount = fromItem
              ? cashAccounts.find(({code}) => code === fromItem.objectCode)
              : {};

            const toAccount = toItem
              ? cashAccounts.find(({code}) => code === toItem.objectCode)
              : {};

            const toAccountTotal = calculateDebitsBalance(
              entryItems,
              toAccount ? toAccount.code : ""
            );

            return (
              <Paper
                elevation={1}
                className={clsx(classes.formContainer, {disabled, readOnly})}
              >
                <Form>
                  <ErrorMessage name="bankAccountId" ignoredKeys={["entry"]} />

                  <Grid container spacing={2}>
                    <Grid item xs={4} className={classes.formCell}>
                      <TextField
                        fullWidth
                        id="fromAccountName"
                        name="fromAccountName"
                        label="From Account"
                        variant="outlined"
                        value={
                          (fromAccount && fromAccount.name) ||
                          fromBankAccountName
                        }
                        InputProps={{
                          readOnly: true,
                          className: classes.nameCell,
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        helperText="Automatically added from Entry"
                      />
                    </Grid>
                    <Grid item xs={1} className={classes.iconCell}>
                      <DirectionIcon className={classes.icon} />
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      className={clsx(
                        classes.formCell,
                        classes.nameContainerCell
                      )}
                    >
                      <TextField
                        fullWidth
                        id="number"
                        name="number"
                        label="To Bank Account"
                        variant="outlined"
                        value={
                          (toAccount && toAccount.name) || toBankAccountName
                        }
                        InputProps={{
                          readOnly: true,
                          className: classes.nameCell,
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        helperText="Automatically added from Entry"
                      />
                    </Grid>
                    <Grid item xs className={classes.filestackCell}>
                      {(fileUrl || !readOnly) && (
                        <UploadBtn
                          value={fileUrl}
                          readOnly={readOnly}
                          disabled={disabled}
                          onChange={(url) => {
                            handleChange({
                              target: {
                                id: "fileUrl",
                                name: "fileUrl",
                                value: url,
                              },
                            });
                          }}
                        />
                      )}
                      <ErrorMessage name="fileUrl" />
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs>
                      <TextFieldWithCounter
                        fullWidth
                        id="memo"
                        name="memo"
                        label="Memo"
                        value={memo}
                        disabled={disabled}
                        InputProps={{readOnly}}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        margin="normal"
                        characterLimit={150}
                        error={errors.memo && touched.memo}
                        helperText={touched.memo && errors.memo}
                      />
                    </Grid>
                    <Grid item xs={2} className={classes.amountCell}>
                      <TextField
                        fullWidth
                        id="amount"
                        name="amount"
                        label="Amount"
                        variant="outlined"
                        value={toAccountTotal.format({prefix: true})}
                        InputProps={{readOnly: true}}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                  </Grid>

                  {/* Entry Form  */}
                  {entry && (
                    <EntryForm
                      {...{
                        values: entry,
                        errors,
                        touched,
                        handleBlur,
                        handleChange,
                        setValues,
                        setFieldValue,
                        hideAccountFinder,
                        disabled: formDisabled,
                        readOnly,
                        isSubmitting,
                        onAccountFinderUpdate,
                        entryItemBlurHandlerCallback: onAccountFinderUpdate,
                      }}
                    />
                  )}

                  {!hideSubmissionBar && (
                    <SubmissionBar
                      {...{
                        isOwner: creatorId === `${window.initial_data.currentUserId}`,
                        aasmState,
                        handleSubmit,
                        isSubmitting,
                        setFieldValue,
                        disabled: formDisabled,
                        permissions: values.permissions || {
                          save_draft: true,
                          send_for_approval: true,
                        },
                      }}
                    />
                  )}
                  {readOnly && (
                    <ApprovalFooter
                      className={classes.approvalFooter}
                      {...values}
                      {...{
                        hideStateBtns: true,
                        createSubmitHandler: () => () => {},
                      }}
                    />
                  )}
                </Form>
              </Paper>
            );
          }}
        </Formik>
      </section>
    </RecoilRoot>
  );
};

const styles = (theme) => ({
  root: {
    marginBottom: "5rem",
  },
  nameContainerCell: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start !important",
  },
  icon: {
    color: "#607D8B",
  },
  iconCell: {
    maxWidth: "40px",
    paddingTop: "1rem !important",
  },
  formContainer: {
    padding: `0 ${theme.spacing(1)}px ${theme.spacing(1)}px`,

    "&.disabled.readOnly input": {
      color: "#333",
    },
  },
  formCell: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  nameCell: {
    padding: "0.25rem 1rem",
  },
  amountCell: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "0 .75rem",

    "& input": {
      textAlign: "right",
      padding: ".55rem .75rem !important",
      backgroundColor: "#f5f5f5 !important",
    },
  },
  filestackCell: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "center",
    flexBasis: "50px",
    paddingRight: ".5rem !important",
  },
  selectDisabled: {color: "#333"},
  approvalFooter: {
    margin: "0.5rem -8px 0",
  },
});

FormikForm.propTypes = {
  bankAccountId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  bankAccountSlug: PropTypes.string,
  accountObjectCode: PropTypes.string,
  bankAccounts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      name: PropTypes.string,
    })
  ),
  initialToBankAccountName: PropTypes.string,
  initialToBankAccountId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  accountTransfer: PropTypes.shape({
    fromBankAccountName: PropTypes.string,
    fromBankAccountId: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    toBankAccountId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    toBankAccountName: PropTypes.string,
    memo: PropTypes.string,
    fileUrl: PropTypes.string,
    entry: defaultEntryState,
  }),
  isInitialValid: PropTypes.bool,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  hideAccountFinder: PropTypes.bool,
  hideSubmissionBar: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FormikForm);
