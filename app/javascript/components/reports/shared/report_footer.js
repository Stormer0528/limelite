import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

const ReportFooter = ({
  createdAt = "",
  updatedAt = "",
  createdBy = "",
  approvedBy = "",
}) => {
  return (
    <footer>
      <Grid container justifyContent="space-around">
        {createdAt && (
          <Grid item>
            <b>Created:</b>
            {createdAt}
          </Grid>
        )}
        {updatedAt && (
          <Grid item>
            <b>Updated:</b>
            {updatedAt}
          </Grid>
        )}
      </Grid>
      <Grid container justifyContent="space-around">
        {createdBy && (
          <Grid item>
            <b>Created By:</b> {createdBy}
          </Grid>
        )}
        {approvedBy && (
          <Grid item>
            <b>Approved By:</b> {approvedBy}
          </Grid>
        )}
      </Grid>
    </footer>
  );
};

ReportFooter.propTypes = {
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string,
  createdBy: PropTypes.string,
  approvedBy: PropTypes.string,
};

const styles = (theme) => ({});

export default withStyles(styles)(ReportFooter);
