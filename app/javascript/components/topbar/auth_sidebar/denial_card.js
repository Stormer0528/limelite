import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import {titleCase} from "humanize-plus";
import decamelize from "decamelize";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActionArea from "@material-ui/core/CardActionArea";
import Typography from "@material-ui/core/Typography";

import CustomerIcon from "../../shared/icons/customer_icon";
import PurchaseOrderIcon from "../../shared/icons/purchase_order_icon";
import InvoiceIcon from "../../shared/icons/invoice_icon";
import VendorIcon from "../../shared/icons/vendor_icon";

const AuthCard = ({item: {reason, authorizable}}) => {
  const {__typename: authableType, path} = authorizable || {};
  const classes = useStyles({authableType});

  return (
    <Card className={classes.root}>
      <CardHeader
        className={classes.cardHeader}
        title={
          <Typography variant="h6">Review {titleize(authableType)}</Typography>
        }
        avatar={
          <Avatar aria-label={authableType} className={classes.avatar}>
            {renderClassIcon(authableType)}
          </Avatar>
        }
        subheader={
          <div className={classes.subtitle}>
            {reason && (
              <span>
                <br />
                <b>Reason:&nbsp;</b>
                <br />
                <p>{reason}</p>
              </span>
            )}
          </div>
        }
      />
      <CardActionArea className={classes.cardActionArea}>
        <Button href={path} fullWidth variant="outlined">
          Review {titleize(authableType)}
        </Button>
      </CardActionArea>
    </Card>
  );
};

AuthCard.propTypes = {
  refetch: PropTypes.func,
  item: PropTypes.shape({
    id: PropTypes.string,
    date: PropTypes.string,
    number: PropTypes.string,
    vendorName: PropTypes.string,
    name: PropTypes.string,
    path: PropTypes.string,
    createdAt: PropTypes.string,
    amount: PropTypes.string,
    creator: PropTypes.object,
    bankAccount: PropTypes.object,
    __typename: PropTypes.string,
  }),
  authableType: PropTypes.string,
  authableId: PropTypes.string,
  classes: PropTypes.object,
};

const useStyles = makeStyles((theme) => {
  return {
    root: {
      width: "100%",
      border: "2px solid darkred",
      transition: "border-color .25s ease-out",
      padding: "8px",

      "&:hover": {
        backgroundColor: "#fcfcfc",
      },
    },
    cardHeader: {
      padding: 8,
    },
    subtitle: {
      display: "grid",
      gridTemplateRows: "1fr 1fr 1fr",
      minWidth: 150,
      width: "25vw",
      color: "#333",
    },
    avatar: ({authableType}) => {
      const {[authableType]: {gradient = ""} = {}} = theme.models || {};
      return {
        background: gradient,
      };
    },
  };
});

export default AuthCard;

// Helpers
//------------------------------------------------------------------------------
export const renderClassIcon = (type = "") => {
  switch (type) {
    case "Vendor":
      return <VendorIcon />;
    case "Customer":
      return <CustomerIcon />;
    case "PurchaseOrder":
      return <PurchaseOrderIcon />;
    case "Invoice":
      return <InvoiceIcon />;
    default:
      return type.slice(0, 1);
  }
};

const titleize = (str = "") => titleCase(decamelize(str).replace(/[-_]/g, " "));
