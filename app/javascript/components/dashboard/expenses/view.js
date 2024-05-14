import React, {useState} from "react";
import {makeStyles} from "@material-ui/core/styles";

import BudgetVsActualChart from "./budgeted_actual_chart";
import AccountFundBtns from "../shared/account_fund_btns";
import {parseAmount} from "@utils";

function ExpensesView({data = {}, accountFunds = []}) {
  const [fund, setFund] = useState("all");
  const classes = useStyles();

  const expenses = data[fund].map((expense) => ({
    title: expense.title,
    actual: parseAmount(expense.actual),
    budgeted: parseAmount(expense.budgeted),
  }));

  return (
    <section>
      <div className={classes.accountFundsCell}>
        <AccountFundBtns {...{accountFunds, fund, setFund}} />
      </div>
      <div className={classes.expenses}>
        {expenses.map((expense, i) => {
          return (
            <div key={i} className={classes.chartCell}>
              <h4 className={classes.header}>{expense.title}</h4>
              <BudgetVsActualChart {...expense} />
            </div>
          );
        })}
      </div>
    </section>
  );
}

const useStyles = makeStyles(() => ({
  expenses: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr",

    columnFill: "balance",
    columnGap: 8,
    rowGap: 8,
    margin: 10,
  },

  header: {
    margin: "0 0 8px",
    fontSize: 16,
    fontWeight: 400,
  },

  chartCell: {
    border: "1px solid #ccc",
    borderRadius: 4,
    padding: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "25vh",
    flexDirection: "column",
  },

  accountFundsCell: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

export default ExpensesView;
