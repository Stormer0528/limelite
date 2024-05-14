import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
// Components
import VendorFilter from "./vendor_filter";
import SearchableTable from "../../../searchable_table/searchable_table";
import DefaultViewLinkRenderer from "../../../searchable_table/components/defaults/view_links_renderer";
import DefaultLinkRenderer from "../../../searchable_table/components/defaults/link_renderer";
import StateCellRenderer from "../../../searchable_table/components/defaults/state_cell_renderer";
import StateBtnColumn from "../../../searchable_table/components/defaults/state_btn_renderer";

const VendorsTable = ({
  vendors = [],
  filter = {},
  createStateBtnHandler = function () {},
  handleVendorFilterStateChange = function () {},
  handleVendorFilterNumberChange = function () {},
  handleVendorFilterNameChange = function () {},
  loading = false,
  classes = {},
}) => {
  return (
    <section className={classes.root}>
      <VendorFilter
        {...filter}
        {...{
          handleFilterStateChange: handleVendorFilterStateChange,
          handleFilterNumberChange: handleVendorFilterNumberChange,
          handleFilterNameChange: handleVendorFilterNameChange,
        }}
      />
      {loading && (
        <LinearProgress
          classes={{root: classes.progress, bar: classes.progressBar}}
        />
      )}
      <SearchableTable
        data={vendors}
        headers={["Company", "Account Number", "State", "Change State", ""]}
        cells={[
          DefaultLinkRenderer("name", "path", {
            columnWidth: 225,
            flexGrow: 0,
          }),
          "accountNumber",
          StateCellRenderer("aasmState", {flexGrow: 0}),
          StateBtnColumn({
            stateProperty: "aasmState",
            columnWidth: 225,
            clickHandler: createStateBtnHandler("vendor"),
            states: {
              draft: ["send_for_approval"],
              needs_revision: ["send_for_approval"],
              needs_approval: ["approve", "deny"],
              ready_to_pay: ["reverse_approval"],
            },
          }),
          DefaultViewLinkRenderer({
            editPathProperty: "editPath",
            columnWidth: 50,
          }),
        ]}
      />
    </section>
  );
};

VendorsTable.propTypes = {
  filter: PropTypes.shape({
    aasm_state: PropTypes.string,
    show: PropTypes.bool,
    number: PropTypes.string,
    name: PropTypes.string,
  }),
  loading: PropTypes.bool,
  vendors: PropTypes.arrayOf(PropTypes.object),
  createStateBtnHandler: PropTypes.func.isRequired,
  handleVendorFilterStateChange: PropTypes.func.isRequired,
  handleVendorFilterNumberChange: PropTypes.func.isRequired,
  handleVendorFilterNameChange: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    flexGrow: "1",
  },
  progress: {
    height: 2,
    backgroundColor: "#009688",
  },
  progressBar: {
    backgroundColor: "#74ab4b",
  },
});

export default withStyles(styles)(VendorsTable);
