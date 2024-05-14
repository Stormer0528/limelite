import PropTypes from "prop-types";
import clamp from "lodash/clamp";
import {USD} from "@utils";

import {makeStyles} from "@material-ui/core/styles";
import {styles} from "../form";

import {DataGrid} from "@material-ui/data-grid";

const useStyles = makeStyles(styles);

export default function ItemsSection({
  purchaseOrder: {purchaseOrderItems = []} = {},
}) {
  const classes = useStyles();
  const height = clamp(purchaseOrderItems.length * 36 + 36, 72, 500);
  return (
    <section
      className={classes.sectionRow}
      style={{margin: "1rem 0 0", height: height}}
    >
      <DataGrid
        rows={purchaseOrderItems}
        columns={columns}
        rowHeight={36}
        headerHeight={36}
        hideFooter
        autoHeight
        disableSelectionOnClick
        disableColumnMenu
        showCellRightBorder
        showColumnRightBorder
      />
    </section>
  );
}

ItemsSection.propTypes = {
  purchaseOrder: PropTypes.shape({
    buyer: PropTypes.string,
    requisitionNumber: PropTypes.string,
    referenceNumber: PropTypes.string,
    requestedBy: PropTypes.shape({fullName: PropTypes.string}),
    requestedFor: PropTypes.shape({fullName: PropTypes.string}),
  }),
};

const columns = [
  {
    field: "quantity",
    headerName: "Quantity",
    flex: 0.75,
  },
  {
    field: "description",
    headerName: "Description",
    width: 250,
    flex: 3,
  },
  {
    field: "priceInCents",
    headerName: "Unit Price",
    flex: 0.75,
    align: "right",
    valueFormatter: ({value}) => "$" + USD(value / 100),
  },
  {
    field: "totalInCents",
    headerName: "Total",
    flex: 0.75,
    align: "right",
    valueFormatter: ({value}) => "$" + USD(value / 100),
  },
];
