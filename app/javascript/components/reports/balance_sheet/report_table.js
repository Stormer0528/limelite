import BalanceCell from "../../shared/balance_cell";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
import {withStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";

const isZeroAccount = (object) => {
  for (const key in object) {
    if (object[key] != "$0.00") {
      return false;
    }
  }

  return true;
};

const ReportTable = ({
  assets = [],
  total_assets = "",
  total_assets_by_account_funds = {},
  equity_balance_by_account_funds = {},
  net_income_loss_by_account_funds = {},
  net_fund_balance_by_account_funds = {},
  total_liabilities_by_account_funds = {},
  liabilities = [],
  account_funds = [],
  total_liabilities = "",
  equities = [],
  equity_balance = "",
  net_income_loss = "",
  net_fund_balance = "",
  classes = {},
  debug = false /* SHOW rows used for equity calculations  */,
  total_nine_thousands = "",
  total_nine_thousands_by_account_funds = {},
  createLinkHandler = function () {},
}) => {
  const colspanWidth = account_funds.length + 2;

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
                <TableCell>
                  <BalanceCell balance={code} />
                </TableCell>
              </Tooltip>
            ))}
            <TableCell>
              <BalanceCell balance="Balance" />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow className={classes.titleRow}>
            <TableCell className={classes.spacer} />
            <TableCell className={classes.nameCell} colSpan={colspanWidth}>
              Assets
            </TableCell>
            <TableCell />
          </TableRow>

          {/* Assets */}
          {assets.map(({name, code, account_funds = [], balance}) => {
            if (balance === "$0.00" && isZeroAccount(account_funds)) {
              return null;
            }

            return (
              <TableRow
                key={code}
                className={classes.tableRow}
                onClick={createLinkHandler(code)}
              >
                <TableCell className={classes.spacer} />
                <TableCell className={classes.codeCell}>{code}</TableCell>
                <TableCell className={classes.nameCell}>{name}</TableCell>
                {Object.entries(account_funds).map(
                  ([fundCode, fundBalance]) => (
                    <TableCell key={fundCode}>
                      <BalanceCell balance={fundBalance} />
                    </TableCell>
                  )
                )}
                <TableCell>
                  <BalanceCell balance={balance} />
                </TableCell>
              </TableRow>
            );
          })}
          <TableRow className={classes.titleRow}>
            <TableCell className={classes.spacer} />
            <TableCell className={classes.nameCell} colSpan={2}>
              Total Assets
            </TableCell>
            {Object.entries(total_assets_by_account_funds).map(
              ([fundCode, fundValue]) => (
                <TableCell key={fundCode}>
                  <BalanceCell balance={fundValue} />
                </TableCell>
              )
            )}
            <TableCell>
              <BalanceCell balance={total_assets} />
            </TableCell>
          </TableRow>

          {/* Liabilities */}
          <TableRow className={classes.titleRow}>
            <TableCell className={classes.spacer} />
            <TableCell className={classes.nameCell} colSpan={colspanWidth}>
              Liabilities
            </TableCell>
            <TableCell />
          </TableRow>

          {liabilities.map(({name, code, account_funds = [], balance}) => {
            if (balance === "$0.00" && isZeroAccount(account_funds)) {
              return null;
            }

            return (
              <TableRow
                key={code}
                className={classes.tableRow}
                onClick={createLinkHandler(code)}
              >
                <TableCell className={classes.spacer} />
                <TableCell className={classes.codeCell}>{code}</TableCell>
                <TableCell className={classes.nameCell}>{name}</TableCell>
                {Object.entries(account_funds).map(
                  ([fundCode, fundBalance]) => (
                    <TableCell key={fundCode}>
                      <BalanceCell balance={fundBalance} />
                    </TableCell>
                  )
                )}
                <TableCell>
                  <BalanceCell balance={balance} />
                </TableCell>
              </TableRow>
            );
          })}
          <TableRow className={classes.titleRow}>
            <TableCell className={classes.spacer} />
            <TableCell className={classes.nameCell} colSpan={2}>
              Total Liabilities
            </TableCell>
            {Object.entries(total_liabilities_by_account_funds).map(
              ([fundCode, fundValue]) => (
                <TableCell key={fundCode}>
                  <BalanceCell balance={fundValue} />
                </TableCell>
              )
            )}
            <TableCell>
              <BalanceCell balance={total_liabilities} />
            </TableCell>
          </TableRow>

          <TableRow className={classes.titleRow}>
            <TableCell className={classes.spacer} />
            <TableCell className={classes.nameCell} colSpan={colspanWidth}>
              Equity
            </TableCell>
            <TableCell />
          </TableRow>
          <TableRow />

          {equities.map(({name, code, account_funds = [], balance}) => {
            if (balance === "$0.00" && isZeroAccount(account_funds)) {
              return null;
            }

            return (
              <TableRow
                key={code}
                className={classes.tableRow}
                onClick={createLinkHandler(code)}
              >
                <TableCell className={classes.spacer} />
                <TableCell className={classes.codeCell}>{code}</TableCell>
                <TableCell className={classes.nameCell}>{name}</TableCell>
                {Object.entries(account_funds).map(
                  ([fundCode, fundBalance]) => (
                    <TableCell key={fundCode}>
                      <BalanceCell balance={fundBalance} />
                    </TableCell>
                  )
                )}
                <TableCell>
                  <BalanceCell balance={balance} />
                </TableCell>
              </TableRow>
            );
          })}
          <TableRow key="net_income_loss">
            <TableCell className={classes.spacer} />
            <TableCell className={classes.codeCell} />
            <TableCell className={classes.nameCell}>
              Net Income (Loss)
            </TableCell>
            {Object.entries(net_income_loss_by_account_funds).map(
              ([fundCode, fundValue]) => (
                <TableCell key={fundCode}>
                  <BalanceCell balance={fundValue} />
                </TableCell>
              )
            )}
            <TableCell>
              <BalanceCell balance={net_income_loss} />
            </TableCell>
          </TableRow>
          <TableRow className={classes.titleRow}>
            <TableCell className={classes.spacer} />
            <TableCell className={classes.nameCell} colSpan={2}>
              Total Equity
            </TableCell>
            {Object.entries(equity_balance_by_account_funds).map(
              ([fundCode, fundValue]) => (
                <TableCell key={fundCode}>
                  <BalanceCell balance={fundValue} />
                </TableCell>
              )
            )}
            <TableCell>
              <BalanceCell balance={equity_balance} />
            </TableCell>
          </TableRow>
          <TableRow className={classes.titleRow}>
            <TableCell className={classes.spacer} />
            <TableCell className={classes.nameCell} colSpan={2}>
              Total Liabilities and Equity
            </TableCell>
            {Object.entries(net_fund_balance_by_account_funds).map(
              ([fundCode, fundValue]) => (
                <TableCell key={fundCode}>
                  <BalanceCell balance={fundValue} />
                </TableCell>
              )
            )}
            <TableCell>
              <BalanceCell balance={net_fund_balance} />
            </TableCell>
          </TableRow>
          {/* DEBUG ROWS */}
          {debug && (
            <TableRow className={classes.debugRow}>
              <TableCell className={classes.spacer} />
              <TableCell className={classes.nameCell} colSpan={2}>
                9700s
              </TableCell>
              {Object.entries(total_nine_thousands_by_account_funds).map(
                ([fundCode, fundValue]) => (
                  <TableCell key={fundCode}>
                    <BalanceCell balance={fundValue} />
                  </TableCell>
                )
              )}
              <TableCell>
                <BalanceCell balance={total_nine_thousands} />
              </TableCell>
            </TableRow>
          )}
          {debug && (
            <TableRow className={classes.debugRow}>
              <TableCell className={classes.spacer} />
              <TableCell className={classes.nameCell} colSpan={2}>
                NET INCOME LOSS
                <br />
                (total_assets - total_liabilities - total_nine_thousands)
              </TableCell>
              {Object.entries(net_income_loss_by_account_funds).map(
                ([fundCode, fundValue]) => (
                  <TableCell key={fundCode}>
                    <BalanceCell balance={fundValue} />
                  </TableCell>
                )
              )}
              <TableCell>
                <BalanceCell balance={net_income_loss} />
              </TableCell>
            </TableRow>
          )}
          {debug && (
            <TableRow className={classes.debugRow}>
              <TableCell className={classes.spacer} />
              <TableCell className={classes.nameCell} colSpan={2}>
                EQUITY BALANCE
                <br />
                (equities_pre_total + net_income_loss)
              </TableCell>
              {Object.entries(equity_balance_by_account_funds).map(
                ([fundCode, fundValue]) => (
                  <TableCell key={fundCode}>
                    <BalanceCell balance={fundValue} />
                  </TableCell>
                )
              )}
              <TableCell>
                <BalanceCell balance={equity_balance} />
              </TableCell>
            </TableRow>
          )}
          {debug && (
            <TableRow className={classes.debugRow}>
              <TableCell className={classes.spacer} />
              <TableCell className={classes.nameCell} colSpan={2}>
                NET YTD FUND BALANCE
                <br />
                (equity_balance + total_liabilities)
              </TableCell>
              {Object.entries(net_fund_balance_by_account_funds).map(
                ([fundCode, fundValue]) => (
                  <TableCell key={fundCode}>
                    <BalanceCell balance={fundValue} />
                  </TableCell>
                )
              )}
              <TableCell>
                <BalanceCell balance={net_fund_balance} />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );
};

ReportTable.propTypes = {
  accountFundName: PropTypes.string,
  accountFundCode: PropTypes.string,
  assets: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string,
      name: PropTypes.string,
      balance: PropTypes.string,
    })
  ),
  account_funds: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      code: PropTypes.string,
    })
  ),
  total_assets: PropTypes.string,
  liabilities: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string,
      name: PropTypes.string,
      balance: PropTypes.string,
    })
  ),
  total_liabilities: PropTypes.string,
  equities: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string,
      name: PropTypes.string,
      balance: PropTypes.string,
    })
  ),
  debug: PropTypes.bool,
  total_nine_thousands: PropTypes.string,
  total_nine_thousands_by_account_funds: PropTypes.object,
  total_assets_by_account_funds: PropTypes.object,
  equity_balance_by_account_funds: PropTypes.object,
  net_income_loss_by_account_funds: PropTypes.object,
  net_fund_balance_by_account_funds: PropTypes.object,
  total_liabilities_by_account_funds: PropTypes.object,
  total_equities: PropTypes.string,
  equity_balance: PropTypes.string,
  net_income_loss: PropTypes.string,
  net_fund_balance: PropTypes.string,
  classes: PropTypes.object.isRequired,
  createLinkHandler: PropTypes.func.isRequired,
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
  debugRow: {
    backgroundColor: "#FFF3E0",
    fontSize: "1.15rem",
    "& > td": {
      color: "#607D8B",
      borderTop: "2px solid #FFB74D",
      fontWeight: "bold",
    },
  },
  nameCell: {
    minWidth: "15rem",
  },
  totalCell: {
    textAlign: "center",
  },
  spacerCell: {
    height: "1.5rem",
    borderBottom: "1px solid #ccc",
    backgroundColor: "#f0f0f0",
  },
});

export default withStyles(styles)(ReportTable);
