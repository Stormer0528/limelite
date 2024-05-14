import {Fragment} from "react";
import {makeStyles} from "@material-ui/core/styles";

import IncomeExpensesChart from "./income_expenses_chart";
import PercentageOfIncomeBudgetChart from "./percentage_of_income_budget_chart";
import PercentageOfExpensesBudgetChart from "./percentage_of_expenses_budget_chart";
import {parseMonthCode, parseAmount} from "@utils";

function Graph({
  expenses,
  revenues,
  netIncome,
  budget,
  totalNetIncome,
  accountPayable,
}) {
  const months = parseMonthCode(expenses);

  const budgetNumber = parseAmount(budget);
  const totalNetIncomeNumber = parseAmount(totalNetIncome);
  const accountPayableNumber = parseAmount(accountPayable);
  const incomeAndExpenses = months.map((month) => ({
    type: month.code,
    revenue: parseAmount(revenues[month.key]),
    expense: parseAmount(expenses[month.key]),
    netIncome: parseAmount(netIncome[month.key]),
  }));

  const classes = useStyles();

  return (
    <Fragment>
      <div className={classes.root}>
        <div className={classes.cell}>
          <h6 className={classes.cellTitle}>Icome and Expenses</h6>
          <IncomeExpensesChart data={incomeAndExpenses} />
        </div>
        <div className={classes.radialCell}>
          <h6 className={classes.cellTitle}>% of Income Budget</h6>
          <PercentageOfIncomeBudgetChart
            data={{
              actual:
                (budgetNumber && totalNetIncomeNumber / budgetNumber) || 0,
              remainder:
                (budgetNumber &&
                  (budgetNumber - totalNetIncomeNumber) / budgetNumber) ||
                0,
            }}
          />
        </div>
        <div className={classes.radialCell}>
          <h6 className={classes.cellTitle}>% of Expenses Budget</h6>
          <PercentageOfExpensesBudgetChart
            data={{
              actual:
                (budgetNumber && accountPayableNumber / budgetNumber) || 0,
              remainder:
                (budgetNumber &&
                  (budgetNumber - accountPayableNumber) / budgetNumber) ||
                0,
            }}
          />
        </div>
      </div>
    </Fragment>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr",
    gridColumnGap: theme.spacing(),
    margin: theme.spacing(),
  },
  cell: {
    border: "1px solid #999",
    borderRadius: 3,
    padding: theme.spacing(),
  },
  radialCell: {
    border: "1px solid #999",
    borderRadius: 3,
    padding: theme.spacing(),
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  cellTitle: {
    justifySelf: "flex-start",
    textAlign: "center",
    fontSize: 14,
  },
}));

export default Graph;
