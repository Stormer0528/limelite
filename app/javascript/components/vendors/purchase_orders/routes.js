import {mount, route, compose, withView, redirect /*map, lazy,*/} from "navi";
import {View} from "react-navi";
import {titleCase} from "humanize-plus";

import DateWrapper from "../../shared/date_wrapper";
import Breadcrumb from "./breadcrumb";

// import IndexView from "./index_view";
import EditView from "./edit_view";
import ShowView from "./show_view";
import NewView from "./new_view";

import API from "./api";

const routes = compose(
  withView(() => DateWrapper(View)),
  withView((request) => <Breadcrumb {...{request}} />),
  mount({
    /* this is the right way to do it, but navi won't update page onClick ... so doing in react until fixed*/
    // "/": redirect(({params: {vendor_id}}) => {
    //   return {pathname: `/vendors/${vendor_id}`, hash: "#purchase-orders"};
    // }),
    /* redirect unmatched paths to vendor#purchase-orders */
    "*": redirect(({params: {vendor_id}}) => {
      return {pathname: `/vendors/${vendor_id}`, hash: "#purchase-orders"};
    }),
    "/new": route({
      getTitle: ({params: {vendor_id = ""} = {}}) =>
        `LimeLite DS :: ${[
          "Vendors",
          titleCase(vendor_id).replace("-", " "),
          "Purchase Orders",
          "New",
        ].join(" › ")}`,
      getData: async ({params: {vendor_id}}, context) => {
        const vendor = await API.fetchVendor(vendor_id);
        return {...context, ...vendor};
      },
      view: <NewView />,
    }),
    "/:purchase_order_id": route({
      getTitle: ({params: {vendor_id = "", purchase_order_id = ""} = {}}) =>
        `LimeLite DS :: ${[
          "Vendors",
          titleCase(vendor_id).replace("-", " "),
          "Purchase Orders",
          titleCase(purchase_order_id).replace("-", " "),
        ].join(" › ")}`,
      getData: async ({params}, context) => {
        const vendor = await API.fetchPurchaseOrder(params);
        return {...context, ...vendor};
      },
      view: <ShowView />,
    }),
    "/:purchase_order_id/edit": route({
      getTitle: ({params: {vendor_id = "", purchase_order_id = ""} = {}}) =>
        `LimeLite DS :: ${[
          "Vendors",
          titleCase(vendor_id).replace("-", " "),
          "Purchase Orders",
          titleCase(purchase_order_id).replace("-", " "),
          "Edit",
        ].join(" › ")}`,
      getData: async ({params}, context) => {
        const vendor = await API.fetchPurchaseOrder(params);
        return {...context, ...vendor};
      },
      view: <EditView />,
    }),
  })
);

export default routes;
