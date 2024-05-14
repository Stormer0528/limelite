import {useState} from "react";
import {makeStyles} from "@material-ui/core/styles";

import AccountFundBtns from "../shared/account_fund_btns";
import Totals from "./totals";
import Graph from "./graph";

function KeyMetricsView({accountFunds = [], data = {}}) {
  const [fund, setFund] = useState("all");

  const classes = useStyles();

  return (
    <section>
      <h2 className={classes.tabHeader}>Key Metrics</h2>

      <div>
        <div className={classes.accountFundsCell}>
          <AccountFundBtns {...{accountFunds, fund, setFund}} />
        </div>

        <Totals
          totalIncome={data[fund].total_income}
          totalExpense={data[fund].total_expense}
          netIncome={data[fund].total_net_income}
          accountPayable={data[fund].account_payable}
        />

        <Graph
          expenses={data[fund].expenses}
          revenues={data[fund].revenues}
          netIncome={data[fund].net_income}
          budget={data[fund].budget}
          totalNetIncome={data[fund].total_net_income}
          accountPayable={data[fund].account_payable}
        />
      </div>
    </section>
  );
}

const useStyles = makeStyles((theme) => ({
  tabHeader: {
    textAlign: "center",
  },
  accountFundsCell: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

export default KeyMetricsView;
