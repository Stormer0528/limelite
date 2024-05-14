import PropTypes from "prop-types";
import CustomNavLink from "@shared/navi_button_link";
import {withStyles} from "@material-ui/core/styles";
import {useCurrentRoute} from "react-navi";
import produce from "immer";
// MUI
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Form from "../form";
import {amountToFloat} from "../../../../utils";

// Icons
import DepositIcon from "@material-ui/icons/AssignmentReturned";
import EditIcon from "@material-ui/icons/Edit";
import BankIcon from "@material-ui/icons/MonetizationOn";

const ShowView = ({classes = {}}) => {
  const {
    data: {
      deposit: initialDeposit,
      deposit: {id, permissions: {edit: canEdit = false} = {}} = {},
      bank_account: {
        slug: bankAccountSlug,
        accountObject: {code: accountObjectCode} = {},
      } = {},
    } = {},
  } = useCurrentRoute();

  const deposit =
    !initialDeposit.entry || !initialDeposit.entry.entryItems
      ? initialDeposit
      : produce(initialDeposit, (depositDraft) => {
          depositDraft.entry.entryItems = initialDeposit.entry.entryItems.map(
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
          <DepositIcon className={classes.icon} />
          <span className="text">Deposit </span>
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
              href={`/bank_accounts/${bankAccountSlug}/deposits/${id}/edit`}
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
          deposit,
          accountObjectCode,
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

ShowView.propTypes = {
  route: PropTypes.shape({
    data: PropTypes.shape({
      deposit: PropTypes.shape({
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
        slug: PropTypes.string,
        accountObject: PropTypes.shape({code: PropTypes.string}),
      }),
    }),
  }),
  classes: PropTypes.object.isRequired,
};

const styles = () => ({
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

export default withStyles(styles)(ShowView);
