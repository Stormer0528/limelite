import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import {useState} from "react";
import {useCurrentRoute} from "react-navi";
import clsx from "clsx";

// Components
import ApprovalFooter from "../../shared/approval_footer";
import PhoneList from "../../shared/phone_list";
import AddressList from "../../shared/address_list";
import NavLinks from "./navlinks";
import EntriesInfo from "./customer_tabs";
import Fab from "./fab";

// Material UI
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";

// Icons
import WebsiteIcon from "@material-ui/icons/Language";
import EmailIcon from "@material-ui/icons/Email";
import CustomerIcon from "@material-ui/icons/PermContactCalendar";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import {Helmet} from "react-helmet";

const CustomerShowView = ({
  createStateBtnHandler = function () {},
  classes = {},
}) => {
  // Callbacks
  const [expanded, setExpanded] = useState(false);
  function handleExpandClick() {
    setExpanded(!expanded);
  }

  const {
    data: {customer},
    lastChunk: {
      request: {
        params: {customer_id},
      },
    },
  } = useCurrentRoute();

  return (
    <section className={`${classes.root} Customers--ShowView react-inputs`}>
      <Helmet>
        <title>LimeLite DS :: Customers &gt; {customer.name}</title>
      </Helmet>

      <NavLinks {...{...customer, customer_id}} />
      <Card className={classes.card}>
        <CardHeader
          className={classes.cardHeader}
          avatar={
            <Avatar aria-label="Customer" className={classes.avatar}>
              <CustomerIcon />
            </Avatar>
          }
          action={
            <IconButton
              aria-label="Expand"
              onClick={handleExpandClick}
              className={clsx(classes.expand, {
                [classes.expandOpen]: expanded,
              })}
            >
              <ExpandMoreIcon />
            </IconButton>
          }
          title={
            <div
              style={{fontSize: "2.5em", fontWeight: 100, paddingTop: ".25em"}}
            >
              {customer.name}
            </div>
          }
          subheader={
            <div style={{marginTop: "0.5em"}}>
              <b>Customer ID:</b>
              <span>{customer.visibleId}</span>
            </div>
          }
        />
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent className={classes.cardContent}>
            <Grid container className={classes.gridCellContainer}>
              <Grid className={classes.gridCell}>
                <b className={classes.fieldLabel}>Name:</b>
                <span>{customer.name}</span>
              </Grid>
              <Grid className={classes.gridCell}>
                <b className={classes.fieldLabel}>Customer ID:</b>
                <span>{customer.visibleId}</span>
              </Grid>
              {customer.email && (
                <Grid className={classes.gridCell}>
                  <b className={classes.fieldLabel}>
                    <EmailIcon /> Email:
                  </b>
                  <span>{customer.email}</span>
                </Grid>
              )}
              {customer.website && (
                <Grid className={classes.gridCell}>
                  <b className={classes.fieldLabel}>
                    <WebsiteIcon /> Website:
                  </b>
                  <span>{customer.website}</span>
                </Grid>
              )}
            </Grid>
            <PhoneList {...customer} />
            <AddressList {...customer} />
          </CardContent>
        </Collapse>
        <CardActions className={classes.cardfooter}>
          <ApprovalFooter {...{modelType: "Customer", ...customer}} />
        </CardActions>
      </Card>

      <EntriesInfo {...{customer_id: customer.id}} />

      <Fab
        {...{
          account_id: customer.slug,
          permissions: customer.permissions,
        }}
      />
    </section>
  );
};

CustomerShowView.propTypes = {
  createStateBtnHandler: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  root: {
    "&.react-inputs input": {
      height: "inherit",
    },
  },
  avatar: {
    height: "48px",
    width: "48px",
  },
  card: {
    border: "1px solid #e0e0e0",
    boxShadow: "none",
    marginBottom: "1em",
  },
  cardHeader: {
    padding: "8px 16px",
  },
  cardContent: {
    paddingTop: 0,
    paddingBottom: 0,

    "&:last-child": {
      paddingBottom: 0,
    },
  },
  cardfooter: {
    padding: "0 0 4px",
  },
  expand: {
    position: "relative",
    top: "8px",
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
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
    gridTemplateColumns: "repeat(4, minmax(min-content, max-content))",
    gridColumnGap: "1em",
    padding: ".5em 1em",
    margin: "0 -16px",
    borderTop: "1px solid #e0e0e0",
    width: "calc(100% + 32px)",
  },
});

export default withStyles(styles)(CustomerShowView);
