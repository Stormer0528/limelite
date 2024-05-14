// import {Fragment} from "react";
// import clsx from "clsx";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import {RecoilRoot} from "recoil";
import {Field} from "formik";
import {KeyboardDatePicker} from "formik-material-ui-pickers";
import {TextField} from "formik-material-ui";

import MuiTextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";

import EntryForm from "./form/entry_form";
import VendorDropdown from "../vendor_dropdown";
import FilePreview from "../../approve_view/preview_iframe";

function ItemPreview({
  i,
  file,
  policy,
  signature,
  vendors = [],
  refetch = function () {},
  handleBlur = function () {},
  handleChange = function () {},
  handleVendorChange = function () {},
  handleDateChange = function () {},
  setFieldValue = function () {},
}) {
  const classes = useStyles();
  const readOnly = file.approved;
  const {reason} = file;

  return (
    <RecoilRoot>
      <div className={classes.root}>
        <Grid container>
          <Grid item xs className={classes.iframeCell}>
            <FilePreview
              width="calc(100% - 12px)"
              file={file}
              policy={policy}
              signature={signature}
              refetch={refetch}
            />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={6} className={classes.inputCell}>
            <VendorDropdown
              fullWidth
              readOnly={readOnly}
              disabled={readOnly}
              label="Vendor Name"
              margin="dense"
              name={`filesUploaded.${i}.vendorName`}
              onChange={handleVendorChange(`filesUploaded.${i}`)}
              value={file.vendorName}
              vendors={vendors}
              TextFieldProps={{
                className: classes.TextField,
                variant: "outlined",
                readOnly,
                disabled: readOnly,
              }}
            />
          </Grid>
          {readOnly && (
            <Grid item xs={6} className={classes.inputCell}>
              <Button
                fullWidth
                startIcon={<CheckCircleOutlineIcon />}
                className={classes.approvalBtn}
              >
                Approved
              </Button>
            </Grid>
          )}
        </Grid>
        <Grid container spacing={1} className={classes.dueDateRow}>
          <Grid item xs={6}>
            <Field
              fullWidth
              readOnly={readOnly}
              variant="outlined"
              component={TextField}
              label="Invoice Number"
              name={`filesUploaded.${i}.invoiceNumber`}
              inputProps={{
                className: "browser-default",
              }}
              InputLabelProps={{
                classes: {
                  root: classes.labelRoot,
                },
              }}
              className={classes.dateTextField}
            />
          </Grid>
          <Grid item xs={3}>
            <Field
              className={classes.dateTextField}
              autoOk
              component={KeyboardDatePicker}
              disabled={readOnly}
              format="MM/dd/yyyy"
              InputLabelProps={{
                shrink: true,
                classes: {
                  root: classes.labelRoot,
                },
              }}
              inputProps={{className: "browser-default"}}
              onChange={handleDateChange(`filesUploaded.${i}.date`)}
              inputVariant="outlined"
              label="Date"
              name={`filesUploaded.${i}.date`}
              readOnly={readOnly}
              variant="inline"
            />
          </Grid>
          <Grid item xs={3}>
            <Field
              className={classes.dateTextField}
              autoOk
              component={KeyboardDatePicker}
              disabled={readOnly}
              format="MM/dd/yyyy"
              inputProps={{className: "browser-default"}}
              onChange={handleDateChange(`filesUploaded.${i}.dueDate`)}
              InputLabelProps={{
                shrink: true,
                classes: {
                  root: classes.labelRoot,
                },
              }}
              inputVariant="outlined"
              label="Due Date"
              name={`filesUploaded.${i}.dueDate`}
              readOnly={readOnly}
              variant="inline"
            />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12} className={classes.entryFormCell}>
            <EntryForm
              {...{
                addItemLabel: "+ Account String",
                handleBlur,
                handleChange,
                name: `filesUploaded.${i}.entry`,
                readOnly,
                disabled: readOnly,
                hideAccountFinder: readOnly,
                setFieldValue,
              }}
            />
          </Grid>
          <Grid item xs className={classes.noteCell}>
            <Field
              fullWidth
              multiline
              readOnly={readOnly}
              variant="outlined"
              component={TextField}
              label="Notes"
              margin="dense"
              name={`filesUploaded.${i}.notes`}
              inputProps={{
                className: "browser-default",
              }}
            />
          </Grid>
        </Grid>
        {reason && (
          <Grid container>
            <Grid item xs className={classes.noteCell}>
              <MuiTextField
                fullWidth
                multiline
                readOnly
                variant="outlined"
                value={reason}
                label="Denial Reason"
                margin="dense"
                inputProps={{
                  className: "browser-default",
                }}
              />
            </Grid>
          </Grid>
        )}
      </div>
    </RecoilRoot>
  );
}

ItemPreview.propTypes = {
  i: PropTypes.number,
  file: PropTypes.object,
  policy: PropTypes.string,
  signature: PropTypes.string,
  vendors: PropTypes.array,
  handleAmountChange: PropTypes.func,
  handleVendorChange: PropTypes.func,
  handleBlur: PropTypes.func,
  handleChange: PropTypes.func,
  setFieldValue: PropTypes.func,
  handleDateChange: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
};

export default ItemPreview;

const useStyles = makeStyles((theme) => ({
  root: {
    border: "2px solid #eeeeee",
    borderRadius: 3,
    padding: theme.spacing(1),
    margin: "8px 0",
  },
  amountInput: {
    textAlign: "right",
  },
  amountCell: {
    marginBottom: 4,
  },
  inputCell: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 0,
  },
  noteCell: {
    paddingBottom: theme.spacing(2),
  },
  iframeCell: {
    position: "relative",
    left: 4,
  },
  entryFormCell: {
    border: "1px solid #ddd",
    borderRadius: 4,
    padding: 4,

    "& .EntryItemsContainer h5": {
      fontSize: 18,
      fontWeight: 600,
    },
  },
  TextField: {
    background: "#fff",
  },
  approvalBtn: {
    ...theme.approvalBtns.approveBtn,
  },
  dateTextField: {
    ".react-inputs & > div": {
      paddingRight: 0,
    },
    ".react-inputs & input": {
      paddingLeft: 10.5,
      paddingRight: 0,
      paddingTop: 10.5,
      paddingBottom: 10.5,
    },
  },
  labelRoot: {
    transform: "translate(12px, 12px)",
  },
  dueDateRow: {
    display: "flex",
    marginBottom: 8,
    alignItems: "flex-end",
  },
}));
