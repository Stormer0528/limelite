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
import Container from "@material-ui/core/Container";

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
        approvedAt,
        approver,
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

      {/* Authorizations */}
      {authorizationPath && (
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
      )}
      <Container>
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
      </Container>
      {/* Approvals */}
      <ApprovalFooter
        className={classes.approvalContainer}
        {...{
          id,
          aasmState,
          permissions,
          stateChangeLogs,
          approvedAt,
          approver,
          modelType: "PurchaseOrder",
        }}
        createSubmitHandler={createApprovalHandler}
        hideStateBtns={
          /* Allow AuthHeader to handle approve/deny */
          aasmState === "needs_approval"
        }
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
    paddingBottom: "5rem",
    paddingTop: "2.5rem",
  },
  approvalContainer: {
    position: "fixed",
    bottom: 0,
    zIndex: 999,
    borderTop: "1px solid #E0E0E0",
    borderBottom: "1px solid #E0E0E0",
    background: "linear-gradient(to right, #F5F5F5, #F5F5F5 250px, whitesmoke)",
  },
});

export default withStyles(styles)(ShowView);
