import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";

// Components
import CustomerFilter from "./customer_filter";
import SearchableTable from "../../../searchable_table/searchable_table";
import DefaultViewLinkRenderer from "../../../searchable_table/components/defaults/view_links_renderer";
import DefaultLinkRenderer from "../../../searchable_table/components/defaults/link_renderer";
import StateCellRenderer from "../../../searchable_table/components/defaults/state_cell_renderer";
import StateBtnColumn from "../../../searchable_table/components/defaults/state_btn_renderer";

const CustomersTable = ({
  loading = false,
  customers = [],
  filter = {},
  createStateBtnHandler = function() {},
  handleCustomerFilterStateChange = function() {},
  handleCustomerFilterNumberChange = function() {},
  handleCustomerFilterNameChange = function() {},
  classes = {},
}) => {
  return (
    <section className={classes.root}>
      <CustomerFilter
        {...filter}
        {...{
          loading,
          handleFilterStateChange: handleCustomerFilterStateChange,
          handleFilterNumberChange: handleCustomerFilterNumberChange,
          handleFilterNameChange: handleCustomerFilterNameChange,
        }}
      />
      <SearchableTable
        data={customers}
        headers={["Company", "Account Number", "State", "Change State", ""]}
        cells={[
          DefaultLinkRenderer("name", "path", {
            columnWidth: 225,
            flexGrow: 0,
          }),
          "number",
          StateCellRenderer("aasmState", {flexGrow: 0}),
          StateBtnColumn({
            stateProperty: "aasmState",
            columnWidth: 225,
            clickHandler: createStateBtnHandler("customer"),
            states: {
              draft: ["send_for_approval"],
              needs_revision: ["send_for_approval"],
              needs_approval: ["approve", "deny"],
              ready_to_pay: ["reverse_approval"],
            },
          }),
          DefaultViewLinkRenderer({editPathProperty: "editPath"}),
        ]}
      />
    </section>
  );
};

CustomersTable.propTypes = {
  filter: PropTypes.shape({
    aasm_state: PropTypes.string,
    show: PropTypes.bool,
    number: PropTypes.string,
    name: PropTypes.string,
  }),
  loading: PropTypes.bool,
  customers: PropTypes.arrayOf(PropTypes.object),
  createStateBtnHandler: PropTypes.func.isRequired,
  handleCustomerFilterStateChange: PropTypes.func.isRequired,
  handleCustomerFilterNumberChange: PropTypes.func.isRequired,
  handleCustomerFilterNameChange: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const styles = theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    flexGrow: "1",
  },
});

export default withStyles(styles)(CustomersTable);
