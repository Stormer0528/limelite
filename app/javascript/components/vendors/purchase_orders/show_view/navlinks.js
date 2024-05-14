import PropTypes from "prop-types";
import {Link as NavLink} from "react-navi";
import {withStyles} from "@material-ui/core/styles";
// MUI
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";

// Icons
import EditIcon from "@material-ui/icons/Edit";
import VendorIcon from "@material-ui/icons/Store";
import InvoiceIcon from "@material-ui/icons/FeaturedPlayList";
import ExportIcon from "@material-ui/icons/AssignmentReturned";

const NavLinks = ({
  vendorPath,
  invoicePath,
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
        href={vendorPath}
        className={classes.linkButton}
      >
        <VendorIcon className={classes.icon} />
        Vendor
      </Link>
      {invoicePath && (
        <Link
          component={Button}
          href={invoicePath}
          className={classes.linkButton}
        >
          <InvoiceIcon className={classes.icon} />
          Invoice
        </Link>
      )}
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
  vendorPath: PropTypes.string,
  invoicePath: PropTypes.string,
  exportPath: PropTypes.string,
  editPath: PropTypes.string,
  permissions: PropTypes.shape({
    edit: PropTypes.bool,
  }),
  classes: PropTypes.object.isRequired,
};

export const styles = theme => ({
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
