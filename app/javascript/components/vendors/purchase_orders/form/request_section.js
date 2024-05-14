import PropTypes from "prop-types";
import clsx from "clsx";
import Grid from "@material-ui/core/Grid";
import TextField from "./styled_textfield";
import UserDropdown from "../user_dropdown";

// import FormikDebug from "@shared/formik_debug";
// import {withStyles} from "@material-ui/core/styles";

export default function RequestSection({
  disabled = false,
  readOnly = false,
  buyer,
  classes = {},
  errors = {},
  organizationId,
  referenceNumber,
  requestedById,
  requestedForId,
  requisitionNumber,
  touched = {},
  user = {},
  handleBlur = function () {},
  handleChange = function () {},
}) {
  return (
    <Grid container spacing={2} className={classes.sectionRow}>
      <Grid item sm={4} md className={classes.formCell}>
        <UserDropdown
          fullWidth
          organizationId={organizationId}
          user={user}
          id="requestedBy"
          name="requestedById"
          label="Requested By"
          value={requestedById}
          disabled={disabled}
          readOnly={readOnly}
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.requestedBy && !!touched.requestedBy}
          className={clsx({readOnly, disabled})}
        />
      </Grid>
      <Grid item sm={4} md className={classes.formCell}>
        <UserDropdown
          fullWidth
          organizationId={organizationId}
          id="requestedFor"
          name="requestedForId"
          label="Requested For"
          value={requestedForId}
          disabled={disabled}
          readOnly={readOnly}
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.requestedFor && !!touched.requestedFor}
          className={clsx({readOnly, disabled})}
        />
      </Grid>
      <Grid item sm={4} md className={classes.formCell}>
        <TextField
          fullWidth
          id="buyer"
          name="buyer"
          label="Buyer"
          value={buyer}
          disabled={disabled}
          InputProps={{readOnly}}
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.buyer && !!touched.buyer}
          helperText={touched.buyer && errors.buyer}
          className={clsx({readOnly, disabled})}
        />
      </Grid>
      <Grid item xs={4} md className={classes.formCell}>
        <TextField
          fullWidth
          id="requisitionNumber"
          name="requisitionNumber"
          label="Requisition Number"
          value={requisitionNumber}
          disabled={disabled}
          InputProps={{readOnly}}
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.requisitionNumber && !!touched.requisitionNumber}
          helperText={touched.requisitionNumber && errors.requisitionNumber}
          className={clsx({readOnly, disabled})}
        />
      </Grid>
      <Grid item xs={4} md className={classes.formCell}>
        <TextField
          fullWidth
          id="referenceNumber"
          name="referenceNumber"
          label="Reference Number"
          value={referenceNumber}
          disabled={disabled}
          InputProps={{readOnly}}
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.referenceNumber && !!touched.referenceNumber}
          helperText={touched.referenceNumber && errors.referenceNumber}
          className={clsx({readOnly, disabled})}
        />
      </Grid>
    </Grid>
  );
}

RequestSection.propTypes = {
  buyer: PropTypes.string,
  disabled: PropTypes.bool,
  errors: PropTypes.object,
  organizationId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  readOnly: PropTypes.bool,
  referenceNumber: PropTypes.string,
  requestedById: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  requestedForId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  requisitionNumber: PropTypes.string,
  touched: PropTypes.object,
  user: PropTypes.object,
  classes: PropTypes.object,
  handleBlur: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
};
