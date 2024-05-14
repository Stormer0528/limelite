import {useState, useCallback} from "react";
import {makeStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import InvoiceIcon from "../../../shared/icons/invoice_icon";

const Invoices = ({invoices}) => {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell colSpan="2">
                <Typography variant="h5" className={classes.title}>
                  <InvoiceIcon />
                  Invoices
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Number</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map(({number, path, amount}, i) => {
              return (
                <TableRow key={i}>
                  <TableCell>
                    <a rel="noreferrer" target="_blank" href={path}>
                      {number}
                    </a>
                  </TableCell>
                  <TableCell className={classes.amountCell}>{amount}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
Invoices.propTypes = {
  invoices: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string,
      number: PropTypes.string,
      path: PropTypes.string,
      amount: PropTypes.string,
    })
  ),
};

const useStyles = makeStyles((theme) => ({
  root: {},
  title: {
    display: "flex",
    alignItems: "center",

    "& > svg": {"margin-right": ".35rem"},
  },
  amountCell: {
    textAlign: "right",
    width: "10rem",
  },
}));

export default Invoices;
