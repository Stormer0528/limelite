import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import VendorIcon from "@material-ui/icons/Store";
import CustomerIcon from "@material-ui/icons/PermContactCalendar";

import {USD} from "../../../utils";
import {withStyles} from "@material-ui/core/styles";
import {debitCell, creditCell} from "../../new_entry_btn/entry_item";

const EntryItem = ({
  memo,
  accountName,
  accountNumber,
  type,
  positiveAmount,
  classes = {},
  payableType,
  payable = {},
}) => {
  const {name: payableName, path: payablePath} = payable || {};
  const PayableIcon = payableType === "Vendor" ? VendorIcon : CustomerIcon;
  return (
    <Grid container className={classes.root}>
      <Grid item xs={12} sm={6} md={5} xl={6}>
        <div className={classes.name}>{accountName}</div>
        <div className={classes.code}>{accountNumber}</div>
        <div className="memo">{memo}</div>
      </Grid>
      <Grid item xs={12} sm={6} md={3} xl={4} className={classes.vendorCell}>
        {payableType && (
          <Button className={classes.btn} href={payablePath}>
            <PayableIcon color="disabled" />
            <b>&nbsp;{payableType}:&nbsp;</b>
            {payableName}
          </Button>
        )}
      </Grid>
      <Grid
        item
        xs={5}
        sm={3}
        md={2}
        xl={1}
        className={[classes.debitCell, classes.amountCell].join(" ")}
      >
        {type === "Debit" ? USD(positiveAmount).format() : " "}
      </Grid>
      <Grid
        item
        xs={5}
        sm={3}
        md={2}
        xl={1}
        className={[classes.creditCell, classes.amountCell].join(" ")}
      >
        {type === "Credit" ? USD(positiveAmount).format() : " "}
      </Grid>
    </Grid>
  );
};

EntryItem.propTypes = {
  accountName: PropTypes.string,
  accountNumber: PropTypes.string,
  accountDisplayName: PropTypes.string,
  type: PropTypes.string,
  payableType: PropTypes.string,
  payable: PropTypes.shape({
    name: PropTypes.string,
    path: PropTypes.string,
  }),
  positiveAmount: PropTypes.string,
  memo: PropTypes.string,
  credit: PropTypes.string,
  debit: PropTypes.string,
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  root: {
    borderBottom: "1px solid #e0e0e0",
  },
  btn: {
    textTransform: "inherit",
  },
  name: {
    fontWeight: "bold",
  },
  vendorCell: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  amountCell: {
    height: "4.5em",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingRight: "0.5rem",
  },
  debitCell: {
    ...debitCell,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  creditCell: {
    ...creditCell,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
  },
});

export default withStyles(styles)(EntryItem);
