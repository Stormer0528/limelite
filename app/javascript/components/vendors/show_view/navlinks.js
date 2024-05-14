import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";

// MUI
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";

// Icons
import EditIcon from "@material-ui/icons/Edit";
import ListIcon from "@material-ui/icons/List";

const NavLinks = ({
  vendor_id,
  permissions: {edit: canEdit = false} = {},
  classes = {},
}) => {
  return (
    <Breadcrumbs
      separator="|"
      arial-label="Breadcrumb"
      className={classes.navlinks}
    >
      <Link
        component={Button}
        prefetch="true"
        href="/vendors"
        className={classes.linkButton}
      >
        <ListIcon className={classes.icon} />
        All Vendors
      </Link>
      {canEdit && (
        <Link
          component={Button}
          href={`/vendors/${vendor_id}/edit`}
          className={classes.linkButton}
        >
          <EditIcon className={classes.icon} />
          Edit
        </Link>
      )}
    </Breadcrumbs>
  );
};

NavLinks.propTypes = {
  vendor_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  permissions: PropTypes.shape({
    edit: PropTypes.bool,
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

export default withStyles(styles)(NavLinks);
