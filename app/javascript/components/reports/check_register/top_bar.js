import PropTypes from "prop-types";
// import {useFormikContext} from "formik";

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
  queryVars = {},
  refetch = function () {},
  loading = false,
  classes = {},
}) => {
  const handleRunReport = async () => {
    await refetch({...queryVars});
  };

  const xlsxPath = `/export/check-register.xlsx?filter=${encodeURIComponent(
    JSON.stringify(queryVars)
  )}`;

  const pdfPath = `/export/check-register.pdf?filter=${encodeURIComponent(
    JSON.stringify(queryVars)
  )}`;

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
          <IconButton onClick={handleRunReport}>
            <RunReportIcon />
          </IconButton>
        </Tooltip>
      </Grid>

      <Grid item>
        <Tooltip title="Export PDF" placement="bottom" disabled={loading}>
          <IconButton
            component="a"
            href={pdfPath}
            target="_blank"
            disabled={loading}
          >
            <PrintIcon />
          </IconButton>
        </Tooltip>
      </Grid>

      <Grid item>
        <Tooltip title="Export Excel" placement="bottom" disabled={loading}>
          <IconButton
            component="a"
            href={xlsxPath}
            target="_blank"
            disabled={loading}
          >
            <ExcelIcon />
          </IconButton>
        </Tooltip>
      </Grid>
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
      position: "absolute",
      height: "0",
      top: "-1px",
      left: "-25px",
      content: "' '",
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
  refetch: PropTypes.func,
  queryVars: PropTypes.object,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TopBar);
