import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import clsx from "clsx";
import {format} from "date-fns/esm";
import ValidationErrors from "@shared/validation_errors";
import {Formik, Form, Field, ErrorMessage, FieldArray} from "formik";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "./styled_textfield";
import UploadBtn from "@shared/upload_btn_container";

import KeyboardDate from "../../../reports/shared/keyboard_date";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

// Sections
import POItem from "./po_item";
import TotalCells from "./total_cells";
import SubmissionBar from "./submission_bar";
import QuoteProposalFields from "./quote_proposal_fields";
import RequestSection from "./request_section";

import Addresses from "./addresses";

// import FormikDebug from "@shared/formik_debug";

const POForm = ({
  isInitialValid = true,
  readOnly = false,
  hideSubmissionBar = false,
  hideRequestSection = false,
  hideQuoteSection = false,
  hideItemsSection = false,
  hideTotalsSection = false,
  hideInvoiceBtn = false,
  disabled: formDisabled = false,
  purchaseOrder = {},
  purchaseOrder: {
    aasmState = "draft",
    id: purchaseOrderId,
    invoiceId,
    invoicePath,
    user,
  } = {},
  vendor: {vendorId, slug, organizationId, defaultPoNumber = ""} = {},
  onSubmit = function () {},
  classes = {},
}) => {
  const defaultPurchaseOrder = {
    vendorId,
    number: defaultPoNumber,
    purchaseOrderItems: [{}],
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <section className={clsx("react-inputs", classes.root)}>
        <Formik
          initialValues={{
            ...defaultPurchaseOrder,
            ...purchaseOrder,
            vendorId,
          }}
          isInitialValid={isInitialValid}
          onSubmit={onSubmit}
        >
          {({
            values,
            values: {purchaseOrderItems = [{}]},
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
            isSubmitting,
          }) => {
            const disabled = formDisabled || isSubmitting;
            const handleDate = (name) => (date) => {
              handleChange({
                target: {
                  id: name,
                  name: name,
                  value: format(date, "yyyy-MM-dd"),
                },
              });
            };

            const handlePriceChange =
              (name) =>
              ({floatValue}) => {
                const value = parseInt((floatValue * 100).toFixed(0), 10);
                handleChange({target: {name, value}});
              };

            return (
              <Form className={classes.form}>
                {!readOnly && errors.length > 0 && (
                  <ValidationErrors errors={errors} />
                )}

                <Grid container spacing={2}>
                  <Grid item sm={4} md={3} lg={2} className={classes.formCell}>
                    <TextField
                      fullWidth
                      id="number"
                      name="number"
                      label="PO Number"
                      value={values.number}
                      disabled={disabled}
                      InputProps={{readOnly}}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!errors.number && !!touched.number}
                      helperText={touched.number && errors.number}
                      className={clsx({readOnly, disabled})}
                    />
                  </Grid>

                  <Grid item sm /* Spacer */ />

                  <Grid
                    item
                    sm={4}
                    md={3}
                    lg={2}
                    className={classes.dateControl}
                  >
                    <KeyboardDate
                      fullWidth
                      label="Date"
                      value={values.date}
                      disabled={disabled}
                      readOnly={readOnly}
                      onChange={handleDate("date")}
                      error={touched.date && errors.date}
                      helperText={touched.date && errors.date}
                      className={clsx({readOnly, disabled})}
                    />
                  </Grid>
                  <Grid
                    item
                    sm={4}
                    md={3}
                    lg={2}
                    className={classes.dateControl}
                  >
                    <KeyboardDate
                      fullWidth
                      label="Date Needed"
                      value={values.dateNeeded}
                      disabled={disabled}
                      readOnly={readOnly}
                      onChange={handleDate("dateNeeded")}
                      error={touched.dateNeeded && errors.dateNeeded}
                      helperText={touched.dateNeeded && errors.dateNeeded}
                      className={clsx({readOnly, disabled})}
                    />
                  </Grid>
                  <Grid item sm /* Spacer */ />
                  <Grid item className={classes.filestackCell}>
                    {(values.fileUrl || !readOnly) && (
                      <UploadBtn
                        value={values.fileUrl}
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

                <Addresses
                  {...{
                    disabled,
                    handleChange,
                    hideInvoiceBtn,
                    invoiceId,
                    invoicePath,
                    organizationId,
                    purchaseOrderId,
                    readOnly,
                    values,
                    vendorId,
                    vendorSlug: slug,
                    ...purchaseOrder,
                  }}
                />

                {/* Request Section */}
                {!hideRequestSection && (
                  <RequestSection
                    handleBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                    classes={classes}
                    handleChange={handleChange}
                    readOnly={readOnly}
                    disabled={disabled}
                    user={user}
                    organizationId={organizationId}
                    requestedById={values.requestedById}
                    requestedForId={values.requestedForId}
                    requisitionNumber={values.requisitionNumber}
                    referenceNumber={values.referenceNumber}
                    buyer={values.buyer}
                  />
                )}

                {/* Quote Section */}
                {!hideQuoteSection && (
                  <QuoteProposalFields
                    {...{
                      quoteDate: values.quoteDate,
                      quoteNumber: values.quoteNumber,
                      proposalDate: values.proposalDate,
                      proposalNumber: values.proposalNumber,
                      disabled,
                      readOnly,
                      handleChange,
                      handleBlur,
                      handleDate,
                      classes,
                    }}
                  />
                )}
                {!hideItemsSection && (
                  <FieldArray name="purchaseOrderItems">
                    {(aryHelpers) => {
                      const handleAddClick = () => {
                        aryHelpers.push({});
                      };

                      return (
                        <div className={classes.purchaseOrderItemsContainer}>
                          <Grid
                            container
                            spacing={1}
                            className={classes.itemBtnRow}
                          >
                            <Grid item xs />
                            {!readOnly && !disabled && (
                              <Grid item style={{textAlign: "right"}}>
                                <Button
                                  disabled={disabled}
                                  onClick={handleAddClick}
                                >
                                  + Item
                                </Button>
                              </Grid>
                            )}
                          </Grid>

                          <section className={classes.purchaseOrderItems}>
                            {purchaseOrderItems.map((item, i) => {
                              return (
                                <Field
                                  component={POItem}
                                  name={`purchaseOrderItems[${i}]`}
                                  value={item}
                                  helpers={aryHelpers}
                                  index={i}
                                  key={i}
                                  readOnly={readOnly}
                                  disabled={disabled}
                                />
                              );
                            })}
                          </section>
                        </div>
                      );
                    }}
                  </FieldArray>
                )}

                {/* Total Row */}
                {!hideTotalsSection && (
                  <Grid container spacing={2} className={classes.totalRow}>
                    <Grid item xs>
                      <Grid container spacing={2}>
                        <Grid item xs className={classes.textControl}>
                          <TextField
                            fullWidth
                            multiline
                            id="paymentTerms"
                            name="paymentTerms"
                            label="Payment Terms"
                            value={values.paymentTerms}
                            disabled={disabled}
                            InputProps={{readOnly}}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                              !!errors.paymentTerms && !!touched.paymentTerms
                            }
                            helperText={
                              touched.paymentTerms && errors.paymentTerms
                            }
                            className={clsx({readOnly, disabled})}
                          />
                        </Grid>
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item xs /* Spacer */ />
                      </Grid>
                    </Grid>
                    <Grid
                      item
                      xs={1}
                      style={{flex: "none", maxWidth: "12px", width: "12px"}}
                    />

                    <TotalCells {...{handlePriceChange, readOnly, disabled}} />

                    {!readOnly && (
                      <Grid item xs={1} style={{flex: "none", width: "64px"}} />
                    )}
                  </Grid>
                )}
                {!hideSubmissionBar && (
                  <SubmissionBar
                    {...{
                      setFieldValue,
                      handleSubmit,
                      isSubmitting,
                      aasmState,
                      disabled,
                    }}
                  />
                )}
              </Form>
            );
          }}
        </Formik>
      </section>
    </MuiPickersUtilsProvider>
  );
};

POForm.propTypes = {
  vendorId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  purchaseOrder: PropTypes.object,
  isInitialValid: PropTypes.bool,
  hideRequestSection: PropTypes.bool,
  hideQuoteSection: PropTypes.bool,
  hideInvoiceBtn: PropTypes.bool,
  hideItemsSection: PropTypes.bool,
  hideTotalsSection: PropTypes.bool,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  hideSubmissionBar: PropTypes.bool,
  vendor: PropTypes.shape({
    vendorId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    slug: PropTypes.string,
    organizationId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    defaultPoNumber: PropTypes.string,
  }),
  onSubmit: PropTypes.func,
  classes: PropTypes.object.isRequired,
};

export const styles = (theme) => ({
  root: {
    marginBottom: "30vh",
  },
  form: {
    "& .disabled.readOnly > label": {
      color: "#546E7A",
    },

    "& .disabled.readOnly input": {
      color: "#333",
    },
  },
  formContainer: {
    padding: `0 ${theme.spacing()}px ${theme.spacing()}px`,
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
      padding: ".25rem .75rem !important",
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
    minWidth: "150px",
  },
  selectDisabled: {color: "#333"},
  approvalFooter: {
    margin: "0.5rem -8px 0",
  },
  filledInput: {
    borderRadius: "4px",

    "&:after, &:before, &:hover:after, &:hover:before": {
      borderBottom: "none !important",
    },
  },
  basicInput: {
    color: "#292929 !important",
  },
  basicOutlineInput: {
    "& input": {
      padding: "10px 14px 10px !important",
    },
  },
  totalRow: {borderTop: "1px solid #ccc", marginTop: "16px"},
  purchaseOrderItemsContainer: {
    margin: "2.5rem 0 1rem",
  },
  itemBtnRow: {
    margin: "0 0 1.35rem",
    borderBottom: "1px solid #ccc",
  },
  textControl: {
    "&.readOnly.disabled > label > span > span": {
      color: "#546E7A !important",
    },
    "&.readOnly.disabled svg": {
      color: "#333",
    },
  },
  sectionRow: {
    marginTop: "1.5rem",
    borderTop: "1px solid #e0e0e0",
    paddingTop: ".5rem",
  },
  dateFieldOutline: {
    "& > div > input[type='text']": {
      padding: "10px",
    },
    "& > div > div > button": {
      padding: 0,
    },
    "& label": {
      color: "#546E7A",
    },
  },
});

export default withStyles(styles)(POForm);
