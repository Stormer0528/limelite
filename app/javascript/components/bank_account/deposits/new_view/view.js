import PropTypes from "prop-types";
import DepositIcon from "@material-ui/icons/AssignmentReturned";
import Form from "../form";
import {useCurrentRoute} from "react-navi";
import Api from "../../api";
import setIn from "lodash/set";
import {validationSchema, submissionSchema} from "../form/deposit.schema";

import {withStyles} from "@material-ui/core/styles";

const NewView = ({classes = {}}) => {
  const {
    data: {
      bank_account: {
        accountObject: {code: accountObjectCode} = {},
        id: bankAccountId,
        slug: bankAccountSlug,
      } = {},
    } = {},
  } = useCurrentRoute();

  const onSubmit = async (values, actions) => {
    const {setSubmitting, setErrors} = actions;

    const elem = document.getElementById("bank_account_index");

    if (elem) {
      const { fiscalYear } = elem.dataset;
      const date = new Date(values.entry.date);

      if (date < new Date(`${fiscalYear}-07-01`) || date > new Date(`${Number(fiscalYear)+1}-06-31`)) {
        if (!confirm('The Date you entered is outside the current fiscal year parameters. Are you sure you want to post?')) {
          setSubmitting(false);
          return ;
        }
      }
    }

    const {stateAction, reason} = values;
    const validationVars = validationSchema.cast(values, {
      stripUnknown: true,
    });
    const submissionVars = submissionSchema.cast(validationVars);
    const response = await Api.createDeposit({
      deposit: submissionVars,
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
      window.location = `/bank_accounts/${bankAccountSlug}/deposits/${id}`;
    }
  };

  return (
    <section className={`react-inputs ${classes.root}`}>
      <h3 className="page-header">
        <DepositIcon className={classes.icon} />
        <span className="text"> New Deposit </span>
      </h3>

      <Form
        {...{onSubmit, bankAccountId, bankAccountSlug, accountObjectCode}}
      />
    </section>
  );
};

NewView.propTypes = {
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

export default withStyles(styles)(NewView);
