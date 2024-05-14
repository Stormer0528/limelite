import PropTypes from "prop-types";
import {Link} from "react-navi";

const EmptyMessage = ({new_path}) => {
  return (
    <div className="well empty-message center-align">
      <h4>There Are No Reconciliations For This Account</h4>
      <p>
        <Link
          href={new_path}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <i className="material-icons">add</i>
          {"  "}
          Create a new reconciliation
        </Link>
      </p>
    </div>
  );
};

EmptyMessage.propTypes = {
  new_path: PropTypes.string,
};

export default EmptyMessage;
