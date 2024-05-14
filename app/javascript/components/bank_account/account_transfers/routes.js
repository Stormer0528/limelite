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
        "Account Transfers",
        "New",
      ].join(" › ")}`,
    getData: async ({params: {account_id}}, context) =>
      Object.assign({}, {...context}, await api.fetchBankAccount(account_id)),
    view: <NewView />,
  }),
  "/:account_transfer_id": route({
    getTitle: ({params: {account_id = ""} = {}}) =>
      `LimeLite DS :: ${[
        "Bank Accounts",
        titleCase(account_id).replace("-", " "),
        "Account Transfers",
      ].join(" › ")}`,
    getData: async ({params: {account_id, account_transfer_id}}, context) => {
      return Object.assign(
        {},
        {...context},
        await api.fetchAccountTransfer(account_id, account_transfer_id)
      );
    },
    view: <ShowView />,
  }),
  "/:account_transfer_id/edit": route({
    getTitle: ({params: {account_id = ""} = {}}) =>
      `LimeLite DS :: ${[
        "Bank Accounts",
        titleCase(account_id).replace("-", " "),
        "Account Transfers",
        "Edit",
      ].join(" › ")}`,
    getData: async ({params: {account_id, account_transfer_id}}, context) =>
      Object.assign(
        {},
        {...context},
        await api.fetchAccountTransfer(account_id, account_transfer_id)
      ),
    view: <EditView />,
  }),
});

export default routes;
