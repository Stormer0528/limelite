// Imports
//------------------------------------------------------------------------------
import {render} from "react-dom";
import FilestackUploadBtn from "../components/shared/filestack_upload_btn";
import FilestackSaveBtn from "../components/vendors/vendor_file_save_btn";
import FilestackImageUploadBtn from "../components/shared/filestack_image_upload_btn";

import {setupApolloClient} from "../utils";

// Apollo
import {ApolloProvider} from "react-apollo";

// HMR
import {AppContainer} from "react-hot-loader";

import {
  StylesProvider,
  createGenerateClassName,
} from "@material-ui/core/styles";

const generateClassName = createGenerateClassName({
  productionPrefix: "filestack-btn",
  seed: ["filestack-btn", Math.random()].join("-"),
});

const generateClassName1 = createGenerateClassName({
  productionPrefix: "filestack-upload-btn",
  seed: ["filestack-upload-btn", Math.random()].join("-"),
});

const generateClassName2 = createGenerateClassName({
  productionPrefix: "filestack-image-btn",
  seed: ["filestack-image-btn", Math.random()].join("-"),
});

// Render Components
//------------------------------------------------------------------------------
const client = setupApolloClient();

const renderComponent = (Component) => {
  const elems = document.getElementsByClassName("filestack-btn");
  Array.from(elems).forEach((elem) => {
    const {policy, signature} = elem.dataset;
    // Render Advanced Editor
    render(
      <AppContainer>
        <ApolloProvider client={client}>
          <StylesProvider generateClassName={generateClassName}>
            <Component {...elem.dataset} security={{policy, signature}} />
          </StylesProvider>
        </ApolloProvider>
      </AppContainer>,
      elem
    );
  });
};

const renderUploadComponent = (Component) => {
  const elems = document.getElementsByClassName("filestack-upload-btn");
  Array.from(elems).forEach((elem) => {
    const {policy, signature} = elem.dataset;
    if (elem) {
      // Render Advanced Editor
      render(
        <AppContainer>
          <ApolloProvider client={client}>
            <StylesProvider generateClassName={generateClassName1}>
              <Component {...elem.dataset} security={{policy, signature}} />
            </StylesProvider>
          </ApolloProvider>
        </AppContainer>,
        elem
      );
    }
  });
};

const renderAvatarComponent = (Component) => {
  const elems = document.getElementsByClassName("filestack-image-btn");

  Array.from(elems).forEach((elem) => {
    const {policy, signature} = elem.dataset;

    if (elem) {
      // Render Advanced Editor
      render(
        <AppContainer>
          <StylesProvider generateClassName={generateClassName2}>
            <Component {...elem.dataset} security={{policy, signature}} />
          </StylesProvider>
        </AppContainer>,
        elem
      );
    }
  });
};

// Render Component when ready
document.addEventListener("DOMContentLoaded", () => {
  renderComponent(FilestackUploadBtn);
  renderAvatarComponent(FilestackImageUploadBtn);
  renderUploadComponent(FilestackSaveBtn);
});

window.renderFilestackBtnComponent = () => renderComponent(FilestackUploadBtn);

// Update from HMR Calls
if (module.hot) {
  module.hot.accept("../components/shared/filestack_upload_btn", () => {
    renderComponent(FilestackUploadBtn);
  });
  module.hot.accept("../components/shared/filestack_image_upload_btn", () => {
    renderAvatarComponent(FilestackImageUploadBtn);
  });
  module.hot.accept("../components/vendors/vendor_file_save_btn", () => {
    renderUploadComponent(FilestackSaveBtn);
  });
}
