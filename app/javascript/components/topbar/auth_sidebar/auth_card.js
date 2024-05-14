import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import {titleCase} from "humanize-plus";
import decamelize from "decamelize";
import {format} from "date-fns/esm";

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

const AuthCard = ({
  item: {
    __typename: authableType,
    date,
    number,
    vendorName,
    amount,
    createdAt,
    path,
    name,
    creator = {},
    bankAccount = {},
  },
}) => {
  const {fullName: creatorName} = creator || {};
  const {name: accountName} = bankAccount || {};
  const classes = useStyles({authableType});

  return (
    <Card className={classes.root}>
      <CardHeader
        className={classes.cardHeader}
        avatar={
          <Avatar aria-label={authableType} className={classes.avatar}>
            {renderClassIcon(authableType)}
          </Avatar>
        }
        title={<Typography variant="h6">{titleize(authableType)}</Typography>}
        subheader={
          <div className={classes.subtitle}>
            {date && (
              <span>
                <b>Date: </b>
                {date.match(/\//) && date}
                {!date.match(/\//) && format(date || createdAt, "MM/dd/yyyy")}
              </span>
            )}
            {number && (
              <span>
                <b>Number: </b>
                {number}
              </span>
            )}
            {vendorName && vendorName.trim() && (
              <span>
                <b>Vendor: </b>
                {vendorName}
              </span>
            )}
            {name && name.trim() && <span>{name}</span>}
            {accountName && (
              <span>
                <b>Account:</b> {accountName}
              </span>
            )}
            {amount && (
              <span>
                <b>Amount:</b> {amount}
              </span>
            )}
            {creatorName && creatorName.trim() && (
              <span>
                <b>Created By:&nbsp;</b>
                {creatorName}
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
      border: "2px solid transparent",
      transition: "border-color .25s ease-out",
      padding: "8px",

      "&:hover": {
        cursor: "pointer",
        backgroundColor: "#fcfcfc",
        border: "2px solid #2196f3",
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
