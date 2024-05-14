import PropTypes from "prop-types";
import AccountTransferIcon from "@material-ui/icons/CompareArrows";
import Form from "../form";
import {useCurrentRoute} from "react-navi";
import {withStyles} from "@material-ui/core/styles";
import Api from "../../api";
import setIn from "lodash/set";
import {
  validationSchema,
  submissionSchema,
} from "../form/account_transfer.schema";
import {amountToFloat} from "../../../../utils";

const View = ({classes = {}}) => {
  const {
    data: {
      account_transfer = {},
      account_transfer: {bankAccountName, bankAccountId} = {},
      bank_accounts,
      bank_account: {
        slug: bankAccountSlug,
        accountObject: {code: accountObjectCode},
      },
    },
  } = useCurrentRoute();

  const onSubmit = async (values, actions) => {
    const {setSubmitting, setErrors} = actions;
    const {stateAction, reason} = values;
    const validationVars = validationSchema.cast(values, {
      stripUnknown: true,
    });
    const submissionVars = submissionSchema.cast(validationVars);
    const response = await Api.updateAccountTransfer({
      account_transfer: submissionVars,
      accountTransfer: submissionVars,
      stateAction,
      reason,
    });

    /*Submission Failure: update page errors */
    if (!response.valid) {
      const {errorMessages = "{}"} = response;
      const errors = JSON.parse(errorMessages);
      const errObj = {entry: {}};
      Object.entries(errors).forEach(([key, value]) => {
        setIn(errObj, key, value);
      });

      setErrors(errObj);
      setSubmitting(false);
    } else {
      const {id} = response;
      setSubmitting(false);
      window.location = `/bank_accounts/${bankAccountSlug}/account_transfers/${id}`;
    }
  };

  return (
    <section className={`react-inputs ${classes.root}`}>
      <h3 className="page-header">
        <AccountTransferIcon className={classes.icon} />
        <span className="text"> Edit Account Transfer </span>
      </h3>

      <Form
        {...{
          accountTransfer: {
            ...formatAmount(account_transfer),
            bankAccountName,
            bankAccountId,
          },
          bankAccounts: bank_accounts,
          initialBankAccountName: bankAccountName,
          initialToBankAccountId: bankAccountId,
          onSubmit,
          bankAccountId,
          bankAccountSlug,
          accountObjectCode,
        }}
      />
    </section>
  );
};

View.propTypes = {
  route: PropTypes.shape({
    data: PropTypes.shape({
      bank_account: PropTypes.shape({
        id: PropTypes.string,
      }),
    }),
  }),
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  icon: {
    color: "#7a92a9",
    marginRight: "0.35em",
    height: "40px",
    width: "40px",
  },
});

export default withStyles(styles)(View);

// HELPER FUNCTIONS
//------------------------------------------------------------------------------

function formatAmount(account_transfer) {
  if (!account_transfer.entry) {
    return {...account_transfer, entryItems: [{}, {}]};
  }

  const {entry: {entryItems: items = []} = {}} = account_transfer;
  const entryItems = items.map((item) => {
    item.amount = amountToFloat(item.amount);
    if (item.type === "Credit") {
      item.credit = item.amount;
    } else {
      item.debit = -item.amount;
      item.amount = -item.amount;
    }
  });

  return {...account_transfer, entryItems};
}
