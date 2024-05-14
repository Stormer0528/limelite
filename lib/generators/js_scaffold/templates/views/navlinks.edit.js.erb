import PropTypes from "prop-types";
import {Link as NavLink} from "react-navi";
import {withStyles} from "@material-ui/core/styles";
// MUI
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";

// Icons
import ViewIcon from "@material-ui/icons/FindInPage";

const NavLinks = ({
  path,
  permissions: {view: canView = false} = {},
  classes = {},
}) => {
  return (
    <Breadcrumbs
      separator="|"
      arial-label="Breadcrumb"
      className={classes.navlinks}
    >
      {canView && (
        <Link component={Button} href={path} className={classes.linkButton}>
          <ViewIcon className={classes.icon} />
          View
        </Link>
      )}
    </Breadcrumbs>
  );
};

NavLinks.propTypes = {
  path: PropTypes.string,
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
      fontWeight: 400,
    },
  },
});

export default withStyles(styles)(NavLinks);

// HELPERS
//------------------------------------------------------------------------------
export const CustomNavLink = (props) => (
  <Button component={NavLink} {...props} />
);
