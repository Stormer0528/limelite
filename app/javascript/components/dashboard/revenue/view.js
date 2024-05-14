import React, {useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import BudgetedActualReport from "./budgeted_actual_chart";
import AccountFundBtns from "../shared/account_fund_btns";
import {parseAmount} from "@utils";

function View({data = {}, accountFunds = []}) {
  const [fund, setFund] = useState("all");
  const classes = useStyles();

  const revenues = data[fund].map((revenue) => ({
    title: revenue.title,
    actual: parseAmount(revenue.actual),
    budgeted: parseAmount(revenue.budgeted),
  }));

  return (
    <section>
      <h3>Revenue Table</h3>
      <div className={classes.accountFundsCell}>
        <AccountFundBtns {...{accountFunds, fund, setFund}} />
      </div>

      <div className={classes.root}>
        {revenues.map((revenue, index) => (
          <div key={index} className={classes.chartCell}>
            <h4>{revenue.title}</h4>
            <BudgetedActualReport {...revenue} />
          </div>
        ))}
      </div>
    </section>
  );
}

const useStyles = makeStyles(() => ({
  root: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr",

    columnFill: "balance",
    columnGap: 8,
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

export default View;
