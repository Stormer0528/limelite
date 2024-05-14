import PropTypes from "prop-types";
import {Link as NavLink} from "react-navi";
import {withStyles} from "@material-ui/core/styles";
// MUI
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";

// Icons
import EditIcon from "@material-ui/icons/Edit";
import ListIcon from "@material-ui/icons/List";
import ExportIcon from "@material-ui/icons/AssignmentReturned";

const NavLinks = ({
  indexPath,
  editPath,
  exportPath,
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
        prefetch="prefetch"
        href={indexPath}
        className={classes.linkButton}
      >
        <ListIcon className={classes.icon} />
        All&nbsp;Users
      </Link>
      <Link component={Button} href={exportPath} className={classes.linkButton}>
        <ExportIcon className={classes.icon} />
        Export
      </Link>
      {canEdit && (
        <Link component={Button} href={editPath} className={classes.linkButton}>
          <EditIcon className={classes.icon} />
          Edit
        </Link>
      )}
    </Breadcrumbs>
  );
};

NavLinks.propTypes = {
  indexPath: PropTypes.string,
  exportPath: PropTypes.string,
  editPath: PropTypes.string,
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
      backgroundColor: "#607d8b2b",
    },
  },
  icon: {
    marginRight: ".35em",
  },
  navlinks: {
    display: "flex",
    justifyContent: "flex-end",
    borderBottom: "none",
    height: "32px",
    lineHeight: "32px",
    "& > ol": {
      justifyContent: "flex-end",
    },
  },
});

export default withStyles(styles)(NavLinks);

// HELPERS
//------------------------------------------------------------------------------
export const CustomNavLink = (props) => (
  <Button component={NavLink} {...props} />
);
