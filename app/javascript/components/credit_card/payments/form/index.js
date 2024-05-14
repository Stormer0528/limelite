import PropTypes from "prop-types";
import {Formik, Form, ErrorMessage} from "formik";
import currency from "currency.js";
import {defaultEntryState} from "../../../entries/form/use_entry_form";
import {withStyles} from "@material-ui/core/styles";
import {RecoilRoot} from "recoil";
import {validationSchema} from "./payment.schema";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import TextFieldWithCounter from "../../../shared/text_field_with_limit";

import EntryForm from "../../../entries/form/entry_form";
import UploadBtn from "@shared/upload_btn_container";
import SubmissionBar from "./submission_bar_data";
defaultEntryState.entryType = "Revenue";

export const calculateDebitsBalance = (items = []) => {
  return items.reduce((accum, {debit} = {}) => accum.add(debit), currency(0));
};

const PaymentForm = ({
  creditCardId,
  payment: {permissions = {}} = {},
  payment = {
    number: "",
    memo: "",
    fileUrl: "",
    entry: defaultEntryState,
  },
  isInitialValid = false,
  readOnly = false,
  disabled: formDisabled = false,
  hideAccountFinder = false,
  hideSubmissionBar = false,
  onSubmit = function () {},
  classes = {},
}) => {
  return (
    <RecoilRoot>
      <section className={classes.root}>
        <Formik
          initialValues={{
            ...payment,
            creditCardId,
          }}
          validationSchema={validationSchema}
          validateOnChange={false}
          isInitialValid={isInitialValid}
          onSubmit={onSubmit}
        >
          {({
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
              <Form>
                <ErrorMessage
                  name="creditCardId"
                  ignoredKeys={["entry"]}
                  component="div"
                  className={classes.errorMessage}
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
                      value={`$${calculateDebitsBalance(entryItems)}`}
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
                      permissions: {
                        save_draft: true,
                        send_for_approval: true,
                        ...permissions,
                      },
                    }}
                  />
                )}
              </Form>
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
  errorMessage: {
    border: "2px solid #E91E63",
    padding: "1em",
    borderRadius: "3px",
    background: "#FCE4EC",
    fontWeight: "300",
    color: "#B71C1C",
    fontSize: "1.15rem",
  },
});

PaymentForm.propTypes = {
  creditCardId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  bankAccountSlug: PropTypes.string,
  accountObjectCode: PropTypes.string,
  payment: PropTypes.shape({
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

export default withStyles(styles)(PaymentForm);
