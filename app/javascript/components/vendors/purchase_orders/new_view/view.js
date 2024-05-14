import PropTypes from "prop-types";
import {useCallback} from "react";
import {useCurrentRoute} from "react-navi";
import {withStyles} from "@material-ui/core/styles";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Form from "../form";

import {
  validationSchema,
  submissionSchema,
} from "../form/purchase_order.schema";

import {useMutation} from "react-apollo";

import CREATE_PO_MUTATION from "../../../../graphql/mutations/create_purchase_order.gql";

import PurchaseOrderIcon from "../../../shared/icons/purchase_order_icon";

const NewView = ({classes = {}}) => {
  const {data: {vendor, vendor: {vendorId} = {}} = {}} = useCurrentRoute();

  const [createPO] = useMutation(CREATE_PO_MUTATION);
  const onSubmit = useCallback(
    (data, filestack) => {
      const handleSubmit = async (data, {setErrors, setSubmitting}) => {
        const {stateAction, reason} = data;

        // Validate Data
        const validationVars = validationSchema.cast(data, {
          stripUnknown: true,
        });

        const submissionVars = submissionSchema.cast(validationVars);

        try {
          const response = await createPO({
            variables: {
              purchaseOrder: {...submissionVars, vendorId},
              stateAction,
              reason,
            },
          });

          const {
            data: {createPurchaseOrder: responseData},
          } = response;
          const {errors, path} = responseData;

          if (!errors || errors.length === 0) {
            window.location = path;
          } else {
            setErrors(errors);
            setSubmitting(false);
          }
        } catch (error) {
          console.error(error);
          setErrors(error);
        }
      };
      handleSubmit(data, filestack);
    },
    [createPO, vendorId]
  );

  return (
    <section className={classes.root}>
      <header className={classes.header}>
        <h3 className={classes.title}>
          <PurchaseOrderIcon className={classes.titleIcon} /> New Purchase Order
        </h3>
      </header>
      <Card>
        <CardContent>
          <Form {...{vendor, onSubmit}} />
        </CardContent>
      </Card>
    </section>
  );
};

NewView.propTypes = {
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
    display: "flex",
    alignItems: "center",
    fontSize: 24,
    fontWeight: 500,
  },
  titleIcon: {
    fontSize: "2.35rem !important",
    position: "relative",
    color: "#455A64",
    marginRight: ".35rem",
  },
});

export default withStyles(styles)(NewView);
