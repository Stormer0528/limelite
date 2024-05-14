import FileTypeDropdown from "./file_type_dropdown";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import {withStyles} from "@material-ui/core/styles";
import UploadIcon from "@material-ui/icons/CloudUpload";
import {Field} from "formik";
import {TextField as MuiTextField, CheckboxWithLabel} from "formik-material-ui";
import PropTypes from "prop-types";

const FileFilter = ({classes = {}, shouldShowUploadButton = true}) => {
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
        <Grid item className={classes.gridItem} xs={2}>
          <FormControl style={{marginTop: 8}}>
            <Field
              type="checkbox"
              component={CheckboxWithLabel}
              Label={{label: "Archived Files"}}
              name="archived"
              fullWidth
              margin="dense"
            />
          </FormControl>
        </Grid>
        <Grid item xs />
        {shouldShowUploadButton && (
          <Grid
            item
            style={{
              diplay: "flex",
              flexDirection: "column",
              placeContent: "center",
              paddingRight: "16px",
            }}
          >
            <Button
              color="primary"
              variant="outlined"
              onClick={() => {
                window.location.href = "/files/new";
              }}
            >
              <UploadIcon />
              &nbsp; Upload Files
            </Button>
          </Grid>
        )}
      </Grid>
    </Toolbar>
  );
};

FileFilter.propTypes = {
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

export default withStyles(styles)(FileFilter);
