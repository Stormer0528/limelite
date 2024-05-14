import React from "react";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import {
  XYPlot,
  VerticalGridLines,
  VerticalBarSeries,
  DiscreteColorLegend,
  HorizontalGridLines,
  XAxis,
  YAxis,
} from "react-vis";

function BudgetedActualReport({actual, budgeted}) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <XYPlot height={200} width={150} xType="ordinal" margin={{left: 60}}>
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis tickSize={0} />
        <YAxis tickSize={0} />
        <VerticalBarSeries
          data={[{x: "", y: actual}]}
          color="#4D73BE"
          barWidth={0.5}
        />
        <VerticalBarSeries
          data={[{x: "", y: budgeted}]}
          color="#DF8244"
          barWidth={0.5}
        />
      </XYPlot>
      <DiscreteColorLegend
        className={classes.legend}
        colors={["#4D73BE", "#DF8244"]}
        items={["Actual", "Budgeted"]}
        orientation="horizontal"
      />
    </div>
  );
}

BudgetedActualReport.propTypes = {
  actual: PropTypes.number,
  budgeted: PropTypes.number,
};

const useStyles = makeStyles(() => ({
  legend: {
    display: "flex",

    "& .rv-discrete-color-legend-item.horizontal": {
      display: "grid",
      gridTemplateColumns: "12px 1fr",
      gridColumnGap: 4,
      alignItems: "center",

      "& > svg": {
        position: "relative",
        right: 4,
      },
    },
  },
}));

export default BudgetedActualReport;
