import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import {Helmet} from "react-helmet";

import Form from "../form";
import Breadcrumb from "../../breadcrumb";

import {useParams} from "react-router-dom";
import {useQuery, useMutation} from "@apollo/react-hooks";
import produce from "immer";
import {amountToFloat} from "../../../../utils";
import setIn from "lodash/set";
import {validationSchema, submissionSchema} from "../form/charge.schema";

import UPDATE_CHARGE_MUTATION from "@graphql/mutations/update_charge.gql";
import CREDIT_CARD_CHARGE_QUERY from "@graphql/queries/load_credit_card_charge.gql";

import ChargeIcon from "@shared/icons/charge_icon";

const EditView = ({classes = {}}) => {
  const {account_id: creditCardSlug, id: chargeId} = useParams();
  const {
    data: {charge = {}, creditCard: {id: creditCardId} = {}} = {},
    loading,
    errors,
  } = useQuery(CREDIT_CARD_CHARGE_QUERY, {
    variables: {
      creditCardSlug,
      chargeId,
    },
  });

  const [updateCharge] = useMutation(UPDATE_CHARGE_MUTATION);
  const onSubmit = async (values, actions) => {
    const {setSubmitting, setErrors} = actions;
    const {stateAction, reason} = values;
    const validationVars = validationSchema.cast(values, {
      stripUnknown: true,
    });

    const submissionVars = submissionSchema.cast(validationVars);
    const {data: {charge: response = {}} = {}} = await updateCharge({
      variables: {charge: submissionVars, stateAction, reason},
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
      /*Submission Success */
      const {id} = response;
      setSubmitting(false);
      window.location = `/credit_cards/${creditCardSlug}/charges/${id}`;
    }
  };

  if (loading || !charge) {
    return null;
  }

  if (errors) {
    // eslint-disable-next-line no-console
    console.error(errors);
  }

  return (
    <section className={`react-inputs ${classes.root}`}>
      <Helmet>
        <title>{`LimeLite DS :: Credit Cards > ${
          creditCardSlug || ""
        } > Charges > ${chargeId} > Edit`}</title>
      </Helmet>
      <Breadcrumb />
      <h3 className="page-header">
        <ChargeIcon className={classes.titleIcon} />
        <span className="text"> Edit Charge </span>
      </h3>

      <Form
        {...{
          charge: formatAmount(charge),
          onSubmit,
          creditCardId,
          creditCardSlug,
        }}
      />
    </section>
  );
};

EditView.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = () => ({
  root: {
    marginBottom: "5rem",
  },
  header: {
    display: "grid",
    gridTemplateColumns: "1fr 315px",
    alignItems: "baseline",
    marginBottom: "-0.125rem",
    padding: "0 .5rem .25rem",
    borderTop: "1px solid #f0f0f0",
    borderRadius: "4px 4px 0 0",
    background: "#f0f0f087",
  },
  title: {
    margin: 0,
  },
  titleIcon: {
    fontSize: "2.35rem !important",
    position: "relative",
    top: ".065em",
    color: "#455A64",
  },
});

export default withStyles(styles)(EditView);

// HELPER FUNCTIONS
//------------------------------------------------------------------------------

function formatAmount(charge) {
  return produce(charge, (checkDraft) => {
    checkDraft.entry.entryItems = charge.entry.entryItems.map((item) => {
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
