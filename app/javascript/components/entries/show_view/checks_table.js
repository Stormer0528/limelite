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

import BankIcon from "../../shared/icons/bank_account_icon";
import CheckIcon from "../../shared/icons/check_icon";
import DepositIcon from "../../shared/icons/deposit_icon";
import TransferIcon from "../../shared/icons/account_transfer_icon";

const ChecksTable = ({checks = []}) => {
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
                <BankIcon /> Bank Account Items
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.typeCell}>Type</TableCell>
            <TableCell>Memo</TableCell>
            <TableCell>Number</TableCell>
            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {checks.map((check, i) => (
            <TableRow key={`${check.id}-${i}`}>
              <TableCell className={classes.typeCell}>
                <a className={classes.itemLink} href={check.path}>
                  <BankItemIcon type={check.type} />
                  {check.type}
                </a>
              </TableCell>
              <TableCell>{check.memo}</TableCell>
              <TableCell>{check.number}</TableCell>
              <TableCell align="right">${check.amount}</TableCell>
            </TableRow>
          ))}
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
  typeCell: {
    width: "10rem",
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

function BankItemIcon({type}) {
  switch (type) {
    case "Check":
      return <CheckIcon />;
    case "Deposit":
      return <DepositIcon />;
    case "AccountTransfer":
      return <TransferIcon />;
    default:
      return null;
  }
}
