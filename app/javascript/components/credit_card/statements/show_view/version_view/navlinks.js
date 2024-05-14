/**
 * CreditCard/Stateemnt Version#show_view Navlinks
 *  -- Links from a version view for a Credit Card statement
 */

import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import {styles} from "../../../show_view/navlinks";
import CustomNavLink from "@shared/nav_button_link";
import NormalNavLink from "@shared/navi_button_link";

// MUI
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";

// Icons
import CardIcon from "@shared/icons/credit_card_icon";
import ListIcon from "@material-ui/icons/List";
import ReconciliationsIcon from "@shared/icons/reconciliation_icon";
import ExportIcon from "@material-ui/icons/AssignmentReturned";

const NavLinks = ({
  account_id,
  statement_id,
  permissions: {edit: canEdit = false},
  classes = {},
  ...rest
}) => {
  return (
    <Breadcrumbs
      separator="|"
      arial-label="Breadcrumb"
      className={`${classes.navlinks}`}
      {...rest}
    >
      <Link
        component={CustomNavLink}
        prefetch
        to="/"
        className={classes.linkButton}
      >
        <ListIcon className={classes.icon} />
        All Accounts
      </Link>
      <Link
        component={CustomNavLink}
        to={`/${account_id}`}
        className={classes.linkButton}
      >
        <CardIcon className={classes.icon} />
        Account
      </Link>
      <Link
        component={CustomNavLink}
        to={`/${account_id}/reconciliations`}
        className={classes.linkButton}
      >
        <ListIcon className={classes.icon} />
        Reconciliations
      </Link>
      {statement_id && canEdit && (
        <Link
          component={CustomNavLink}
          to={`/${account_id}/reconciliations/${statement_id}`}
          className={classes.linkButton}
        >
          <ReconciliationsIcon className={classes.icon} />
          Reconciliation
        </Link>
      )}
      {statement_id && (
        <Link
          component={NormalNavLink}
          href={`${window.location.pathname}/export.xlsx`}
          target="_blank"
          className={classes.linkButton}
        >
          <ExportIcon className={classes.icon} />
          Export
        </Link>
      )}
    </Breadcrumbs>
  );
};

NavLinks.propTypes = {
  account_id: PropTypes.string,
  account: PropTypes.object,
  permissions: PropTypes.shape({
    edit: PropTypes.bool,
  }),
  statement_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavLinks);
