import "@storybook/addon-console";
import {addDecorator, addParameters} from "@storybook/react";

import limeliteTheme from "./limelite_theme";
// import {muiTheme} from "storybook-addon-material-ui";
import {INITIAL_VIEWPORTS} from "@storybook/addon-viewport";
// import {siteTheme} from "../app/javascript/utils";

addParameters({
  options: {
    theme: limeliteTheme,
    showRoots: true,
  },
  viewport: {
    viewports: INITIAL_VIEWPORTS,
    defaultViewport: "responsive", // Default
  },
});

// addDecorator(muiTheme([{themeName: "Site Theme", ...siteTheme}]));
