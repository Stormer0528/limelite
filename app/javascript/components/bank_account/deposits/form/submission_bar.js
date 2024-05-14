import PropTypes from "prop-types";
import {useCurrentRoute} from "react-navi";

import SubmissionBar from "@shared/submission_bar";

import API from "../../api";

const SubmissionBarData = ({
  setFieldValue = function () {},
  handleSubmit = function () {},
  isSubmitting = false,
  aasmState = "draft",
  hideDraft = false,
  hideDelete = false,
  disabled = false,
  permissions: passedPermissions = {},
}) => {
  const {
    data: {
      permissions: pagePermissons = {},
      deposit: {id, permissions: recordPermissions = {}} = {},
      bank_account: {slug} = {},
    } = {},
  } = useCurrentRoute();

  const permissions = {
    ...passedPermissions,
    ...pagePermissons,
    ...recordPermissions,
  };

  const submitHandler = ({stateAction, reason, event}) => {
    setFieldValue("stateAction", stateAction);
    setFieldValue("reason", reason);

    setTimeout(() => {
      handleSubmit(event);
    }, 100);
  };

  const handleDelete = async () => {
    await API.destroyDeposit(id);
    window.location = `/bank_accounts/${slug}`;
  };

  return (
    <SubmissionBar
      {...{
        handleSubmit: submitHandler,
        handleDelete,
        isSubmitting,
        aasmState,
        hideDraft,
        hideDelete,
        disabled,
        permissions,
      }}
    />
  );
};

SubmissionBarData.propTypes = {
  setFieldValue: PropTypes.func.isRequired,
  aasmState: PropTypes.string,
  disabled: PropTypes.bool,
  hideDraft: PropTypes.bool,
  hideDelete: PropTypes.bool,
  isValidating: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  permissions: PropTypes.shape({
    create: PropTypes.bool,
    edit: PropTypes.bool,
    view: PropTypes.bool,
    show: PropTypes.bool,
    update: PropTypes.bool,
    delete: PropTypes.bool,
    print: PropTypes.bool,
    void: PropTypes.bool,
    save_draft: PropTypes.bool,
    send_for_approval: PropTypes.bool,
    reverse_approval: PropTypes.bool,
    approve: PropTypes.bool,
    deny: PropTypes.bool,
  }),
  handleSubmit: PropTypes.func.isRequired,
};

export default SubmissionBarData;
