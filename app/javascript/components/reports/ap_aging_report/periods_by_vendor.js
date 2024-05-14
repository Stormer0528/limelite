import PropTypes from "prop-types";
import {USD} from "../../../utils";
import {Fragment} from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {withStyles} from "@material-ui/core/styles";
import BalanceCell from "../../shared/balance_cell";

const ReportTable = ({
  periodNames = [],
  periodsByVendor = {},
  showActiveColumns = false,
  classes = {},
}) => {
  return (
    <section className={classes.root}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{width: "35%"}}>Vendor</TableCell>
            {periodNames.map(name => (
              <TableCell
                style={{width: "10.82%"}}
                className={classes.headerRight}
                key={name}
              >
                <BalanceCell balance={name.toLocaleUpperCase()} />
              </TableCell>
            ))}
            <TableCell className={classes.headerRight}><BalanceCell balance={"TOTAL"} /></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(periodsByVendor).map(([id, vendor]) => {
            const {
              name,
              periods = {},
              total_balance,
              balance_by_account,
            } = vendor;

            if (
              showActiveColumns &&
              Object.values(periods).every(val => val === 0)
            ) {
              return null;
            }

            return (
              <Fragment key={id}>
                <TableRow key={id} className={classes.vendorRow}>
                  <TableCell style={{width: "35%"}}>{name}</TableCell>
                  {periodNames.map(period => (
                    <TableCell
                      key={`periodNames${id}-${period}`}
                      style={{width: "10.82%"}}
                      className={classes.currencyCell}
                    >
                      <BalanceCell balance={USD(periods[period]).format()} />
                    </TableCell>
                  ))}

                  <TableCell
                    key={`${id}-total`}
                    className={classes.currencyCell}
                  >
                    <BalanceCell balance={USD(total_balance).format()} />
                  </TableCell>
                </TableRow>
                {balance_by_account.map(accountBalances => {
                  return Object.entries(accountBalances).map(
                    ([code, balances]) => {
                      return (
                        <TableRow
                          key={`accountBalances-${id}`}
                          className={classes.accountRow}
                        >
                          <TableCell style={{width: "35%"}}>{code}</TableCell>
                          {balances.map((balance, i) => (
                            <TableCell
                              key={`${code}-${id}-${balance} - ${i}`}
                              style={{width: "10.82%"}}
                              className={classes.currencyCell}
                            >
                              <BalanceCell balance={USD(balance).format()} />
                            </TableCell>
                          ))}
                        </TableRow>
                      );
                    }
                  );
                })}
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
    </section>
  );
};

ReportTable.propTypes = {
  periodNames: PropTypes.arrayOf(PropTypes.string),
  periodsByVendor: PropTypes.object,
  vendorsByPeriod: PropTypes.object,
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
  headerRight: {
    textAlign: "right",
  },
  vendorRow: {
    backgroundColor: "#EFEFEF",
    fontSize: "1.25rem",
    color: "blue",

    "& > td:first-child": {
      fontSize: "1.025rem",
    },
  },
  accountRow: {
    backgroundColor: "#f5f5f5",
    "& > td": {
      color: "#616161;",
    },
  },
});

export default withStyles(styles)(ReportTable);
