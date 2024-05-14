import PropTypes from "prop-types";
import {useCallback} from "react";
import {useCurrentRoute} from "react-navi";
import {withStyles} from "@material-ui/core/styles";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Form from "../form";
import Navlinks from "./navlinks";
import {
  validationSchema,
  submissionSchema,
} from "../form/purchase_order.schema";

import {useMutation} from "react-apollo";

import UPDATE_PURCHASE_ORDER from "@graphql/mutations/update_purchase_order.gql";
import PurchaseOrderIcon from "@shared/icons/purchase_order_icon";

const EditView = ({classes = {}}) => {
  const {
    data: {
      vendor = {},
      purchaseOrder = {},
      purchaseOrder: {id, vendorId, vendorPath, invoicePath, path} = {},
    },
  } = useCurrentRoute();

  const {permissions = {}} = purchaseOrder;
  const [updatePO] = useMutation(UPDATE_PURCHASE_ORDER);
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
          const response = await updatePO({
            variables: {
              purchaseOrder: {...submissionVars, id, vendorId},
              stateAction,
              reason,
            },
          });

          const {
            data: {updatePurchaseOrder: responseData},
          } = response;
          const {errors, path} = responseData;

          if (!errors || errors.length === 0) {
            window.location = path;
          } else {
            setErrors(errors);
            setSubmitting(false);
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
          setErrors(error);
        }
      };
      handleSubmit(data, filestack);
    },
    [id, updatePO, vendorId]
  );

  return (
    <section className={classes.root}>
      <header className={classes.header}>
        <h3 className={classes.title}>
          <PurchaseOrderIcon className={classes.titleIcon} /> Purchase Order
        </h3>
        <Navlinks {...{permissions, path, vendorPath, invoicePath}} />
      </header>
      <Card>
        <CardContent>
          <Form {...{vendor, purchaseOrder, onSubmit}} />
        </CardContent>
      </Card>
    </section>
  );
};

EditView.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = () => ({
  root: {
    marginBottom: "5rem",
    paddingBottom: "5rem",
  },
  header: {
    display: "grid",
    gridTemplateColumns: "1fr max-content",
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

export default withStyles(styles)(EditView);
