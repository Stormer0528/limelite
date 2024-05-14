import PropTypes from "prop-types";
import CustomNavLink from "@shared/nav_button_link";

import {withStyles} from "@material-ui/core/styles";
// MUI
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";

// Icons
import CreditCardIcon from "@shared/icons/credit_card_icon";
import ListIcon from "@material-ui/icons/List";

const Navlinks = ({account: {slug} = {}, classes = {}}) => {
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
    </Breadcrumbs>
  );
};

Navlinks.propTypes = {
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
