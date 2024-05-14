import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import {styles} from "../../show_view/navlinks";
import CustomNavLink from "@shared/navi_button_link";

// MUI
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";

// Icons
import PrintIcon from "@material-ui/icons/Print";
import ListIcon from "@material-ui/icons/List";
import EditIcon from "@material-ui/icons/Edit";
import BankIcon from "@shared/icons/bank_account_icon";
import ReconciliationsIcon from "@material-ui/icons/CallToAction";
import ExportIcon from "@material-ui/icons/AssignmentReturned";

const NavLinks = ({
  statement_id,
  persisted = false,
  permissions: {edit: canEdit = false},
  account_id,
  classes = {},
  className = "",
  ...rest
}) => {
  const isEditView = /\/edit\/?$/.test(window.location.pathname);

  return (
    <Breadcrumbs
      separator="|"
      arial-label="Breadcrumb"
      className={`${classes.navlinks} ${className}`}
      {...rest}
    >
      <Link
        component={CustomNavLink}
        prefetch
        href="/bank_accounts"
        className={classes.linkButton}
      >
        <ListIcon className={classes.icon} />
        All Accounts
      </Link>
      <Link
        component={Button}
        href={`/bank_accounts/${account_id}/reconciliations`}
        className={classes.linkButton}
      >
        <BankIcon className={classes.icon} />
        Account
      </Link>
      <Link
        component={Button}
        href={`/bank_accounts/${account_id}/reconciliations`}
        className={classes.linkButton}
      >
        <ReconciliationsIcon className={classes.icon} />
        Reconciliations
      </Link>
      <Link
        component={Button}
        href={`/bank_accounts/${account_id}/print-checks`}
        className={classes.linkButton}
      >
        <PrintIcon className={classes.icon} />
        Print Checks
      </Link>
      {statement_id && canEdit && !isEditView && (
        <Link
          component={Button}
          href={`/bank_accounts/${account_id}/reconciliations/${statement_id}/edit`}
          className={classes.linkButton}
        >
          <EditIcon className={classes.icon} />
          Edit
        </Link>
      )}
      {persisted && (
        <Link
          component={Button}
          href={`/bank_accounts/${account_id}/reconciliations/${statement_id}/export.xlsx`}
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
  persisted: PropTypes.bool,
  account: PropTypes.object,
  permissions: PropTypes.shape({
    edit: PropTypes.bool,
  }),
  statement_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavLinks);
