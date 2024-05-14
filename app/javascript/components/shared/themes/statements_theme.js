import {createTheme} from "@material-ui/core/styles";
import {siteTheme} from "../../../utils";
import newSiteTheme from "./site_theme";
import {blueGrey, amber, red} from "@material-ui/core/colors";

export default createTheme(
  {
    palette: {
      primary: blueGrey,
      secondary: amber,
      error: red,
    },
  },
  newSiteTheme,
  siteTheme
);
