import PropTypes from "prop-types";
import {useState, useEffect} from "react";
import {useCurrentRoute} from "react-navi";
import {withStyles} from "@material-ui/core/styles";
import {useFormikContext} from "formik";
import {useLazyQuery} from "@apollo/react-hooks";
import gql from "graphql-tag";

import HiddenInputs from "./hidden_inputs";
import ConfirmationModal from "./confirmation_modal";

// Material UI
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import PrintIcon from "@material-ui/icons/Print";

const VALIDATE_CHECK_NUMBERS_QUERY = gql`
  query validateCheckNumbers($numbers: [String]!, $bankAccountId: ID!) {
    validateCheckNumbers(numbers: $numbers, bankAccountId: $bankAccountId) {
      success
      errorMessages
    }
  }
`;

// Component
//------------------------------------------------------------------------------
const Footer = ({
  itemCount = 0,
  balance = "$0.00",
  total = "$0.00",
  isValid = true,
  items = [],
  classes = {},
}) => {
  const {
    data: {
      bank_account: {slug, id: bankAccountId},
    },
  } = useCurrentRoute();

  // Modal State
  const [isModalOpen, setModalOpen] = useState(false);

  // LazyQuery onCompleted re-runs when the component is re-rendered
  // Adding shouldSubmit flag to avoid resubmission if confirmation dialog is closed without confirming
  const [shouldSubmit, setShouldSubmit] = useState(false);
  const {
    setFieldError,
    values = {},
    values: {checkedItems = {}},
    resetForm = function () {},
  } = useFormikContext();

  const handleModalClose = () => {
    resetForm({values: {...values, confirmedItems: {}}});
    setModalOpen(false);
  };

  const [formDom, setForm] = useState();
  const [validateNumbers] = useLazyQuery(VALIDATE_CHECK_NUMBERS_QUERY, {
    fetchPolicy: "network-only",
    variables: {
      numbers: Object.values(checkedItems).map(({number}) => number),
      bankAccountId,
    },
    onCompleted: ({
      validateCheckNumbers: {errorMessages = [], success = false} = {},
    }) => {
      if (success && shouldSubmit) {
        setModalOpen(true);
        setShouldSubmit(false);
        formDom.submit();
      } else if (!success) {
        setFieldError("checkedItems", errorMessages);
        setShouldSubmit(false);
      }
    },
  });

  useEffect(() => {
    validateNumbers()
  }, [])

  const submitHandler = (e) => {
    setShouldSubmit(true);
    e.preventDefault();
    setForm(e.target);
    validateNumbers();

    return false;
  };

  return (
    <AppBar
      color="inherit"
      position="sticky"
      className={classes.appBar}
      component="footer"
    >
      <ConfirmationModal {...{isModalOpen, handleModalClose}} />
      <Grid container alignContent="space-between" nowrap="nowrap">
        <Grid item className={classes.growCell}>
          <h5 className={classes.header}>{itemCount} Items Selected</h5>
        </Grid>
        <Grid item className={classes.growCell}>
          <h5 className={classes.header}>
            Account Balance:{" "}
            <small className={classes.headerText}>{balance}</small>
          </h5>
        </Grid>
        <Grid item>
          <h5 className={classes.header}>
            Total: <small className={classes.headerText}>{total}</small>
          </h5>
        </Grid>
        <Grid item className={classes.btnCell}>
          <form
            onSubmit={submitHandler}
            target="_blank"
            method="post"
            acceptCharset="UTF-8"
            action={`/bank_accounts/${slug}/print_checks/print.pdf`}
          >
            <HiddenInputs {...{items}} />
            <Button
              disabled={!isValid}
              variant="contained"
              color="primary"
              type="submit"
            >
              <PrintIcon />
              &nbsp;Print&nbsp;Checks
            </Button>
          </form>
        </Grid>
      </Grid>
    </AppBar>
  );
};

// PropTypes
//------------------------------------------------------------------------------
Footer.propTypes = {
  items: PropTypes.array,
  itemCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  balance: PropTypes.string,
  total: PropTypes.string,
  isValid: PropTypes.bool,
  handleSubmit: PropTypes.func,
  /*  Styles  */
  classes: PropTypes.object.isRequired,
};

// Theme
//------------------------------------------------------------------------------
const styles = (theme) => ({
  appBar: {
    position: "fixed",
    bottom: "0",
    top: "inherit",
    left: "0",
    right: "0",
    background: "#EEEEEE",
    boxShadow: "0 0 7.5px rgba(33,33,33,.25)",
    color: "#607D8B",
    padding: "0.5rem 1em",
    display: "flex",
  },
  header: {
    fontSize: "1.35em",
    fontWeight: "300",
  },
  headerText: {
    color: "#455a64",
    fontSize: "1.35rem",
    fontWeight: "bold",
  },
  growCell: {
    flexGrow: 0,
    marginRight: "1em",
  },
  btnCell: {
    flexGrow: 1,
    textAlign: "right",
    alignSelf: "center",
  },
});

// Export
//------------------------------------------------------------------------------
export default withStyles(styles)(Footer);
