import React from "react";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import {
  XYPlot,
  VerticalGridLines,
  VerticalBarSeries,
  DiscreteColorLegend,
  HorizontalGridLines,
  MarkSeries,
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
          cluster="stack 1"
          data={[{x: "", y: actual}]}
          color="#4D73BE"
          barWidth={0.5}
        />
        <MarkSeries
          cluster="stack 1"
          data={[{x: "", y: budgeted}]}
          color="#DF8244"
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

      "&:first-child > svg": {
        position: "relative",
        right: 4,
      },
      "&:nth-child(2) > svg": {
        background: "#df8244",
        height: 8,
        width: 8,
        borderRadius: "50%",
        position: "relative",
        right: -4,

        "& > path": {
          display: "none",
        },
      },
    },
  },
}));

export default BudgetedActualReport;
