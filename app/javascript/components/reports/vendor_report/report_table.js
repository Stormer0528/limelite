import {Fragment} from "react";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";

import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import {DataGrid} from "@material-ui/data-grid";

const ReportTable = ({vendors = [], classes = {}}) => {
  return (
    <AutoSizer>
      {({width, height}) => (
        <Fragment>
          <section
            className={classes.sectionRow}
            style={{margin: "1rem 0 0", height, width}}
          >
            <DataGrid
              className={classes.root}
              rows={vendors}
              columns={columns}
              rowHeight={65}
              headerHeight={36}
              getRowId={(row) =>
                [row.code, row.vendorName, row.vendorNumber, row.amount].join()
              }
              autoHeight
              autoPageSize
              disableSelectionOnClick
              disableColumnMenu
              showCellRightBorder
              showColumnRightBorder
            />
          </section>
        </Fragment>
      )}
    </AutoSizer>
  );
};

ReportTable.propTypes = {
  vendors: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string,
      vendor_name: PropTypes.string,
      vendor_number: PropTypes.string,
      amount: PropTypes.string,
    })
  ),
  classes: PropTypes.object.isRequired,
};

const columns = [
  {
    field: "code",
    headerName: "Fund Code",
    width: 120,
  },
  {
    field: "vendorName",
    headerName: "Name",
    flex: 1.5,
  },
  {
    field: "phone",
    headerName: "Phone Number",
    flex: 1,
  },
  {
    field: "vendorNumber",
    headerName: "Number",
    flex: 2,
  },
  {
    field: "amount",
    headerAlign: "center",
    align: "right",
    headerName: "Amount",
    flex: 1,
  },
  {
    field: "address",
    headerName: "Address",
    flex: 2.5,
    renderCell: ({value}) => {
      const {attention, city, department, line1, line2, state, zip} =
        value || {};
      const tooltip = [
        attention,
        department,
        line1,
        line2,
        `${city}, ${state} ${zip}`,
      ]
        .filter((e) => Boolean(e))
        .join("\n");
      return (
        <div
          title={tooltip}
          style={{display: "flex", flexDirection: "column", lineHeight: "16px"}}
        >
          {attention && (
            <div>
              <b>Attn:</b>&nbsp;{attention}
            </div>
          )}
          {department && (
            <div>
              <b>Dept:</b>&nbsp;{department}
            </div>
          )}
          <div>{line1}</div>
          {line2 && <div>{line2}</div>}
          {[city, state, zip].some((elem) => Boolean(elem)) && (
            <div>
              {city}, {state} {zip}
            </div>
          )}
        </div>
      );
    },
  },
];

const styles = () => ({
  root: {
    minHeight: "250px",
    flexGrow: 1,
  },
});

export default withStyles(styles)(ReportTable);
