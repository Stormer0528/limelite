import PropTypes from "prop-types";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
import {withStyles} from "@material-ui/core/styles";
import BalanceCell, { getChangesPrice, getChangesPercentage } from "../../shared/balance_cell";

const ReportTable = ({
  titles = [],
  classes = {},
  colspanWidth = 0,
  createLinkHandler = function () {},
  excess_revenues_totals = [],
  expenses = {},
  expenses_range_totals = {},
  revenues = {},
  revenues_range_totals = {},
  other_financing = {},
  other_financing_range_totals = {},
  net_position_totals = {},
}) => {
  return (
    <Paper>
      <Table className={classes.reportTable + " report-table condensed"}>
        <TableHead className={classes.header}>
          <TableRow className={classes.headerRow}>
            <TableCell style={{width: "3em"}} />
            {
              titles.map((title, index) =>
                <TableCell key={title}>{title}</TableCell>
              )
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {/* REVENUES */}
          <TableRow>
            <TableCell className={classes.spacer} />
            <TableCell className={classes.fundRow} colSpan={colspanWidth}>
              <h6>
                <b>Revenues</b>
              </h6>
            </TableCell>
          </TableRow>

          {Object.entries(revenues).map(
            ([accountRange, {accounts = [], title, balances = []}]) => {
              return [
                accounts.map(({description, code, current_balance, before_balance}) => {
                  return (
                    <TableRow
                      key={code}
                      style={{cursor: "pointer"}}
                      className={classes.tableRow}
                      onClick={createLinkHandler(code)}
                    >
                      <TableCell className={classes.spacer} />
                      <TableCell className={classes.codeCell}>{code}</TableCell>
                      <TableCell className={classes.nameCell}>
                        {description}
                      </TableCell>
                      <TableCell>
                        <BalanceCell balance={current_balance} />
                      </TableCell>
                      <TableCell>
                        <BalanceCell balance={before_balance} />
                      </TableCell>

                      <TableCell>
                        <BalanceCell balance={getChangesPrice(current_balance, before_balance)} />
                      </TableCell>
                      <TableCell>
                        <BalanceCell balance={getChangesPercentage(current_balance, before_balance)} />
                      </TableCell>
                    </TableRow>
                  );
                }),

                <TableRow
                  key={accountRange}
                  className={classes.titleRow}
                  onClick={createLinkHandler(accountRange.replace("-", "..."))}
                >
                  <TableCell className={classes.spacer} />
                  <TableCell className={classes.fundRow}>
                    {accountRange}
                  </TableCell>
                  <TableCell className={classes.fundRow}>{title}</TableCell>

                  <TableCell className={classes.fundRow}>
                    <BalanceCell balance={balances.current_balance} />
                  </TableCell>

                  <TableCell className={classes.fundRow}>
                    <BalanceCell balance={balances.before_balance} />
                  </TableCell>

                  <TableCell className={classes.fundRow}>
                    <BalanceCell balance={getChangesPrice(balances.current_balance, balances.before_balance)} />
                  </TableCell>

                  <TableCell className={classes.fundRow}>
                    <BalanceCell balance={getChangesPercentage(balances.current_balance, balances.before_balance)} />
                  </TableCell>
                </TableRow>,
              ];
            }
          )}
          <TableRow className={classes.titleRow}>
            <TableCell className={classes.spacer} />
            <TableCell className={classes.nameCell} colSpan={2}>
              TOTAL, REVENUES
            </TableCell>
            <TableCell>
              <BalanceCell balance={revenues_range_totals.current_balance} />
            </TableCell>
            <TableCell>
              <BalanceCell balance={revenues_range_totals.before_balance} />
            </TableCell>

            <TableCell>
              <BalanceCell balance={getChangesPrice(revenues_range_totals.current_balance, revenues_range_totals.before_balance)} />
            </TableCell>
            <TableCell>
              <BalanceCell balance={getChangesPercentage(revenues_range_totals.current_balance, revenues_range_totals.before_balance)} />
            </TableCell>
          </TableRow>

          {/* Expenses */}
          <TableRow>
            <TableCell className={classes.spacer} />
            <TableCell className={classes.fundRow} colSpan={colspanWidth}>
              <h6>
                <b>Expenses</b>
              </h6>
            </TableCell>
          </TableRow>
          {Object.entries(expenses).map(
            ([accountRange, {accounts = [], title, balances = []}]) => {
              return [
                accounts.map(({description, code, balance, current_balance, before_balance}) => {
                  return (
                    <TableRow
                      key={code}
                      className={classes.tableRow}
                      onClick={createLinkHandler(code)}
                    >
                      <TableCell className={classes.spacer} />
                      <TableCell className={classes.codeCell}>{code}</TableCell>
                      <TableCell className={classes.nameCell}>
                        {description}
                      </TableCell>
                      <TableCell>
                        <BalanceCell balance={current_balance} />
                      </TableCell>
                      <TableCell>
                        <BalanceCell balance={before_balance} />
                      </TableCell>

                      <TableCell>
                        <BalanceCell balance={getChangesPrice(current_balance, before_balance)} />
                      </TableCell>
                      <TableCell>
                        <BalanceCell balance={getChangesPercentage(current_balance, before_balance)} />
                      </TableCell>
                    </TableRow>
                  );
                }),
                <TableRow
                  key={accountRange}
                  style={{cursor: "pointer"}}
                  className={classes.titleRow}
                  onClick={createLinkHandler(
                    accountRange + "..." + accountRange.replace(/0/g, "9")
                  )}
                >
                  <TableCell className={classes.spacer} />
                  <TableCell className={classes.fundRow}>
                    {accountRange}
                  </TableCell>
                  <TableCell className={classes.fundRow}>{title}</TableCell>
                  <TableCell className={classes.fundRow}>
                    <BalanceCell balance={balances.current_balance} />
                  </TableCell>
                  <TableCell className={classes.fundRow}>
                    <BalanceCell balance={balances.before_balance} />
                  </TableCell>

                  <TableCell className={classes.fundRow}>
                    <BalanceCell balance={getChangesPrice(balances.current_balance, balances.before_balance)} />
                  </TableCell>
                  <TableCell className={classes.fundRow}>
                    <BalanceCell balance={getChangesPercentage(balances.current_balance, balances.before_balance)} />
                  </TableCell>
                </TableRow>,
              ];
            }
          )}
          <TableRow className={classes.titleRow}>
            <TableCell className={classes.spacer} />
            <TableCell className={classes.nameCell} colSpan={2}>
              TOTAL, EXPENSES
            </TableCell>
            <TableCell>
              <BalanceCell balance={expenses_range_totals.current_balance} />
            </TableCell>
            <TableCell>
              <BalanceCell balance={expenses_range_totals.before_balance} />
            </TableCell>
            <TableCell>
              <BalanceCell balance={getChangesPrice(expenses_range_totals.current_balance, expenses_range_totals.before_balance)} />
            </TableCell>
            <TableCell>
              <BalanceCell balance={getChangesPercentage(expenses_range_totals.current_balance, expenses_range_totals.before_balance)} />
            </TableCell>
          </TableRow>
          <TableRow className={classes.titleRow}>
            <TableCell className={classes.spacer} />
            <TableCell colSpan={2}>
              Excess (Deficiency) of Revenues Over Expenses
            </TableCell>
            <TableCell><BalanceCell balance={excess_revenues_totals.current_balance} /></TableCell>
            <TableCell><BalanceCell balance={excess_revenues_totals.before_balance} /></TableCell>
            <TableCell>
              <BalanceCell balance={getChangesPrice(excess_revenues_totals.current_balance, excess_revenues_totals.before_balance)} />
            </TableCell>
            <TableCell>
              <BalanceCell balance={getChangesPercentage(excess_revenues_totals.current_balance, excess_revenues_totals.before_balance)} />
            </TableCell>
          </TableRow>

          {/* Other Financing */}
          <TableRow>
            <TableCell className={classes.spacer} />
            <TableCell className={classes.fundRow} colSpan={colspanWidth}>
              <h6>
                <b>Other Financing Sources/Uses</b>
              </h6>
            </TableCell>
          </TableRow>
          {Object.entries(other_financing).sort((a, b) => {
            const order = ['8900-8929', '7600-7629', '8930-8979', '7630-7699', '8980-8999']
            const index1 = order.indexOf(a[0]), index2 = order.indexOf(b[0])

            if (index2 == -1) return -1
            if (index1 == -1) return 1

            if (index1 < index2) return -1
            if (index1 > index2) return 1
            return 0;
          }).map(
            ([accountRange, {accounts = [], title, balances = {}}]) => {
              return [
                accounts.map(({description, code, current_balance, before_balance}) => {
                  return (
                    <TableRow
                      key={code}
                      className={classes.tableRow}
                      onClick={createLinkHandler(code)}
                    >
                      <TableCell className={classes.spacer} />
                      <TableCell className={classes.codeCell}>{code}</TableCell>
                      <TableCell className={classes.nameCell}>
                        {description}
                      </TableCell>
                      <TableCell>
                        <BalanceCell balance={current_balance} parenthesis={accountRange && accountRange.startsWith('76')} />
                      </TableCell>
                      <TableCell>
                        <BalanceCell balance={before_balance} parenthesis={accountRange && accountRange.startsWith('76')} />
                      </TableCell>
                      <TableCell>
                        <BalanceCell balance={getChangesPrice(current_balance, before_balance)} />
                      </TableCell>
                      <TableCell>
                        <BalanceCell balance={getChangesPercentage(current_balance, before_balance)} />
                      </TableCell>
                    </TableRow>
                  );
                }),
                <TableRow
                  key={accountRange}
                  style={{cursor: "pointer"}}
                  className={classes.titleRow}
                  onClick={createLinkHandler(
                    accountRange + "..." + accountRange.replace(/0/g, "9")
                  )}
                >
                  <TableCell className={classes.spacer} />
                  <TableCell className={classes.fundRow}>
                    {accountRange}
                  </TableCell>
                  <TableCell className={classes.fundRow}>{title}</TableCell>
                  <TableCell className={classes.fundRow}>
                    <BalanceCell balance={balances.current_balance} parenthesis={accountRange && accountRange.startsWith('76')} />
                  </TableCell>
                  <TableCell className={classes.fundRow}>
                    <BalanceCell balance={balances.before_balance} parenthesis={accountRange && accountRange.startsWith('76')} />
                  </TableCell>
                  <TableCell className={classes.fundRow}>
                    <BalanceCell balance={getChangesPrice(balances.current_balance, balances.before_balance)} />
                  </TableCell>
                  <TableCell className={classes.fundRow}>
                    <BalanceCell balance={getChangesPercentage(balances.current_balance, balances.before_balance)} />
                  </TableCell>
                </TableRow>,
              ];
            }
          )}
          <TableRow className={classes.titleRow}>
            <TableCell className={classes.spacer} />
            <TableCell className={classes.nameCell} colSpan={2}>
              TOTAL, OTHER FINANCING SOURCES/USES
            </TableCell>
            <TableCell>
              <BalanceCell balance={other_financing_range_totals.current_balance} />
            </TableCell>
            <TableCell>
              <BalanceCell balance={other_financing_range_totals.before_balance} />
            </TableCell>
            <TableCell>
              <BalanceCell balance={getChangesPrice(other_financing_range_totals.current_balance, other_financing_range_totals.before_balance)} />
            </TableCell>
            <TableCell>
              <BalanceCell balance={getChangesPercentage(other_financing_range_totals.current_balance, other_financing_range_totals.before_balance)} />
            </TableCell>
          </TableRow>
          <TableRow className={classes.titleRow}>
            <TableCell className={classes.spacer} />
            <TableCell className={classes.nameCell} colSpan={2}>
              NET INCREASE (DECREASE) IN NET POSITION
            </TableCell>
            <TableCell>
              <BalanceCell balance={net_position_totals.current_balance} />
            </TableCell>
            <TableCell>
              <BalanceCell balance={net_position_totals.before_balance} />
            </TableCell>
            <TableCell>
              <BalanceCell balance={getChangesPrice(net_position_totals.current_balance, net_position_totals.before_balance)} />
            </TableCell>
            <TableCell>
              <BalanceCell balance={getChangesPercentage(net_position_totals.current_balance, net_position_totals.before_balance)} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
};

ReportTable.propTypes = {
  titles: PropTypes.array,
  accountFundName: PropTypes.string,
  accountFundCode: PropTypes.string,
  excess_revenues_totals: PropTypes.object,
  excess_revenues: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  data: PropTypes.object,
  colspanWidth: PropTypes.number,
  classes: PropTypes.object.isRequired,
  createLinkHandler: PropTypes.func.isRequired,
  expenses: PropTypes.object,
  expenses_range_totals: PropTypes.object,
  revenues: PropTypes.object,
  revenues_range_totals: PropTypes.object,
  other_financing: PropTypes.object,
  other_financing_range_totals: PropTypes.object,
  net_position_totals: PropTypes.object,
};

const styles = (theme) => ({
  header: {
    borderBottom: "2px solid black",
  },
  headerRow: {
    borderBottom: "1px solid #ccc",
    ["&:last-child"]: {
      borderBottom: "none",
    },
  },
  reportTable: {
    ["tr > td"]: {
      padding: ".125rem 1rem",
    },
  },
  spacer: {
    width: "2em",
    maxWidth: "2em",
    padding: 0,
  },
  tableRow: {
    cursor: "pointer",
  },
  titleRow: {
    ["& > td"]: {
      fontWeight: "bold",
    },
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
