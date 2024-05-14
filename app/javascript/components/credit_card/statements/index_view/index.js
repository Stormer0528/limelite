import PropTypes from "prop-types";
import clsx from "clsx";
import {withStyles} from "@material-ui/core/styles";

import {useParams} from "react-router-dom";
import {useQuery} from "@apollo/react-hooks";

import CREDIT_CARD_QUERY from "@graphql/queries/load_credit_card.gql";

// Components
//------------------------------------------------------------------------------

import NavLinks from "./navlinks";
import AccountStatus from "../../show_view/account_status";
import Spacer from "../../../page_elements/spacer";
import Statements from "./statements_container";
import Fab from "./fab";
import Breadcrumb from "../../breadcrumb";
import {Helmet} from "react-helmet";

const IndexView = ({classes = {}}) => {
  const {account_id: slug} = useParams();

  const {
    loading,
    data: {accounts = [], account = {}} = {},
  } = useQuery(CREDIT_CARD_QUERY, {variables: {slug}});

  if (loading) {
    return null;
  }

  return (
    <section className={clsx("CreditCard--StatementsIndex", classes.root)}>
      <Helmet>
        <title>{`LimeLite DS :: Credit Cards > ${
          slug || ""
        } > Reconciliations`}</title>
      </Helmet>
      <Breadcrumb />
      <NavLinks account={account} />
      <AccountStatus
        {...{
          account,
          accounts,
          handleChange: updateCurrentPage,
        }}
      />

      <Spacer />
      <Statements slug={slug} />

      <Fab account_id={slug} />
    </section>
  );
};

IndexView.propTypes = {
  classes: PropTypes.object,
};

const styles = () => ({
  root: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
});

export default withStyles(styles)(IndexView);

function updateCurrentPage({target: {value: id}}) {
  window.location = `/credit_cards/${id}/reconciliations`;
}
