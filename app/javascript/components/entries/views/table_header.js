import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";

// Material UI
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import HelpIcon from "@material-ui/icons/Help";
import Print from "@material-ui/icons/Print";
import Excel from "@material-ui/icons/GridOn";
import SummaryIcon from "@material-ui/icons/ViewList";
import DetailIcon from "@material-ui/icons/ViewStream";

const TableHeader = ({
  component: Component = Paper,
  title = "",
  TitleIcon = HelpIcon,
  PrintIcon = Print,
  hidePdfPrint = false,
  hideXlsxPrint = false,
  classes = {},
  loading = false,
  printPath = "#!",
  ExcelIcon = Excel,
  xlsxPath,
  children = null,
  detailSwitch = false,
  ledgerView = "summary",
  handleToggleSetUiDetailView = function () {},
}) => {
  return (
    <Component className={`${classes.root} EntriesIndex`} elevation={1}>
      <Typography
        variant="h5"
        component="h5"
        className={`page-header ${classes.header}`}
      >
        <div className={classes.left}>
          {!loading && <TitleIcon className={classes.titleIcon} />}
          {loading && (
            <CircularProgress
              size={24}
              className={classes.titleIcon}
              thickness={5}
              style={{color: "#546E7A"}}
            />
          )}
          <span className={classes.titleText}>{title}</span>
        </div>
        <div className={classes.center}>
          {detailSwitch && (
            <ToggleButtonGroup
              size="small"
              variant="text"
              value={ledgerView}
              exclusive
              onChange={handleToggleSetUiDetailView}
              aria-label="Ledger View"
              className={classes.centerToggle}
            >
              <ToggleButton value="summary">
                <SummaryIcon fontSize="small" /> Summary
              </ToggleButton>
              <ToggleButton value="detail">
                <DetailIcon fontSize="small" /> Detail
              </ToggleButton>
            </ToggleButtonGroup>
          )}
        </div>
        <div className={classes.right}>
          {!hidePdfPrint && (
            <IconButton
              href={printPath}
              className={classes.printIcon}
              target="_blank"
            >
              <PrintIcon />
            </IconButton>
          )}
          {!hideXlsxPrint && (
            <IconButton
              href={xlsxPath}
              className={classes.printIcon}
              target="_blank"
            >
              <ExcelIcon />
            </IconButton>
          )}
        </div>
      </Typography>

      {children}
    </Component>
  );
};

TableHeader.propTypes = {
  component: PropTypes.node,
  ExcelIcon: PropTypes.any,
  PrintIcon: PropTypes.any,
  printPath: PropTypes.string,
  xlsxPath: PropTypes.string,
  hidePdfPrint: PropTypes.bool,
  hideXlsxPrint: PropTypes.bool,
  TitleIcon: PropTypes.any,
  title: PropTypes.string,
  loading: PropTypes.bool,
  loadingMessage: PropTypes.string,
  render: PropTypes.func,
  children: PropTypes.any,
  classes: PropTypes.object,
  detailSwitch: PropTypes.bool,
  ledgerView: PropTypes.string,
  handleToggleSetUiDetailView: PropTypes.func,
};

const styles = (theme) => ({
  root: {
    flexBasis: " 500px",
    minHeight: "550px",
    flex: "auto",
    display: "flex",
    flexDirection: "column",
    height: "100%",

    "@media only screen and (max-height: 455px)": {
      display: "contents",
      boxShadow: "none !important",
    },
  },
  header: {
    padding: `.5em ${theme.spacing(1)}px`,
    display: "grid",
    gridTemplateColumns: "minmax(min-content, max-content) 1fr max-content",
    gridColumnGap: "1rem",
    background: "#f5f5f5",
    color: "#546E7A",

    ["& b"]: {
      color: "#607D8B",
    },
  },
  left: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  centerToggle: {
    marginLeft: "-12.5%",
  },
  right: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  titleIcon: {
    color: "90A4AE",
    marginRight: "0.2em",
  },
  thumb: {
    paddingLeft: "0 !important",
    lineHeight: "20px !important",
    height: "20px !important",
    "&:before": {
      display: "none",
    },
    "&:after": {
      display: "none",
    },
  },
  loadingMessage: {
    color: "#e5e5e5",
  },
  printIcon: {
    borderRadius: "50%",
    margin: "0 .125rem",
    padding: 8,
  },
  titleText: {
    fontSize: "1.25em",
    lineHeight: "1.25em",
    flexGrow: 2,
  },
  chip: {
    backgroundColor: "#fcfcfc",
    border: "1px solid #CFD8DC",
  },
});

export default withStyles(styles)(TableHeader);
