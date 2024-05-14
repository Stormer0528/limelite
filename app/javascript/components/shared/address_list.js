import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";

// Material UI
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";

import Address from "./address";

// Icons
import AddressIcon from "@material-ui/icons/Store";

const AddressList = ({addresses = [], classes = {}}) => {
  return (
    <div className={`${classes.root}`}>
      <Grid container className={classes.gridCellContainer}>
        <div className={classes.titleContainer}>
          <h3 className={classes.title}>
            <AddressIcon />
            {`${addresses.length > 1 ? "Addresses" : "Address"}`}
          </h3>
        </div>
        {addresses.map((address, i) => {
          const {name} = address;
          return (
            <Card className={classes.card} key={i + name}>
              <CardHeader
                className={classes.cardHeader}
                title={<h3 className={classes.title}>{name}</h3>}
              />
              <CardContent className={classes.cardContent}>
                <Address {...address} />
              </CardContent>
            </Card>
          );
        })}
      </Grid>
    </div>
  );
};

AddressList.propTypes = {
  addresses: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      attention: PropTypes.string,
      department: PropTypes.string,
      line1: PropTypes.string,
      line2: PropTypes.string,
      city: PropTypes.string,
      state: PropTypes.string,
      zip: PropTypes.string,
    })
  ),
  classes: PropTypes.object.isRequired,
};

const styles = theme => ({
  root: {},
  title: {
    margin: 0,
    fontSize: "1.125rem",
    fontWeight: "100",
    color: "#546E7A",
    display: "flex",
    placeContent: "center",
  },
  card: {
    overflow: "hidden",
    boxShadow: "none",
  },
  cardHeader: {
    padding: "5px 16px",
    borderBottom: "1px solid #ECEFF1",
  },
  cardContent: {
    padding: "0 0 8px",

    "&:last-child": {
      padding: "0 0 8px",
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
  gridCell: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    "&:first-child": {justifyContent: "flex-start"},
    "&:last-child": {justifyContent: "flex-end"},
  },
  gridCellContainer: {
    display: "grid",
    gridTemplateColumns:
      "minmax(8.5rem, 15%) repeat(3, minmax(150px, 3fr)) 1fr",
    padding: "0",
    margin: "0 -16px",
    borderTop: "1px solid #e0e0e0",
    width: "calc(100% + 32px)",
    gridColumnGap: "1em",
  },
  titleContainer: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#ebeff1",

    "& > h3": {
      fontWeight: 100,
      fontSize: "1.25rem",
      padding: ".25rem .5rem",
      alignItems: "center",

      "& > svg": {
        marginRight: ".35rem",
      },
    },
  },

  [theme.breakpoints.down("xs")]: {
    gridCellContainer: {
      gridTemplateColumns: "1fr",

      "& > :last-child": {justifyContent: "flex-start"},
    },

    titleContainer: {
      placeContent: "center",

      "& > h3": {
        fontWeight: 300,
        fontSize: "2.5rem",
        textAlign: "center",
      },
    },

    cardContent: {
      padding: "0 1rem",
      fontSize: "1.25rem",

      "&:last-child": {padding: "0 1rem"},
    },
  },
});

export default withStyles(styles)(AddressList);
