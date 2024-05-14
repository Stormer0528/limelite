import React, {useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import AccountFundBtns from "../shared/account_fund_btns";

function GrantsTableView({data = {}, accountFunds = []}) {
  const [fund, setFund] = useState("all");
  const classes = useStyles();

  const grants = data[fund];

  return (
    <div className={classes.root}>
      <h4>Grants Table</h4>
      <div className={classes.accountFundsCell}>
        <AccountFundBtns {...{accountFunds, fund, setFund}} />
      </div>

      <table className={classes.table}>
        <thead className={classes.header}>
          <tr className={classes.row1}>
            <th />
            <th>Actuals</th>
            <th>Budget</th>
            <th>Fav/(Unfav) $</th>
            <th>Fav/(Unfav) %</th>
          </tr>
        </thead>
        <tbody>
          {grants.map((grant, index) => (
            <tr key={index}>
              <td className={classes.titleCell}>{grant.title}</td>
              <td className={classes.moneyCell}>{grant.actual}</td>
              <td className={classes.moneyCell}>{grant.budget}</td>
              <td className={classes.moneyCell}>{grant.diff}</td>
              <td className={classes.percentageCell}>
                {grant.account_percentage}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    border: "1px solid #ccc",
    padding: theme.spacing(),
  },
  moneyCell: {
    textAlign: "right",
  },
  percentageCell: {
    textAlign: "center",
  },
  table: {
    border: "1px solid #ccc",
    margin: 10,
  },
  header: {
    borderBottom: "2px solid #999",
    borderCollapse: "separate",
  },
  totalCell: {
    textAlign: "left",
  },
  row1: {
    "& > th": {
      fontWeight: 400,
    },
  },
  row2: {
    "& > th": {borderBottom: "2px solid #999"},
  },
  accountFundsCell: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

export default GrantsTableView;
