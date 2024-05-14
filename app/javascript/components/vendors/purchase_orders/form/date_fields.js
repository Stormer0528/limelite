import PropTypes from "prop-types";
import clsx from "clsx";
import {ErrorMessage} from "formik";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import UploadBtn from "../../../shared/upload_btn_container";
import DatePicker from "../../../page_elements/date_input_base";

const DateFields = ({
  values,
  disabled,
  readOnly,
  handleChange,
  handleBlur,
  errors,
  touched,
  classes = {},
}) => {
  return (
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

      <Grid item sm={4} md={3} lg={2} className={classes.dateControl}>
        <DatePicker
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
      <Grid item sm={4} md={3} lg={2} className={classes.dateControl}>
        <DatePicker
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
  );
};

DateFields.propTypes = {
  values: PropTypes.object,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  touched: PropTypes.bool,
  errors: PropTypes.array,
  handleBlur: PropTypes.func,
  handleChange: PropTypes.func,
  classes: PropTypes.object,
};

export default DateFields;
