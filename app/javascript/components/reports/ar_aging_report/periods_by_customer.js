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
  periodsByCustomer = {},
  showActiveColumns = false,
  classes = {},
}) => {
  return (
    <section className={classes.root}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{width: "35%"}}>Customer</TableCell>
            {periodNames.map(name => (
              <TableCell
                style={{width: "10.82%"}}
                className={classes.headerCenter}
                key={name}
              >
                <BalanceCell balance={name.toLocaleUpperCase()} />
              </TableCell>
            ))}
            <TableCell className={classes.headerRight}><BalanceCell balance="TOTAL" /></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(periodsByCustomer).map(([id, customer]) => {
            const {name, periods = {}, total_balance} = customer;

            if (
              showActiveColumns &&
              Object.values(periods).every(val => val === 0)
            ) {
              return null;
            }

            return (
              <TableRow key={id}>
                <TableCell style={{width: "35%"}}>{name}</TableCell>
                {periodNames.map(period => (
                  <TableCell
                    key={`${id}-${period}`}
                    style={{width: "10.82%"}}
                    className={classes.currencyCell}
                  >
                    <BalanceCell balance={USD(periods[period]).format()} />
                  </TableCell>
                ))}

                <TableCell key={`${id}-total`} className={classes.currencyCell}>
                  <BalanceCell balance={USD(total_balance).format()} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </section>
  );
};

ReportTable.propTypes = {
  periodNames: PropTypes.arrayOf(PropTypes.string),
  periodsByCustomer: PropTypes.object,
  showActiveColumns: PropTypes.bool,
  classes: PropTypes.object.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
  },
  tableBody: {
    flexGrow: 1,
    overflow: "auto",
  },
  currencyCell: {
    textAlign: "right",
  },
  headerCenter: {
    textAlign: "center",
    padding: "4px 24px",
  },
  headerRight: {
    padding: "4px 24px 4px 56px",
    textAlign: "right",
  },
});

export default withStyles(styles)(ReportTable);
