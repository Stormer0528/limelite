import PropTypes from "prop-types";
import clsx from "clsx";
import {makeStyles} from "@material-ui/core/styles";
import {titleCase} from "humanize-plus";

import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import CheckIcon from "../../shared/icons/check_icon";
import PaymentIcon from "../../shared/icons/payment_icon";
import FinalIcon from "@material-ui/icons/CheckCircle";
import ShowIcon from "@material-ui/icons/FindInPage";

const PaymentsTable = ({payments = []}) => {
  const classes = useStyles();

  return (
    <TableContainer component={Paper} className={classes.root}>
      <Table size="small" className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell colSpan="6">
              <Typography
                className={classes.itemLink}
                variant="h5"
                component="h2"
              >
                <PaymentIcon /> Payments
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Final</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Check Status</TableCell>
            <TableCell />
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {payments.map(
            (
              {
                id,
                final,
                formattedDate,
                amount,
                path,
                check: {editPath, aasmState} = {},
              },
              i
            ) => (
              <TableRow key={`${id}-${i}`}>
                <TableCell className={classes.finalCell}>
                  <Final final={final} />
                </TableCell>
                <TableCell>{formattedDate}</TableCell>
                <TableCell>{amount}</TableCell>
                <TableCell className={clsx(classes.approvalText, aasmState)}>
                  {titleize(aasmState)}
                </TableCell>
                <TableCell>
                  <Button
                    startIcon={<CheckIcon />}
                    href={editPath}
                    variant="outlined"
                  >
                    Edit Check
                  </Button>
                </TableCell>
                <TableCell>
                  <IconButton href={path} color="primary">
                    <ShowIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

PaymentsTable.propTypes = {
  payments: PropTypes.array,
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
  approvalText: {
    fontWeight: 400,

    "&.draft": {
      color: "#2196f3",
    },
    "&.approved": {
      color: "#4caf50",
    },
    "&.needs_revision": {
      color: "#ffb300",
    },

    "&.reversed": {
      color: "#f44336",
    },
  },
}));

export default PaymentsTable;

function Final({final = false}) {
  return final ? <FinalIcon /> : null;
}

const titleize = (str = "") => titleCase(str.replace(/[-_]/g, " "));
