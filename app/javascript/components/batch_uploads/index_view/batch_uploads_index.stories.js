import {
  CSSBaseline,
  SiteThemeProvider,
} from "../../shared/stories/theme_decorator";
import withApollo from "../../shared/stories/apollo_decorator";
// import {withKnobs, select, number} from "@storybook/addon-knobs";
// import {action} from "@storybook/addon-actions";
import {Formik} from "formik";
import BatchUploadIndexView from "./index";

export default {
  component: BatchUploadIndexView,
  title: "Batch Uploads/Index",
  decorators: [CSSBaseline, withApollo, SiteThemeProvider],
};

export const IndexView = () => {
  return (
    <Formik
      initialValues={{
        aasmState: ["needs_approval"],
      }}
    >
      {({values: {aasmState, ...restVars} = {}}) => {
        return <BatchUploadIndexView batchUploads={batchUploads} />;
      }}
    </Formik>
  );
};

const batchUploads = [];
