import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import {useRouteMatch} from "react-router-dom";

// MUI
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";

// Icons
import PaymentIcon from "@shared/icons/credit_card_payment_icon";
import EditIcon from "@material-ui/icons/Edit";

import CreditCardIcon from "@shared/icons/credit_card_icon";

function Header({canEdit = false}) {
  const {url, params: {account_id} = {}} = useRouteMatch();
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <h3 className="page-header">
        <PaymentIcon className={classes.icon} />
        <span className="text">Payment </span>
      </h3>
      <Breadcrumbs
        separator="|"
        arial-label="Breadcrumb"
        className={classes.navlinks}
      >
        <Link
          component={Button}
          prefetch="mount"
          href={`/credit_cards/${account_id}`}
          className={classes.linkButton}
        >
          <CreditCardIcon className={classes.linkIcon} />
          Credit&nbsp;Card
        </Link>
        {canEdit && (
          <Link
            component={Button}
            href={`/credit_cards${url}/edit`}
            className={classes.linkButton}
          >
            <EditIcon className={classes.linkIcon} />
            Edit
          </Link>
        )}
      </Breadcrumbs>
    </div>
  );
}

Header.propTypes = {
  canEdit: PropTypes.bool,
  classes: PropTypes.object.isRequired,
};

export default Header;

const useStyles = makeStyles(() => ({
  icon: {
    color: "#7a92a9",
    marginRight: "0.35em",
    height: "40px",
    width: "40px",
  },
  linkButton: {
    display: "flex",
    color: "#424242",

    "&:hover": {
      textDecoration: "none",
    },
  },
  linkIcon: {
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
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "baseline",
  },
}));
