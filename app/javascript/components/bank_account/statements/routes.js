import {mount, route} from "navi";
import {titleCase} from "humanize-plus";
import api from "../api";
import VersionView from "./show_view/version_view";

const routes = mount({
  "/": route({
    getTitle: ({params: {account_id = ""} = {}}) =>
      `LimeLite DS :: ${[
        "Bank Accounts",
        titleCase(account_id).replace("-", " "),
        "Statements",
      ].join(" › ")}`,
    getData: async ({params: {account_id}}, context) =>
      Object.assign({}, {...context}, await api.fetchBankAccount(account_id)),
    getView: () => import("./index_view"),
  }),
  "/:reconciliation_id": route({
    getTitle: ({params: {account_id = "", reconciliation_id} = {}}) =>
      `LimeLite DS :: ${[
        "Bank Accounts",
        titleCase(account_id).replace("-", " "),
        "Statements",
        reconciliation_id,
      ].join(" › ")}`,
    getData: async ({params: {account_id}}, context) =>
      Object.assign({}, {...context}, await api.fetchBankAccount(account_id)),
    getView: () => import("./show_view"),
  }),
  "/:reconciliation_id/new": route({
    getTitle: ({params: {account_id = "", reconciliation_id} = {}}) =>
      `LimeLite DS :: ${[
        "Bank Accounts",
        titleCase(account_id).replace("-", " "),
        "Statements",
        reconciliation_id,
      ].join(" › ")}`,
    getData: async ({params: {account_id}}, context) =>
      Object.assign({}, {...context}, await api.fetchBankAccount(account_id)),
    getView: () => import("./show_view"),
  }),
  "/:reconciliation_id/edit": route({
    getTitle: ({params: {account_id = "", reconciliation_id} = {}}) =>
      `LimeLite DS :: ${[
        "Bank Accounts",
        titleCase(account_id).replace("-", " "),
        "Statements",
        reconciliation_id,
      ].join(" › ")}`,
    getData: async ({params: {account_id}}, context) =>
      Object.assign({}, {...context}, await api.fetchBankAccount(account_id)),
    getView: () => import("./show_view"),
  }),
  "/:reconciliation_id/version/:version_id": route({
    getTitle: ({params: {account_id = "", reconciliation_id} = {}}) =>
      `LimeLite DS :: ${[
        "Bank Accounts",
        titleCase(account_id).replace("-", " "),
        "Statements",
        reconciliation_id,
      ].join(" › ")}`,
    getData: async ({params, params: {account_id}}, context) =>
      Object.assign(
        {},
        {...context, ...params},
        await api.fetchBankAccount(account_id)
      ),
    view: <VersionView />,
  }),
});

export default routes;
