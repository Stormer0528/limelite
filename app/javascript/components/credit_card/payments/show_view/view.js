import PropTypes from "prop-types";
import clsx from "clsx";
import {withStyles} from "@material-ui/core/styles";
import {Helmet} from "react-helmet";

import {useParams} from "react-router-dom";
import {useQuery} from "@apollo/react-hooks";

// MUI
import Paper from "@material-ui/core/Paper";

import CREDIT_CARD_QUERY from "@graphql/queries/credit_card_payment.gql";

import Header from "./header";
import Form from "../form";
import ApprovalFooter from "@shared/approval_footer";
import Breadcrumb from "../../breadcrumb";

const ShowView = ({classes = {}}) => {
  const {account_id, id: paymentId} = useParams();
  const {
    loading: ccQueryIsLoading,
    data: {
      creditCardPayment: payment,
      creditCardPayment: {permissions: {edit: canEdit} = {}} = {},
      account: {id: creditCardId, slug: creditCardSlug} = {},
    } = {},
  } = useQuery(CREDIT_CARD_QUERY, {
    variables: {
      creditCardSlug: account_id,
      paymentId,
    },
  });

  if (ccQueryIsLoading || !payment) {
    return null;
  }

  return (
    <section className={`react-inputs ${classes.root}`}>
      <Helmet>
        <title>{`LimeLite DS :: Credit Cards > ${
          creditCardSlug || ""
        } > Payments > ${paymentId} > Edit`}</title>
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
            payment,
            creditCardId,
            creditCardSlug,
            isInitialValid: true,
            onSubmit: () => {},
          }}
          readOnly
          disabled
          hideSubmissionBar
          hideAccountFinder
        />
        <ApprovalFooter
          className={classes.approvalFooter}
          {...payment}
          {...{
            hideStateBtns: true,
            createSubmitHandler: () => () => {},
          }}
        />
      </Paper>
    </section>
  );
};

ShowView.propTypes = {
  route: PropTypes.shape({
    data: PropTypes.shape({
      payment: PropTypes.shape({
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

export default withStyles(styles)(ShowView);
