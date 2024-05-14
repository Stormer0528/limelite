import BatchUploadsTable from "./index_view/batch_uploads_container";
import Fab from "./index_view/fab";
import InvoicesTable from "./index_view/invoices_table_container";
import PurchaseOrdersTable from "./index_view/purchase_orders_table";
import VendorsTable from "./index_view/vendors_table_container";
import Paper from "@material-ui/core/Paper";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import {withStyles} from "@material-ui/core/styles";
import BatchUploadIcon from "@material-ui/icons/CreateNewFolder";
import InvoiceIcon from "@material-ui/icons/FeaturedPlayList";
import PurchaseOrderIcon from "@material-ui/icons/FeaturedVideo";
import VendorIcon from "@material-ui/icons/Store";
import PropTypes from "prop-types";

const IndexView = ({
  purchaseOrders = [],
  tabIndex = 0,
  vendorFilter = {},
  invoiceFilter = {},
  batchUploadFilter = {},
  createStateBtnHandler = function () {},
  handleTabClick = function () {},
  handleVendorFilterStateChange = function () {},
  handleVendorFilterNumberChange = function () {},
  handleVendorFilterNameChange = function () {},
  handleInvoiceFilterStateChange = function () {},
  handleInvoiceFilterNumberChange = function () {},
  handleInvoiceFilterPaidChange = function () {},
  handleInvoiceVoidChange = function () {},
  handleFilterVendorIdChange = function () {},
  handleBatchUploadFilterStateChange = function () {},
  permissions = {},
  classes = {},
  // theme = {},
}) => {
  return (
    <section className="VendorIndex">
      <Paper position="static" color="initial" className={classes.container}>
        <Tabs
          value={tabIndex}
          onChange={handleTabClick}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          centered
          classes={{
            indicator: classes.indicator,
          }}
        >
          <Tab
            label="Vendors"
            icon={<VendorIcon />}
            className={classes.tab}
            classes={{
              selected: classes.selected,
              textColorPrimary: classes.textColorPrimary,
            }}
          />
          <Tab
            label="Invoices"
            icon={<InvoiceIcon />}
            classes={{
              selected: classes.selected,
              textColorPrimary: classes.textColorPrimary,
            }}
            className={classes.tab}
          />
          <Tab
            label="Purchase Orders"
            icon={<PurchaseOrderIcon />}
            classes={{
              selected: classes.selected,
              textColorPrimary: classes.textColorPrimary,
            }}
            className={classes.tab}
          />
          <Tab
            label="Batch Upload"
            icon={<BatchUploadIcon />}
            classes={{
              selected: classes.selected,
              textColorPrimary: classes.textColorPrimary,
            }}
            className={classes.tab}
          />
        </Tabs>
        {tabIndex === 0 && (
          <VendorsTable
            {...{
              filter: vendorFilter,
              createStateBtnHandler,
              handleVendorFilterStateChange,
              handleVendorFilterNumberChange,
              handleVendorFilterNameChange,
            }}
          />
        )}
        {tabIndex === 1 && (
          <InvoicesTable
            {...{
              createStateBtnHandler,
              filter: invoiceFilter,
              handleInvoiceFilterStateChange,
              handleInvoiceFilterNumberChange,
              handleFilterVendorIdChange,
              handleInvoiceFilterPaidChange,
              handleInvoiceVoidChange,
            }}
          />
        )}
        {tabIndex === 2 && <PurchaseOrdersTable {...{purchaseOrders}} />}
        {tabIndex === 3 && (
          <BatchUploadsTable
            {...{
              filter: batchUploadFilter,
              handleBatchUploadFilterStateChange,
            }}
          />
        )}
      </Paper>
      <Fab {...{permissions}} />
    </section>
  );
};

IndexView.propTypes = {
  invoices: PropTypes.arrayOf(PropTypes.object),
  vendors: PropTypes.arrayOf(PropTypes.object),
  purchaseOrders: PropTypes.arrayOf(PropTypes.object),
  tabIndex: PropTypes.number,
  createStateBtnHandler: PropTypes.func.isRequired,
  handleTabClick: PropTypes.func.isRequired,
  vendorFilter: PropTypes.object,
  invoiceFilter: PropTypes.object,
  permissions: PropTypes.object,
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  handleVendorFilterStateChange: PropTypes.func.isRequired,
  handleVendorFilterNumberChange: PropTypes.func.isRequired,
  handleVendorFilterNameChange: PropTypes.func.isRequired,
  handleInvoiceFilterStateChange: PropTypes.func.isRequired,
  handleInvoiceFilterNumberChange: PropTypes.func.isRequired,
  handleInvoiceFilterPaidChange: PropTypes.func.isRequired,
  handleInvoiceVoidChange: PropTypes.func.isRequired,
  handleFilterVendorIdChange: PropTypes.func.isRequired,
};

const styles = (theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    flexGrow: "1",
    marginBottom: "1rem",
  },
  tab: {
    color: "#7CB342",
    width: "inherit",
    maxWidth: "inherit",
    "&:focus": {
      color: "#7CB342",
      backgroundColor: "#F5F5F5",
    },
  },
  textColorPrimary: {
    color: "#7CB342",
    "&$selected": {
      color: "#7CB342",
      backgroundColor: "#F5F5F5",
    },
  },
  selected: {
    color: "#7CB342",
  },
  indicator: {
    backgroundColor: "#7CB342",
  },
});

export default withStyles(styles, {withTheme: true})(IndexView);
