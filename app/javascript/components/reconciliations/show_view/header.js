import PropTypes from "prop-types";

// Material UI
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import TextField from "../../shared/styled_textfield";
import {withStyles} from "@material-ui/core/styles";
import UploadBtn from "../../shared/upload_btn_container";

const Header = ({
  name = "Bank Account",
  started_at = "",
  ended_at = "",
  classes = {},
  file_url,
  filestack = {},
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
          <UploadBtn {...filestack} value={file_url} readOnly />
        </Grid>
        <Grid item style={{marginRight: "1rem"}}>
          <TextField
            id="started_at"
            helperText="Reconciliation Starting Date"
            type="date"
            value={started_at}
            margin="dense"
            required
            autoFocus
            readOnly
            disabled
          />
        </Grid>
        <Grid item>
          <TextField
            id="ended_at"
            helperText="Reconciliation Ending Date"
            type="date"
            value={ended_at}
            margin="dense"
            required
            autoFocus
            disabled
            readOnly
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
  setEndDate: PropTypes.func,
  setStartDate: PropTypes.func,
  handleFileUrlChange: PropTypes.func,
  editable: PropTypes.bool,
  filestack: PropTypes.object,
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  divider: {
    margin: "1em 0 1.5em",
  },
  container: {
    paddingRight: theme.spacing(),
  },
});

export default withStyles(styles)(Header);
