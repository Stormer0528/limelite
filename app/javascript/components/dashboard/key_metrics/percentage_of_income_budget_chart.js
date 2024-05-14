// import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import {RadialChart} from "react-vis";

function IncomeExpensesChart({data = {}}) {
  const classes = useStyles();
  const {actual, remainder} = data;

  return (
    <div className={classes.root}>
      <RadialChart
        colorType="literal"
        className="progress-chart"
        innerRadius={45}
        radius={70}
        padAngle={0.06125}
        data={[
          {angle: actual * 100, color: "#DF8244", label: "Actual"},
          {angle: remainder * 100, color: "#4D73BE", label: "Remainder"},
        ]}
        width={150}
        height={150}
      />
    </div>
  );
}

const useStyles = makeStyles(() => ({
  root: {
    // border: "1px solid #e0e0e0",
    borderRadius: 3,
    padding: 8,
  },
}));

export default IncomeExpensesChart;
