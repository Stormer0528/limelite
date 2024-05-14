import {useCallback} from "react";
import {useDispatch} from "react-redux";

import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import {useMutation, useQuery} from "@apollo/react-hooks";

import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";

import OrgIcon from "@material-ui/icons/AccountBox";
import OtherOrgIcon from "@material-ui/icons/AccountCircleOutlined";

import UserFilter from "./visible_user_filter";
import SearchableTable from "../searchable_table/searchable_table";
import ViewLinksColumn from "../searchable_table/components/defaults/view_links_renderer";
import LinkRenderer from "../searchable_table/components/defaults/link_renderer";

import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";

import Star from "@material-ui/icons/Star";
import StarBorder from "@material-ui/icons/StarBorder";
import ArchiveIcon from "@material-ui/icons/Archive";
import UnArchiveIcon from '@material-ui/icons/Unarchive';

import ARCHIVE_USER_MUTATION from "../../graphql/mutations/archive_user.gql";
import UNARCHIVE_USER_MUTATION from "../../graphql/mutations/unarchive_user.gql";
import {textSearch} from "../searchable_table/utils/search_functions";

const AdminUserTable = ({
  orgUsers = [],
  nonOrgUsers = [],
  users = [],
  organization = "",
  classes = {},
  archived = false,
  setUserRole = function () {},
  setUserType = function () {},
  handleRefetchUsers = function () {},
}) => {
  const [archiveUser] = useMutation(ARCHIVE_USER_MUTATION);
  const [unArchiveUser] = useMutation(UNARCHIVE_USER_MUTATION);

  const dispatch = useDispatch();

  const handleResponse = (response) => {
    // OnSuccess -> show success message
    if (response.success) {
      // refecth users
      handleRefetchUsers();

      dispatch({type: "users/setUserMessageType", payload: "info"});
      dispatch({
        type: "users/setUserMessage",
        payload: "User successfully updated",
      });
      dispatch({type: "users/showUserMessage"});
    } else {
      // onError -> show error message
      dispatch({type: "users/setUserMessageType", payload: "error"});
      dispatch({
        type: "users/setUserMessage",
        payload: response.errorMessages[0],
      });
      dispatch({type: "users/showUserMessage"});
    }
  }

  const handleArchiveUser = useCallback(
    (id) => async () => {
      if (!confirm("Are you sure you want to archive this user?")) {
        return;
      }

      const {
        data: {archiveUser: response},
      } = await archiveUser({variables: {id}});

      handleResponse(response);
    },
    [archiveUser, handleRefetchUsers, dispatch]
  );

  const handleUnArchiveUser = useCallback(
    (id) => async () => {
      if (!confirm("Are you sure you want to unarchive this user?")) {
        return;
      }

      const {
        data: {unArchiveUser: response},
      } = await unArchiveUser({variables: {id}});

      handleResponse(response);
    },
    [unArchiveUser, handleRefetchUsers, dispatch]
  )

  return (
    <Paper className={classes.paperRoot}>
      <UserFilter />
      {organization === "" && (
        <SearchableTable
          className={`${classes.root}`}
          data={users}
          headers={["Admin", "Name", "Email", "", ""]}
          cells={[
            AdminCell,
            LinkRow,
            "email",

            ViewLinksColumn({
              pathProperty: "url",
              editPathProperty: "editUrl",
              deletePathProperty: "url",
              defaultDelete: true,
              showEdit: true,
              showDelete: false,
              columnWidth: 35,
              flexGrow: 0,
            }),
            ArchiveCell(!archived ? handleArchiveUser : handleUnArchiveUser, archived),
          ]}
        />
      )}
      {organization !== "" && (
        <div className={classes.expansionRoot}>
          <Accordion
            defaultExpanded
            classes={{
              expanded: classes.panelExpanded,
            }}
          >
            <AccordionSummary
              className={classes.panelSummary}
              classes={{expanded: classes.panelSummaryExpanded}}
            >
              <Typography className={classes.heading}>
                <OrgIcon className={classes.icon} />
                Organization Users
              </Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.panelInner}>
              <SearchableTable
                className={`${classes.root}`}
                data={orgUsers}
                headers={["Admin", "Name", "Email", "Type", "", ""]}
                cells={[
                  AdminCell,
                  LinkRow,
                  "email",
                  TypeCell(organization, setUserType),
                  ViewLinksColumn({
                    pathProperty: "url",
                    editPathProperty: "editUrl",
                    deletePathProperty: "url",
                    showEdit: true,
                    showDelete: false,
                    columnWidth: 35,
                    flexGrow: 0,
                  }),
                  ArchiveCell(handleArchiveUser),
                ]}
              />
            </AccordionDetails>
          </Accordion>
          <Accordion
            classes={{
              expanded: classes.panelExpanded,
            }}
          >
            <AccordionSummary
              className={classes.panelSummary}
              classes={{expanded: classes.panelSummaryExpanded}}
            >
              <Typography className={classes.heading}>
                <OtherOrgIcon className={classes.icon} />
                Other Users
              </Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.panelInner}>
              <SearchableTable
                className={`${classes.root}`}
                data={nonOrgUsers}
                headers={["Admin", "Name", "Email", "Type", "", ""]}
                cells={[
                  AdminCell,
                  LinkRow,
                  "email",
                  TypeCell(organization, setUserType),
                  ViewLinksColumn({
                    pathProperty: "url",
                    editPathProperty: "editUrl",
                    deletePathProperty: "url",
                    showEdit: true,
                    showDelete: false,
                    columnWidth: 35,
                    flexGrow: 0,
                  }),
                  ArchiveCell(handleArchiveUser),
                ]}
              />
            </AccordionDetails>
          </Accordion>
        </div>
      )}
    </Paper>
  );
};

AdminUserTable.propTypes = {
  users: PropTypes.array,
  orgUsers: PropTypes.array,
  nonOrgUsers: PropTypes.array,
  organization: PropTypes.string,
  setUserRole: PropTypes.func.isRequired,
  setUserType: PropTypes.func.isRequired,
  handleRefetchUsers: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const styles = () => ({
  paperRoot: {
    marginTop: 65,
  },
  root: {
    ["& .SearchableTable .ReactVirtualized__Table__headerRow .ReactVirtualized__Table__headerColumn"]:
      {
        marginRight: 0,
      },
    ["& .ReactVirtualized__Table__rowColumn"]: {
      height: "100%",
      width: "100%",
      marginRight: 0,
      display: "flex",
      alignItems: "center",

      ["& > div"]: {
        height: "100%",
        padding: ".5rem",
      },
    },
  },
  icon: {
    color: "#607D8B",
    padding: 0,
    marginRight: "0.5em",
  },
  heading: {
    color: "#607D8B",
    fontSize: "16px",
    fontWeight: 500,
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
  },
  expansionRoot: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
  panelExpanded: {
    marginTop: "0 !important",
    marginBottom: "0 !important",
    borderRadius: "0 !important",
    flexGrow: 1,
  },
  panelSummary: {
    background: "#f5f5f5",
  },
  panelSummaryExpanded: {
    margin: "0 0 !important",
    minHeight: "24px !important",
    alignItems: "center",

    ["& > p"]: {
      margin: "12px 0",
    },
  },
  panelInner: {
    padding: 0,
  },
  panelHeader: {
    ["&:last-child"]: {
      borderRadius: 0,
    },
  },
});

export default withStyles(styles)(AdminUserTable);

// TABLE ROWS
//------------------------------------------------------------------------------
const LinkRow = LinkRenderer("fullName", "url");
LinkRow.customSortFunc = textSearch("name");
LinkRow.columnWidth = 135;
LinkRow.flexGrow = 0;

const AdminCell = ({rowData: {admin}}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginRight: "0.5em",
      }}
    >
      {admin ? (
        <Star nativeColor="#4CAF50" />
      ) : (
        <StarBorder nativeColor="#CFD8DC" />
      )}
    </div>
  );
};

AdminCell.propTypes = {
  rowData: PropTypes.shape({
    admin: PropTypes.bool,
  }),
};

AdminCell.columnWidth = 70;
AdminCell.flexGrow = 0;

const RoleCell = (org_id, setUserRole) => {
  const Cell = ({rowData: {id, organizationAssignments = []}}) => {
    if (org_id === "") {
      return null;
    }

    const assignments = organizationAssignments.filter(
      (assignment) => assignment.organizationId === org_id
    );
    const assignment = assignments[0] || {};
    const {["role"]: role = "None", type: assignmentType = "None"} = assignment;

    return (
      <div>
        <FormControl fullWidth>
          <Select
            value={role}
            onChange={setUserRole(id, org_id)}
            disabled={assignmentType !== "EditorAssignment"}
            variant="filled"
            inputProps={{
              className: "browser-default",
            }}
          >
            <MenuItem key="None" value="None">
              None
            </MenuItem>
            <MenuItem key="APClerk" value="AP Clerk">
              AP Clerk
            </MenuItem>
            <MenuItem key="StaffAccountant" value="Staff Accountant">
              Staff Accountant
            </MenuItem>
            <MenuItem key="Controller" value="Controller">
              Controller
            </MenuItem>
            <MenuItem key="CallRequestor" value="Call Requestor">
              Call Requestor
            </MenuItem>
          </Select>
        </FormControl>
      </div>
    );
  };

  Cell.displayName = "RoleCell";
  Cell.propTypes = {
    rowData: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      organizationAssignments: PropTypes.array,
    }),
  };

  Cell.columnWidth = 115;
  Cell.flexGrow = 0;

  return Cell;
};

const DepartmentCell =
  ({departments = [], handleUpdateUserDepartment = function () {}}) =>
  ({rowData: {id, departmentId = ""} = {}}) => {
    return (
      <TextField
        select
        fullWidth
        onChange={handleUpdateUserDepartment(id)}
        value={departmentId || ""}
      >
        <MenuItem value="">None</MenuItem>
        {departments.map(({name, id}) => (
          <MenuItem value={id} key={id}>
            {name}
          </MenuItem>
        ))}
      </TextField>
    );
  };

const ArchiveCell = (handleArchiveUser = function () {}, archived=false) => {
  const Cell = ({rowData: {id}}) => {
    return (
      <div>
        <Tooltip title={!archived ? "Archive User" : "UnArchive User"} placement="top">
          <IconButton onClick={handleArchiveUser(id)}>
            {
              !archived &&
                <ArchiveIcon style={{fill: "#e53935"}} /> ||
                <UnArchiveIcon style={{fill: "#e53935"}} />
            }
          </IconButton>
        </Tooltip>
      </div>
    );
  };

  Cell.displayName = "ArchiveCell";
  Cell.propTypes = {
    rowData: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  };

  Cell.columnWidth = 35;
  Cell.flexGrow = 0;

  return Cell;
};

const TypeCell = (org_id, setUserType) => {
  const Cell = ({rowData: {id, organizationAssignments = []}}) => {
    if (org_id === "") {
      return null;
    }

    const assignments = organizationAssignments.filter(
      (assignment) => assignment.organizationId === org_id
    );
    const assignment = assignments[0] || {};
    const {["type"]: assignmentType = "None"} = assignment;

    return (
      <div>
        <FormControl fullWidth>
          <Select
            value={assignmentType}
            onChange={setUserType(id, org_id)}
            inputProps={{
              className: "browser-default",
            }}
          >
            <MenuItem key="None" value={null}>
              None
            </MenuItem>
            <MenuItem key="ViewerAssignment" value="ViewerAssignment">
              Viewer
            </MenuItem>
            <MenuItem key="EditorAssignment" value="EditorAssignment">
              Editor
            </MenuItem>
            <MenuItem key="OwnerAssignment" value="OwnerAssignment">
              Owner
            </MenuItem>
          </Select>
        </FormControl>
      </div>
    );
  };

  // PropTypes
  Cell.displayName = "TypeCell";
  Cell.propTypes = {
    rowData: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      organizationAssignments: PropTypes.arrayOf(
        PropTypes.shape({
          organizationId: PropTypes.string,
          type: PropTypes.string,
        })
      ),
    }),
  };

  Cell.columnWidth = 115;
  Cell.flexGrow = 0;

  return Cell;
};
