import PropTypes from "prop-types";
import {USD} from "../../../utils";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {withStyles} from "@material-ui/core/styles";
import BalanceCell from "../../shared/balance_cell";

const ReportTable = ({
  periodNames = [],
  customersByPeriod = {},
  showActiveRows = false,
  classes = {},
}) => {
  return (
    <section className={classes.root}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Transaction Type</TableCell>
            <TableCell>Num</TableCell>
            <TableCell>Vendor</TableCell>
            <TableCell>Dept</TableCell>
            <TableCell className={classes.dateCell}>Due Date</TableCell>
            <TableCell className={classes.dateCell}>Past Due</TableCell>
            <TableCell><BalanceCell balance="Amount" /></TableCell>
            <TableCell><BalanceCell balance="Open Balance" /></TableCell>
          </TableRow>
        </TableHead>
      </Table>
      <div className={classes.tableBody}>
        <Table>
          <TableBody>
            {periodNames.map(period => [
              (!showActiveRows || customersByPeriod[period].length > 0) && (
                <TableRow key={period}>
                  <TableCell colSpan={9} className={classes.titleRow}>
                    {period}
                  </TableCell>
                </TableRow>
              ),
              customersByPeriod[period].length === 0 && !showActiveRows && (
                <TableRow key={`empty-${period}`}>
                  <TableCell colSpan={9} className={classes.emptyRow}>
                    No Data For This Period
                  </TableCell>
                </TableRow>
              ),
              customersByPeriod[period].map(
                (
                  {
                    name,
                    date,
                    number,
                    transaction_type,
                    due_date,
                    past_due,
                    amount,
                    dept,
                    open_balance,
                  },
                  i
                ) => {
                  return (
                    <TableRow key={`${name}-${i}`}>
                      <TableCell className={classes.dateCell}>{date}</TableCell>
                      <TableCell>{transaction_type}</TableCell>
                      <TableCell>{number}</TableCell>
                      <TableCell>{name}</TableCell>
                      <TableCell>{dept}</TableCell>
                      <TableCell className={classes.dateCell}>
                        {due_date}
                      </TableCell>
                      <TableCell className={classes.dateCell}>
                        {past_due}
                      </TableCell>
                      <TableCell className={classes.currencyCell}>
                        <BalanceCell balance={USD(amount).format()} />
                      </TableCell>
                      <TableCell className={classes.currencyCell}>
                      <BalanceCell balance={USD(open_balance).format()} />
                      </TableCell>
                    </TableRow>
                  );
                }
              ),
            ])}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

ReportTable.propTypes = {
  periodNames: PropTypes.arrayOf(PropTypes.string),
  customersByPeriod: PropTypes.object,
  showActiveRows: PropTypes.bool,

  classes: PropTypes.object.isRequired,
};

const styles = theme => ({
  root: {
    overflow: "auto",
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
  },
  tableBody: {
    flexGrow: 1,
    overflow: "auto",
  },
  titleRow: {
    fontWeight: "400",
    backgroundColor: "#CFD8DC",
    textAlign: "center",
    textTransform: "capitalize",
    fontSize: "1.25em",
    color: "#455A64",
    padding: "0 1em",
  },
  emptyRow: {
    fontWeight: "200",
    backgroundColor: "#FAFAFA",
    textAlign: "center",
    fontSize: ".95em",
    color: "#607D8B",
    padding: "0 1em",
  },
  currencyCell: {
    textAlign: "right",
  },
  dateCell: {
    padding: "0 .5em",
    textAlign: "center",
    width: "11em",
  },
});

export default withStyles(styles)(ReportTable);
