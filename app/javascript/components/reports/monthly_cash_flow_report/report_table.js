import PropTypes from "prop-types";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import {withStyles} from "@material-ui/core/styles";

const ReportTable = ({
  monthTitles = [],
  // months = [],
  netCash = [],
  otherIncome = [],
  otherIncomeTotal = [],
  netOperationsCash = [],
  investingActivities = [],
  investingActivitiesTotal = [],
  financingActivities = [],
  financingActivitiesTotal = [],
  netCashIncrease = [],
  cashAtBeginning = [],
  cashAtEnd = [],
  colspanWidth = 0,

  classes = {},
}) => {
  return (
    <Paper className={classes.root}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell />
            {monthTitles.map(month => (
              <TableCell key={month}>{month}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell
              colSpan={2 + colspanWidth}
              className={classes.headerCell}
            >
              <b>OPERATING ACTIVITIES</b>
            </TableCell>
          </TableRow>
          {/* NET CASH */}
          <TableRow>
            <TableCell colSpan={2}>
              <b>Net Income</b>
            </TableCell>
            {(netCash || []).map((total, i) => (
              <TableCell key={i}>{total}</TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell colSpan={2 + colspanWidth} className={classes.labelCell}>
              <b>
                Adjustments to reconcile Net Income to Net Cash provided by
                operations:
              </b>
            </TableCell>
          </TableRow>
          {/*  Other Income */}
          {(otherIncome || []).map(({code, name, balances = []}, i) => (
            <TableRow key={i}>
              <TableCell>{code}</TableCell>
              <TableCell>{name}</TableCell>
              {(balances || []).map((balance, i) => (
                <TableCell key={i}>{balance}</TableCell>
              ))}
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={2} className={classes.labelCell}>
              <b>
                Total Adjustments to reconcile Net Income to Net Cash provided
                by operations:
              </b>
            </TableCell>
            {otherIncomeTotal.map((total, i) => (
              <TableCell key={i}>{total}</TableCell>
            ))}
          </TableRow>
          <TableRow className={classes.totalRow}>
            <TableCell
              colSpan={2}
              className={`${classes.labelCell} ${classes.totalCell}`}
            >
              <b>Net cash provided by operating activities:</b>
            </TableCell>
            {(netOperationsCash || []).map((total, i) => (
              <TableCell className={classes.totalCell} key={i}>
                {total}
              </TableCell>
            ))}
          </TableRow>

          <TableRow>
            <TableCell
              colSpan={2 + colspanWidth}
              className={classes.headerCell}
            >
              <b>INVESTING ACTIVITIES</b>
            </TableCell>
          </TableRow>
          {/*  Investing Activities */}
          {(investingActivities || []).map(({code, name, balances = []}, i) => (
            <TableRow key={i}>
              <TableCell>{code}</TableCell>
              <TableCell>{name}</TableCell>
              {balances.map((balance, i) => (
                <TableCell key={i}>{balance}</TableCell>
              ))}
            </TableRow>
          ))}
          <TableRow className={classes.totalRow}>
            <TableCell
              colSpan={2}
              className={`${classes.labelCell} ${classes.totalCell}`}
            >
              <b>Net cash provided by investing activities</b>
            </TableCell>
            {investingActivitiesTotal.map((total, i) => (
              <TableCell className={classes.totalCell} key={i}>
                {total}
              </TableCell>
            ))}
          </TableRow>
          {/*  FINANCING ACTIVITIES */}
          <TableRow>
            <TableCell
              colSpan={2 + colspanWidth}
              className={classes.headerCell}
            >
              <b>FINANCING ACTIVITIES</b>
            </TableCell>
          </TableRow>
          {(financingActivities || []).map(({code, name, balances = []}, i) => (
            <TableRow key={i}>
              <TableCell>{code}</TableCell>
              <TableCell>{name}</TableCell>
              {balances.map((balance, i) => (
                <TableCell key={i}>{balance}</TableCell>
              ))}
            </TableRow>
          ))}
          <TableRow className={classes.totalRow}>
            <TableCell
              colSpan={2}
              className={`${classes.labelCell} ${classes.totalCell}`}
            >
              <b>Net cash provided by financing activities</b>
            </TableCell>
            {financingActivitiesTotal.map((total, i) => (
              <TableCell className={classes.totalCell} key={i}>
                {total}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell colSpan={2} className={classes.labelCell}>
              <b>Net cash increase for period:</b>
            </TableCell>
            {netCashIncrease.map((total, i) => (
              <TableCell key={i}>{total}</TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell colSpan={2} className={classes.labelCell}>
              <b>Cash at beginning of period:</b>
            </TableCell>
            {cashAtBeginning.map((total, i) => (
              <TableCell key={i}>{total}</TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell colSpan={2} className={classes.labelCell}>
              <b>Cash at end of period:</b>
            </TableCell>
            {cashAtEnd.map((total, i) => (
              <TableCell key={i}>{total}</TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
};

ReportTable.propTypes = {
  colspanWidth: PropTypes.number,
  monthTitles: PropTypes.arrayOf(PropTypes.string),
  months: PropTypes.arrayOf(PropTypes.string),
  netCash: PropTypes.arrayOf(PropTypes.string),
  otherIncomeTotal: PropTypes.arrayOf(PropTypes.string),
  netOperationsCash: PropTypes.arrayOf(PropTypes.string),
  investingActivities: PropTypes.arrayOf(PropTypes.string),
  investingActivitiesTotal: PropTypes.arrayOf(PropTypes.string),
  financingActivities: PropTypes.arrayOf(PropTypes.string),
  financingActivitiesTotal: PropTypes.arrayOf(PropTypes.string),
  netCashIncrease: PropTypes.arrayOf(PropTypes.string),
  cashAtBeginning: PropTypes.arrayOf(PropTypes.string),
  cashAtEnd: PropTypes.arrayOf(PropTypes.string),
  otherIncome: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      code: PropTypes.string,
      balances: PropTypes.arrayOf(PropTypes.string),
    })
  ),

  cashFromCustomers: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  cashToSuppliers: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  netOperationsFlow: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  beginningCash: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  endingCash: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

  classes: PropTypes.object.isRequired,
};

const styles = theme => ({
  root: {
    overflow: "auto",
  },
  headerCell: {
    backgroundColor: "#f0f0f0",
    fontWeight: "500",
    fontSize: "1.15rem",
    textAlign: "center",
  },
  totalRow: {
    backgroundColor: "#CFD8DC",
    fontSize: "1.15rem",
    "& > td": {
      color: "#546E7A",
      fontWeight: "400",
      borderTop: "2px solid #90A4AE",
    },
  },
  totalCell: {
    textAlign: "center",
  },
});

export default withStyles(styles)(ReportTable);
