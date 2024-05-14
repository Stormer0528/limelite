import PropTypes from "prop-types";

// Material UI
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import {withStyles} from "@material-ui/core/styles";
import UploadBtn from "@shared/upload_btn_container";

const Header = ({
  name = "Credit Card",
  started_at = "",
  ended_at = "",
  file_url,
  classes = {},
  filestack = {},
  editable = false /* user has permission to edit*/,
  readOnly = false /* showView - i.e. page is not in editable state */,
  hideFilestack = false /* showView - i.e. page is not in editable state */,
  /* Callbacks */
  setEndDate = function () {},
  setStartDate = function () {},
  handleFileUrlChange = function () {},
}) => {
  return (
    <section>
      <Grid container className={classes.container}>
        <Grid item style={{flexGrow: 1}}>
          <h5>
            <b>Reconcile:</b> {name}
          </h5>
        </Grid>
        <Grid
          item
          style={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
          }}
        >
          {!hideFilestack && (
            <UploadBtn
              {...filestack}
              readOnly={readOnly}
              value={file_url}
              onChange={handleFileUrlChange}
            />
          )}
        </Grid>
        <Grid item style={{marginRight: "1rem"}}>
          <TextField
            id="started_at"
            helperText="Reconciliation Starting Date"
            type="date"
            onChange={setStartDate}
            value={started_at}
            margin="dense"
            required
            autoFocus={!readOnly}
            readOnly={readOnly}
            disabled={!editable}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly,
            }}
          />
        </Grid>
        <Grid item>
          <TextField
            id="ended_at"
            helperText="Reconciliation Ending Date"
            type="date"
            onChange={setEndDate}
            value={ended_at}
            margin="dense"
            required
            readOnly={readOnly}
            disabled={!editable}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly,
            }}
          />
        </Grid>
      </Grid>
      <Divider className={classes.divider} />
    </section>
  );
};

Header.propTypes = {
  name: PropTypes.string,
  file_url: PropTypes.string,
  started_at: PropTypes.string,
  ended_at: PropTypes.string,
  editable: PropTypes.bool,
  readOnly: PropTypes.bool,
  /* hideFilestack - hide filestack component */
  hideFilestack: PropTypes.bool,
  setEndDate: PropTypes.func.isRequired,
  setStartDate: PropTypes.func.isRequired,
  handleFileUrlChange: PropTypes.func.isRequired,
  filestack: PropTypes.object,
  classes: PropTypes.object,
};

const styles = (theme) => ({
  divider: {
    margin: "1em 0 1.5em",
  },
  container: {
    paddingRight: theme.spacing(1),
  },
});

export default withStyles(styles)(Header);
