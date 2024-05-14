import PropTypes from "prop-types";
import clsx from "clsx";

import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import TextFieldWithCounter from "@shared/text_field_with_limit";
import UploadBtn from "@shared/upload_btn_container";
import {Formik, Form, ErrorMessage} from "formik";
import ApprovalFooter from "@shared/approval_footer";
import currency from "currency.js";
import EntryForm from "../../checks/form/entry_form_container";
import {defaultEntryState} from "../../../entries/form/use_entry_form";
import SubmissionBar from "./submission_bar";
import {validationSchema} from "./deposit.schema";
import {withStyles} from "@material-ui/core/styles";
import {RecoilRoot} from "recoil";
import {EntryFormProvider} from "../../../entries/form/entry_form_context";
import Api from "../../api";
import { useState } from "react";

defaultEntryState.entryType = "Revenue";

export const calculateDebitsBalance = (items = [], cashAccountCode) => {
  return items
    .filter(({objectCode}) => {
      return objectCode === cashAccountCode;
    })
    .reduce(
      (accum, {debit, credit} = {}) => accum.add(debit).subtract(credit),
      currency(0)
    );
};

const FormikForm = ({
  bankAccountId,
  deposit = {
    number: "",
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
  const [key, setKey] = useState(0);

  return (
    <RecoilRoot>
      <section className={classes.root}>
        <Formik
          initialValues={{
            ...deposit,
            bankAccountId,
          }}
          validationSchema={validationSchema.meta({accountObjectCode})}
          validateOnChange={false}
          isInitialValid={isInitialValid}
          onSubmit={onSubmit}
        >
          {({
            values,
            values: {number, memo, fileUrl, entry, aasmState},
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

            return (
              <Paper
                elevation={1}
                className={clsx(classes.formContainer, {disabled, readOnly})}
              >
                <Form>
                  <EntryFormProvider>
                    <ErrorMessage
                      name="bankAccountId"
                      ignoredKeys={["entry"]}
                    />

                    <Grid container spacing={2}>
                      <Grid item xs={4} className={classes.formCell}>
                        <TextField
                          fullWidth
                          id="number"
                          name="number"
                          label="Number"
                          value={number}
                          disabled={disabled}
                          InputProps={{readOnly}}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={!!errors.number && !!touched.number}
                          helperText={touched.number && errors.number}
                        />
                      </Grid>
                      <Grid item xs className={classes.filestackCell}>
                        <UploadBtn
                          key={key}
                          value={fileUrl}
                          readOnly={false}
                          disabled={false}
                          onChange={(url) => {
                            if (readOnly) {
                              if (window.confirm(`Are you sure you want to ${url ? 'add file' : 'delete file'}?`)) {
                                Api.updateDepositFile({
                                  id: deposit.id,
                                  fileUrl: url
                                }).then(() => {
                                  window.location.reload();
                                })
                              } else {
                                setKey(key+1);
                              }

                              return ;
                            }

                            handleChange({
                              target: {
                                id: "fileUrl",
                                name: "fileUrl",
                                value: url,
                              },
                            });
                          }}
                        />
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
                          value={`$${calculateDebitsBalance(
                            entryItems,
                            accountObjectCode
                          )}`}
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
                          disableUpload: true
                        }}
                      />
                    )}

                    {!hideSubmissionBar && (
                      <SubmissionBar
                        {...{
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
                  </EntryFormProvider>
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
  deposit: PropTypes.shape({
    checkType: PropTypes.string,
    number: PropTypes.string,
    memo: PropTypes.string,
    fileUrl: PropTypes.string,
    entry: PropTypes.shape({
      date: PropTypes.string,
      entryType: PropTypes.string,
    }),
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
