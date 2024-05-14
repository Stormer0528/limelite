import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import InvoiceIcon from "../../shared/icons/invoice_icon";
import ChargeIcon from "../../shared/icons/charge_icon";
import PaymentIcon from "../../shared/icons/payment_icon";

const ChecksTable = ({invoice = {}}) => {
  const classes = useStyles();

  return (
    <TableContainer component={Paper} className={classes.root}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell colSpan="4">
              <Typography
                className={classes.itemLink}
                variant="h5"
                component="h2"
              >
                <InvoiceIcon /> Invoice
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.dateCell}>Date</TableCell>
            <TableCell>Vendor</TableCell>
            <TableCell>Number</TableCell>
            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell className={classes.dateCell}>{invoice.date}</TableCell>
            <TableCell>
              <a href={invoice.vendor.path}>{invoice.vendor.fullName}</a>
            </TableCell>
            <TableCell>
              <a href={invoice.path}>{invoice.number}</a>
            </TableCell>
            <TableCell align="right" className={classes.amountCell}>
              {invoice.amount}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
ChecksTable.propTypes = {
  checks: PropTypes.array,
};

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: "1rem",
  },
  dateCell: {
    width: "10rem",
  },
  amountCell: {
    width: "17.5rem",
  },
  itemLink: {
    display: "flex",
    alignItems: "center",

    "& > svg": {
      marginRight: ".25rem",
    },
  },
}));

export default ChecksTable;
