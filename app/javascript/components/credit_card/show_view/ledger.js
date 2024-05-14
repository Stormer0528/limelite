import {lowerCase} from "lodash";
import {titleCase} from "humanize-plus";
import {withStyles} from "@material-ui/core/styles";

import {ApolloConsumer} from "react-apollo";
import EntryQuery from "../../../graphql/queries/load_entry.gql";

import PropTypes from "prop-types";
import Filter from "./credit_card_item_filter_container";
import ChargeIcon from "@material-ui/icons/CreditCard";
import PaymentIcon from "@material-ui/icons/LocalAtm";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import PopupBtn from "../../shared/popup_btn";
import Entry from "./entry_container";
import TableHeader from "./table_header";
import ViewLinksRenderer from "../../searchable_table/components/defaults/view_links_renderer";
import SearchableTable from "../../searchable_table/searchable_table";
import DateCellRenderer from "../../searchable_table/components/defaults/date_column";
import StateCellRenderer from "../../searchable_table/components/defaults/state_cell_renderer";
import {amountSearch} from "../../searchable_table/utils/search_functions";
import {creditCell, debitCell} from "../../new_entry_btn/entry_item";

const Ledger = ({
  loading = false,
  printPath,
  xlsxPath,
  storeKey = "account_show_ledger",
  account = {},
  items = [],
  filter = {},
  account: {id = 0},
}) => (
  <TableHeader
    {...{
      account,
      printPath,
      xlsxPath,
      loading,
    }}
  >
    <Filter {...{vendors: account.vendors, ...filter}} />
    <SearchableTable
      data={items}
      storeKey={`${storeKey}-${id}`}
      headers={[
        "Type",
        "State",
        "Date",
        "Payee",
        "Memo",
        "Entry",
        "Reconciled",
        "Credits",
        "Debits",
        "",
      ]}
      cells={[
        TypeColumn,
        StateCellRenderer("aasmState", {columnWidth: 90}),
        DateCellRenderer("date"),
        "payee",
        "memo",
        EntryColumn,
        ReconciledColumn,
        CreditColumn,
        DebitColumn,
        ViewLinksRenderer({
          columnWidth: 35,
          editPathProperty: "editPath",
          showDelete: false,
          showView: false,
          target: "_blank",
        }),
      ]}
    />
  </TableHeader>
);

Ledger.propTypes = {
  loading: PropTypes.bool,
  printPath: PropTypes.string,
  xlsxPath: PropTypes.string,
  items: PropTypes.array,
  filter: PropTypes.object,
  storeKey: PropTypes.string,
  account: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    balance: PropTypes.string,
    starting_balance: PropTypes.string,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        credit: PropTypes.string,
        debit: PropTypes.string,
        memo: PropTypes.string,
        type: PropTypes.string,
      })
    ),
  }),
  classes: PropTypes.object.isRequired,
};

// TYPE COLUMN
//------------------------------------------------------------------------------
const TypeColumn = ({rowData: {path = "", type = ""}}) => {
  const Icon = type === "CreditCard::Charge" ? ChargeIcon : PaymentIcon;
  return (
    <a href={path} target="_blank" rel="noopener noreferrer">
      <Icon fontSize="small" style={{top: ".25em", position: "relative"}} />
      {"  "}
      {`${titleCase(lowerCase(type.replace(/CreditCard::/, "")))}`}
    </a>
  );
};

TypeColumn.columnWidth = 100;
TypeColumn.flexGrow = 0;

TypeColumn.propTypes = {
  rowData: PropTypes.shape({
    type: PropTypes.string,
    path: PropTypes.string,
  }),
};

// Debit COLUMN
//------------------------------------------------------------------------------
const DebitColumn = ({rowData: {debit}}) => (
  <div style={debitCellStyle}>{debit}</div>
);

DebitColumn.propTypes = {
  rowData: PropTypes.shape({
    debit: PropTypes.string,
  }),
};

DebitColumn.disableSort = false;
DebitColumn.column = "debit";
DebitColumn.customSortFunc = amountSearch("debit");

// Credit COLUMN
//------------------------------------------------------------------------------
const CreditColumn = ({rowData: {credit}}) => (
  <div style={creditCellStyle}>{credit}</div>
);

CreditColumn.propTypes = {
  rowData: PropTypes.shape({
    credit: PropTypes.string,
  }),
};

CreditColumn.disableSort = false;
CreditColumn.column = "credit";
CreditColumn.customSortFunc = amountSearch("credit");

// RECONCILED COLUMN
//------------------------------------------------------------------------------
const ReconciledColumn = ({rowData: {reconciled}}) =>
  reconciled ? (
    <div className="green-text center-align">
      <CheckCircleIcon />
    </div>
  ) : (
    <div />
  );

ReconciledColumn.columnWidth = 85;

ReconciledColumn.propTypes = {
  rowData: PropTypes.shape({
    reconciled: PropTypes.bool,
  }),
};

// Entry Column
//------------------------------------------------------------------------------
const EntryColumn = ({
  rowData: {entryId = false, path: itemPath, type: itemType},
}) => {
  if (!entryId) {
    return <div />;
  }

  return (
    <ApolloConsumer>
      {(client) => (
        <PopupBtn
          text="Entry"
          onMouseOver={() =>
            client.query({
              query: EntryQuery,
              variables: {entry_id: entryId},
            })
          }
          popupProps={{
            PaperProps: {
              style: {
                width: "75vw",
              },
            },
          }}
        >
          {" "}
          <Entry {...{itemPath, itemType, entry_id: entryId}} />
        </PopupBtn>
      )}
    </ApolloConsumer>
  );
};

EntryColumn.propTypes = {
  rowData: PropTypes.shape({
    entryId: PropTypes.string,
    path: PropTypes.string,
    type: PropTypes.string,
  }),
};

EntryColumn.disableSort = true;
EntryColumn.columnWidth = 75;
EntryColumn.flexGrow = 0;

// Styles
//------------------------------------------------------------------------------
const baseAmount = {
  height: "100%",
  width: "100%",
  padding: ".5em 0.25em",
  flex: "1 0 100%",
  display: "inline-flex",
  placeContent: "center flex-end",
};

const creditCellStyle = Object.assign({}, baseAmount, creditCell, {
  borderWidth: "0 1px 0 2px",
  textAlign: "right",
});
const debitCellStyle = Object.assign({}, baseAmount, debitCell, {
  borderWidth: "0 2px 0 1px",
  textAlign: "right",
});

const styles = (theme) => ({
  root: {
    flexBasis: " 500px",
    minHeight: "250px",
    flex: "auto",
    display: "flex",
    flexDirection: "column",
    height: "calc(100vh - 135px)",
    marginTop: "0.75em",

    ["& .ReactVirtualized__Table__headerColumn:nth-child(10)"]: {
      justifyContent: "center",
    },
  },
  header: {
    padding: `.5em ${theme.spacing(1)}px`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f5f5",
    color: "#546E7A",

    ["& b"]: {
      color: "#607D8B",
    },
  },
  ledgerText: {
    fontSize: "1.75em",
    lineHeight: "1.25em",
    flexGrow: 2,
  },
  chip: {
    backgroundColor: "#fcfcfc",
    border: "1px solid #CFD8DC",
  },
});

export default withStyles(styles)(Ledger);
