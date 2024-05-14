import PropTypes from "prop-types";
import FileUploadBtn from "../file_upload_btn";
import FileTypeDropdown from "./file_type_dropdown";

import {TextField as MuiTextField} from "formik-material-ui";
import {Field} from "formik";
import {withStyles} from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";

const InvoiceFilter = ({classes = {}}) => {
  return (
    <Toolbar className={classes.root}>
      <Grid
        container
        className={classes.container}
        spacing={1}
        alignItems="stretch"
        alignContent="space-around"
        justify="center"
        wrap="nowrap"
      >
        <Grid item className={classes.gridItem} xs={3} sm={2}>
          <FileTypeDropdown />
        </Grid>
        <Grid item className={classes.gridItem} xs={5}>
          <Field
            component={MuiTextField}
            label="Description"
            name="description"
            fullWidth
            margin="dense"
            inputProps={{className: "browser-default"}}
          />
        </Grid>
        <Grid item xs />
        <Grid
          item
          style={{
            diplay: "flex",
            flexDirection: "column",
            placeContent: "center",
            paddingRight: "16px",
          }}
        >
          <FileUploadBtn color="primary" variant="outlined" />
        </Grid>
      </Grid>
    </Toolbar>
  );
};

InvoiceFilter.propTypes = {
  classes: PropTypes.object,
  number: PropTypes.string,
  invoice_number: PropTypes.string,

  showNumberFilter: PropTypes.bool,
  showInvoiceNumberFilter: PropTypes.bool,
};

const styles = (theme) => ({
  container: {
    alignItems: "center",
    justifyContent: "flex-start",
    padding: `4px ${theme.spacing(2)}px`,
  },
  gridItem: {
    marginRight: ".75rem",
  },
  root: {
    padding: 0,
    background: "#fcfcfc",
    borderTop: "1px solid #e3e4e3",
  },
  menuButton: {
    backgroundColor: "transparent",

    "&:focus": {
      backgroundColor: "transparent",
    },
  },
  menuButtonCell: {
    width: "1.5rem",
  },
});

export default withStyles(styles)(InvoiceFilter);
