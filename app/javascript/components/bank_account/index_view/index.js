import PropTypes from "prop-types";
import {Helmet} from "react-helmet-async";

// Components
//------------------------------------------------------------------------------
import Paper from "@material-ui/core/Paper";
import Fab from "./fab";
import SearchableTable from "../../searchable_table/searchable_table";
import {Link, useCurrentRoute} from "react-navi";

const IndexPage = () => {
  const {
    data: {bank_accounts = []},
  } = useCurrentRoute();

  return (
    <Paper>
      <Helmet>
        <title>LimeLite DS :: Bank Accounts</title>
      </Helmet>

      <SearchableTable
        data={bank_accounts}
        storeKey={"account_index"}
        headers={["Account Number", "Name", "Last Reconciled"]}
        cells={["number", LinkRow, "lastReconciledDate"]}
      />
      <Fab />
    </Paper>
  );
};

IndexPage.propTypes = {
  accounts: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      number: PropTypes.string,
      startedAt: PropTypes.string,
      endedAt: PropTypes.string,
      path: PropTypes.string,
    })
  ),
};

export default IndexPage;

const LinkRow = ({rowData: {name, path = ""}}) => (
  <Link href={path}>{name}</Link>
);
LinkRow.propTypes = {
  rowData: PropTypes.shape({
    name: PropTypes.string,
    path: PropTypes.string,
  }),
};
