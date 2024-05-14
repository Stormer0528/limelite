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

const PrintIcon = ({disabled}) => (
  <Icon
    path={mdiFilePdf}
    size={1}
    horizontal
    vertical
    rotate={180}
    color={disabled ? "#00000042" : "#707070"}
  />
);

const TopBar = ({
  pdfPath,
  xlsxPath,
  loading = false,
  dirty = false,
  handleRunClick = function () {},
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
          <IconButton onClick={handleRunClick}>
            <RunReportIcon />
          </IconButton>
        </Tooltip>
      </Grid>
      {pdfPath && (
        <Grid item>
          <Tooltip
            title="Export PDF"
            placement="bottom"
            disabled={loading || dirty}
          >
            <IconButton
              component="a"
              href={pdfPath}
              target="_blank"
              disabled={loading || dirty}
            >
              <PrintIcon disabled={loading || dirty} />
            </IconButton>
          </Tooltip>
        </Grid>
      )}
      {xlsxPath && (
        <Grid item>
          <Tooltip
            title="Export Excel"
            placement="bottom"
            disabled={loading || dirty}
          >
            <IconButton
              component="a"
              href={xlsxPath}
              target="_blank"
              disabled={loading || dirty}
            >
              <ExcelIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      )}
    </Grid>
  );
};

const styles = (theme) => ({
  root: {
    background: "#e1e1e1",
    top: 60,
    position: " fixed",
    zIndex: "996",
    right: 0,
    width: 160,
    display: "flex",
    paddingLeft: 8,
    paddingRight: 8,
    justifyContent: "flex-start",
    alignItems: "center",

    "&:after": {
      borderBottom: "49px solid #e1e1e1",
      borderLeft: "25px solid #0000",
      height: 0,
      right: 160,
      width: 2,
      content: "' '",
      top: -4,
      borderRadius: "5px 0 0 0",
      position: "absolute",
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
  dirty: PropTypes.bool,
  printPath: PropTypes.string,
  pdfPath: PropTypes.string,
  xlsxPath: PropTypes.string,
  loading: PropTypes.bool,
  handleRunClick: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TopBar);
