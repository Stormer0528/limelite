import PropTypes from "prop-types";
import {useFormikContext} from "formik";
import {useQuery} from "@apollo/react-hooks";
import {useDebounce} from "@react-hook/debounce";
import isEqual from "react-fast-compare";

import {makeStyles} from "@material-ui/core/styles";
import PurchaseOrderIcon from "@shared/icons/purchase_order_icon";

// Components
import SearchableTable from "searchable_table/searchable_table";
import DateRenderer from "searchable_table/components/defaults/date_column";
import TextRenderer from "searchable_table/components/defaults/text_column";
import DefaultViewLinkRenderer from "searchable_table/components/defaults/view_links_renderer";
import StateCellRenderer from "searchable_table/components/defaults/state_cell_renderer";

import CREATED_ITEMS_QUERY from "@graphql/queries/created_authable_items.gql";

const AuthorizationsTable = () => {
  const {values: formValues = {}} = useFormikContext();
  const [savedValues, setSavedValues] = useDebounce({
    description: "",
    fileType: "",
  });

  const {data: {currentUser: {items = []} = {}} = {}} = useQuery(
    CREATED_ITEMS_QUERY,
    {
      fetchPolicy: "network-only",
    }
  );

  if (!isEqual(formValues, savedValues)) {
    setSavedValues(formValues);
  }

  const {clientHeight: height = 500} =
    document.querySelector("#user-card-container") || {};
  const cl = useStyles({height});

  return (
    <div className={cl.root} data-cy="authorizations-table">
      <SearchableTable
        data={items}
        headers={[
          "Type",
          "Vendor",
          "Number",
          "Date",
          "Date Needed",
          "State",
          "",
        ]}
        cells={[
          FileTypeColumn,
          "vendorName",
          TextRenderer("number", {
            columnWidth: 150,
            flexGrow: 1,
          }),
          DateRenderer("date", {flexGrow: 0, columnWidth: 95}),
          DateRenderer("dateNeeded", {flexGrow: 0, columnWidth: 95}),
          StateCellRenderer("aasmState", {flexGrow: 0}),
          DefaultViewLinkRenderer({
            pathProperty: "path",
            editPathProperty: "editPath",
            showDelete: false,
            columnWidth: 90,
            flexGrow: 0,
            target: "_blank",
          }),
        ]}
      />
    </div>
  );
};

AuthorizationsTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
};

const FileTypeColumn = () => {
  return (
    <div style={{display: "flex", alignItems: "center"}}>
      <PurchaseOrderIcon style={{marginRight: ".5rem", color: "#2c4374"}} />
      <span title="Pruchase Order">Purchase Order</span>
    </div>
  );
};

FileTypeColumn.flexGrow = 1;
FileTypeColumn.columnWidth = 150;

FileTypeColumn.propTypes = {};

const useStyles = makeStyles((theme) => {
  return {
    root: {
      display: "flex",
      flexDirection: "column",
      height: (props) => props.height,

      "& .SearchableTable": {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
      },
      "& .SearchableTable .ReactVirtualized__Table__headerRow": {
        border: "2px solid #fafafa",
        background: "#fafafa",
      },
    },
  };
});

export default AuthorizationsTable;
