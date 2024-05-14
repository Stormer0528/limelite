import {Fragment} from "react";
import PropTypes from "prop-types";
import LinearProgress from "@material-ui/core/LinearProgress";

import View from "../../../../vendors/purchase_orders/preview/view";
import {useQuery} from "react-apollo";
import LOAD_PO_QUERY from "@graphql/queries/load_purchase_order.gql";
import {withStyles} from "@material-ui/styles";

const PurchaseOrderPreview = ({slug, vendorSlug, classes = {}}) => {
  const response = useQuery(LOAD_PO_QUERY, {
    variables: {
      slug,
      vendorSlug,
    },
  });

  const {loading = false, data: {purchaseOrder = {}} = {}} = response;

  return (
    <Fragment>
      {loading && (
        <LinearProgress
          classes={{
            colorPrimary: classes.progressBar,
          }}
          className={classes.progress}
        />
      )}
      <View purchaseOrder={purchaseOrder} />
    </Fragment>
  );
};

PurchaseOrderPreview.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  slug: PropTypes.string,
  vendorSlug: PropTypes.string,
  classes: PropTypes.object.isRequired,
};

const styles = () => ({
  progress: {
    height: "2px",
  },
  progressBar: {
    background: "#43A047",
  },
});

export default withStyles(styles)(PurchaseOrderPreview);
