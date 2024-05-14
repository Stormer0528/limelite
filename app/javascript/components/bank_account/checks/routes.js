import {mount, route, redirect} from "navi";
import {titleCase} from "humanize-plus";
import api from "../api";
import NewView from "./new_view";
import EditView from "./edit_view";
import ShowView from "./show_view";

const routes = mount({
  "/": redirect(
    ({params: {account_id = ""} = {}}) => `/bank_accounts/${account_id}`
  ),
  "/new": route({
    getTitle: ({params: {account_id = ""} = {}}) =>
      `LimeLite DS :: ${[
        "Bank Accounts",
        titleCase(account_id).replace("-", " "),
        "Checks",
        "New",
      ].join(" › ")}`,
    getData: async ({params: {account_id}}, context) =>
      Object.assign({}, {...context}, await api.fetchBankAccount(account_id)),
    view: <NewView />,
  }),
  "/:check_id": route({
    getTitle: ({params: {account_id = ""} = {}}) =>
      `LimeLite DS :: ${[
        "Bank Accounts",
        titleCase(account_id).replace("-", " "),
        "Checks",
      ].join(" › ")}`,
    getData: async ({params: {account_id, check_id}}, context) =>
      Object.assign(
        {},
        {...context},
        await api.fetchCheck(account_id, check_id)
      ),
    view: <ShowView />,
  }),
  "/:check_id/edit": route({
    getTitle: ({params: {account_id = ""} = {}}) =>
      `LimeLite DS :: ${[
        "Bank Accounts",
        titleCase(account_id).replace("-", " "),
        "Checks",
        "Edit",
      ].join(" › ")}`,
    getData: async ({params: {account_id, check_id}}, context) =>
      Object.assign(
        {},
        {...context},
        await api.fetchCheck(account_id, check_id)
      ),
    view: <EditView />,
  }),
});

export default routes;
