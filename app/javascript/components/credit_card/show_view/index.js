// import PropTypes from "prop-types";
// import {Redirect} from "react-router-dom";
import {useParams} from "react-router-dom";

import {useQuery} from "@apollo/react-hooks";
import LOAD_CREDIT_CARD_QUERY from "@graphql/queries/load_credit_card.gql";

// Components
// ------------------------------------------------------------------------------
import Breadcrumb from "../breadcrumb";
import AccountStatus from "./account_status";
import NavLinks from "./navlinks";
import Ledger from "./ledger_container";
import Fab from "./fab";

import {Helmet} from "react-helmet";

function ShowPage() {
  const {account_id} = useParams();

  const {
    data: {
      accounts = [],
      account = {},
      account: {name, permissions: {show = false} = {}} = {},
    } = {},
    loading,
  } = useQuery(LOAD_CREDIT_CARD_QUERY, {
    variables: {slug: account_id},
  });

  if (loading) {
    return null;
  }

  return (
    <section className="CreditCardShow">
      <Helmet>
        <title>{`LimeLite DS :: Credit Cards > ${name || ""}`}</title>
      </Helmet>
      <Breadcrumb />
      <NavLinks account_id={account_id} />
      <AccountStatus
        {...{
          account,
          accounts,
        }}
      />
      <div style={{height: ".5rem"}} />
      <Ledger storeKey={`account_show-${account.id}`} account={account} />
      <Fab account_id={account_id} />
    </section>
  );
}

export default ShowPage;
