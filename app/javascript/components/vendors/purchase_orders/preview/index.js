import {useCallback} from "react";
import PropTypes from "prop-types";
import {useCurrentRoute} from "react-navi";
import {withStyles} from "@material-ui/core/styles";
import {useMutation} from "@apollo/react-hooks";

import View from "./view";
import Header from "./header";
import AuthHeader from "@shared/auth_footer";
import ApprovalFooter from "@shared/approval_footer";
import UPDATE_STATE_MUTATION from "@graphql/mutations/update_state.gql";

const ShowView = ({classes = {}, ...rest}) => {
  const {
    data: {
      purchaseOrder = {},
      vendor = {},
      purchaseOrder: {
        id,
        slug,
        authorizations = [],
        authorizationPath = [],
        authorizationPathIndex,
        permissions,
        stateChangeLogs = [],
        permissions: {authorize: canAuthorize} = {},
        aasmState,
        exportPath,
        vendorPath,
        invoicePath,
      } = {},
    },
  } = useCurrentRoute();

  const [updateItemState] = useMutation(UPDATE_STATE_MUTATION, {
    variables: {id, slug, modelType: "PurchaseOrder"},
    onCompleted: () => {
      window.location.reload();
    },
  });

  const createApprovalHandler = useCallback(
    () => (nextState) => (e) => {
      e.preventDefault();
      updateItemState({
        variables: {
          nextState,
        },
      });
    },
    [updateItemState]
  );

  return (
    <section className={classes.root}>
      <Header
        {...{purchaseOrder, exportPath, vendorPath, invoicePath, ...rest}}
      />

      {/* Approvals */}
      <ApprovalFooter
        className={classes.approvalContainer}
        {...{aasmState, permissions, stateChangeLogs}}
        createSubmitHandler={createApprovalHandler}
        hideStateBtns={
          /* Allow AuthHeader to handle approve/deny */
          aasmState === "needs_approval"
        }
      />

      {/* Authorizations */}
      <AuthHeader
        {...{
          id: purchaseOrder.id,
          aasmState,
          canAuthorize,
          authorizations,
          authorizationPath,
          authorizationPathIndex,
          type: "PurchaseOrder",
        }}
      />
      <View
        {...{
          vendor,
          purchaseOrder,
          exportPath,
          vendorPath,
          invoicePath,
          ...rest,
        }}
      />
    </section>
  );
};

ShowView.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = () => ({
  root: {
    marginBottom: "5rem",
  },
  approvalContainer: {
    borderTop: "1px solid #E0E0E0",
    borderBottom: "1px solid #E0E0E0",
    background: "linear-gradient(to right, #F5F5F5, #F5F5F5 250px, whitesmoke)",
  },
});

export default withStyles(styles)(ShowView);
