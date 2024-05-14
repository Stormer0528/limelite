import PropTypes from "prop-types";
import currency from "currency.js";
import {makeStyles} from "@material-ui/core/styles";

import {Formik, Form, ErrorMessage} from "formik";
import {RecoilRoot} from "recoil";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import TextFieldWithCounter from "../../../shared/text_field_with_limit";

import EntryForm from "../../../entries/form/entry_form";
import {EntryFormProvider} from "../../../entries/form/entry_form_context";
import {defaultEntryState} from "../../../entries/form/use_entry_form";
import UploadBtn from "@shared/upload_btn_container";
import SubmissionBar from "./submission_bar_data";

// import Debug from "@shared/formik_debug";

const calcAmount = (items = []) => {
  return items.reduce((accum, {debit} = {}) => accum.add(debit), currency(0));
};

export default function ChargeForm({
  charge = {
    date: new Date(),
    memo: "",
    entry: defaultEntryState,
    permissions: {},
  },
  charge: {permissions = {}} = {},
  creditCardId,
  isInitialValid = false,
  readOnly = false,
  disabled: formDisabled = false,
  hideAccountFinder = false,
  hideSubmissionBar = false,
  action = "",
  onSubmit = () => {},
}) {
  const cl = useStyles();

  return (
    <Formik
      initialValues={{
        ...charge,
        creditCardId,
      }}
      validateOnChange={false}
      isInitialValid={isInitialValid}
      onSubmit={onSubmit}
    >
      {({
        values: {entry, aasmState, number, fileUrl, memo},
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setValues,
        setFieldValue,
        isSubmitting,
      }) => {
        return (
          <RecoilRoot>
            <Form className="react-inputs" action={action}>
              <EntryFormProvider>
                <Grid container spacing={2}>
                  <Grid item xs={4} className={cl.formCell}>
                    <TextField
                      fullWidth
                      id="number"
                      name="number"
                      label="Number"
                      value={number}
                      disabled={formDisabled}
                      InputProps={{readOnly}}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!errors.number && !!touched.number}
                      helperText={touched.number && errors.number}
                    />
                  </Grid>
                  <Grid item xs className={cl.filestackCell}>
                    {(fileUrl || !readOnly) && (
                      <UploadBtn
                        value={fileUrl}
                        readOnly={readOnly}
                        disabled={formDisabled}
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
                      disabled={formDisabled}
                      InputProps={{readOnly}}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      characterLimit={150}
                      error={errors.memo && touched.memo}
                      helperText={touched.memo && errors.memo}
                    />
                  </Grid>
                  <Grid item xs={2} className={cl.amountCell}>
                    <TextField
                      fullWidth
                      id="amount"
                      name="amount"
                      label="Amount"
                      variant="outlined"
                      value={`$${calcAmount(entry.entryItems || [])}`}
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
              </EntryFormProvider>
            </Form>
          </RecoilRoot>
        );
      }}
    </Formik>
  );
}

ChargeForm.propTypes = {
  charge: PropTypes.object,
  creditCardId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  isInitialValid: PropTypes.bool,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  hideAccountFinder: PropTypes.bool,
  hideSubmissionBar: PropTypes.bool,
  action: PropTypes.string,
  onSubmit: PropTypes.func,
};

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    marginBottom: 8,
    padding: "12px 12px 0",
  },
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
}));
