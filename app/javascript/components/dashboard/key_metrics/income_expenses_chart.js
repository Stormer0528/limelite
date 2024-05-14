import {makeStyles} from "@material-ui/core/styles";
import {
  XYPlot,
  LineSeries,
  VerticalGridLines,
  VerticalBarSeries,
  DiscreteColorLegend,
  HorizontalGridLines,
  XAxis,
  YAxis,
} from "react-vis";

function IncomeExpensesChart({data = []}) {
  const classes = useStyles();

  const lineData = formatNetIncomeData(data);
  const revenueData = formatRevenueData(data);
  const expenseData = formatExpenseData(data);

  return (
    <div className={classes.root}>
      <XYPlot height={275} width={550} xType="ordinal" margin={{left: 60}}>
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis />
        <YAxis />
        <VerticalBarSeries
          data={expenseData}
          cluster="stack 1"
          color="#DF8244"
        />
        <VerticalBarSeries
          data={revenueData}
          cluster="stack 1"
          color="#4D73BE"
        />
        <LineSeries data={lineData} color="#19CDD7" />
      </XYPlot>
      <DiscreteColorLegend
        colors={["#DF8244", "#4D73BE", "#19CDD7"]}
        items={["Revenue", "Expenses", "Net Balance"]}
        orientation="horizontal"
      />
    </div>
  );
}
const useStyles = makeStyles(() => ({
  root: {
    border: "1px solid #e0e0e0",
    borderRadius: 3,
    padding: 8,
  },
}));

export default IncomeExpensesChart;

// HELPER FUNCTIONS
const formatNetIncomeData = (data) => {
  return data.map(({netIncome, type: month}) => {
    return {x: month, y: netIncome};
  });
};

const formatExpenseData = (data) => {
  return data.map(({type: month, expense}) => {
    return {x: month, y: expense};
  });
};

const formatRevenueData = (data) => {
  return data.map(({type: month, revenue}) => {
    return {x: month, y: revenue};
  });
};
