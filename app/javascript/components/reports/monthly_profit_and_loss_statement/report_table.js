import {Fragment} from "react";
import PropTypes from "prop-types";

import clsx from "clsx";
// import capitalize from "lodash/capitalize";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import BalanceCell from "../../shared/balance_cell";
import {withStyles} from "@material-ui/core/styles";

const ReportTable = ({
  accountFundName = "",
  accountFundCode = "",
  revenues = {},
  revenues_range_totals = {},
  expenses = {},
  expenses_range_totals = {},
  other_financing = {},
  other_financing_range_totals = {},
  net_position_totals = {},
  excess_revenues_totals = {},
  monthTitles = [],
  colspanWidth = 0,

  createLinkHandler = function () {},
  classes = {},
}) => {
  return (
    <Paper className={classes.root}>
      <Table className={classes.reportTable + " report-table condensed"}>
        <TableHead className={classes.header}>
          <TableRow className={classes.headerRow}>
            <TableCell colSpan={4 + colspanWidth}>Fund / Resource</TableCell>
          </TableRow>
          <TableRow className={classes.headerRow}>
            <TableCell style={{width: "3em"}} />
            <TableCell
              style={{
                minWidth: "9.5rem",
              }}
            >
              Object
            </TableCell>
            <TableCell
              style={{
                minWidth: "21.5rem",
              }}
            >
              Description
            </TableCell>
            {monthTitles.map((title) => (
              <TableCell key={title} style={{ textAlign: "right" }}>
                <BalanceCell balance={title} />
              </TableCell>
            ))}
            <TableCell><BalanceCell balance="Balance" /></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell className={classes.fundRow} colSpan={4 + colspanWidth}>
              {accountFundCode} &mdash; {accountFundName}
            </TableCell>
          </TableRow>
          {/* REVENUES */}
          <TableRow>
            <TableCell className={classes.spacer} />
            <TableCell className={classes.fundRow} colSpan={4 + colspanWidth}>
              <h6>
                <b>Revenues</b>
              </h6>
            </TableCell>
          </TableRow>

          {Object.entries(revenues).map(
            ([accountRange, {title, balances = {}, accounts = []}]) => {
              return (
                <Fragment key={title}>
                  {accounts.map(({description, code, balance, ...objCodes}) => {
                    return (
                      <ReportRow
                        code={code}
                        description={description}
                        balance={balance}
                        key={code}
                        titles={monthTitles}
                        objCodes={objCodes}
                        classes={classes}
                        createLinkHandler={createLinkHandler}
                      />
                    );
                  })}

                  {/* Total Row */}
                  <ReportRow
                    code={accountRange}
                    description={title}
                    balance={balances.balance}
                    titles={monthTitles}
                    objCodes={balances}
                    classes={classes}
                    className={classes.totalRow}
                    createLinkHandler={createLinkHandler}
                  />
                </Fragment>
              );
            }
          )}
          <TableRow className={classes.titleTitleRow}>
            <TableCell className={classes.spacer} />
            <TableCell className={classes.nameCell} colSpan={2}>
              TOTAL, REVENUES
            </TableCell>
            {monthTitles.map((title, i) => (
              <TableCell key={`${title}-${i}`} style={{textAlign: "right"}}>
                <BalanceCell balance={revenues_range_totals[title.replace("'", "_")]} />
              </TableCell>
            ))}
            <TableCell>
              <BalanceCell balance={revenues_range_totals["balance"]} />
            </TableCell>
          </TableRow>

          {/* EXPENSES */}
          <TableRow>
            <TableCell className={classes.spacer} />
            <TableCell className={classes.fundRow} colSpan={4 + colspanWidth}>
              <h6>
                <b>Expenses</b>
              </h6>
            </TableCell>
          </TableRow>

          {Object.entries(expenses).map(
            ([accountRange, {title, balances = {}, accounts = []}]) => {
              return (
                <Fragment key={title}>
                  {accounts.map(({description, code, balance, ...objCodes}) => {
                    return (
                      <ReportRow
                        createLinkHandler={createLinkHandler}
                        code={code}
                        description={description}
                        balance={balance}
                        key={code}
                        titles={monthTitles}
                        objCodes={objCodes}
                        classes={classes}
                      />
                    );
                  })}

                  {/* Total Row */}
                  <ReportRow
                    createLinkHandler={createLinkHandler}
                    code={accountRange}
                    description={title}
                    balance={balances.balance}
                    titles={monthTitles}
                    objCodes={balances}
                    classes={classes}
                    className={classes.totalRow}
                  />
                </Fragment>
              );
            }
          )}
          <TableRow className={classes.titleTitleRow}>
            <TableCell className={classes.spacer} />
            <TableCell className={classes.nameCell} colSpan={2}>
              TOTAL, EXPENSES
            </TableCell>
            {monthTitles.map((title, i) => (
              <TableCell key={`${title}-${i}`} style={{textAlign: "right"}}>
                <BalanceCell balance={expenses_range_totals[title.replace("'", "_")]} />
              </TableCell>
            ))}
            <TableCell>
              <BalanceCell balance={expenses_range_totals["balance"]} />
            </TableCell>
          </TableRow>

          <TableRow className={classes.titleTitleTitleRow}>
            <TableCell className={classes.spacer} />
            <TableCell colSpan={2}>
              EXCESS (DEFICIENCY) OF REVENUES OVER EXPENSES
            </TableCell>
            {monthTitles.map((title, i) => (
              <TableCell key={`${title}-${i}`} style={{textAlign: "right"}}>
                <BalanceCell balance={excess_revenues_totals[title.replace("'", "_")]} />
              </TableCell>
            ))}
            <TableCell>
              <BalanceCell balance={excess_revenues_totals["balance"]} />
            </TableCell>
          </TableRow>

          {/* Other Financing */}
          <TableRow>
            <TableCell className={classes.spacer} />
            <TableCell className={classes.fundRow} colSpan={4 + colspanWidth}>
              <h6>
                <b>Other Financing</b>
              </h6>
            </TableCell>
          </TableRow>
          {Object.entries(other_financing).map(
            // Each Range
            ([accountRange, {title, balances = {}, accounts = []}]) => {
              return (
                <Fragment key={title}>
                  {accounts.map(({description, code, balance, ...objCodes}) => {
                    return (
                      <ReportRow
                        createLinkHandler={createLinkHandler}
                        code={code}
                        description={description}
                        balance={balance}
                        key={code}
                        titles={monthTitles}
                        objCodes={objCodes}
                        classes={classes}
                      />
                    );
                  })}

                  {/* Total Row */}
                  <ReportRow
                    createLinkHandler={createLinkHandler}
                    code={accountRange}
                    description={title}
                    balance={balances.balance}
                    titles={monthTitles}
                    objCodes={balances}
                    classes={classes}
                    className={classes.totalRow}
                  />
                </Fragment>
              );
            }
          )}

          <TableRow className={classes.titleTitleRow}>
            <TableCell className={classes.spacer} />
            <TableCell className={classes.nameCell} colSpan={2}>
              TOTAL, OTHER FINANCING SOURCES/USES
            </TableCell>
            {monthTitles.map((title, i) => (
              <TableCell key={`${title}-${i}`} style={{textAlign: "right"}}>
                <BalanceCell balance={other_financing_range_totals[title.replace("'", "_")]} />
              </TableCell>
            ))}
            <TableCell>
              <BalanceCell balance={other_financing_range_totals["balance"]} />
            </TableCell>
          </TableRow>
          <TableRow className={classes.titleTitleTitleRow}>
            <TableCell className={classes.spacer} />
            <TableCell colSpan={2}>
              NET INCREASE (DECREASE) IN NET POSITION
            </TableCell>
            {monthTitles.map((title, i) => (
              <TableCell key={`${title}-${i}`} style={{textAlign: "right"}}>
                <BalanceCell balance={net_position_totals[title.replace("'", "_")]} />
              </TableCell>
            ))}
            <TableCell>
              <BalanceCell balance={net_position_totals.balance} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
};

ReportTable.propTypes = {
  accountFundName: PropTypes.string,
  accountFundCode: PropTypes.string,
  revenues: PropTypes.object,
  revenues_range_totals: PropTypes.object,
  expenses: PropTypes.object,
  expenses_range_totals: PropTypes.object,
  net_position_totals: PropTypes.object,
  monthTitles: PropTypes.arrayOf(PropTypes.string),
  colspanWidth: PropTypes.number,
  other_financing: PropTypes.object,
  other_financing_range_totals: PropTypes.object,
  excess_revenues_totals: PropTypes.object,
  createLinkHandler: PropTypes.func,
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  root: {
    overflowY: "auto",
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
  titleTitleRow: {
    backgroundColor: "##ECEFF1",
    fontSize: "1.15rem",
    "& > td": {
      color: "#546E7A",
      fontWeight: "400",
      borderTop: "2px solid #90A4AE",
    },
  },
  titleTitleTitleRow: {
    backgroundColor: "#CFD8DC",
    borderTop: "1px solid #90A4AE",

    "& > td": {
      color: "#546E7A",
      fontWeight: "400",
      borderTop: "none",
    },
  },
  emptyCell: {
    textAlign: "center",
    color: "#999",
    fontWeight: "100",
  },
});

export default withStyles(styles)(ReportTable);

const TotalCell = ({value, textAlign = "right", ...rest}) => {
  const style = {
    textAlign: value === "$0.00" ? "center" : textAlign,
    color: value === "$0.00" ? "#999" : "inherit",
  };
  return (
    <TableCell style={style} {...rest}>
      <BalanceCell balance={value === "$0.00" ? "-" : value} />
    </TableCell>
  );
};

TotalCell.propTypes = {
  value: PropTypes.string,
  textAlign: PropTypes.string,
};

const ReportRow = ({
  code,
  description = "",
  balance = "",
  titles = [],
  classes = {},
  objCodes = {},
  className,
  createLinkHandler = () => () => {},
}) => {
  return (
    <TableRow
      className={clsx(classes.tableRow, className)}
      onClick={createLinkHandler(code)}
    >
      <TableCell className={classes.spacer} />
      <TableCell className={classes.codeCell}>{code}</TableCell>
      <TableCell className={classes.nameCell}>{description}</TableCell>
      {titles.map((title, i) => {
        const key = title.replace("'", "_");
        return (
          <TotalCell
            key={key + i}
            value={objCodes[key]}
          />
        );
      })}
      <TableCell><BalanceCell balance={balance} /></TableCell>
    </TableRow>
  );
};

ReportRow.propTypes = {
  code: PropTypes.string,
  description: PropTypes.string,
  balance: PropTypes.string,
  titles: PropTypes.arrayOf(PropTypes.string),
  classes: PropTypes.object,
  objCodes: PropTypes.object,
  className: PropTypes.string,
  createLinkHandler: PropTypes.func,
};
