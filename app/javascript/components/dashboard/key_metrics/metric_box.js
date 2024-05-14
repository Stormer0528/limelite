import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";

import Box from "@material-ui/core/Box";

const MetricBox = ({title, amount}) => {
  const cl = useStyles();

  return (
    <Box className={cl.root}>
      <Box className={cl.titleCell}>{title}</Box>
      <Box className={cl.amountCell}>{amount}</Box>
    </Box>
  );
};

MetricBox.propTypes = {
  title: PropTypes.string,
  amount: PropTypes.string,
};

const useStyles = makeStyles(() => ({
  root: {
    border: "1px solid #e0e0e0",
    borderRadius: 3,
    padding: 8,
  },
  titleCell: {
    borderBottom: "1px solid #e0e0e0",
    margin: "0 -8px",
    padding: "0 8px 4px",
    fontWeight: 500,
    fontSize: 16,
    textAlign: "center",
  },
  amountCell: {
    textAlign: "center",
    paddingTop: 8,
  },
}));

export default MetricBox;
