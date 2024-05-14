import {
  BrowserRouter as Router,
  Switch,
  Route,
  useRouteMatch,
} from "react-router-dom";

import ShowView from "./show_view";
import NewView from "./new_view";
import EditView from "./edit_view";

const CreditCardRouter = () => {
  let {
    path,
    params: {account_id},
  } = useRouteMatch();

  return (
    <Router basename="/credit_cards">
      <Switch>
        <Route path={`${path}/new`} component={NewView} />
        <Route path={`${path}/:id/edit`} component={EditView} />
        <Route path={`${path}/:id`} component={ShowView} />

        {/* Redirect index to CreditCard#show */}
        <Route path="/">
          <HardRedirect account_id={account_id} />
        </Route>
      </Switch>
    </Router>
  );
};

export default CreditCardRouter;

// Because a regular Redirect won't work ...
const HardRedirect = ({account_id}) => {
  window.location = `/credit_cards/${account_id}`;
  return null;
};
