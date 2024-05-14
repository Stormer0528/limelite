import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import IndexPage from "./index_view";
import ShowPage from "./show_view";

import StatementIndexPage from "./statements/index_view";
import StatementShowPage from "./statements/show_view";
import StatementVersionPage from "./statements/show_view/version_view";

import ChargeRoutes from "./charges/router";
import PaymentRoutes from "./payments/router";

const CreditCardRouter = () => {
  return (
    <Router basename="/credit_cards">
      <Switch>
        {/* Charges */}
        <Route path="/:account_id/charges">
          <ChargeRoutes />
        </Route>

        {/* Payments */}
        <Route path="/:account_id/payments">
          <PaymentRoutes />
        </Route>

        {/* Reconciliations */}
        <Route exact path="/:account_id/reconciliations/:statement_id">
          <StatementShowPage />
        </Route>

        <Route path="/:account_id/reconciliations/:statement_id/version/:version_id">
          <StatementVersionPage />
        </Route>

        <Route path="/:account_id/reconciliations/:statement_id/edit">
          <StatementShowPage />
        </Route>

        <Route path="/:account_id/reconciliations">
          <StatementIndexPage />
        </Route>

        {/* CreditCards */}
        <Route path="/:account_id">
          <ShowPage />
        </Route>

        <Route exact path="/">
          <IndexPage />
        </Route>
      </Switch>
    </Router>
  );
};

export default CreditCardRouter;
