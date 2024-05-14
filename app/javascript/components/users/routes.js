import {mount, map, route, lazy, compose, redirect, withView} from "navi";
import {View} from "react-navi";

// import {titleCase} from "humanize-plus";

// import api from "./api";
import ShowView from "./show_view";
// import IndexView from "./index_view";
// import NewView from "./new_view";
// import EditView from "./edit_view";

import Breadcrumb from "./breadcrumb";

const routes = compose(
  withView((request) => <Breadcrumb {...{request}} />),
  mount({
    "/": route({
      title: "User Profile",
      view: <ShowView />,
      // getData: () => api.fetchCurrentUser(),
    }),
  })
);

export default routes;
