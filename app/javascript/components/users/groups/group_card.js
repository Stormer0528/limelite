import PropTypes from "prop-types";
import {useState, useCallback} from "react";
import {makeStyles} from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";

import NewGroupModal from "./user_group_modal";
import GroupUsersModal from "./group_users_modal";

import UserGroupIcon from "../../shared/icons/user_group_icon";
import UsersIcon from "@material-ui/icons/Group";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";

const GroupCard = ({
  name = "User Group",
  id,
  refetch = function () {},
  organizationId = 0,
  ...restProps
}) => {
  const cl = useStyles();
  const [editOpen, setEditOpen] = useState(false);
  const [usersOpen, setUsersOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const handleEditOpen = useCallback(() => setEditOpen(true), [setEditOpen]);
  const handleEditClose = useCallback(() => setEditOpen(false), [setEditOpen]);

  const handleUsersOpen = useCallback(() => setUsersOpen(true), [setUsersOpen]);
  const handleUsersClose = useCallback(
    () => setUsersOpen(false),
    [setUsersOpen]
  );

  const handleAddOpen = useCallback(() => setAddOpen(true), [setAddOpen]);
  const handleAddClose = useCallback(() => setAddOpen(false), [setAddOpen]);

  return (
    <Card className="group-card">
      <CardHeader
        avatar={<UserGroupIcon className={cl.icon} />}
        title={
          <Typography variant="h6" className={cl.groupName}>
            {name}
          </Typography>
        }
      />
      <CardActions className={cl.cardActions}>
        <Button
          onClick={handleEditOpen}
          color="secondary"
          size="small"
          startIcon={<EditIcon />}
        >
          Edit
        </Button>
        <Button onClick={handleAddOpen} color="primary" size="small">
          <AddIcon />
        </Button>
        <Button
          onClick={handleUsersOpen}
          color="primary"
          size="small"
          startIcon={<UsersIcon />}
        >
          Users
        </Button>
      </CardActions>

      {/* Edit Modal */}
      {editOpen && (
        <NewGroupModal
          {...{
            id,
            name,
            ...restProps,
            open: editOpen,
            handleClose: handleEditClose,
            action: "edit",
          }}
        />
      )}

      {/* New Modal */}
      {addOpen && (
        <NewGroupModal
          {...{
            parentId: id,
            open: addOpen,
            handleClose: handleAddClose,
            action: "new",
            refetch,
          }}
        />
      )}

      {/* Users Modal */}
      {usersOpen && (
        <GroupUsersModal
          {...{id, name, open: usersOpen, handleClose: handleUsersClose, organizationId}}
        />
      )}
    </Card>
  );
};

GroupCard.propTypes = {
  name: PropTypes.string,
  permissions: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  refetch: PropTypes.func.isRequired,
};

const useStyles = makeStyles((theme) => {
  return {
    icon: {
      color: "#bdbdbd",
      height: 40,
      width: 40,
    },
    groupName: {
      fontSize: "16px",
    },
    cardActions: {
      borderTop: "1px solid #f0f0f0",
      background: "linear-gradient(to bottom, #fafafa, #f0f0f0)",
      display: "flex",
      justifyContent: "space-around",
    },
  };
});

export default GroupCard;
