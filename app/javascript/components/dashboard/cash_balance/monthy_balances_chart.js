import {makeStyles} from "@material-ui/core/styles";
import {
  XYPlot,
  VerticalBarSeries,
  HorizontalGridLines,
  XAxis,
  YAxis,
} from "react-vis";

function MonthyBalancesChart({data = []}) {
  const classes = useStyles();
  const balanceData = formatBalanceData(data);

  return (
    <div className={classes.root}>
      <XYPlot height={275} width={750} xType="ordinal" margin={{left: 65}}>
        <HorizontalGridLines />
        <XAxis />
        <YAxis />
        <VerticalBarSeries data={balanceData} color="#4D73BE" barWidth={0.5} />
      </XYPlot>
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

export default MonthyBalancesChart;

// HELPER FUNCTIONS
const formatBalanceData = (data) => {
  return data.map(({label: x, amount: y}) => {
    return {x, y};
  });
};
