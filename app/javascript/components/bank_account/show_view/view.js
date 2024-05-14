import PropTypes from "prop-types";

// Components
//------------------------------------------------------------------------------
import AccountStatus from "./account_status";
import NavLinks from "./navlinks";
import Ledger from "./ledger_container";
import Fab from "./fab";
import {useCurrentRoute} from "react-navi";

const ShowPage = () => {
  const {
    data: {
      bank_account = {},
      bank_account: {
        slug: account_id,
        permissions: accountPermissions = {},
      } = {},
      bank_accounts: accounts = [],
      permissions = {},
    } = {},
  } = useCurrentRoute();

  const combinedPermissions = Object.assign({}, permissions, {
    bank_account: accountPermissions,
  });

  return (
    <section className="BankAccountShow">
      <NavLinks {...{account_id, permissions: accountPermissions}} />
      <AccountStatus {...{accounts, bank_account}} />
      <Ledger
        {...{account: bank_account, bank_account}}
        storeKey={`account_show-${account_id}`}
      />{" "}
      <Fab {...{account_id, permissions: combinedPermissions}} />
    </section>
  );
};

ShowPage.propTypes = {
  accounts: PropTypes.array,
  bank_account: PropTypes.shape({
    slug: PropTypes.string,
    number: PropTypes.string,
    description: PropTypes.string,
    startedAt: PropTypes.string,
    endedAt: PropTypes.string,
    edpNumber: PropTypes.string,
    pseudo: PropTypes.string,
    accountObject: PropTypes.shape({
      code: PropTypes.string,
      name: PropTypes.string,
    }),
  }),
};

export default ShowPage;
