import PropTypes from "prop-types";
import PaymentIcon from "@shared/icons/credit_card_payment_icon";
import Form from "../form";
import setIn from "lodash/set";
import {validationSchema, submissionSchema} from "../form/payment.schema";
import {withStyles} from "@material-ui/core/styles";
import {Helmet} from "react-helmet";
import produce from "immer";
import {amountToFloat} from "../../../../utils";
import {useParams, withRouter} from "react-router-dom";
import {useQuery, useMutation} from "@apollo/react-hooks";
import Breadcrumb from "../../breadcrumb";

import UPDATE_PAYMENT_MUTATION from "@graphql/mutations/update_payment.gql";
import CREDIT_CARD_PAYMENT_QUERY from "@graphql/queries/credit_card_payment.gql";

const EditView = ({classes = {}}) => {
  const {account_id: creditCardSlug, account_id, id: paymentId} = useParams();
  const {
    loading: ccQueryIsLoading,
    data: {
      creditCardPayment: payment,
      creditCardPayment: {permissions: {edit: canEdit} = {}} = {},
      account: {id: creditCardId} = {},
    } = {},
  } = useQuery(CREDIT_CARD_PAYMENT_QUERY, {
    variables: {
      creditCardSlug: account_id,
      paymentId,
    },
  });

  const [updatePayment] = useMutation(UPDATE_PAYMENT_MUTATION);

  if (ccQueryIsLoading || !payment) {
    return null;
  }

  const onSubmit = async (values, actions) => {
    const {setSubmitting, setErrors} = actions;
    const {stateAction, reason} = values;
    const validationVars = validationSchema.cast(values, {
      stripUnknown: true,
    });
    const submissionVars = submissionSchema.cast(validationVars);
    const {data: {payment: response = {}} = {}} = await updatePayment({
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

  return (
    <section className={`react-inputs ${classes.root}`}>
      <Helmet>
        <title>{`LimeLite DS :: Credit Cards > ${
          creditCardSlug || ""
        } > Payments > ${paymentId} > Edit`}</title>
      </Helmet>
      <Breadcrumb />

      <h3 className="page-header">
        <PaymentIcon className={classes.icon} />
        <span className="text"> Edit Payment </span>
      </h3>

      <Form
        {...{
          payment: formatAmount(payment),
          onSubmit,
          creditCardId,
          creditCardSlug,
        }}
      />
    </section>
  );
};

EditView.propTypes = {
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

export default withStyles(styles)(withRouter(EditView));

// HELPER FUNCTIONS
//------------------------------------------------------------------------------

function formatAmount(payment) {
  return produce(payment, (checkDraft) => {
    checkDraft.entry.entryItems = payment.entry.entryItems.map((item) => {
      const amount = amountToFloat(item.amount);
      return {
        ...item,
        debit: item.type === "Debit" ? -amount : null,
        credit: item.type === "Credit" ? amount : null,
        amount: item.type === "Credit" ? amount : -amount,
        valid: true,
      };
    });
  });
}
