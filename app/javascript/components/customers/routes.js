import {mount, route, compose} from "navi";
import {titleCase} from "humanize-plus";

import api from "./api";
import IndexView from "./index";
import ShowView from "./show_view";

const routes = compose(
  mount({
    "/": route({
      title: "LimeLite DS :: Customers",
      getData: () => api.fetchVendors(),
      view: <IndexView />,
    }),
    "/:customer_id": route({
      getTitle: ({params: {customer_id = ""} = {}}) =>
        `LimeLite DS :: ${[
          "Customers",
          titleCase(customer_id).replace("-", " "),
        ].join(" › ")}`,
      getData: async ({params: {customer_id}}, context) => {
        return Object.assign(
          {},
          {...context},
          await api.fetchCustomer(customer_id)
        );
      },
      view: <ShowView />,
    }),
  })
);

export default routes;
