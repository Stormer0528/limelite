import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

// Icons
import RunReportIcon from "@material-ui/icons/DirectionsRun";
import Icon from "@mdi/react";
import {mdiFilePdf} from "@mdi/js";
import {withStyles} from "@material-ui/core/styles";

import ExcelIcon from "@material-ui/icons/GridOn";
import LinearProgress from "@material-ui/core/LinearProgress";
import Grow from "@material-ui/core/Grow";

const PrintIcon = () => (
  <Icon
    path={mdiFilePdf}
    size={1}
    horizontal
    vertical
    rotate={180}
    color="#707070"
  />
);

const TopBar = ({
  pdfPath,
  xlsxPath,
  loading = false,
  persisted = false,
  valid = false,
  // handleSaveClick = function () {},
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
      className={classes.root}
    >
      {loading && <LinearProgress className={classes.progress} />}

      <Grid item>
        <Tooltip title="Run Report" placement="bottom">
          <IconButton onClick={handleRunReportClick}>
            <RunReportIcon />
          </IconButton>
        </Tooltip>
      </Grid>
      {pdfPath && (
        <Grow in={!loading}>
          <Grid item>
            <Tooltip title="Export PDF" placement="bottom" disabled={loading}>
              <IconButton
                component="a"
                onClick={handleExportClick}
                href={pdfPath}
                target="_blank"
                disabled={loading || !persisted || !valid}
              >
                <PrintIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grow>
      )}
      {xlsxPath && (
        <Grow in={!loading}>
          <Grid item>
            <Tooltip title="Export Excel" placement="bottom" disabled={loading}>
              <IconButton
                component="a"
                onClick={handleExportClick}
                href={xlsxPath}
                target="_blank"
                disabled={loading || !persisted || !valid}
              >
                <ExcelIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grow>
      )}
    </Grid>
  );
};

const styles = (theme) => ({
  root: {
    borderRadius: "5px 5px 0 0",
    background: "#e1e1e1",
    top: "56px",
    position: " fixed",
    zIndex: "996",
    right: "1em",
    width: "150px",

    "&:before": {
      borderBottom: "49px solid #e1e1e1",
      borderLeft: "25px solid #0000",
      position: "relative",
      height: "0",
      width: "2px",
      left: "-5px",
      content: "' '",
      top: "0",
      borderRadius: "5px 0 0 0",
    },
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
  loadingCell: {
    display: "flex",
    alignItems: "center",
    padding: "0 1em",
  },
  progress: {
    left: "0",
    width: "100vw",
    right: "0",
    position: "fixed",
    top: "105px",
    height: "2px",
  },
});

TopBar.propTypes = {
  persisted: PropTypes.bool,
  valid: PropTypes.bool,
  printPath: PropTypes.string,
  pdfPath: PropTypes.string,
  xlsxPath: PropTypes.string,
  loading: PropTypes.bool,
  filter: PropTypes.object,
  handleSaveClick: PropTypes.func,
  handleExportClick: PropTypes.func,
  handleRunReportClick: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TopBar);
