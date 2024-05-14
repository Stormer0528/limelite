import {compose} from "redux";
import {connect} from "react-redux";
import CustomerShowView from "./view";

const mapStateToProps = () => ({});
const mapDispatchToProps = (dispatch) => ({
  createStateBtnHandler: (id) => (nextState) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({
      type: "TRANSITION_STATE",
      id,
      nextState,
      modelType: "customer",
      save: true,
    });

    setTimeout(() => {
      window.location.reload();
    }, 250);
  },
});

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  CustomerShowView
);
