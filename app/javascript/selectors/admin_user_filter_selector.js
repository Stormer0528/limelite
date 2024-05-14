import {createSelector} from "reselect";
import {findIndex, omitBy, isNil, isEmpty, filter} from "lodash";

export const getSelectedUsers = ({users: {selected}}) => selected;
export const getSelectedUserIds = createSelector(
  getSelectedUsers,
  (selected = []) => Object.values(selected).map(({id}) => id)
);
const getUsers = ({users: {users = {}} = {}}) => Object.values(users);

export const getSelectedUserCount = createSelector(
  getSelectedUsers,
  (selected = {}) => {
    return Object.keys(selected).length;
  }
);

export const getUpdatedUserSettings = ({
  settings: {school: school_id, role, admin} = {},
}) => omitBy({school_id, role, admin}, isNil);

// User List filters
//------------------------------------------------------------------------------
// Note:  Each Filter is composed with the next
//        (Admin > Name > Email > School > Role)

const getAdminFilter = ({filters: {admin} = {}}) => admin;
export const getAdminUsers = createSelector(
  getAdminFilter,
  getUsers,
  (admin, users) => {
    return admin ? users.filter(user => user.back_office === true) : users;
  }
);

const getNameFilter = ({filters: {name} = {}}) => name;
export const getUsersWithName = createSelector(
  getNameFilter,
  getAdminUsers,
  (nameFilter, users) => {
    if (isEmpty(nameFilter) || isNil(nameFilter)) {
      return users;
    }

    return filter(
      users,
      ({name = ""}) =>
        ((name && name.toLocaleLowerCase()) || "").indexOf(
          nameFilter.toLocaleLowerCase()
        ) >= 0
    );
  }
);

const getEmailFilter = ({filters: {email} = {}}) => email;
export const getUsersWithEmail = createSelector(
  getEmailFilter,
  getUsersWithName,
  (emailFilter, users) => {
    if (isEmpty(emailFilter) || isNil(emailFilter)) {
      return users;
    }

    return filter(
      users,
      ({email = ""}) =>
        ((email && email.toLocaleLowerCase()) || "").indexOf(
          emailFilter.toLocaleLowerCase()
        ) >= 0
    );
  }
);

const getSchoolFilter = ({filters: {school} = {}}) => school;
export const getUsersWithSchool = createSelector(
  getSchoolFilter,
  getUsersWithEmail,

  (schoolFilter, users) => {
    if (schoolFilter === "all") {
      return users;
    }

    return users.filter(user => {
      return findIndex(user.roles, {school_id: parseInt(schoolFilter)}) !== -1;
    });
  }
);

const getRoleFilter = ({filters: {role} = {}}) => role;
export const getUsersWithRole = createSelector(
  getSchoolFilter,
  getRoleFilter,
  getUsersWithSchool,
  (school_id, role, users) => {
    if (isNil(role) || role === "all") {
      return users;
    }

    return users.filter(user => {
      return findIndex(user.roles, {school_id, role}) !== -1;
    });
  }
);
