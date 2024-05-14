import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";

import Typography from "@material-ui/core/Typography";

import Navlinks from "./navlinks";
import PurchaseOrderIcon from "../../../shared/icons/purchase_order_icon";

const Header = ({
  exportPath,
  vendorPath,
  invoicePath,
  purchaseOrder = {},
  classes = {},
}) => {
  const {permissions = {}, editPath} = purchaseOrder;

  return (
    <header className={classes.header}>
      <Typography variant="h3" className={classes.title}>
        <PurchaseOrderIcon className={classes.titleIcon} /> Purchase Order
      </Typography>
      <Navlinks
        {...{permissions, exportPath, editPath, vendorPath, invoicePath}}
      />
    </header>
  );
};

Header.propTypes = {
  exportPath: PropTypes.string,
  vendorPath: PropTypes.string,
  invoicePath: PropTypes.string,
  purchaseOrder: PropTypes.object,
  classes: PropTypes.object.isRequired,
};

const styles = () => ({
  header: {
    display: "grid",
    gridTemplateColumns: "1fr max-content",
    alignItems: "baseline",
    marginBottom: "-0.125rem",
    marginTop: "1rem",
    padding: "0 .5rem .25rem",
    borderTop: "1px solid #f0f0f0",
    borderRadius: "4px 4px 0 0",
    background: "#f0f0f087",
  },
  title: {
    margin: 0,
    display: "flex",
    alignItems: "center",

    "& > svg": {
      margin: "0 0.5rem",
    },
  },
  titleIcon: {
    fontSize: "2.35rem !important",
    position: "relative",
    color: "#455A64",
  },
});

export default withStyles(styles)(Header);
