import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import IndexPage from "./index_view";
import ShowPage from "./show_view";
import StatementIndexPage from "./statements/index_view";
import StatementShowPage from "./statements/show_view";

const BankAccountRouter = () => {
  return (
    <Router basename="/bank_accounts">
      <Switch>
        <Route
          path="/:account_id/reconciliations/:statement_id"
          component={StatementShowPage}
        />
        <Route
          path="/:account_id/statements/:statement_id"
          component={StatementShowPage}
        />
        <Route
          path="/:account_id/reconciliations"
          component={StatementIndexPage}
        />
        <Route path="/:account_id/statements" component={StatementIndexPage} />
        <Route path="/:account_id" component={ShowPage} />
        <Route exact path="/" component={IndexPage} />
      </Switch>
    </Router>
  );
};

export default BankAccountRouter;
