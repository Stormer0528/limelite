import PropTypes from "prop-types";

import InvoicesTable from "./index_view/invoices_table_container";
import CustomersTable from "./index_view/customers_table_container";
// import PurchaseOrdersTable from "./index_view/purchase_orders_table";
import Fab from "./index_view/fab";

import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {withStyles} from "@material-ui/core/styles";

import CustomerIcon from "@material-ui/icons/PermContactCalendar";
import InvoiceIcon from "@material-ui/icons/FeaturedPlayList";

const IndexView = ({
  tabIndex = 0,
  customerFilter = {},
  invoiceFilter = {},
  createStateBtnHandler = function() {},
  handleTabClick = function() {},
  handleCustomerFilterStateChange = function() {},
  handleCustomerFilterNumberChange = function() {},
  handleCustomerFilterNameChange = function() {},
  handleInvoiceFilterStateChange = function() {},
  handleInvoiceFilterNumberChange = function() {},
  handleFilterCustomerIdChange = function() {},
  handleInvoiceFilterPaidChange = function() {},
  classes = {},
  // theme = {},
}) => {
  return (
    <section className="CustomerIndex">
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
            label="customers"
            icon={<CustomerIcon />}
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
        </Tabs>

        {tabIndex === 0 && (
          <CustomersTable
            {...{
              filter: customerFilter,
              createStateBtnHandler,
              handleCustomerFilterStateChange,
              handleCustomerFilterNumberChange,
              handleCustomerFilterNameChange,
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
              handleFilterCustomerIdChange,
              handleInvoiceFilterPaidChange,
            }}
          />
        )}
      </Paper>
      <Fab />
    </section>
  );
};

IndexView.propTypes = {
  invoices: PropTypes.arrayOf(PropTypes.object),
  customers: PropTypes.arrayOf(PropTypes.object),
  purchaseOrders: PropTypes.arrayOf(PropTypes.object),
  tabIndex: PropTypes.number,
  customerFilter: PropTypes.object,
  invoiceFilter: PropTypes.object,
  createStateBtnHandler: PropTypes.func.isRequired,
  handleTabClick: PropTypes.func.isRequired,
  handleCustomerFilterStateChange: PropTypes.func.isRequired,
  handleCustomerFilterNumberChange: PropTypes.func.isRequired,
  handleCustomerFilterNameChange: PropTypes.func.isRequired,
  handleInvoiceFilterStateChange: PropTypes.func.isRequired,
  handleInvoiceFilterNumberChange: PropTypes.func.isRequired,
  handleFilterCustomerIdChange: PropTypes.func.isRequired,
  handleInvoiceFilterPaidChange: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

const styles = theme => ({
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
