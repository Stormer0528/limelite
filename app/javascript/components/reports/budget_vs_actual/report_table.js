import PropTypes from "prop-types";
import clsx from "clsx";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
import BalanceCell from "../../shared/balance_cell";
import {withStyles} from "@material-ui/core/styles";

const ReportTable = ({
  account_funds = [],
  classes = {},
  colspanWidth = 0,
  createLinkHandler = function () {},
  createBudgetLinkHandler = function () {},
  excess_revenues = "",
  excess_revenues_totals = [],
  excess_revenues_budget,
  excess_revenues_account_balance,
  expenditures = {},
  expenditures_account_balance_percentage = "",
  expenditures_account_balance_total = "",
  expenditures_budget_total = "",
  expenditures_range_totals = [],
  expenditures_total = "",
  revenue = {},
  revenue_account_balance_percentage = "",
  revenue_account_balance_total = "",
  revenue_budget_total = "",
  revenue_range_totals = [],
  revenue_total = "",
}) => {
  return (
    <Paper>
      <Table className={classes.reportTable + " report-table condensed"}>
        <TableHead className={classes.header}>
          <TableRow className={classes.headerRow}>
            <TableCell style={{width: "3em"}} />
            <TableCell>Object</TableCell>
            <TableCell>Description</TableCell>
            {/* Account Funds */}
            {account_funds.map(({name, code}) => (
              <Tooltip placement="top" key={code} title={name}>
                <TableCell><BalanceCell balance={code} /></TableCell>
              </Tooltip>
            ))}
            <TableCell><BalanceCell balance="Balance" /></TableCell>
            <TableCell><BalanceCell balance="Budget" /></TableCell>
            <TableCell><BalanceCell balance="$ Variance" deleteSign={false} /></TableCell>
            <TableCell>%&nbsp;Variance</TableCell>
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
          {Object.entries(revenue).map(
            ({
              [0]: accountRange,
              [1]: {
                accounts,
                title,
                funds_balances = [],
                total_balance,
                total_budget,
                total_account_balance,
                total_account_percentage,
              },
            }) => {
              return [
                accounts.map(
                  ({
                    name,
                    code,
                    balance,
                    budget,
                    dollar_variance,
                    percentage_variance,
                    account_funds = [],
                  }) => {
                    if (balance === "$0.00" && budget === "$0.00") {
                      return null;
                    }

                    const accountFunds = Object.entries(account_funds).map(
                      ({[0]: fundCode, [1]: balance}) => {
                        return (
                          <TableCell
                            key={fundCode}
                          >
                            <BalanceCell balance={balance} />
                          </TableCell>
                        );
                      }
                    );

                    return (
                      <TableRow
                        key={code}
                        style={{cursor: "pointer"}}
                        className={classes.tableRow}
                        onClick={createLinkHandler(code)}
                      >
                        <TableCell className={classes.spacer} />
                        <TableCell className={classes.codeCell}>
                          {code}
                        </TableCell>
                        <TableCell className={classes.nameCell}>
                          {name}
                        </TableCell>
                        {accountFunds}
                        <TableCell>
                          <BalanceCell balance={balance} />
                        </TableCell>
                        <TableCell>
                          <a
                            onClick={createBudgetLinkHandler(code)}
                            className={classes.budgetCell}
                          >
                            <BalanceCell balance={budget} />
                          </a>
                        </TableCell>
                        <TableCell>
                          <BalanceCell balance={dollar_variance} />
                        </TableCell>
                        <TableCell className={classes.percentageCell}>
                          {percentage_variance === 0
                            ? "N/A"
                            : `${percentage_variance}%`}
                        </TableCell>
                      </TableRow>
                    );
                  }
                ),
                total_balance !== "$0.00" && (
                  <TableRow
                    key={accountRange}
                    className={classes.titleRow}
                    onClick={createLinkHandler(
                      accountRange.replace("-", "...")
                    )}
                  >
                    <TableCell className={classes.spacer} />
                    <TableCell className={classes.fundRow}>
                      {accountRange}
                    </TableCell>
                    <TableCell className={classes.fundRow}>{title}</TableCell>
                    {Object.entries(funds_balances).map(
                      ({[0]: fundCode, [1]: balance}) => {
                        return (
                          <TableCell
                            key={fundCode}
                          >
                            <BalanceCell balance={balance} />
                          </TableCell>
                        );
                      }
                    )}
                    <TableCell className={classes.fundRow}>
                      <BalanceCell balance={total_balance} />
                    </TableCell>
                    <TableCell className={classes.fundRow}>
                      <BalanceCell balance={total_budget} />
                    </TableCell>
                    <TableCell className={classes.fundRow}>
                      <BalanceCell balance={total_account_balance} />
                    </TableCell>
                    <TableCell
                      className={clsx(classes.fundRow, classes.percentageCell)}
                    >
                      {total_account_percentage === 0
                        ? "N/A"
                        : `${total_account_percentage}%`}
                    </TableCell>
                  </TableRow>
                ),
              ];
            }
          )}
          <TableRow className={classes.titleRow}>
            <TableCell className={classes.spacer} />
            <TableCell className={classes.nameCell} colSpan={2}>
              Total Revenues
            </TableCell>
            {Object.entries(revenue_range_totals).map(
              ({[0]: key, [1]: value}) => (
                <TableCell key={key}>
                  <BalanceCell balance={value} />
                </TableCell>
              )
            )}
            <TableCell>
              <BalanceCell balance={revenue_total} />
            </TableCell>
            <TableCell>
              <BalanceCell balance={revenue_budget_total} />
            </TableCell>
            <TableCell>
              <BalanceCell balance={revenue_account_balance_total} />
            </TableCell>
            <TableCell className={classes.percentageCell}>
              {revenue_account_balance_percentage === 0
                ? "N/A"
                : `${revenue_account_balance_percentage}%`}
            </TableCell>
          </TableRow>

          {/* EXPENDITURES */}
          <TableRow>
            <TableCell className={classes.spacer} />
            <TableCell className={classes.fundRow} colSpan={colspanWidth}>
              <h6>
                <b>Expenditures</b>
              </h6>
            </TableCell>
          </TableRow>
          {Object.entries(expenditures).map(
            ({
              [0]: accountRange,
              [1]: {
                accounts,
                title,
                funds_balances = [],
                total_balance,
                total_budget,
                total_account_balance,
                total_account_percentage,
              },
            }) => {
              return [
                accounts.map(
                  ({
                    name,
                    code,
                    account_funds = [],
                    balance,
                    budget,
                    dollar_variance,
                    percentage_variance,
                  }) => {
                    if (balance === "$0.00" && budget === "$0.00") {
                      return null;
                    }

                    const accountFunds = Object.entries(account_funds).map(
                      ({[0]: fundCode, [1]: balance}) => {
                        return (
                          <TableCell
                            key={fundCode}
                          >
                            <BalanceCell balance={balance} />
                          </TableCell>
                        );
                      }
                    );

                    return (
                      <TableRow
                        key={code}
                        className={classes.tableRow}
                        onClick={createLinkHandler(code)}
                      >
                        <TableCell className={classes.spacer} />
                        <TableCell className={classes.codeCell}>
                          {code}
                        </TableCell>
                        <TableCell className={classes.nameCell}>
                          {name}
                        </TableCell>
                        {accountFunds}
                        <TableCell>
                          <BalanceCell balance={balance} />
                        </TableCell>
                        <TableCell>
                          <a
                            onClick={createBudgetLinkHandler(code)}
                            className={classes.budgetCell}
                          >
                            <BalanceCell balance={budget} />
                          </a>
                        </TableCell>
                        <TableCell>
                          <BalanceCell balance={dollar_variance} />
                        </TableCell>
                        <TableCell className={classes.percentageCell}>
                          {percentage_variance === 0
                            ? "N/A"
                            : `${percentage_variance}%`}
                        </TableCell>
                      </TableRow>
                    );
                  }
                ),
                total_balance !== "$0.00" && (
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
                    {Object.entries(funds_balances).map(
                      ({[0]: fundCode, [1]: balance}) => {
                        return (
                          <TableCell
                            key={fundCode}
                          >
                            <BalanceCell balance={balance} />
                          </TableCell>
                        );
                      }
                    )}
                    <TableCell className={classes.fundRow}>
                      <BalanceCell balance={total_balance} />
                    </TableCell>
                    <TableCell className={classes.fundRow}>
                      <BalanceCell balance={total_budget} />
                    </TableCell>
                    <TableCell className={classes.fundRow}>
                      <BalanceCell balance={total_account_balance} />
                    </TableCell>
                    <TableCell
                      className={clsx(classes.fundRow, classes.percentageCell)}
                    >
                      {total_account_percentage === 0
                        ? "N/A"
                        : `${total_account_percentage}%`}
                    </TableCell>
                  </TableRow>
                ),
              ];
            }
          )}
          <TableRow className={classes.titleRow}>
            <TableCell className={classes.spacer} />
            <TableCell className={classes.nameCell} colSpan={2}>
              Total Expenditures
            </TableCell>
            {Object.entries(expenditures_range_totals).map(
              ({[0]: key, [1]: value}) => (
                <TableCell key={key}>
                  <BalanceCell balance={value} />
                </TableCell>
              )
            )}
            <TableCell>
              <BalanceCell balance={expenditures_total} />
            </TableCell>
            <TableCell>
              <BalanceCell balance={expenditures_budget_total} />
            </TableCell>
            <TableCell>
              <BalanceCell balance={expenditures_account_balance_total} />
            </TableCell>
            <TableCell className={classes.percentageCell}>
              {expenditures_account_balance_percentage === 0
                ? "N/A"
                : `${expenditures_account_balance_percentage}%`}
            </TableCell>
          </TableRow>
          <TableRow className={classes.titleRow}>
            <TableCell className={classes.spacer} />
            <TableCell colSpan={2}>
              Excess (Deficiency) of Revenues Over Expenses
            </TableCell>
            {Object.entries(excess_revenues_totals).map(
              ({[0]: key, [1]: value}) => (
                <TableCell key={key}>
                  <BalanceCell balance={value} />
                </TableCell>
              )
            )}
            <TableCell><BalanceCell balance={excess_revenues} /></TableCell>
            <TableCell><BalanceCell balance={excess_revenues_budget} /></TableCell>
            <TableCell><BalanceCell balance={excess_revenues_account_balance} /></TableCell>
            <TableCell />
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
};

ReportTable.propTypes = {
  account_funds: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      code: PropTypes.string,
    })
  ),
  accountFundCode: PropTypes.string,
  accountFundName: PropTypes.string,
  data: PropTypes.object,
  excess_revenues_totals: PropTypes.array,
  excess_revenues: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  excess_revenues_budget: PropTypes.string,
  excess_revenues_account_balance: PropTypes.string,
  expenditures_account_balance_percentage: PropTypes.string,
  expenditures_account_balance_total: PropTypes.string,
  expenditures_budget_total: PropTypes.string,
  expenditures_range_totals: PropTypes.array,
  expenditures_total: PropTypes.string,
  expenditures: PropTypes.object,
  revenue_account_balance_percentage: PropTypes.string,
  revenue_account_balance_total: PropTypes.string,
  revenue_budget_total: PropTypes.string,
  revenue_range_totals: PropTypes.array,
  revenue_total: PropTypes.string,
  revenue: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  colspanWidth: PropTypes.number,
  classes: PropTypes.object.isRequired,
  createLinkHandler: PropTypes.func.isRequired,
  createBudgetLinkHandler: PropTypes.func.isRequired,
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
  percentageCell: {
    textAlign: "center",
  },
  budgetCell: {
    display: "flex",
    height: "3.125rem",
    alignItems: "center",
  },
});

export default withStyles(styles)(ReportTable);
