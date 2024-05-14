import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import {useState, useEffect} from "react";
import {useCurrentRoute} from "react-navi";
import clsx from "clsx";

import VendorQuery from "@graphql/queries/vendor.gql";
import {useQuery} from "@apollo/react-hooks";

// Components
import ApprovalFooter from "../../shared/approval_footer";
import PhoneList from "../../shared/phone_list";
import AddressList from "../../shared/address_list";
import NavLinks from "./navlinks";
import VendorTabs from "./vendor_tabs";
import Fab from "./fab";
import TaxInfo from "./tax_info";

// Material UI
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Chip from "@material-ui/core/Chip";

// Icons
import WebsiteIcon from "@material-ui/icons/Language";
import EmailIcon from "@material-ui/icons/Email";
import VendorIcon from "@material-ui/icons/Store";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import NotesIcon from "@material-ui/icons/Notes";
import TermsIcon from "@material-ui/icons/SubtitlesOutlined";
import AccountIcon from "@material-ui/icons/ChromeReaderMode";
import ActiveIcon from "@material-ui/icons/CheckCircle";
import InactiveIcon from "@material-ui/icons/NotInterested";
import BalanceInfoIcon from "@material-ui/icons/AttachMoney";

const VendorShowView = ({classes = {}}) => {
  // Callbacks
  const [expanded, setExpanded] = useState(false);

  function handleExpandClick() {
    setExpanded(!expanded);
  }

  const {
    lastChunk: {
      request: {
        params: {vendor_id},
      },
    },
  } = useCurrentRoute();

  const {
    error,
    loading,
    data: {vendor = {}} = {},
  } = useQuery(VendorQuery, {
    variables: {slug: vendor_id},
  });

  useEffect(() => {
    if (vendor.aasmState) {
      if (vendor.aasmState != 'approved') {
        setExpanded(true);
      } else {
        setExpanded(false);
      }
    }
  }, [vendor.aasmState]);

  if (error) {
    console.error(error);
  }
  if (loading) {
    return null;
  }
  return (
    <section className={`${classes.root} Vendors--ShowView react-inputs`}>
      <NavLinks {...{...vendor, vendor_id}} />
      <Card className={classes.card}>
        <CardHeader
          className={classes.cardHeader}
          avatar={
            <Avatar aria-label="Vendor" className={classes.avatar}>
              <VendorIcon />
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
              style={{
                fontSize: "2.5em",
                fontWeight: 100,
                paddingTop: ".25em",
                lineHeight: "1.15",
              }}
            >
              {vendor.name}
            </div>
          }
          subheader={
            <div style={{marginTop: "0.5em"}}>
              <b>Vendor ID:</b>
              <span>{vendor.visibleId}</span>
            </div>
          }
        />
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent className={classes.cardContent}>
            {/* General Info */}
            <Grid container className={classes.generalInfoGridContainer}>
              <Grid className={classes.gridCell} />
              <Grid className={classes.gridCell}>
                <b className={classes.fieldLabel}>Name:</b>
                <span>{vendor.name}</span>
              </Grid>
              <Grid className={classes.gridCell}>
                <b className={classes.fieldLabel}>Vendor ID:</b>
                <span>{vendor.visibleId}</span>
              </Grid>

              <Grid className={classes.gridCell}>
                <b className={classes.fieldLabel}>
                  <EmailIcon /> Email:
                </b>
                {vendor.email && <span>{vendor.email}</span>}
                {!vendor.email && (
                  <span className="grey-text">Not&nbsp;Provided</span>
                )}
              </Grid>

              {vendor.website && (
                <Grid className={classes.gridCell}>
                  <b className={classes.fieldLabel}>
                    <WebsiteIcon /> Website:
                  </b>
                  <span>{vendor.website}</span>
                </Grid>
              )}
            </Grid>

            {/* Phone List  */}
            <PhoneList {...vendor} />

            {/* Address List */}
            <AddressList {...vendor} />

            {/* Notes */}
            <Grid container className={classes.gridSingleRowContainer}>
              <Grid className={classes.gridTitleCell}>
                <h5 className={classes.gridTitleHeader}>
                  <NotesIcon /> <span>Notes</span>
                </h5>
              </Grid>
              <Grid
                className={classes.gridCell}
                style={{justifyContent: "flex-start"}}
              >
                {vendor.notes && <span>{vendor.notes}</span>}
                {!vendor.notes && (
                  <span className="grey-text">Not&nbsp;Provided</span>
                )}
              </Grid>
            </Grid>

            {/* Terms */}
            <Grid container className={classes.gridSingleRowContainer}>
              <Grid className={classes.gridTitleCell}>
                <h5 className={classes.gridTitleHeader}>
                  <TermsIcon /> Payment Terms
                </h5>
              </Grid>
              <Grid
                className={classes.gridCell}
                style={{justifyContent: "flex-start"}}
              >
                {vendor.paymentTerms && <span>{vendor.paymentTerms}</span>}
                {!vendor.paymentTerms && (
                  <span className="grey-text">Not Provided</span>
                )}
              </Grid>
            </Grid>

            {/* Account Info */}
            <Grid container className={classes.gridRowContainer}>
              <Grid className={classes.gridTitleCell}>
                <h5 className={classes.gridTitleHeader}>
                  <AccountIcon /> <span>Account</span>
                </h5>
              </Grid>
              <Grid className={classes.gridCell}>
                <b className={classes.fieldLabel}>Account Number:</b>
                {vendor.accountNumber && <span>{vendor.accountNumber}</span>}
                {!vendor.accountNumber && (
                  <span className="grey-text">Not Provided</span>
                )}
              </Grid>
              <Grid className={classes.gridCell}>
                {vendor.active && (
                  <Chip
                    icon={<ActiveIcon style={{fill: "#4CAF50"}} />}
                    label={<b style={{color: "#4CAF50"}}>Active</b>}
                    style={{
                      borderColor: "#4CAF50",
                      backgroundColor: "#F1F8E9",
                      fontSize: "15px",
                      margin: ".4em",
                    }}
                    variant="outlined"
                  />
                )}
                {!vendor.active && (
                  <Chip
                    icon={<InactiveIcon style={{fill: "#F44336"}} />}
                    label={<b style={{color: "#F44336"}}>Inactive</b>}
                    style={{
                      borderColor: "#F44336",
                      backgroundColor: "#FFEBEE",
                      fontSize: "15px",
                      margin: ".4em",
                    }}
                    variant="outlined"
                  />
                )}
              </Grid>
            </Grid>

            {/* Tax Info */}
            <TaxInfo
              info={vendor.currentTenNinetyNine}
              tenNinetyNines={vendor.tenNinetyNines}
            />

            {/* Balance Info */}
            <Grid container className={classes.gridRowContainer}>
              <Grid className={classes.gridTitleCell}>
                <h5 className={classes.gridTitleHeader}>
                  <BalanceInfoIcon /> Balance Info
                </h5>
              </Grid>
              <Grid className={classes.gridCell}>
                <b className={classes.fieldLabel}>Starting Balance:</b>
                {vendor.startingBalance && (
                  <span>{vendor.startingBalance}</span>
                )}
                {!vendor.startingBalance && (
                  <span className="grey-text">Not&nbsp;Provided</span>
                )}
              </Grid>
              <Grid className={classes.gridCell}>
                <b className={classes.fieldLabel}>Started At:</b>
                {vendor.startDate && <span>{vendor.startDate}</span>}
                {!vendor.startDate && (
                  <span className="grey-text">Not&nbsp;Provided</span>
                )}
              </Grid>
              <Grid className={classes.gridCell}>
                <b className={classes.fieldLabel}>Ended At:</b>
                {vendor.endDate && <span>{vendor.endDate}</span>}
                {!vendor.endDate && (
                  <span className="grey-text">Not&nbsp;Provided</span>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Collapse>
        <CardActions className={classes.cardfooter}>
          <ApprovalFooter {...{modelType: "Vendor", ...vendor}} />
        </CardActions>
      </Card>

      {
        vendor.aasmState == 'approved' && (
          <>
            <VendorTabs {...{vendor_id: vendor.id}} />
            <Fab
              {...{
                account_id: vendor.slug,
                permissions: vendor.permissions,
              }}
            />
          </>
        ) || <></>
      }
    </section>
  );
};

VendorShowView.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",

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
  gridCell: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    "&:first-child, &:fist-child:last-child": {justifyContent: "flex-start"},
    "&:last-child": {justifyContent: "flex-end"},
  },
  generalInfoGridContainer: {
    display: "grid",
    gridTemplateColumns:
      "minmax(8.5rem, 15%) repeat(3, minmax(min-content, max-content))",
    gridColumnGap: "1rem",
    padding: ".35rem 0",
    margin: "0 -16px",
    borderTop: "1px solid #e0e0e0",
    width: "calc(100% + 32px)",

    "& > div": {
      justifyContent: "flex-start",
    },

    "& > :first-child": {
      gridRow: "1 / 3",
    },
  },

  taxInfoGridContainer: {
    display: "grid",
    gridTemplateColumns:
      "minmax(8.5rem, 15%) repeat(4, minmax(min-content, max-content)) 1fr 55px",
    gridAutoColumns: "minmax(max-content, 1fr)",
    gridColumnGap: "0.75rem",
    gridRowGap: ".625em",
    padding: "0",
    margin: "0 -16px",
    borderTop: "1px solid #e0e0e0",
    width: "calc(100% + 32px)",
  },
  gridRowContainer: {
    display: "grid",
    gridTemplateColumns:
      "minmax(8.5rem, 15%) repeat(4, minmax(min-content, max-content))",
    gridAutoColumns: "minmax(max-content, 1fr)",
    gridColumnGap: "0.75rem",
    gridRowGap: ".625em",
    padding: "0",
    margin: "0 -16px",
    borderTop: "1px solid #e0e0e0",
    width: "calc(100% + 32px)",
  },
  gridSingleRowContainer: {
    display: "grid",
    gridTemplateColumns: "minmax(8.5rem, 15%) 1fr",
    gridColumnGap: "0.75em",
    padding: "0",
    margin: "0 -16px",
    borderTop: "1px solid #e0e0e0",
    width: "calc(100% + 32px)",
  },

  [theme.breakpoints.down("sm")]: {
    generalInfoGridContainer: {
      gridTemplateColumns:
        "minmax(8.5rem, 15%) repeat(2, minmax(max-content, 1fr))",

      "& > :last-child": {justifyContent: "flex-start"},
    },

    gridTitleCell: {placeContent: "center"},
  },

  [theme.breakpoints.down("xs")]: {
    generalInfoGridContainer: {
      gridTemplateColumns: "5px minmax(max-content, 1fr)",

      "& > div": {
        fontSize: "1.35rem",
      },
    },
    gridRowContainer: {
      gridTemplateColumns: "1fr",

      "& > div": {
        fontSize: "1.35rem",
      },
      "& h5": {fontSize: "2.5rem", fontWeight: 300},
    },
    taxInfoGridContainer: {
      gridTemplateColumns: "1fr",

      "& > div": {
        fontSize: "1.35rem",
      },
      "& h5": {fontSize: "2.5rem", fontWeight: 300},
    },
    gridCell: {
      paddingLeft: "1rem",
      justifyContent: "flex-start",
      "&:last-child": {justifyContent: "flex-start"},
    },
  },
});

export default withStyles(styles)(VendorShowView);
