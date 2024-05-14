/* eslint-disable react/display-name */
import {MuiThemeProvider} from "@material-ui/core/styles";
import siteTheme from "./themes/site_theme";

const ThemeWrapper = (Component) => (props) => {
  return (
    <MuiThemeProvider theme={siteTheme}>
      <Component {...props} />
    </MuiThemeProvider>
  );
};

ThemeWrapper.displayName = "ThemeWrapper";

export default ThemeWrapper;
