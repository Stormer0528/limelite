import {mount, map, route, lazy, compose, redirect, withView} from "navi";
import {View} from "react-navi";

import {titleCase} from "humanize-plus";

import api from "./api";
import IndexPage from "./index_view";
import ShowPage from "./show_view";
import PrintView from "./print_checks_view/index";
import Breadcrumb from "./breadcrumb2";

import DateWrapper from "../shared/date_wrapper";
import ThemeWrapper from "../shared/theme_wrapper";

const routes = compose(
  withView(() => DateWrapper(View)),
  withView(() => ThemeWrapper(View)),
  withView((request) => <Breadcrumb {...{request}} />),
  mount({
    "/": route({
      title: "Bank Accounts",
      getData: () => api.fetchBankAccounts(),
      view: <IndexPage />,
    }),
    /* redirect unmatched paths to bank account index */
    "*": redirect("/bank_accounts"),
    "/:account_id": map(async ({params: {account_id}}, context) => {
      try {
        const account = await api.fetchBankAccount(account_id);
        return route({
          getTitle: ({params: {account_id = ""} = {}}) =>
            `LimeLite DS :: ${[
              "Bank Accounts",
              titleCase(account_id).replace("-", " "),
            ].join(" › ")}`,
          data: {...context, ...account},
          view: <ShowPage />,
        });
      } catch {
        return redirect("/bank_accounts");
      }
    }),
    "/:account_id/print-checks": map(
      async ({params: {account_id}}, context) => {
        try {
          const account = await api.fetchBankAccountChecks(account_id);
          return route({
            getTitle: ({params: {account_id = ""} = {}}) =>
              `LimeLite DS :: ${[
                "Bank Accounts",
                titleCase(account_id).replace("-", " "),
                "Print Checks",
              ].join(" › ")}`,
            data: {...context, ...account},
            view: <PrintView />,
          });
        } catch {
          return redirect("/bank_accounts");
        }
      }
    ),

    // Reconciliations
    //--------------------------------------------------------------------------
    "/:account_id/reconciliations": lazy(() => import("./statements/routes")),

    // Checks
    //--------------------------------------------------------------------------
    "/:account_id/checks": lazy(() => import("./checks/routes")),

    // Deposits
    //--------------------------------------------------------------------------
    "/:account_id/deposits": lazy(() => import("./deposits/routes")),

    // Account Transfers
    //--------------------------------------------------------------------------
    "/:account_id/account_transfers": lazy(() =>
      import("./account_transfers/routes")
    ),
  })
);

export default routes;
