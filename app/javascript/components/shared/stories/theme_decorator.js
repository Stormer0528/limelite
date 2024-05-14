import {Fragment} from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import {createTheme} from "@material-ui/core/styles";
import {ThemeProvider} from "@material-ui/styles";
import siteTheme from "../themes/site_theme";

export default function (storyFunc) {
  return <ThemeProvider theme={createTheme()}>{storyFunc()}</ThemeProvider>;
}

export function SiteThemeProvider(storyFunc) {
  return <ThemeProvider theme={siteTheme}>{storyFunc()}</ThemeProvider>;
}

export function CSSBaseline(storyFunc) {
  return (
    <Fragment>
      <CssBaseline />
      {storyFunc()}
    </Fragment>
  );
}
