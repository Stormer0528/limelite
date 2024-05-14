import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import Ten99HistoryModal from "./1099_history_modal";
import {useCurrentRoute} from "react-navi";
import clsx from "clsx";

// Components
import Address from "../../shared/address";

// Material UI
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

// Icons
import TaxInfoIcon from "@material-ui/icons/BallotOutlined";
import ActiveIcon from "@material-ui/icons/CheckCircle";
import InactiveIcon from "@material-ui/icons/NotInterested";
import FileIcon from "@material-ui/icons/AssignmentReturned";

const TaxInfo = ({info = {}, tenNinetyNines = [], classes = {}, ...rest}) => {
  const {data: {filestack: {security = {}} = {}} = {}} = useCurrentRoute();
  const hasInfo = !!info;
  return (
    <Grid container className={classes.taxInfoGridContainer} {...rest}>
      <Grid className={classes.gridTitleCell}>
        <h5 className={classes.gridTitleHeader}>
          <TaxInfoIcon /> Tax Info
        </h5>
      </Grid>

      {/* Required */}
      <Grid className={classes.gridCellInfo}>
        <div className={classes.gridCellInfoContent}>
          {hasInfo && info.required && (
            <Chip
              icon={<ActiveIcon style={{fill: "#4CAF50"}} />}
              label={<b style={{color: "#4CAF50"}}>1099&nbsp;Required</b>}
              style={{
                borderColor: "#4CAF50",
                backgroundColor: "#F1F8E9",
                fontSize: "15px",
                margin: ".4em",
              }}
              variant="outlined"
            />
          )}
          {hasInfo && !info.required && (
            <Chip
              icon={<InactiveIcon style={{fill: "#636363"}} />}
              label={
                <b style={{color: "#737373"}}>No&nbsp;1099&nbsp;Required</b>
              }
              style={{
                borderColor: "#636363",
                backgroundColor: "#F5F5F5",
                fontSize: "15px",
                margin: ".4em",
              }}
              variant="outlined"
            />
          )}
        </div>
      </Grid>

      {/* Year */}
      <Grid className={classes.gridCellInfo}>
        <div className={classes.gridCellInfoTitle}>
          <b className={classes.fieldLabel}>Last Updated</b>
        </div>
        <div className={classes.gridCellInfoContent}>
          {hasInfo && info.year}
        </div>
      </Grid>

      {/* EIN */}
      <Grid className={classes.gridCellInfo}>
        <div className={classes.gridCellInfoTitle}>
          <b className={classes.fieldLabel}>EIN</b>
        </div>
        <div className={classes.gridCellInfoContent}>
          {hasInfo && info.ein}
          {hasInfo && !info.ein && (
            <span className="grey-text">Not&nbsp;Provided</span>
          )}
        </div>
      </Grid>

      {/* EIN Type */}
      <Grid className={classes.gridCellInfo}>
        <div className={classes.gridCellInfoTitle}>
          <b className={classes.fieldLabel}>EIN Type</b>
        </div>
        <div className={classes.gridCellInfoContent}>
          {hasInfo && info.einType && <span>{info.einType}</span>}
          {!hasInfo ||
            (!info.einType && (
              <span className="grey-text">Not&nbsp;Provided</span>
            ))}
        </div>
      </Grid>

      {/* Address */}
      <Grid className={classes.gridCellInfo}>
        <div className={classes.gridCellInfoTitle}>
          <b className={classes.fieldLabel}>EIN Address</b>
        </div>
        <div className={clsx(classes.gridCellInfoContent, "address")}>
          {hasInfo && info.address && (
            <Address {...{...info.address, hideTitle: true}} />
          )}
          {!hasInfo ||
            (!info.einType && (
              <span className="grey-text">Not&nbsp;Provided</span>
            ))}
        </div>
      </Grid>
      <Grid className={classes.spacer} />
      <Grid className={classes.historyBtnCell}>
        {hasInfo && info.fileUrl && security && (
          <Tooltip placement="top" title="Download EIN File">
            <IconButton
              href={
                info.fileUrl +
                `?policy=${security.policy}&signature=${security.signature}`
              }
            >
              <FileIcon />
            </IconButton>
          </Tooltip>
        )}
      </Grid>
      <Grid className={classes.historyBtnCell}>
        <Ten99HistoryModal
          {...{tenNinetyNines, security}}
          className={classes.historyBtn}
        />
      </Grid>
    </Grid>
  );
};

TaxInfo.propTypes = {
  info: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    addressId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    year: PropTypes.number,
    ein: PropTypes.string,
    einType: PropTypes.string,
    tenNinetyNine: PropTypes.boolean,
    vendorId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    address: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      attention: PropTypes.string,
      department: PropTypes.string,
      line1: PropTypes.string,
      line2: PropTypes.string,
      city: PropTypes.string,
      state: PropTypes.string,
      zip: PropTypes.string,
    }),
  }),
  tenNinetyNines: PropTypes.array,
  classes: PropTypes.object.isRequired,
};

const styles = theme => ({
  taxInfoGridContainer: {
    display: "grid",
    gridTemplateColumns:
      "minmax(8.5rem, 15%) repeat(4, minmax(min-content, max-content)) minmax(min-content, 20em) 1fr 55px 55px",
    gridAutoColumns: "minmax(max-content, 1fr)",
    gridColumnGap: "0",
    gridRowGap: ".625em",
    padding: "0",
    margin: "0 -16px",
    borderTop: "1px solid #e0e0e0",
    width: "calc(100% + 32px)",
  },
  gridCell: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    "&:first-child, &:fist-child:last-child": {justifyContent: "flex-start"},
    "&:last-child": {justifyContent: "flex-end"},
  },
  gridTitleCell: {
    display: "flex",
    backgroundColor: "#ECEFF1",
  },
  gridTitleHeader: {
    color: "#455A64",
    margin: "0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: ".25rem .5rem",
    fontSize: "1.25rem",
    fontWeight: "100",
    gridRow: "1 / 3",

    "& > svg": {
      marginRight: "0.35rem",
    },
  },
  fieldLabel: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    marginRight: ".5em",

    "& > svg": {
      marginRight: ".25rem",
    },
  },
  historyBtnCell: {
    display: "grid",
    placeContent: "center",
  },
  historyBtn: {
    height: "45px",
  },
  gridCellInfo: {
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid #CFD8DC",
  },
  gridCellInfoTitle: {
    background: "#ECEFF1",
    padding: ".125em .5rem",
    color: "#455A64",
  },
  gridCellInfoContent: {
    padding: ".125em .5rem",
    textAlign: "center",
    display: "flex",
    placeContent: "center",
    flexGrow: "1",
    flexDirection: "column",

    "&.address": {
      textAlign: "left",
    },
  },
});

export default withStyles(styles)(TaxInfo);
