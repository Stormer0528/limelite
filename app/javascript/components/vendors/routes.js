import {mount, route, compose} from "navi";
import {titleCase} from "humanize-plus";

import api from "./api";
import IndexView from "./index";
import ShowView from "./show_view";

const routes = compose(
  mount({
    "/": route({
      title: "LimeLite DS :: Vendors",
      getData: () => api.fetchVendors(),
      view: <IndexView />,
    }),
    "/:vendor_id": route({
      getTitle: ({params: {vendor_id = ""} = {}}) =>
        `LimeLite DS :: ${[
          "Vendors",
          titleCase(vendor_id).replace("-", " "),
        ].join(" › ")}`,
      getData: async ({params: {vendor_id}}, context) =>
        Object.assign({}, {...context}, await api.fetchVendor(vendor_id)),
      view: ShowView,
    }),
  })
);

export default routes;
