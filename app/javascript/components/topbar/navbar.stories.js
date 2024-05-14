import {withKnobs, text, number} from "@storybook/addon-knobs";
import {
  SiteThemeProvider,
  CSSBaseline,
} from "../shared/stories/theme_decorator";

import AppBar from "./index";
import Layout from ".";

import HeaderImg from "../../../assets/images/LOGO-1.png";
import {setupApolloClient} from "../../utils";
import DateFnsUtils from "@date-io/date-fns";
import MuiPickersUtilsProvider from "material-ui-pickers/MuiPickersUtilsProvider";
import {ApolloProvider} from "react-apollo";
import Skeleton from "@material-ui/lab/Skeleton";

// Redux
import {Provider} from "react-redux";
import NotificationsStore, {
  defaultState as defaultNotificationsState,
} from "../../reducers/notifications_reducer";

// Rematch
import {init} from "@rematch/core";

// Models
import entryModel from "../../reducers/models/entries/entry.model";

const client = setupApolloClient();

export default {
  component: AppBar,
  title: "Layout/AppBar",
  decorators: [
    withKnobs,
    SiteThemeProvider,
    CSSBaseline,
    (storyFn) => (
      <ApolloProvider client={client}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Provider store={store}>{storyFn()}</Provider>
        </MuiPickersUtilsProvider>
      </ApolloProvider>
    ),
  ],
};

// Set up rematch
const store = init({
  models: {
    entry: entryModel,
  },
  redux: {
    reducers: {
      notifications: NotificationsStore,
    },
  },
});

const defaultProps = {
  title: text("Organization Name", "Organization Name"),
  logoPath: HeaderImg,
  earliestFiscalYear: 2016,
  fiscalYear: number("Fiscal Year", 2019, {
    range: true,
    min: 2016,
    max: 2020,
    step: 1,
  }),
  latestFiscalYear: 2020,
};

const Content = () => {
  return (
    <section style={{padding: "1em"}}>
      <h2>Page Content</h2>
      <Skeleton variant="text" animation="wave" />
      <Skeleton variant="text" animation="wave" />

      <Skeleton variant="rect" height={128} />
      <Skeleton />
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
    </section>
  );
};

export const appBar = () => <AppBar {...defaultProps} />;
export const advandedLayout = () => (
  <Layout {...defaultProps}>
    <Content />
  </Layout>
);
