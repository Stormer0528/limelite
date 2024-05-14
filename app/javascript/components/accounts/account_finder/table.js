// Account Finder -->  AccountsTable
import PropTypes from "prop-types";
import {useContext} from "react";
import SearchableTable from "../../searchable_table_infinite/components/table.js";
import {AccountFinderContext} from "./context";

import Button from "@material-ui/core/Button";

const AccountsTable = ({accounts = [], fetchMore = function () {}}) => {
  const state = useContext(AccountFinderContext);

  const handleSelectAccountClick = (account) => () => {
    const {onAccountFinderSelect, currentEntryIndex} = state;
    onAccountFinderSelect({account, currentEntryIndex});
  };

  return (
    <SearchableTable
      fetchMore={fetchMore}
      data={accounts.filter((i) => i)}
      listLength={accounts.length}
      headers={["Code", "Name"]}
      cells={[NumberBtnColumn(handleSelectAccountClick), "name"]}
      height={300}
    />
  );
};

AccountsTable.propTypes = {
  accounts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      number: PropTypes.string,
      path: PropTypes.string,
    })
  ),
  fetchMore: PropTypes.func,
  classes: PropTypes.object,
};

export default AccountsTable;

// Columns
//----------------------------------------------------------------------------------------
const NumberBtnColumn = (handleClick) => ({
  rowData: account,
  rowData: {number, permissions: {view: canView}} = {},
}) => {
  return canView ? (
    <Button color="primary" onClick={handleClick(account)}>
      {number}
    </Button>
  ) : null;
};

NumberBtnColumn.flexGrow = 0;

NumberBtnColumn.propTypes = {
  rowData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    number: PropTypes.string,
    path: PropTypes.string,
  }),
};
