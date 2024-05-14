import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import {styles} from "../../bank_account/show_view/navlinks";

// MUI
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";

// Icons
import ListIcon from "@material-ui/icons/List";
import ExportIcon from "@material-ui/icons/AssignmentReturned";

const NavLinks = ({classes = {}, className = "", exportPath = "", ...rest}) => {
  return (
    <Breadcrumbs
      separator="|"
      arial-label="Breadcrumb"
      className={`${classes.navlinks} ${className}`}
      {...rest}
    >
      <Link
        component={Button}
        href={"/reconciliations"}
        className={classes.linkButton}
      >
        <ListIcon className={classes.icon} />
        Reconciliations
      </Link>

      <Link
        component={Button}
        href={exportPath}
        target="_blank"
        className={classes.linkButton}
      >
        <ExportIcon className={classes.icon} />
        Export
      </Link>
    </Breadcrumbs>
  );
};

NavLinks.propTypes = {
  account_id: PropTypes.string,
  persisted: PropTypes.bool,
  account: PropTypes.object,
  permissions: PropTypes.shape({
    edit: PropTypes.bool,
  }),
  statement_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  exportPath: PropTypes.string,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavLinks);
