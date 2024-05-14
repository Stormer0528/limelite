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
import BankAccountIcon from "@material-ui/icons/MonetizationOn";

const NavLinks = ({account_id, classes = {}, className = "", ...rest}) => {
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
        component={CustomNavLink}
        prefetch
        href={`/bank_accounts/${account_id}`}
        className={classes.linkButton}
      >
        <BankAccountIcon className={classes.icon} />
        Bank Account
      </Link>
      <Link
        component={Button}
        href={`/bank_accounts/${account_id}/print-checks`}
        className={classes.linkButton}
      >
        <PrintIcon className={classes.icon} />
        Print Checks
      </Link>
    </Breadcrumbs>
  );
};

NavLinks.propTypes = {
  account_id: PropTypes.string.isRequired,
  className: PropTypes.string,
  permissions: PropTypes.shape({
    edit: PropTypes.bool,
  }),
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavLinks);
