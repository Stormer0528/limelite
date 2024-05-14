import {mount, map, route, lazy, compose, redirect, withView} from "navi";
import {View} from "react-navi";

import {titleCase} from "humanize-plus";

import api from "./api";
import IndexView from "./index_view";
import NewView from "./new_view";
import ShowView from "./show_view";
import EditView from "./edit_view";

import Breadcrumb from "./breadcrumb";

const routes = compose(
  withView((request) => <Breadcrumb {...{request}} />),
  mount({
    "/": route({
      title: "<%= @file_name.pluralize.titleize %>",
      getData: () => api.fetch<%= @file_name.singularize.camelize.capitalize %>(),
      view: <IndexView />,
    }),
    /* redirect unmatched paths to bank account index */
    "*": redirect("/<%= @file_name.singularize.underscore %>"),
    "/:<%= @file_name.singularize.underscore %>_id": map(async ({params: {<%= @file_name.singularize.underscore %>_id}}, context) => {
      try {
        const account = await api.fetch<%= @file_name.singularize.camelize.capitalize %>(<%= @file_name.singularize.underscore %>_id);
        return route({
          getTitle: ({params: {<%= @file_name.singularize.underscore %>_id = ""} = {}}) =>
            `LimeLite DS :: ${[
              <%= @file_name.pluralize.titleize %>,
              titleCase(<%= @file_name.singularize.underscore %>_id).replace("-", " "),
            ].join(" › ")}`,
          data: {...context, ...account},
          view: <ShowView />,
        });
      } catch {
        return redirect("/<%= @file_name.tableize %>");
      }
    }),
    "/new": route({
      getTitle: ({params: {account_id = ""} = {}}) =>
        `LimeLite DS :: ${[
          <%= @file_name.pluralize.titleize %>,
          titleCase(<%= @file_name.singularize.underscore %>_id).replace("-", " "),
          "<%= @file_name.pluralize.titleize %>",
          "New",
        ].join(" › ")}`,
      getData: async ({params: {account_id}}, context) =>
        Object.assign({}, {...context}, await api.fetch<%= @file_name.singularize.camelize.capitalize %>(),
      view: <NewView />,
      "/:check_id/edit": route({
        getTitle: ({params: {account_id = ""} = {}}) =>
          `LimeLite DS :: ${[
            <%= @file_name.pluralize.titleize %>,
            titleCase(account_id).replace("-", " "),
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
    }),
  })
);

export default routes;
