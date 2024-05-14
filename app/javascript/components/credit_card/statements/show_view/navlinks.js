import PropTypes from "prop-types";
import CustomNavLink from "@shared/nav_button_link";
import NormalNavLink from "@shared/navi_button_link";

import {withStyles} from "@material-ui/core/styles";
// MUI
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";

// Icons
import CreditCardIcon from "@shared/icons/credit_card_icon";
import ListIcon from "@material-ui/icons/List";
import EditIcon from "@material-ui/icons/Edit";
import ExportIcon from "@material-ui/icons/AssignmentReturned";
import ReconciliationIcon from "@shared/icons/statement_icon";

const Navlinks = ({
  statement_id,
  permissions: {edit: canEdit = false},
  account: {slug} = {},
  classes = {},
}) => {
  const isEditView = window.location.pathname.split("/")[5] === "edit";
  const isNewView = window.location.pathname.match(/\/new\/?$/);
  const isShowView = !isEditView && !isNewView && statement_id;

  return (
    <Breadcrumbs
      separator="|"
      arial-label="Breadcrumb"
      className={classes.navlinks}
    >
      <Link
        component={CustomNavLink}
        data-cy="cc-index-link"
        className={classes.linkButton}
        to="/"
      >
        <ListIcon className={classes.icon} />
        All Accounts
      </Link>
      <Link
        component={CustomNavLink}
        data-cy="cc-show-link"
        className={classes.linkButton}
        to={`/${slug}`}
      >
        <CreditCardIcon className={classes.icon} />
        Account
      </Link>
      <Link
        component={CustomNavLink}
        data-cy="cc-index-link"
        className={classes.linkButton}
        to={`/${slug}/reconciliations`}
      >
        <ListIcon className={classes.icon} />
        Reconciliations
      </Link>

      {/**
        Using Normal link here to force page reload.
        Otherwise, it keeps current page state
      */}
      {statement_id && isEditView && (
        <Link
          component={NormalNavLink}
          data-cy="cc-reconciliation-link"
          className={classes.linkButton}
          href={`/credit_cards/${slug}/reconciliations/${statement_id}`}
        >
          <ReconciliationIcon className={classes.icon} />
          Reconciliation
        </Link>
      )}
      {canEdit && isShowView && (
        <Link
          component={CustomNavLink}
          data-cy="cc-edit-link"
          className={classes.linkButton}
          to={`/${slug}/reconciliations/${statement_id}/edit`}
        >
          <EditIcon className={classes.icon} />
          Edit
        </Link>
      )}
      {statement_id && (
        <Link
          component={CustomNavLink}
          data-cy="cc-export-link"
          className={classes.linkButton}
          to={`/${slug}/statements/${statement_id}/export.xlsx`}
        >
          <ExportIcon className={classes.icon} />
          Export
        </Link>
      )}
    </Breadcrumbs>
  );
};

Navlinks.propTypes = {
  editable: PropTypes.bool,
  persisted: PropTypes.bool,
  permissions: PropTypes.shape({edit: PropTypes.bool}),
  statement_id: PropTypes.oneOfType([PropTypes.string, PropTypes.string]),
  account: PropTypes.shape({
    slug: PropTypes.string,
  }),
  classes: PropTypes.object.isRequired,
};

export const styles = (theme) => ({
  linkButton: {
    display: "flex",
    color: "#424242",

    "&:hover": {
      textDecoration: "none",
    },
  },
  icon: {
    marginRight: ".35em",
  },
  navlinks: {
    borderBottom: "none",
    marginBottom: ".75em",
    height: "32px",
    lineHeight: "32px",
    "& > ol": {
      justifyContent: "flex-end",
    },
  },
});

export default withStyles(styles)(Navlinks);
