import PropTypes from "prop-types";
import clsx from "clsx";
import {makeStyles} from "@material-ui/core/styles";
import {styles} from "../form";

import Grid from "@material-ui/core/Grid";
import TextField from "../form/styled_textfield";

const useStyles = makeStyles(styles);
export default function RequestSection({
  purchaseOrder: {
    buyer = "buyer",
    requisitionNumber = "requisitionNumber",
    referenceNumber = "referenceNumber",
    requestedBy = {},
    requestedFor = {},
  } = {},
}) {
  const classes = useStyles();
  const readOnly = true;
  const {fullName: requestedByName} = requestedBy || {};
  const {fullName: requestedForName} = requestedFor || {};

  return (
    <Grid
      container
      spacing={2}
      className={classes.sectionRow}
      style={{margin: "1rem 0"}}
    >
      <Grid item sm={4} md className={classes.formCell}>
        <TextField
          fullWidth
          id="requestedBy"
          name="requestedBy"
          label="Requested By"
          value={requestedByName}
          readOnly
          InputProps={{readOnly}}
          className={clsx(classes.readOnly)}
        />
      </Grid>
      <Grid item sm={4} md className={classes.formCell}>
        <TextField
          fullWidth
          id="requestedFor"
          name="requestedFor"
          label="Requested For"
          value={requestedForName}
          readOnly
          InputProps={{readOnly}}
          className={clsx(classes.readOnly)}
        />
      </Grid>
      <Grid item sm={4} md className={classes.formCell}>
        <TextField
          fullWidth
          id="buyer"
          name="buyer"
          label="Buyer"
          value={buyer}
          readOnly
          InputProps={{readOnly}}
          className={clsx(classes.readOnly)}
        />
      </Grid>
      <Grid item xs={4} md className={classes.formCell}>
        <TextField
          fullWidth
          id="requisitionNumber"
          name="requisitionNumber"
          label="Requisition Number"
          value={requisitionNumber}
          readOnly
          InputProps={{readOnly}}
          className={clsx(classes.readOnly)}
        />
      </Grid>
      <Grid item xs={4} md className={classes.formCell}>
        <TextField
          fullWidth
          id="referenceNumber"
          name="referenceNumber"
          label="Reference Number"
          value={referenceNumber}
          readOnly
          InputProps={{readOnly}}
          className={clsx(classes.readOnly)}
        />
      </Grid>
    </Grid>
  );
}

RequestSection.propTypes = {
  purchaseOrder: PropTypes.shape({
    buyer: PropTypes.string,
    requisitionNumber: PropTypes.string,
    referenceNumber: PropTypes.string,
    requestedBy: PropTypes.shape({fullName: PropTypes.string}),
    requestedFor: PropTypes.shape({fullName: PropTypes.string}),
  }),
};
