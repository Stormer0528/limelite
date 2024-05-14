import {mount, route, compose, redirect, withView} from "navi";
import Breadcrumb from "./breadcrumb";
import {View} from "react-navi";

// import api from "./api";
import IndexView from "./index_view";
import ShowView from "./show_view";
// import Breadcrumb from "./breadcrumb2";

import DateWrapper from "../shared/date_wrapper";
import ThemeWrapper from "../shared/theme_wrapper";

const routes = compose(
  withView(() => DateWrapper(View)),
  withView((request) => <Breadcrumb {...{request}} />),
  mount({
    "/": route({
      title: "Reconciliations",
      // getData: () => api.fetchBankAccounts(),
      view: <IndexView />,
    }),
    "/:reconciliationId": route({
      getTitle: ({params: {reconciliationId} = {}}) =>
        `LimeLite DS :: ${["Reconciliations", reconciliationId].join(" › ")}`,
      getData: ({params}) => {
        return {...params};
      },
      view: <ShowView />,
    }),
    /* redirect unmatched paths to index */
    "*": redirect("/reconciliations"),
  })
);

export default routes;
