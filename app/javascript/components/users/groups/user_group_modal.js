import UserGroupForm from "./user_group_form";
import {useMutation, useQuery} from "@apollo/react-hooks";
import CREATE_MUTATION from "@graphql/mutations/create_user_group.gql";
import UPDATE_MUTATION from "@graphql/mutations/update_user_group.gql";
import USER_GROUP_QUERY from "@graphql/queries/user_groups.gql";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import {titleCase} from "humanize-plus";
import {useSnackbar} from "notistack";
import PropTypes from "prop-types";
import {useEffect} from "react";
import {connect} from "react-redux";

const NewUserGroupModal = ({
  action,
  open,
  name,
  handleClose,
  refetch,
  organization,
  ...props
}) => {
  if (!organization.id) {
    return null;
  }

  const {
    groupsLoading,
    refetch: reloadGroups,
    data: {groups = []} = {},
  } = useQuery(USER_GROUP_QUERY, {
    variables: {organizationId: organization.id},
  });

  const [createGroup] = useMutation(CREATE_MUTATION);
  const [updateGroup] = useMutation(UPDATE_MUTATION);
  const {enqueueSnackbar} = useSnackbar();

  useEffect(() => {
    reloadGroups();
  }, [open]);

  const handleEditSubmit = async (values, {setSubmitting}) => {
    setSubmitting(true);

    const approvalAmountInCents = values.approvalAmount * 100;

    const {__typename, ...modulePermissions} = values.modulePermissions;

    try {
      await updateGroup({
        variables: {
          ...values,
          modulePermissions,
          approvalAmount: approvalAmountInCents,
          organizationId: organization.id,
        },
      });
      handleClose();
    } catch (e) {
      enqueueSnackbar(e.message, {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
      });
    }
  };

  const handleNewSubmit = async (values, {setSubmitting}) => {
    setSubmitting(true);

    const approvalAmountInCents = values.approvalAmount * 100;
    const {__typename, ...modulePermissions} = values.modulePermissions;

    await createGroup({
      variables: {
        ...values,
        modulePermissions,
        approvalAmount: approvalAmountInCents,
        organizationId: organization.id,
      },
    });

    setSubmitting(false);
    refetch();
    handleClose();
  };

  const submitHandler = action === "new" ? handleNewSubmit : handleEditSubmit;

  if (groupsLoading) {
    return null;
  }

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      onClose={handleClose}
      aria-labelledby="edit-group-title"
      open={open}
    >
      <DialogTitle id="edit-group-title">
        {titleCase(action)} User Group for {organization.name} Organization
      </DialogTitle>
      <UserGroupForm
        name={action === "edit" ? name : ""}
        userGroups={groups}
        {...props}
        action={action}
        refetch={refetch}
        handleClose={handleClose}
        handleSubmit={submitHandler}
      />
    </Dialog>
  );
};

NewUserGroupModal.propTypes = {
  name: PropTypes.string,
  open: PropTypes.bool,
  action: PropTypes.oneOf(["new", "edit"]),
  handleOpen: PropTypes.func,
  handleClose: PropTypes.func,
  refetch: PropTypes.func,
};

const mapStateToProps = (state) => {
  const {groups: {organization = {}} = {}} = state;
  return {
    organization,
  };
};

export default connect(mapStateToProps)(NewUserGroupModal);
