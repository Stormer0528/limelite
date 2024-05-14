import {useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {USD, parseMonthCode, parseAmount} from "@utils";
import Box from "@material-ui/core/Box";

import AccountFundBtns from "../shared/account_fund_btns";
import MonthyBalancesChart from "./monthy_balances_chart";

function CashBalanceView({accountFunds = [], data = {}}) {
  const [fund, setFund] = useState("all");
  const balances = data[fund] || {};

  const months = parseMonthCode(balances.cash_balances);
  const totalIn = parseAmount(balances.total_income);
  const totalOut = parseAmount(balances.total_outcome);
  const cashBalance = parseAmount(balances.total_cash);
  const monthTotals = months.map((month, index) => ({
    label: !index ? "Start" : `${month.key}`,
    amount: parseAmount(balances.cash_balances[month.key]),
  }));

  const classes = useStyles();
  return (
    <section>
      <h2 className={classes.tabHeader}>Key Metrics</h2>

      <div>
        <div className={classes.accountFundsCell}>
          <AccountFundBtns {...{accountFunds, fund, setFund}} />
        </div>
        <Box style={{display: "flex", marginTop: 8}}>
          <div style={{padding: 8}}>
            <h3>Cash Balance</h3>
            {USD(cashBalance).format()}
            <h5>
              <b>IN:&nbsp;</b>
              {USD(totalIn).format()}
            </h5>
            <h5>
              <b>OUT:&nbsp;</b>
              {USD(totalOut).format()}
            </h5>
          </div>
          <div
            style={{
              display: "flex",
              border: "1px solid #ccc",
              borderRadius: 4,
              width: "100%",
            }}
          >
            <MonthyBalancesChart data={monthTotals} />
          </div>
        </Box>
      </div>
    </section>
  );
}

const useStyles = makeStyles(() => ({
  tabHeader: {
    textAlign: "center",
  },
  accountFundsCell: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

export default CashBalanceView;
