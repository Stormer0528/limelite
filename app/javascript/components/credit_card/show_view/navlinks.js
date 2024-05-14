import PropTypes from "prop-types";
import CustomNavLink from "@shared/nav_button_link";
import {withStyles} from "@material-ui/core/styles";
// MUI
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";

// Icons
import EditIcon from "@material-ui/icons/Edit";
import ListIcon from "@material-ui/icons/List";
import ReconciliationsIcon from "@material-ui/icons/CallToAction";

const NavLinks = ({
  account_id,
  permissions: {update: canEdit = false} = {},
  classes = {},
}) => {
  return (
    <Breadcrumbs
      separator="|"
      arial-label="Breadcrumb"
      className={classes.navlinks}
    >
      <Link
        component={CustomNavLink}
        prefetch="mount"
        to="/"
        className={classes.linkButton}
      >
        <ListIcon className={classes.icon} />
        All Accounts
      </Link>
      {canEdit && (
        <Link
          component={Button}
          to={`/${account_id}/edit`}
          className={classes.linkButton}
        >
          <EditIcon className={classes.icon} />
          Edit
        </Link>
      )}
      <Link
        component={CustomNavLink}
        to={`/${account_id}/reconciliations`}
        className={classes.linkButton}
      >
        <ReconciliationsIcon className={classes.icon} />
        Reconciliations
      </Link>
    </Breadcrumbs>
  );
};

NavLinks.propTypes = {
  account_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  permissions: PropTypes.shape({
    edit: PropTypes.bool,
  }),
  classes: PropTypes.object.isRequired,
};

export const styles = () => ({
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

export default withStyles(styles)(NavLinks);
