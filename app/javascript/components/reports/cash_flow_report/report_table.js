import PropTypes from "prop-types";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import BalanceCell from "../../shared/balance_cell";
import {withStyles} from "@material-ui/core/styles";

const ReportTable = ({
  netCash = [],
  otherIncome = [],
  otherIncomeTotal = "$0.00",
  netOperationsCash = [],
  investingActivities = [],
  investingActivitiesTotal = "$0.00",
  financingActivities = [],
  financingActivitiesTotal = "$0.00",
  netCashIncrease = "$0.00",
  cashAtBeginning = "$0.00",
  cashAtEnd = "$0.00",
  accountFund = [],
  classes = {},
}) => {
  return (
    <Paper>
      <Table>
        <TableHead />
        <TableBody>
          <TableRow>
            <TableCell colSpan={3} className={classes.headerCell}>
              <b>OPERATING ACTIVITIES</b>
            </TableCell>
          </TableRow>
          {/* NET CASH */}
          <TableRow>
            <TableCell colSpan={2}>
              <b>Net Income</b>
            </TableCell>
            <TableCell><BalanceCell deleteSign={false} balance={netCash} /></TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={3} className={classes.labelCell}>
              <b>
                Adjustments to reconcile Net Income to Net Cash provided by
                operations:
              </b>
            </TableCell>
          </TableRow>
          {/*  Other Income */}
          {(otherIncome || []).map(({code, name, balance}, i) => (
            <TableRow key={i}>
              <TableCell>{code}</TableCell>
              <TableCell>{name}</TableCell>
              <TableCell><BalanceCell deleteSign={false} balance={balance} /></TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={2} className={classes.labelCell}>
              <b>
                Total Adjustments to reconcile Net Income to Net Cash provided
                by operations:
              </b>
            </TableCell>
            <TableCell><BalanceCell deleteSign={false} balance={otherIncomeTotal} /></TableCell>
          </TableRow>
          <TableRow className={classes.totalRow}>
            <TableCell
              colSpan={2}
              className={`${classes.labelCell} ${classes.totalCell}`}
            >
              <b>Net cash provided by operating activities:</b>
            </TableCell>
            <TableCell>
              <BalanceCell deleteSign={false} balance={netOperationsCash} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={3} className={classes.headerCell}>
              <b>INVESTING ACTIVITIES</b>
            </TableCell>
          </TableRow>
          {/*  Investing Activities */}
          {(investingActivities || []).map(({code, name, balance}, i) => (
            <TableRow key={i}>
              <TableCell>{code}</TableCell>
              <TableCell>{name}</TableCell>
              <TableCell><BalanceCell deleteSign={false} balance={balance} /></TableCell>
            </TableRow>
          ))}
          <TableRow className={classes.totalRow}>
            <TableCell
              colSpan={2}
              className={`${classes.labelCell} ${classes.totalCell}`}
            >
              <b>Net cash provided by investing activities</b>
            </TableCell>
            <TableCell><BalanceCell deleteSign={false} balance={investingActivitiesTotal} /></TableCell>
          </TableRow>
          {/*  FINANCING ACTIVITIES */}
          <TableRow>
            <TableCell colSpan={3} className={classes.headerCell}>
              <b>FINANCING ACTIVITIES</b>
            </TableCell>
          </TableRow>
          {(financingActivities || []).map(({code, name, balance}, i) => (
            <TableRow key={i}>
              <TableCell>{code}</TableCell>
              <TableCell>{name}</TableCell>
              <TableCell><BalanceCell deleteSign={false} balance={balance} /></TableCell>
            </TableRow>
          ))}
          <TableRow className={classes.totalRow}>
            <TableCell
              colSpan={2}
              className={`${classes.labelCell} ${classes.totalCell}`}
            >
              <b>Net cash provided by financing activities</b>
            </TableCell>
            <TableCell><BalanceCell deleteSign={false} balance={financingActivitiesTotal} /></TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2} className={classes.labelCell}>
              <b>Net cash increase for period:</b>
            </TableCell>
            <TableCell><BalanceCell deleteSign={false} balance={netCashIncrease} /></TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2} className={classes.labelCell}>
              <b>Cash at beginning of period:</b>
            </TableCell>
            <TableCell><BalanceCell deleteSign={false} balance={cashAtBeginning} /></TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2} className={classes.labelCell}>
              <b>Cash at end of period:</b>
            </TableCell>
            <TableCell><BalanceCell deleteSign={false} balance={cashAtEnd} /></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
};

ReportTable.propTypes = {
  cashFromCustomers: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  cashToSuppliers: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  netOperationsFlow: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  beginningCash: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  endingCash: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  netCash: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
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
