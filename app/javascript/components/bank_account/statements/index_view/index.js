// import {connect} from "react-redux";
import {compose} from "redux";
import {render} from "react-dom";

import {lifecycle} from "recompose";
import Breadcrumb from "../../breadcrumb";

// Components
//------------------------------------------------------------------------------
import View from "./view";

export default compose(
  lifecycle({
    componentDidMount() {
      const {account: {name, slug} = {}} = this.props;
      const header = document.querySelector(".alt-breadcrumb");
      render(
        <Breadcrumb
          path={[
            {text: name, path: `/bank_accounts/${slug}/`},
            {
              text: "Reconciliations",
              path: `/bank_accounts/${slug}/reconciliations`,
            },
          ]}
        />,
        header
      );
    },
  })
)(View);
