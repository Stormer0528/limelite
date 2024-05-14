import {Fragment} from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import PayIcon from "@material-ui/icons/LocalAtm";
import Fade from "@material-ui/core/Fade";
import {Formik} from "formik";
// import ErrorMessageList from "../../../shared/error_message_list";
import validationSchema from "./pay_invoices.schema";
import AddressDropdown from "./address_dropdown";
import AccountDropdown from "./account_dropdown";
import {useMutation} from "@apollo/react-hooks";
import {withStyles} from "@material-ui/core/styles";

import PAY_INVOICES_MUTATION from "../../../../graphql/mutations/pay_invoices.gql";

const PayInvoicesForm = ({vendorId, invoiceIds = [], classes = {}}) => {
  const [payInvoices] = useMutation(PAY_INVOICES_MUTATION);
  const handleSubmit = async (form, {resetForm}) => {
    const variables = {ids: Array.from(invoiceIds), ...form};

    try {
      const response = await payInvoices({variables});
      const {
        data: {
          createCheckForPayments: {success = false, errorMessages = []},
        },
      } = response;
      if (success) {
        window.location.reload();
      } else {
        errorMessages.forEach(error => {
          console.error(error);
        });
        resetForm();
      }
    } catch (error) {
      console.error(error);
      resetForm();
    }
  };

  return (
    <Fade in>
      <Grid container className={classes.root}>
        <Formik
          initialValues={{vendorId}}
          validationSchema={validationSchema}
          isInitialValid={false}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            isValid,
          }) => {
            return (
              <Fragment>
                <Grid item xs={4} className={classes.grid}>
                  <Button
                    variant="outlined"
                    onClick={handleSubmit}
                    className={classes.payBtn}
                    disabled={isSubmitting || !isValid}
                  >
                    <PayIcon className={classes.payIcon} />
                    Pay Invoices
                  </Button>
                </Grid>
                <Grid item xs={4} className={classes.grid}>
                  <AddressDropdown
                    id="addressId"
                    value={values.addressId || ""}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    SelectProps={{
                      inputProps: {
                        name: "addressId",
                      },
                    }}
                    {...{vendor_id: vendorId}}
                  />
                </Grid>
                <Grid item xs={4} className={classes.grid}>
                  <AccountDropdown
                    id="cashAccountId"
                    value={values.cashAccountId || ""}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    SelectProps={{
                      inputProps: {
                        name: "cashAccountId",
                      },
                    }}
                    {...{vendor_id: vendorId}}
                  />
                </Grid>
              </Fragment>
            );
          }}
        </Formik>
      </Grid>
    </Fade>
  );
};

PayInvoicesForm.propTypes = {
  vendorId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  invoiceIds: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  classes: PropTypes.object.isRequired,
};

const styles = theme => ({
  root: {
    top: "1px",
    right: "0",
    height: "4.15em",
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    zIndex: "100",
    width: "500px",
    borderLeft: "1px solid #E0E0E0",
    backgroundColor: "#ECEFF1",
  },
  grid: {
    padding: "8px",
  },
  payIcon: {
    marginRight: ".35rem",
    position: "relative",
    top: "-1px",
    color: "#333",
  },
});

export default withStyles(styles)(PayInvoicesForm);
