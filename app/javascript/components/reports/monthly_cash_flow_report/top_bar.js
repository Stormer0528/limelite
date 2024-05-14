import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

// Icons
import SaveIcon from "@material-ui/icons/Save";
import RunReportIcon from "@material-ui/icons/PlayCircleOutline";
import ExportIcon from "@material-ui/icons/AssignmentReturned";

import {withStyles} from "@material-ui/core/styles";

const FilterBar = ({
  handleSaveClick = function () {},
  handleExportClick = function () {},
  handleRunReportClick = function () {},
  classes = {},
}) => {
  return (
    <Grid
      container
      spacing={0}
      justifyContent="flex-end"
      wrap="nowrap"
      className={classes.container}
    >
      <Grid item>
        <Tooltip title="Run Report" placement="top">
          <IconButton onClick={handleRunReportClick}>
            <RunReportIcon />
          </IconButton>
        </Tooltip>
      </Grid>
      <Grid item>
        <Tooltip title="Save" placement="top">
          <IconButton onClick={handleSaveClick}>
            <SaveIcon />
          </IconButton>
        </Tooltip>
      </Grid>
      <Grid item>
        <Tooltip title="Export" placement="top">
          <IconButton onClick={handleExportClick}>
            <ExportIcon />
          </IconButton>
        </Tooltip>
      </Grid>
    </Grid>
  );
};

const styles = (theme) => ({
  container: {
    border: "1px solid #E0E0E0",
    padding: ".25em .125em",
    borderRadius: "5px 5px 0 0",
  },
  gridItem: {
    flexGrow: 1,
    marginRight: ".75rem",
  },
  searchContainer: {
    padding: 0,
  },
  textLabel: {
    fontSize: "1.15em",
    padding: "0 .75em",
    fontWeight: "300",
  },
  menuButton: {
    "&:focus": {
      backgroundColor: "transparent",
    },
  },
});

FilterBar.propTypes = {
  filter: PropTypes.object,
  handleSaveClick: PropTypes.func.isRequired,
  handleExportClick: PropTypes.func.isRequired,
  handleRunReportClick: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FilterBar);
