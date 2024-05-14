import PropTypes from "prop-types";
import {useCurrentRoute, Link as NavLink} from "react-navi";
import {withStyles} from "@material-ui/core/styles";
import produce from "immer";
// MUI
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Form from "../form";
import {amountToFloat} from "../../../../utils";

// Icons
import AccountTransferIcon from "@material-ui/icons/CompareArrows";
import EditIcon from "@material-ui/icons/Edit";
import BankIcon from "@material-ui/icons/MonetizationOn";

const View = ({classes = {}}) => {
  const {
    data: {
      account_transfer: initialAccountTransfer,
      account_transfer: {
        id,
        bankAccountName,
        bankAccountId,
        permissions: {edit: canEdit = false} = {},
      } = {},
      bank_account: {slug: bankAccountSlug},
    },
  } = useCurrentRoute();

  const accountTransfer =
    !initialAccountTransfer.entry || !initialAccountTransfer.entry.entryItems
      ? initialAccountTransfer
      : produce(initialAccountTransfer, (accountTransferDraft) => {
          accountTransferDraft.entry.entryItems = initialAccountTransfer.entry.entryItems.map(
            (item) => {
              const amount = amountToFloat(item.amount);
              return {
                ...item,
                debit: item.type === "Debit" ? -amount : null,
                credit: item.type === "Credit" ? amount : null,
                amount,
                valid: true,
              };
            }
          );
        });

  return (
    <section className={`react-inputs ${classes.root}`}>
      <div className={classes.headerContainer}>
        <h3 className="page-header">
          <AccountTransferIcon className={classes.icon} />
          <span className="text">AccountTransfer </span>
        </h3>
        <Breadcrumbs
          separator="|"
          arial-label="Breadcrumb"
          className={classes.navlinks}
        >
          <Link
            component={CustomNavLink}
            prefetch
            href={`/bank_accounts/${bankAccountSlug}`}
            className={classes.linkButton}
          >
            <BankIcon className={classes.linkIcon} />
            Bank Account
          </Link>
          {canEdit && (
            <Link
              component={Button}
              href={`/bank_accounts/${bankAccountSlug}/account_transfers/${id}/edit`}
              className={classes.linkButton}
            >
              <EditIcon className={classes.linkIcon} />
              Edit
            </Link>
          )}
        </Breadcrumbs>
      </div>

      <Form
        {...{
          accountTransfer: {...accountTransfer, bankAccountName, bankAccountId},
          initialBankAccountName: bankAccountName,
          initialToBankAccountId: bankAccountId,
          isInitialValid: true,
          onSubmit: () => {},
        }}
        readOnly
        disabled
        hideSubmissionBar
        hideAccountFinder
      />
    </section>
  );
};

View.propTypes = {
  route: PropTypes.shape({
    data: PropTypes.shape({
      account_transfer: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        permissions: PropTypes.shape({
          edit: PropTypes.bool.isRequired,
        }),
        entry: PropTypes.shape({
          entryItems: PropTypes.arrayOf(
            PropTypes.shape({
              id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
              amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            })
          ),
        }),
      }),
      bank_account: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        name: PropTypes.string,
        slug: PropTypes.string,
      }),
    }),
  }),
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  root: {},
  card: {},
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
  headerContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "baseline",
  },
});

export default withStyles(styles)(View);

// HELPERS
//------------------------------------------------------------------------------
export const CustomNavLink = (props) => (
  <Button component={NavLink} {...props} />
);
