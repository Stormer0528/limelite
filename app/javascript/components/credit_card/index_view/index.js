import PropTypes from "prop-types";
import {useQuery} from "@apollo/react-hooks";
import FETCH_CREDIT_CARDS_QUERY from "@graphql/queries/credit_cards.gql";

// Components
//------------------------------------------------------------------------------
import Paper from "@material-ui/core/Paper";
import SearchableTable from "../../searchable_table/searchable_table";
import RouterLinkRenderer from "../../searchable_table/components/defaults/router_link_renderer";
import Fab from "./fab";

const IndexPage = () => {
  const {loading, data: {creditCards = []} = {}} = useQuery(
    FETCH_CREDIT_CARDS_QUERY
  );

  if (loading) {
    return null;
  }

  return (
    <Paper>
      <SearchableTable
        storeKey={"credit_account_show_index"}
        data={creditCards}
        headers={["Number", "Name", "Balance", "Last Reconciled"]}
        cells={[
          "number",
          RouterLinkRenderer("name", "slug"),
          "balance",
          "lastReconciledDate",
        ]}
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
      started_at: PropTypes.string,
      ended_at: PropTypes.string,
      path: PropTypes.string,
      edit_path: PropTypes.string,
      delete_path: PropTypes.string,
    })
  ),
};

export default IndexPage;
