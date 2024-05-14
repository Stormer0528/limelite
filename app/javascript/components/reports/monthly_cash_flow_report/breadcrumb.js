// import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";

import {Link} from "react-router-dom";

const Breadcrumb = () => {
  return (
    <div className="alt-breadcrumb">
      <h2 className="page-header">
        <i className="material-icons medium">assignment</i>
        <span className="text">
          <Link className="breadcrumb primary" to="/">
            {" "}
            Reports{" "}
          </Link>
          <Link to="/monthly-cash-flow-report" className="breadcrumb">
            <span className="link-text">Monthly Cash Flow Report</span>
          </Link>
        </span>
      </h2>
    </div>
  );
};

const styles = theme => ({});

export default withStyles(styles)(Breadcrumb);
