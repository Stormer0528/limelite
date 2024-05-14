import {compose} from "redux";
import {connect} from "react-redux";
import VendorShowView from "./view";

const mapStateToProps = () => ({});
const mapDispatchToProps = (dispatch) => ({
  createStateBtnHandler: (id) => (nextState) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({
      type: "TRANSITION_STATE",
      id,
      nextState,
      modelType: "vendor",
      save: true,
    });

    setTimeout(() => {
      window.location.reload();
    }, 250);
  },
});

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  VendorShowView
);
