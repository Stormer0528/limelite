import {
  CSSBaseline,
  SiteThemeProvider,
} from "../../shared/stories/theme_decorator";
import withApollo from "../../shared/stories/apollo_decorator";
// import {withKnobs, select, number} from "@storybook/addon-knobs";
// import {action} from "@storybook/addon-actions";

import UserGroups from "../groups";

export default {
  component: UserGroups,
  title: "Admin/Users",
  decorators: [CSSBaseline, withApollo, SiteThemeProvider],
};

export const GroupEditor = () => {
  return <UserGroups tree={treeData} />;
};

export const treeData = {
  name: "Admin",
  permissions: "Edit/Approve",
  id: 1,
  children: [
    {
      name: "Back Office",
      permissions: "Edit/Approve",
      id: 2,
      children: [
        {
          name: "Teaching Administrator",
          permissions: "Approval Only",
          id: 5,
          children: [
            {
              name: "Teachers",
              permissions: "Create/Approve Own",
              id: 1,
              children: [
                {
                  name: "Teaching Assistant",
                  permissions: "Edit/Approve",
                  id: 1,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "Front Office",
      permissions: "Edit/Approve",
      id: 2,
      children: [{}, {}],
    },
    {
      name: "Accounts Payable (AP)",
      permissions: "Edit/Approve",
      id: 2,
      children: [{}, {}],
    },
  ],
};
