import PropTypes from "prop-types";
import CheckIcon from "@material-ui/icons/OfflinePin";
import Form from "../form";
import {useCurrentRoute} from "react-navi";
import {withStyles} from "@material-ui/core/styles";
import Api from "../../api";
import setIn from "lodash/set";
import {validationSchema, submissionSchema} from "../form/check.schema";
import {amountToFloat} from "../../../../utils";

const View = ({classes = {}}) => {
  const {
    data: {
      check = {},
      bank_account: {
        accountObject: {code: accountObjectCode},
        id: bankAccountId,
        slug: bankAccountSlug,
      } = {},
    } = {},
  } = useCurrentRoute();

  const onSubmit = async (values, actions) => {
    const {setSubmitting, setErrors} = actions;
    const {stateAction, reason} = values;
    const validationVars = validationSchema.cast(values, {
      stripUnknown: true,
    });
    const submissionVars = submissionSchema.cast(validationVars);
    const response = await Api.updateCheck({
      check: submissionVars,
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
      window.location = `/bank_accounts/${bankAccountSlug}/checks/${id}`;
    }
  };

  return (
    <section className={`react-inputs ${classes.root}`}>
      <h3 className="page-header">
        <CheckIcon className={classes.icon} />
        <span className="text"> Edit Check </span>
      </h3>

      <Form
        {...{
          check: formatAmount(check),
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

const styles = theme => ({
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

function formatAmount(check) {
  const entryItems = check.entry.entryItems.map(item => {
    item.amount = amountToFloat(item.amount);
    if (item.type === "Credit") {
      item.credit = item.amount;
    } else {
      item.debit = -item.amount;
      item.amount = -item.amount;
    }
  });

  return {...check, entryItems};
}
