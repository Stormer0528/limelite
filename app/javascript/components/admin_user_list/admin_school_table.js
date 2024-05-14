import UpdateFundUsersQuery from "../../graphql/mutations/update_fund_users.gql";
import SchoolsQuery from "../../graphql/queries/organization_schools.gql";
import SearchableTable from "../searchable_table/searchable_table";
import TransferList from "../shared/transfer_list";
import {OrgSelector} from "./org_selector";
import {useQuery, useMutation} from "@apollo/react-hooks";
import FundUsersQuery from "@graphql/queries/fund_users_query.gql";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import LinearProgress from "@material-ui/core/LinearProgress";
import Paper from "@material-ui/core/Paper";
import {withStyles} from "@material-ui/core/styles";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import {Formik, Form} from "formik";
import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import {connect} from "react-redux";

function not(a, b) {
  const filtered = b.map(({id}) => id);
  return a.filter((value) => filtered.indexOf(value.id) === -1);
}

const userListStyles = (theme) => ({
  root: {
    textAlign: "center",
    padding: "8px 24px",
  },
});
const EditUserList = withStyles(userListStyles)(
  ({fund, classes, handleClose}) => {
    const {
      data: {accountFundUsers: fundUsers = [], users: allUsers = []} = {},
      loading,
    } = useQuery(FundUsersQuery, {
      variables: {id: fund.id, organizationId: fund.organizationId},
      fetchPolicy: "network-only",
    });
    const [updateUsers] = useMutation(UpdateFundUsersQuery);

    const unselectedUsers = not(allUsers, fundUsers);
    return (
      <Formik
        onSubmit={async (values, {setSubmitting}) => {
          setSubmitting(true);
          await updateUsers({
            variables: {
              ...values,
              organizationId: fund.organizationId,
              accountFundId: fund.id,
            },
          });

          setSubmitting(false);
          handleClose();
        }}
        initialValues={{userIds: fundUsers.map(({id}) => id)}}
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
                      currentUsers: fundUsers,
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
  }
);

const AdminSchoolTable = ({
  organizations,
  organization_id,
  setCurrentOrg,
  setFunds,
  classes,
}) => {
  const organizationId = organization_id || organizations[0].id;
  const {loading = false, data: {accountFunds: funds = []} = {}} = useQuery(
    SchoolsQuery,
    {
      variables: {organizationId},
      fetchPolicy: "network-only",
    }
  );

  const [currentFund, setCurrentFund] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (!loading && funds.length) {
      setFunds(funds);
    }
  }, [loading, funds]);

  const FundActions = ({rowData}) => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginRight: 10,
        }}
      >
        <IconButton
          component="a"
          onClick={(e) => {
            e.preventDefault();

            setCurrentFund(rowData);
            setModalVisible(true);
          }}
          rel="nofollow"
          style={{
            color: "#8BC34A",
            height: "auto",
            width: "auto",
            borderRadius: "5px",
            padding: "3px",
          }}
        >
          <EditIcon />
        </IconButton>
      </div>
    );
  };
  FundActions.columnWidth = 25;

  const TableCell = (width, attr) => {
    const cell = ({rowData}) => {
      return <div>{rowData[attr]}</div>;
    };
    cell.columnWidth = width;

    return cell;
  };

  const tableData = funds.map((fund) => {
    const organization = organizations.find(
      (org) => org.id == fund.organizationId
    );
    return {
      organization: organization ? organization.name : "",
      ...fund,
    };
  });

  return (
    <Paper className={classes.paperRoot}>
      <div className={classes.header}>
        <div className={classes.spacer} />

        <div className={classes.organization}>
          <OrgSelector
            organizations={organizations}
            organization_id={organizationId}
            showAllOrgOption={false}
            setCurrentOrg={(e) => {
              const id = e.target.value;
              const organization = organizations.find((org) => org.id == id);

              if (organization) {
                setCurrentOrg(organization);
              }
            }}
          />
        </div>
      </div>

      <div className={classes.content}>
        <SearchableTable
          data={tableData}
          headers={["name", "code", "organization", ""]}
          cells={[
            TableCell(200, "name"),
            TableCell(25, "code"),
            TableCell(100, "organization"),
            FundActions,
          ]}
        />
      </div>

      <Dialog
        fullWidth
        maxWidth="md"
        aria-labelledby="fund-title"
        open={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <DialogTitle className={classes.title} id="fund-title">
          {currentFund.name} Users
        </DialogTitle>
        <EditUserList
          fund={currentFund}
          handleClose={() => setModalVisible(false)}
        />
      </Dialog>
    </Paper>
  );
};

AdminSchoolTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  const {funds: {organization = {}} = {}} = state;

  return {
    organization_id: organization.id || "",
  };
};

const mapDispatchToProps = (dispatch) => ({
  setCurrentOrg: (organization) => {
    dispatch({type: "funds/setOrganization", payload: organization});
  },
  setFunds: (tree) => {
    dispatch({type: "funds/setFunds", payload: tree});
  },
});

const styles = (theme) => ({
  paperRoot: {
    marginTop: 65,
  },
  header: {
    display: "flex",
    paddingTop: 10,
    paddingBottom: 10,
    margin: theme.spacing(2),
  },
  spacer: {
    flexGrow: 1,
  },
  organization: {
    maxWidth: 350,
  },
  title: {
    textAlign: "center",
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AdminSchoolTable));
