import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import {withStyles} from "@material-ui/core/styles";

import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import MuiTable from "mui-virtualized-table";

const ReportTable = ({vendors = [], classes = {}}) => {
  return (
    <Paper className={classes.root}>
      <AutoSizer>
        {({width, height}) => (
          <MuiTable
            className={classes.reportTable + " report-table condensed"}
            data={vendors}
            columns={[
              {name: "name", header: "Name"},
              {name: "type", header: "Type"},
              {name: "ssnEin", header: "SSN/EIN"},
              {name: "address", header: "Vendor Address", width: 350},
              {name: "yearAmount", header: "Year Amount"},
            ]}
            width={width}
            maxHeight={height}
            includeHeaders={true}
            fixedRowCount={1}
            style={{backgroundColor: "white"}}
          />
        )}
      </AutoSizer>
    </Paper>
  );
};

ReportTable.propTypes = {
  vendors: PropTypes.arrayOf(
    PropTypes.shape({
      address: PropTypes.string,
      name: PropTypes.string,
      ssn_ein: PropTypes.string,
      type: PropTypes.string,
      year_amount: PropTypes.string,
    })
  ),
  classes: PropTypes.object.isRequired,
};

const styles = theme => ({
  root: {
    minHeight: "250px",
    flexGrow: 1,
  },
});

export default withStyles(styles)(ReportTable);
