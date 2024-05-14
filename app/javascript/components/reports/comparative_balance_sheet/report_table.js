import PropTypes from "prop-types";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
import BalanceCell, { getChangesPrice, getChangesPercentage } from "../../shared/balance_cell";
import {withStyles} from "@material-ui/core/styles";

const ReportTable = ({
  assets = [],
  titles = [],
  total_assets = {},
  liabilities = [],
  account_funds = [],
  total_liabilities = {},
  equities = [],
  equity_balance = {},
  net_income_loss = {},
  net_fund_balance = {},
  classes = {},
  debug = false /* SHOW rows used for equity calculations  */,
  total_nine_thousands = {},
  createLinkHandler = function () {},
}) => {
  const colspanWidth = account_funds.length + 2;

  return (
    <Paper>
      <Table className={classes.reportTable + " report-table condensed"}>
        <TableHead className={classes.header}>
          <TableRow className={classes.headerRow}>
            <TableCell style={{width: "3em"}} />
            {
              titles.map(title => <TableCell key={title}>{title}</TableCell>)
            }
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
          {assets.filter(({ current_balance, before_balance }) => current_balance != '$0.00' || before_balance != '$0.00')
                .map(({name, code, current_balance, before_balance}) => {
            return (
              <TableRow
                key={code}
                className={classes.tableRow}
                onClick={createLinkHandler(code)}
              >
                <TableCell className={classes.spacer} />
                <TableCell className={classes.codeCell}>{code}</TableCell>
                <TableCell className={classes.nameCell}>{name}</TableCell>
                <TableCell><BalanceCell balance={current_balance} /></TableCell>
                <TableCell><BalanceCell balance={before_balance} /></TableCell>
                <TableCell><BalanceCell balance={getChangesPrice(current_balance, before_balance)} /></TableCell>
                <TableCell><BalanceCell balance={getChangesPercentage(current_balance, before_balance)} /></TableCell>
              </TableRow>
            );
          })}
          <TableRow className={classes.titleRow}>
            <TableCell className={classes.spacer} />
            <TableCell className={classes.nameCell} colSpan={2}>
              Total Assets
            </TableCell>
            <TableCell><BalanceCell balance={total_assets.current_balance} /></TableCell>
            <TableCell><BalanceCell balance={total_assets.before_balance} /></TableCell>
            <TableCell><BalanceCell balance={getChangesPrice(total_assets.current_balance, total_assets.before_balance)} /></TableCell>
            <TableCell><BalanceCell balance={getChangesPercentage(total_assets.current_balance, total_assets.before_balance)} /></TableCell>
          </TableRow>

          {/* Liabilities */}
          <TableRow className={classes.titleRow}>
            <TableCell className={classes.spacer} />
            <TableCell className={classes.nameCell} colSpan={colspanWidth}>
              Liabilities
            </TableCell>
            <TableCell />
          </TableRow>

          {liabilities.filter(({ current_balance, before_balance }) => current_balance != '$0.00' || before_balance != '$0.00')
            .map(({name, code, before_balance, current_balance}) => {
            return (
              <TableRow
                key={code}
                className={classes.tableRow}
                onClick={createLinkHandler(code)}
              >
                <TableCell className={classes.spacer} />
                <TableCell className={classes.codeCell}>{code}</TableCell>
                <TableCell className={classes.nameCell}>{name}</TableCell>
                <TableCell><BalanceCell balance={current_balance} /></TableCell>
                <TableCell><BalanceCell balance={before_balance} /></TableCell>
                <TableCell><BalanceCell balance={getChangesPrice(current_balance, before_balance)} /></TableCell>
                <TableCell><BalanceCell balance={getChangesPercentage(current_balance, before_balance)} /></TableCell>
              </TableRow>
            );
          })}
          <TableRow className={classes.titleRow}>
            <TableCell className={classes.spacer} />
            <TableCell className={classes.nameCell} colSpan={2}>
              Total Liabilities
            </TableCell>
            <TableCell><BalanceCell balance={total_liabilities.current_balance} /></TableCell>
            <TableCell><BalanceCell balance={total_liabilities.before_balance} /></TableCell>
            <TableCell><BalanceCell balance={getChangesPrice(total_liabilities.current_balance, total_liabilities.before_balance)} /></TableCell>
            <TableCell><BalanceCell balance={getChangesPercentage(total_liabilities.current_balance, total_liabilities.before_balance)} /></TableCell>
          </TableRow>

          <TableRow className={classes.titleRow}>
            <TableCell className={classes.spacer} />
            <TableCell className={classes.nameCell} colSpan={colspanWidth}>
              Equity
            </TableCell>
            <TableCell />
          </TableRow>
          <TableRow />

          {equities.filter(({ current_balance, before_balance }) => current_balance != '$0.00' || before_balance != '$0.00')
              .map(({name, code, before_balance, current_balance}) => {
            return (
              <TableRow
                key={code}
                className={classes.tableRow}
                onClick={createLinkHandler(code)}
              >
                <TableCell className={classes.spacer} />
                <TableCell className={classes.codeCell}>{code}</TableCell>
                <TableCell className={classes.nameCell}>{name}</TableCell>
                <TableCell><BalanceCell balance={current_balance} /></TableCell>
                <TableCell><BalanceCell balance={before_balance} /></TableCell>
                <TableCell><BalanceCell balance={getChangesPrice(current_balance, before_balance)} /></TableCell>
                <TableCell><BalanceCell balance={getChangesPercentage(current_balance, before_balance)} /></TableCell>
              </TableRow>
            );
          })}
          <TableRow key="net_income_loss">
            <TableCell className={classes.spacer} />
            <TableCell className={classes.codeCell} />
            <TableCell className={classes.nameCell}>
              Net Income (Loss)
            </TableCell>
            <TableCell><BalanceCell balance={net_income_loss.current_balance} /></TableCell>
            <TableCell><BalanceCell balance={net_income_loss.before_balance} /></TableCell>
            <TableCell><BalanceCell balance={getChangesPrice(net_income_loss.current_balance, net_income_loss.before_balance)} /></TableCell>
            <TableCell><BalanceCell balance={getChangesPercentage(net_income_loss.current_balance, net_income_loss.before_balance)} /></TableCell>
          </TableRow>
          <TableRow className={classes.titleRow}>
            <TableCell className={classes.spacer} />
            <TableCell className={classes.nameCell} colSpan={2}>
              Total Equity
            </TableCell>

            <TableCell><BalanceCell balance={equity_balance.current_balance} /></TableCell>
            <TableCell><BalanceCell balance={equity_balance.before_balance} /></TableCell>
            <TableCell><BalanceCell balance={getChangesPrice(equity_balance.current_balance, equity_balance.before_balance)} /></TableCell>
            <TableCell><BalanceCell balance={getChangesPercentage(equity_balance.current_balance, equity_balance.before_balance)} /></TableCell>
          </TableRow>
          <TableRow className={classes.titleRow}>
            <TableCell className={classes.spacer} />
            <TableCell className={classes.nameCell} colSpan={2}>
              Total Liabilities and Equity
            </TableCell>
            <TableCell><BalanceCell balance={net_fund_balance.current_balance} /></TableCell>
            <TableCell><BalanceCell balance={net_fund_balance.before_balance} /></TableCell>
            <TableCell><BalanceCell balance={getChangesPrice(net_fund_balance.current_balance, net_fund_balance.before_balance)} /></TableCell>
            <TableCell><BalanceCell balance={getChangesPercentage(net_fund_balance.current_balance, net_fund_balance.before_balance)} /></TableCell>
          </TableRow>
          {/* DEBUG ROWS */}
          {debug && (
            <TableRow className={classes.debugRow}>
              <TableCell className={classes.spacer} />
              <TableCell className={classes.nameCell} colSpan={2}>
                9700s
              </TableCell>
              <TableCell><BalanceCell balance={total_nine_thousands.current_balance} /></TableCell>
              <TableCell><BalanceCell balance={total_nine_thousands.before_balance} /></TableCell>
              <TableCell><BalanceCell balance={getChangesPrice(total_nine_thousands.current_balance, total_nine_thousands.before_balance)} /></TableCell>
              <TableCell><BalanceCell balance={getChangesPercentage(total_nine_thousands.current_balance, total_nine_thousands.before_balance)} /></TableCell>
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
              <TableCell><BalanceCell balance={net_income_loss.current_balance} /></TableCell>
              <TableCell><BalanceCell balance={net_income_loss.before_balance} /></TableCell>
              <TableCell><BalanceCell balance={getChangesPrice(net_income_loss.current_balance, net_income_loss.before_balance)} /></TableCell>
              <TableCell><BalanceCell balance={getChangesPercentage(net_income_loss.current_balance, net_income_loss.before_balance)} /></TableCell>
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
              <TableCell><BalanceCell balance={equity_balance.current_balance} /></TableCell>
              <TableCell><BalanceCell balance={equity_balance.before_balance} /></TableCell>
              <TableCell><BalanceCell balance={getChangesPrice(equity_balance.current_balance, equity_balance.before_balance)} /></TableCell>
              <TableCell><BalanceCell balance={getChangesPercentage(equity_balance.current_balance, equity_balance.before_balance)} /></TableCell>
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
              <TableCell><BalanceCell balance={net_fund_balance.current_balance} /></TableCell>
              <TableCell><BalanceCell balance={net_fund_balance.before_balance} /></TableCell>
              <TableCell><BalanceCell balance={getChangesPrice(net_fund_balance.current_balance, net_fund_balance.before_balance)} /></TableCell>
              <TableCell><BalanceCell balance={getChangesPercentage(net_fund_balance.current_balance, net_fund_balance.before_balance)} /></TableCell>
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
  titles: PropTypes.arrayOf(PropTypes.string),
  account_funds: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      code: PropTypes.string,
    })
  ),
  total_assets: PropTypes.object,
  liabilities: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string,
      name: PropTypes.string,
      balance: PropTypes.string,
    })
  ),
  total_liabilities: PropTypes.object,
  equities: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string,
      name: PropTypes.string,
      balance: PropTypes.string,
    })
  ),
  debug: PropTypes.bool,
  total_nine_thousands: PropTypes.object,
  total_equities: PropTypes.string,
  equity_balance: PropTypes.object,
  net_income_loss: PropTypes.object,
  net_fund_balance: PropTypes.object,
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
