import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import find from "lodash/find";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import DateField from "@shared/keyboard_date";

import AddIcon from "@material-ui/icons/Add";
import VendorDropdown from "../new_view/vendor_dropdown";

function PreviewVendorSection({file = {}, handleChange, name, vendors = []}) {
  const classes = useStyles();
  const handleVendorChange = (name) => (e, text) => {
    const {id: vendorId} = find(vendors, {displayName: text}) || {};
    handleChange({
      target: {
        name: `${name}.vendorName`,
        value: text,
      },
    });

    if (vendorId) {
      handleChange({
        target: {
          name: `${name}.vendorId`,
          value: vendorId,
        },
      });
    }
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.vendorSection}>
        <VendorDropdown
          freeSolo={!file.vendorId}
          fullWidth
          label="Vendor Name"
          margin="dense"
          name={name}
          onChange={handleVendorChange(name)}
          value={file.vendorName}
          vendors={vendors}
          TextFieldProps={{
            className: classes.TextField,
            variant: "outlined",
          }}
        />
        <div className={classes.vendorBtnCell}>
          <IconButton
            href="/vendors/new"
            target="_blank"
            rel="noopener noreferrer"
            title="Add New Vendor"
          >
            <AddIcon />
          </IconButton>
        </div>
      </Box>

      <Grid container spacing={1}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Invoice Number"
            margin="dense"
            name="date"
            readOnly
            value={file.invoiceNumber}
            variant="outlined"
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
        <Grid item xs={6}>
          <DateField
            className={classes.dateTextField}
            fullWidth
            label="Date"
            margin="dense"
            name="dueDate"
            readOnly
            value={file.date}
            variant="inline"
            inputVariant="outlined"
            inputProps={{
              className: "browser-default",
            }}
            InputLabelProps={{
              shrink: true,
              classes: {
                root: classes.labelRoot,
              },
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <DateField
            className={classes.dateTextField}
            fullWidth
            label="Due Date"
            margin="dense"
            name="dueDate"
            readOnly
            value={file.dueDate}
            variant="inline"
            inputVariant="outlined"
            inputProps={{
              className: "browser-default",
            }}
            InputLabelProps={{
              shrink: true,
              classes: {
                root: classes.labelRoot,
              },
            }}
          />
        </Grid>
      </Grid>

      <TextField
        className={classes.TextField}
        fullWidth
        label="Notes"
        margin="dense"
        multiline
        name="notes"
        readOnly
        value={file.notes}
        variant="outlined"
        inputProps={{
          className: "browser-default",
        }}
        InputLabelProps={{shrink: true}}
      />
    </Box>
  );
}

PreviewVendorSection.propTypes = {
  file: PropTypes.object,
  name: PropTypes.string,
  policy: PropTypes.string,
  signature: PropTypes.string,
  vendors: PropTypes.array,

  handleChange: PropTypes.func,
};

const useStyles = makeStyles(() => ({
  root: {
    background: "#f5f5f5",
    padding: 8,
    margin: "0 0 0 -8px",
    borderRadius: 4,
  },
  TextField: {
    background: "#fff",
  },
  vendorSection: {
    display: "grid",
    gridTemplateColumns: "1fr 48px",
    gridColumnGap: "8px",
  },
  vendorBtnCell: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  dateTextField: {
    backgroundColor: "#fff",

    ".react-inputs & > div": {
      paddingRight: 0,
    },
    ".react-inputs & input": {
      paddingLeft: 10.5,
      paddingRight: 0,
      paddingTop: 16.5,
      paddingBottom: 17.5,
    },
  },
  labelRoot: {
    transform: "translate(12px, 12px)",
  },
}));

export default PreviewVendorSection;
