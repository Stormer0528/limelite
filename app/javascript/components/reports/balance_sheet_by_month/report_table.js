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
  assets = [],
  total_assets_by_month = [],
  total_liabilities_by_month = [],
  net_income_loss_by_month = [],
  net_fund_balance_by_month = [],
  equity_balance_by_month = [],
  liabilities = [],
  equities = [],
  classes = {},
  monthTitles = [],
  createLinkHandler = function () {},
}) => {
  const colspanWidth = monthTitles.length + 2;
  return (
    <Paper className={classes.root}>
      <Table className={classes.reportTable + " report-table condensed"}>
        <TableHead className={classes.header}>
          <TableRow className={classes.headerRow}>
            <TableCell style={{width: "3em"}} />
            <TableCell>Object</TableCell>
            <TableCell>Description</TableCell>
            {/* Account Funds */}
            {monthTitles.map((month, i) => (
              <TableCell key={month + i}><BalanceCell balance={month} /></TableCell>
            ))}
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
          {assets.map(({name, code, month_totals = [], balance}) => {
            if (
              balance === "$0.00" &&
              month_totals.every((total) => total === "$0.00")
            ) {
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
                {month_totals.map((total, i) => (
                  <TableCell key={total + i}><BalanceCell balance={total} /></TableCell>
                ))}
              </TableRow>
            );
          })}
          <TableRow className={classes.titleRow}>
            <TableCell className={classes.spacer} />
            <TableCell className={classes.nameCell} colSpan={2}>
              Total Assets
            </TableCell>
            {total_assets_by_month.map((total, i) => (
              <TableCell key={i}>
                <BalanceCell balance={total} />
              </TableCell>
            ))}
          </TableRow>
          <TableRow className={classes.titleRow}>
            <TableCell className={classes.spacer} />
            <TableCell className={classes.nameCell} colSpan={colspanWidth}>
              Liabilities
            </TableCell>
            <TableCell />
          </TableRow>
          {/* Liabilities */}
          {liabilities.map(({name, code, month_totals = [], balance}) => {
            if (
              balance === "$0.00" &&
              month_totals.every((total) => total === "$0.00")
            ) {
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
                {month_totals.map((total, i) => (
                  <TableCell key={total + i}><BalanceCell balance={total} /></TableCell>
                ))}
              </TableRow>
            );
          })}
          <TableRow className={classes.titleRow}>
            <TableCell className={classes.spacer} />
            <TableCell className={classes.nameCell} colSpan={2}>
              Total Liabilities
            </TableCell>
            {total_liabilities_by_month.map((total, i) => (
              <TableCell key={i}>
                <BalanceCell balance={total} />
              </TableCell>
            ))}
          </TableRow>
          <TableRow className={classes.titleRow}>
            <TableCell className={classes.spacer} />
            <TableCell className={classes.nameCell} colSpan={colspanWidth}>
              Equity
            </TableCell>
            <TableCell />
          </TableRow>

          {/* Equities */}
          {equities.map(({name, code, month_totals = [], balance}) => {
            if (
              balance === "$0.00" &&
              month_totals.every((total) => total === "$0.00")
            ) {
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
                {month_totals.map((total, i) => (
                  <TableCell key={total + i}><BalanceCell balance={total} /></TableCell>
                ))}
              </TableRow>
            );
          })}
          <TableRow key="net_income_loss">
            <TableCell className={classes.spacer} />
            <TableCell className={classes.codeCell} />
            <TableCell className={classes.nameCell}>
              Net Income (Loss)
            </TableCell>
            {net_income_loss_by_month.map((value, index) => (
              <TableCell key={index}>
                <BalanceCell balance={value} />
              </TableCell>
            ))}
          </TableRow>
          <TableRow className={classes.titleRow}>
            <TableCell className={classes.spacer} />
            <TableCell className={classes.nameCell} colSpan={2}>
              Total Equity
            </TableCell>
            {equity_balance_by_month.map((total, i) => (
              <TableCell key={i}>
                <BalanceCell balance={total} />
              </TableCell>
            ))}
          </TableRow>
          <TableRow className={classes.titleRow}>
            <TableCell className={classes.spacer} />
            <TableCell className={classes.nameCell} colSpan={2}>
              Total Liabilities and Equity
            </TableCell>
            {net_fund_balance_by_month.map((total, i) => (
              <TableCell key={i}>
                <BalanceCell balance={total} />
              </TableCell>
            ))}
          </TableRow>
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
  monthTitles: PropTypes.arrayOf(PropTypes.string),
  total_assets_by_account_funds: PropTypes.object,
  equity_balance_by_account_funds: PropTypes.object,
  net_income_loss_by_account_funds: PropTypes.object,
  net_fund_balance_by_account_funds: PropTypes.object,
  total_liabilities_by_account_funds: PropTypes.object,
  total_assets_by_month: PropTypes.arrayOf(PropTypes.string),
  total_liabilities_by_month: PropTypes.arrayOf(PropTypes.string),
  total_equities_by_month: PropTypes.arrayOf(PropTypes.string),
  net_income_loss_by_month: PropTypes.arrayOf(PropTypes.string),
  net_fund_balance_by_month: PropTypes.arrayOf(PropTypes.string),
  equity_balance_by_month: PropTypes.arrayOf(PropTypes.string),
  total_equities: PropTypes.string,
  equity_balance: PropTypes.string,
  net_income_loss: PropTypes.string,
  net_fund_balance: PropTypes.string,
  classes: PropTypes.object.isRequired,
  createLinkHandler: PropTypes.func.isRequired,
};

const styles = (theme) => ({
  root: {
    overflow: "auto",
  },
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
