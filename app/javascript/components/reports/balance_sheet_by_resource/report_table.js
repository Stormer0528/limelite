import capitalize from "lodash/capitalize";
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
  equities = [],
  equity_balance = {},
  liabilities = [],
  net_fund_balance = {},
  net_income_loss = {},
  resourceTitles = [],
  total_assets = {},
  total_liabilities = {},
  createLinkHandler = function () {},
  classes = {},
  debug = false /* SHOW rows used for equity calculations  */,
  total_9700s = {},
  total_equities = {},
}) => {
  const colspanWidth = resourceTitles.length + 3;
  return (
    <Paper className={classes.root}>
      <Table className={classes.reportTable + " report-table condensed"}>
        <TableHead className={classes.header}>
          <TableRow className={classes.headerRow}>
            <TableCell style={{width: "3em"}} />
            <TableCell>Object</TableCell>
            <TableCell>Description</TableCell>
            {/* Account Funds */}
            {resourceTitles.map((resource, i) => (
              <TableCell key={resource + i} className={classes.resourceTitle}>
                <BalanceCell balance={capitalize(resource)} />
              </TableCell>
            ))}
            <TableCell className={classes.resourceTitle}><BalanceCell balance="Balance" /></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Assets */}
          <ReportSectionHeader
            title="Assets"
            classes={classes}
            colspanWidth={colspanWidth}
          />
          <ReportSection
            section={assets}
            classes={classes}
            resourceTitles={resourceTitles}
            createLinkHandler={createLinkHandler}
          />
          <ReportSectionFooter
            title="Total Assets"
            row={total_assets}
            classes={classes}
            resourceTitles={resourceTitles}
          />
          {/* Liabilities */}
          <ReportSectionHeader
            title="Liabilities"
            classes={classes}
            colspanWidth={colspanWidth}
          />
          <ReportSection
            section={liabilities}
            classes={classes}
            resourceTitles={resourceTitles}
            createLinkHandler={createLinkHandler}
          />
          <ReportSectionFooter
            title="Total Liabilities"
            row={total_liabilities}
            classes={classes}
            resourceTitles={resourceTitles}
          />
          {/* Equities */}
          <ReportSectionHeader
            title="Equity"
            classes={classes}
            colspanWidth={colspanWidth}
          />
          <ReportSection
            section={equities}
            classes={classes}
            resourceTitles={resourceTitles}
            createLinkHandler={createLinkHandler}
          />
          <ReportRow
            resourceTitles={resourceTitles}
            classes={classes}
            {...net_income_loss}
            description="Net Income (Loss)"
          />
          <ReportSectionFooter
            title="Total Equity"
            row={equity_balance}
            classes={classes}
            resourceTitles={resourceTitles}
          />
          <ReportSectionFooter
            title="Total Liabilities and Equity"
            row={net_fund_balance}
            classes={classes}
            resourceTitles={resourceTitles}
          />
          {/** DEBUG ROWS -- Check report calculations */}
          {debug && (
            <ReportSectionFooter
              title="Equity Pre-Total"
              row={total_equities}
              classes={classes}
              resourceTitles={resourceTitles}
            />
          )}
          {debug && (
            <ReportSectionFooter
              title="Total 9700s"
              row={total_9700s}
              classes={classes}
              resourceTitles={resourceTitles}
            />
          )}
          {debug && (
            <ReportSectionFooter
              title="NET INCOME LOSS - (total_assets - total_liabilities - total_nine_thousands)"
              row={net_income_loss}
              classes={classes}
              resourceTitles={resourceTitles}
            />
          )}
          {debug && (
            <ReportSectionFooter
              title="EQUITY BALANCE = (equities_pre_total + net_income_loss)"
              row={equity_balance}
              classes={classes}
              resourceTitles={resourceTitles}
            />
          )}
          {debug && (
            <ReportSectionFooter
              title="NET YTD FUND BALANCE = (equity_balance + total_liabilities)"
              row={net_fund_balance}
              classes={classes}
              resourceTitles={resourceTitles}
            />
          )}
        </TableBody>
      </Table>
    </Paper>
  );
};

const ReportSectionHeader = ({title = "", colspanWidth = 3, classes = {}}) => {
  return (
    <TableRow className={classes.titleRow}>
      <TableCell className={classes.spacer} />
      <TableCell className={classes.nameCell} colSpan={colspanWidth}>
        {title}
      </TableCell>
    </TableRow>
  );
};

const ReportSectionFooter = ({
  title = "",
  row: {balance, ...restRow} = {},
  classes = {},
  resourceTitles = [],
}) => {
  return (
    <TableRow className={classes.titleRow}>
      <TableCell className={classes.spacer} />
      <TableCell className={classes.nameCell} colSpan={2}>
        {title}
      </TableCell>
      {resourceTitles.map((title, i) => {
        const key = title.toLowerCase();
        return (
          <TableCell className={classes.balanceCell} key={key + i}>
            <BalanceCell balance={restRow[key]} />
          </TableCell>
        );
      })}
      <TableCell className={classes.balanceCell}><BalanceCell balance={balance} /></TableCell>
    </TableRow>
  );
};

const ReportSection = ({
  section = [],
  classes,
  resourceTitles = [],
  createLinkHandler = function () {},
}) => {
  return section.map(({description, code, balance, ...rest}) => {
    if (balance === "$0.00") {
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
        <TableCell className={classes.nameCell}>{description}</TableCell>
        {resourceTitles.map((title, i) => {
          const key = title.toLowerCase();
          return (
            <TableCell className={classes.balanceCell} key={key + i}>
              <BalanceCell balance={rest[key]} />
            </TableCell>
          );
        })}
        <TableCell className={classes.balanceCell}><BalanceCell balance={balance} /></TableCell>
      </TableRow>
    );
  });
};

const ReportRow = ({
  code,
  description = "",
  balance = "",
  resourceTitles = [],
  classes = {},
  ...rest
}) => {
  return (
    <TableRow className={classes.tableRow}>
      <TableCell className={classes.spacer} />
      <TableCell className={classes.codeCell}>{code}</TableCell>
      <TableCell className={classes.nameCell}>{description}</TableCell>
      {resourceTitles.map((title, i) => {
        const key = title.toLowerCase();
        return (
          <TableCell className={classes.balanceCell} key={key + i}>
            {rest[key]}
          </TableCell>
        );
      })}
      <TableCell className={classes.balanceCell}>{balance}</TableCell>
    </TableRow>
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
  resourceTitles: PropTypes.arrayOf(PropTypes.string),
  total_equities: PropTypes.object,
  equity_balance: PropTypes.object,
  net_income_loss: PropTypes.object,
  net_fund_balance: PropTypes.object,
  classes: PropTypes.object.isRequired,
  createLinkHandler: PropTypes.func.isRequired,
  debug: PropTypes.bool,
  total_9700s: PropTypes.object,
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
  nameCell: {
    minWidth: "20rem",
  },
  balanceCell: {
    maxWidth: "12.5rem",
    textAlign: "right",
    paddingLeft: "2.5rem",
  },
  totalCell: {
    textAlign: "center",
  },
  resourceTitle: {
    textAlign: "right",
  },
});

export default withStyles(styles)(ReportTable);
