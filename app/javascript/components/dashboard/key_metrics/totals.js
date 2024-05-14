import {makeStyles} from "@material-ui/core/styles";
import MetricBox from "./metric_box";

function Totals({totalIncome, totalExpense, netIncome, accountPayable}) {
  const cl = useStyles();
  return (
    <div className={cl.root}>
      <MetricBox title="Total Income" amount={totalIncome} />
      <MetricBox title="Total Expenses" amount={totalExpense} />
      <MetricBox title="Net Income (Loss)" amount={netIncome} />
      <MetricBox title="Accounts Payable" amount={accountPayable} />
    </div>
  );
}

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 12,
  },
}));

export default Totals;
