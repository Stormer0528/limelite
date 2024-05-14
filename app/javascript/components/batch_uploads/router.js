import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import IndexView from "./index_view";
import ApproveView from "./approve_view";
import EditView from "./edit_view";
import NewView from "./new_view";

const CreditCardRouter = () => {
  return (
    <Router basename="/batch_uploads">
      <Switch>
        <Route path="/:account_id/approve">
          <ApproveView />
        </Route>

        <Route path="/new">
          <NewView />
        </Route>

        <Route path="/:account_id/edit">
          <EditView />
        </Route>
        <Route path="/:account_id">
          <EditView />
        </Route>

        <Route exact path="/">
          <IndexView />
        </Route>
      </Switch>
    </Router>
  );
};

export default CreditCardRouter;
