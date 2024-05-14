
import produce from "immer";

const UserGroupIndexModel = {
  state: {
    organization: {},
    groups: [],
  },

  reducers: {
    setOrganization: (state, organization) =>
      produce(state, nextState => {
        nextState.organization = organization;
      }),
    setUserGroups: (state, groups) =>
      produce(state, nextState => {
        nextState.groups = groups;
      })
  }
}

export default UserGroupIndexModel;
