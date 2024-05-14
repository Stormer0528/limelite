import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import PhonesIcon from "@material-ui/icons/Phone";
import HomePhoneIcon from "@material-ui/icons/Store";
import MobilePhoneIcon from "@material-ui/icons/PhonelinkRing";
import WorkPhoneIcon from "@material-ui/icons/SettingsPhone";
import FaxPhoneIcon from "@material-ui/icons/Print";

const PhoneList = ({
  homePhoneNumber,
  mobilePhoneNumber,
  workPhoneNumber,
  faxPhoneNumber,
  classes = {},
}) => {
  return (
    <div className={`${classes.root}`}>
      <Grid container className={classes.gridCellContainer}>
        <div className={classes.titleContainer}>
          <h3>
            <PhonesIcon />
            Phones{" "}
          </h3>
        </div>
        {homePhoneNumber && (
          <Grid className={classes.gridCell}>
            <b className={classes.fieldLabel}>
              <HomePhoneIcon /> Home:
            </b>
            <span>{homePhoneNumber}</span>
          </Grid>
        )}
        {mobilePhoneNumber && (
          <Grid className={classes.gridCell}>
            <b className={classes.fieldLabel}>
              <MobilePhoneIcon /> Mobile:
            </b>
            <span>{mobilePhoneNumber}</span>
          </Grid>
        )}
        {workPhoneNumber && (
          <Grid className={classes.gridCell}>
            <b className={classes.fieldLabel}>
              <WorkPhoneIcon /> Work:
            </b>
            <span>{workPhoneNumber}</span>
          </Grid>
        )}
        {faxPhoneNumber && (
          <Grid className={classes.gridCell}>
            <b className={classes.fieldLabel}>
              <FaxPhoneIcon /> Fax:
            </b>
            <span>{faxPhoneNumber}</span>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

PhoneList.propTypes = {
  homePhoneNumber: PropTypes.string,
  mobilePhoneNumber: PropTypes.string,
  workPhoneNumber: PropTypes.string,
  faxPhoneNumber: PropTypes.string,
  classes: PropTypes.object.isRequired,
};

const styles = theme => ({
  fieldLabel: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    marginRight: ".5em",

    "& > svg": {
      marginRight: ".25rem",
      fill: "#78909C",
    },
  },
  gridCell: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  gridCellContainer: {
    display: "grid",
    gridTemplateColumns:
      "minmax(8.5rem, 15%) repeat(4, minmax(max-content, 1fr))",
    gridAutoColumns: "minmax(max-content, 1fr)",
    gridColumnGap: ".55em",
    gridRowGap: ".625em",
    margin: "0 -16px",
    borderTop: "1px solid #e0e0e0",
    width: "calc(100% + 32px)",
  },
  titleContainer: {
    display: "flex",
    alignItems: "center",
    gridRow: "1 / 3",
    backgroundColor: "#ebeff1",

    "& > h3": {
      color: "#546E7A",
      margin: "0",
      display: "flex",
      padding: ".25rem .5rem",
      fontSize: "1.25rem",
      fontWeight: "200",
      alignItems: "center",
    },
  },
  "@media (max-width: 1175px)": {
    gridCellContainer: {
      gridTemplateColumns:
        "minmax(8.5rem, 15%) repeat(2, minmax(max-content, 1fr))",
    },
  },
  "@media (max-width: 685px)": {
    gridCellContainer: {
      gridTemplateColumns: "minmax(8.5rem, 15%) auto",
    },
    titleContainer: {
      gridRow: "1 / 5",
    },
    gridCell: {
      justifyContent: "flex-start",
    },
  },
  [theme.breakpoints.down("xs")]: {
    root: {
      fontSize: "1.25rem",
    },
    gridCellContainer: {
      gridTemplateColumns: "1fr",
      fontSize: "1.25em",
      gridRowGap: ".25em",
    },
    titleContainer: {
      gridRow: "1 / 1",
      justifyContent: "center",
      fontSize: "22px",

      "& > h3": {
        fontSize: "2.5rem",
        fontWeight: "300",
      },
    },
    gridCell: {
      justifyContent: "flex-start",
      fontSize: "1.35rem",
      marginLeft: "1rem",
    },
  },
});

export default withStyles(styles)(PhoneList);
