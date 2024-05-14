import PropTypes from "prop-types";
import {useMutation} from "@apollo/react-hooks";
import {useParams} from "react-router-dom";

import SubmissionBar from "@shared/submission_bar";
import DESTROY_CHARGE_MUTATION from "@graphql/mutations/destroy_charge.gql";

/**
 * Set up Data for submission bar
 *    -- delete btn
 *    -- permissions
 */
export default function SubmissionBarData({
  aasmState = "draft",
  disabled = false,
  hideDelete = false,
  hideDraft = false,
  isSubmitting = false,
  permissions = {},
  setFieldValue = function () {},
  handleSubmit = function () {},
}) {
  // const  = props;
  const {account_id: slug, id} = useParams();
  const [handleDelete] = useMutation(DESTROY_CHARGE_MUTATION, {
    variables: {id},
    onCompleted: () => {
      window.location = `/credit_cards/${slug}`;
    },
  });

  const submitHandler = ({stateAction, reason, event}) => {
    setFieldValue("stateAction", stateAction);
    setFieldValue("reason", reason);

    setTimeout(() => {
      handleSubmit(event);
    }, 100);
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
}

SubmissionBarData.propTypes = {
  handleSubmit: PropTypes.func,
  setFieldValue: PropTypes.func,
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
};
