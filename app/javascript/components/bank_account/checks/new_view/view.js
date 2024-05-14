import PropTypes from "prop-types";
import CheckIcon from "@material-ui/icons/OfflinePin";
import {useCurrentRoute} from "react-navi";
import Form from "../form";

import Api from "../../api";
import setIn from "lodash/set";
import {validationSchema, submissionSchema} from "../form/check.schema";

import {withStyles} from "@material-ui/core/styles";

const View = ({classes = {}}) => {
  const {
    data: {
      bank_account: {
        accountObject: {code: accountObjectCode},
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
    const response = await Api.createCheck({
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
      <StyledHeader />
      <Form
        {...{onSubmit, bankAccountId, bankAccountSlug, accountObjectCode}}
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
};

const styles = (theme) => ({
  icon: {
    color: "#7a92a9",
    marginRight: "0.35em",
    height: "40px",
    width: "40px",
  },
});

const Header = ({classes = {}}) => (
  <h3 className="page-header">
    <CheckIcon className={classes.icon} />
    <span className="text"> Manual Check </span>
  </h3>
);

Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

const StyledHeader = withStyles(styles)(Header);

export default View;
