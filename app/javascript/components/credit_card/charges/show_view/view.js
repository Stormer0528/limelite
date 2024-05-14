import PropTypes from "prop-types";
import clsx from "clsx";
import {withStyles} from "@material-ui/core/styles";
import {Helmet} from "react-helmet";
import {useParams} from "react-router-dom";
import {useQuery} from "@apollo/react-hooks";
import produce from "immer";
import {amountToFloat} from "../../../../utils";

import CREDIT_CARD_CHARGE_QUERY from "@graphql/queries/load_credit_card_charge.gql";

import Paper from "@material-ui/core/Paper";

import Header from "./header";
import Form from "../form";
import ApprovalFooter from "@shared/approval_footer";
import Breadcrumb from "../../breadcrumb";

const EditView = ({classes = {}}) => {
  const {account_id: creditCardSlug, id: chargeId} = useParams();
  const {
    data: {
      charge: {permissions: {edit: canEdit} = {}} = {},
      charge = {},
      creditCard: {id: creditCardId} = {},
    } = {},
    loading,
    errors,
  } = useQuery(CREDIT_CARD_CHARGE_QUERY, {
    variables: {
      creditCardSlug,
      chargeId,
    },
  });

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
        } > Charges > ${chargeId}`}</title>
      </Helmet>
      <Breadcrumb />

      <Header canEdit={canEdit} />

      <Paper
        elevation={1}
        className={clsx(classes.formContainer, {
          disabled: true,
          readOnly: true,
        })}
      >
        <Form
          {...{
            charge: formatAmount(charge),
            onSubmit: () => {},
            creditCardId,
            creditCardSlug,
            isInitialValid: true,
          }}
          readOnly
          disabled
          hideSubmissionBar
          hideAccountFinder
        />
        <ApprovalFooter
          className={classes.approvalFooter}
          {...charge}
          {...{
            hideStateBtns: true,
            createSubmitHandler: () => () => {},
          }}
        />
      </Paper>
    </section>
  );
};

EditView.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
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
  formContainer: {
    padding: `0 ${theme.spacing(1)}px ${theme.spacing(1)}px`,

    "&.disabled.readOnly input": {
      color: "#333",
    },
  },
  selectDisabled: {color: "#333"},
  approvalFooter: {
    margin: "0.5rem -8px 0",
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
