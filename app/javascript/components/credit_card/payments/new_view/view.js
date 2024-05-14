import PropTypes from "prop-types";
import {useParams} from "react-router-dom";
import {Helmet} from "react-helmet";

import PaymentIcon from "@shared/icons/credit_card_payment_icon";
import Form from "../form";
import Breadcrumb from "../../breadcrumb";

import {useQuery, useMutation} from "@apollo/react-hooks";

import setIn from "lodash/set";
import {validationSchema, submissionSchema} from "../form/payment.schema";

import {withStyles} from "@material-ui/core/styles";

import CREATE_PAYMENT_MUTATION from "@graphql/mutations/create_payment.gql";
import CREDIT_CARD_QUERY from "@graphql/queries/load_credit_card.gql";

const NewView = ({classes = {}}) => {
  const {account_id} = useParams();
  const {
    loading: ccQueryIsLoading,
    data: {account: {id: creditCardId, slug: creditCardSlug} = {}} = {},
  } = useQuery(CREDIT_CARD_QUERY, {
    variables: {slug: account_id},
  });

  const [createPayment] = useMutation(CREATE_PAYMENT_MUTATION);

  const onSubmit = async (values, actions) => {
    const {setSubmitting, setErrors} = actions;
    const {stateAction, reason} = values;

    const validationVars = validationSchema.cast(values, {
      stripUnknown: true,
    });
    const submissionVars = submissionSchema.cast(validationVars);

    const {data: {createPayment: response = {}} = {}} = await createPayment({
      variables: {
        payment: {...submissionVars, creditCardId},
        stateAction,
        reason,
      },
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
      window.location = `/credit_cards/${creditCardSlug}/payments/${id}`;
    }
  };

  if (ccQueryIsLoading || !creditCardId) {
    return null;
  }

  return (
    <section className={`react-inputs ${classes.root}`}>
      <Helmet>
        <title>{`LimeLite DS :: Credit Cards > ${
          creditCardSlug || ""
        } > New Payment`}</title>
      </Helmet>
      <Breadcrumb />
      <h3 className="page-header">
        <PaymentIcon className={classes.icon} />
        <span className="text"> New Payment </span>
      </h3>

      <Form
        {...{
          onSubmit,
          creditCardId,
          creditCardSlug,
        }}
      />
    </section>
  );
};

NewView.propTypes = {
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

export default withStyles(styles)(NewView);
