import PropTypes from "prop-types";
import {useState, useCallback, Fragment} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {titleCase} from "humanize-plus";
import decamelize from "decamelize";
import {format} from "date-fns/esm";

import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";

import CustomerIcon from "../../shared/icons/customer_icon";
import PurchaseOrderIcon from "../../shared/icons/purchase_order_icon";
import InvoiceIcon from "../../shared/icons/invoice_icon";
import VendorIcon from "../../shared/icons/vendor_icon";

import AuthModal from "./auth_modal";

const AuthCard = ({
  item,
  item: {__typename: authableType, date, number, vendorName, createdAt},
  refetch = function () {},
}) => {
  const classes = useStyles({authableType});
  const [modalOpen, setModalOpen] = useState(false);

  const handleModalOpen = useCallback(() => {
    setModalOpen(true);
  }, [setModalOpen]);

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
    refetch();
  }, [setModalOpen, refetch]);

  return (
    <Fragment>
      <AuthModal
        open={modalOpen}
        item={{...item, type: authableType}}
        handleClose={handleModalClose}
        refetch={refetch}
      />
      <Card className={classes.root} onClick={handleModalOpen}>
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
              <span>
                <b>Date: </b>
                {format(date || createdAt, "MM/dd/yyyy")}
              </span>
              <span>
                <b>Number: </b>
                {number}
              </span>
              {vendorName && vendorName.trim() && (
                <span>
                  <b>Vendor: </b>
                  {vendorName}
                </span>
              )}
            </div>
          }
        />
      </Card>
    </Fragment>
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
    createdAt: PropTypes.string,
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
