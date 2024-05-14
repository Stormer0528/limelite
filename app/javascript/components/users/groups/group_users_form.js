import PropTypes from "prop-types";
import {useQuery, useMutation} from "@apollo/react-hooks";
import {makeStyles} from "@material-ui/core/styles";

import {Formik, Form} from "formik";

import LinearProgress from "@material-ui/core/LinearProgress";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import InputAdornment from "@material-ui/core/InputAdornment";
import DialogActions from "@material-ui/core/DialogActions";

import SaveIcon from "@material-ui/icons/Save";

import USER_GROUP_QUERY from "@graphql/queries/user_group_users.gql";
import UPDATE_USERS_QUERY from "@graphql/mutations/update_user_group_users.gql";
import TransferList from "../../shared/transfer_list";

const UserGroupForm = ({id, handleClose, organizationId}) => {
  const classes = useStyles();
  const {
    data: {userGroup: {users: groupUsers = []} = {}, users: allUsers = []} = {},
    loading,
  } = useQuery(USER_GROUP_QUERY, {
    variables: {id, organizationId},
    skip: !id,
    fetchPolicy: "network-only",
  });
  const [updateUsers] = useMutation(UPDATE_USERS_QUERY);
  const unselectedUsers = not(allUsers, groupUsers);

  if (loading) {
    return null;
  }

  return (
    <Formik
      onSubmit={async (values, {setSubmitting}) => {
        setSubmitting(true);
        await updateUsers({variables: {...values, organizationId}});

        setSubmitting(false);
        handleClose();
      }}
      initialValues={{userIds: groupUsers.map(({id}) => id), id}}
    >
      {({submitForm, isSubmitting, handleChange}) => {
        const updateUsers = (users) => {
          handleChange({
            target: {
              name: "userIds",
              value: users.map(({id}) => id),
            },
          });
        };
        return (
          <Form className="react-inputs">
            {(isSubmitting || loading) && <LinearProgress />}

            {!loading && (
              <Grid container spacing={3} className={classes.container}>
                <TransferList
                  {...{
                    currentUsers: groupUsers,
                    allUsers: unselectedUsers,
                    handleChange: updateUsers,
                  }}
                />
              </Grid>
            )}
            <DialogActions>
              <Button onClick={handleClose} color="secondary">
                Cancel
              </Button>
              <Button
                startIcon={
                  <InputAdornment position="start">
                    <SaveIcon />
                  </InputAdornment>
                }
                onClick={submitForm}
                color="primary"
                autoFocus
              >
                Save Users
              </Button>
            </DialogActions>
          </Form>
        );
      }}
    </Formik>
  );
};
UserGroupForm.propTypes = {
  name: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  handleClose: PropTypes.func,
};

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
  },
  paper: {
    width: 200,
    height: 230,
    overflow: "auto",
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
}));

export default UserGroupForm;

function not(a, b) {
  const filtered = b.map(({id}) => id);
  return a.filter((value) => filtered.indexOf(value.id) === -1);
}
