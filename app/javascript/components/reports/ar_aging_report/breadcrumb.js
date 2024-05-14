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
          <Link to="/ar-aging-report" className="breadcrumb">
            <span className="link-text">A/R Aging Report</span>
          </Link>
        </span>
      </h2>
    </div>
  );
};

const styles = theme => ({});

export default withStyles(styles)(Breadcrumb);
