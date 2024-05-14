// import findIndex from "lodash/findIndex";
import produce from "immer";

const UserIndexModel = {
  state: {
    users: [],
    settings: {},
    filter: {
      admin: null,
      archived: false,
    },
    ui: {
      notification: {
        visible: false,
        message: "",
      },
    },
  },
  reducers: {
    selectRole: (state, role) =>
      produce(state, nextState => {
        if (!state.filter) {
          state.filter = {};
        }
        nextState.filter.role = role;
      }),

    setName: (state, name) =>
      produce(state, nextState => {
        if (!state.filter) {
          state.filter = {};
        }
        nextState.filter.name = name;
      }),

    setEmail: (state, email) =>
      produce(state, nextState => {
        if (!state.filter) {
          state.filter = {};
        }
        nextState.filter.email = email;
      }),

    setType: (state, type) =>
      produce(state, nextState => {
        if (!state.filter) {
          state.filter = {};
        }
        nextState.filter.type = type;
      }),

    setOrganization: (state, organization) =>
      produce(state, nextState => {
        if (!state.filter) {
          state.filter = {};
        }
        nextState.filter.organization = organization;
      }),

    toggleAdmin: (state, admin) => {
      return Object.assign({}, state, {
        filter: Object.assign({}, state.filter, {
          admin: admin ? true : null,
        }),
      });
    },

    toggleArchived: (state, archived) => {
      return Object.assign({}, state, {
        filter: Object.assign({}, state.filter, {
          archived: archived ? true : false,
        })
      })
    },

    setUserMessageType: (state, messageType) =>
      produce(state, nextState => {
        if (!state.ui) {
          nextState.ui = {};
        }

        if (!state.ui.notification) {
          nextState.ui.notification = {};
        }

        nextState.ui.notification.messageType = messageType;
      }),
    setUserMessage: (state, message) =>
      produce(state, nextState => {
        if (!state.ui) {
          nextState.ui = {};
        }

        if (!state.ui.notification) {
          nextState.ui.notification = {};
        }

        nextState.ui.notification.message = message;
      }),
    showUserMessage: state =>
      produce(state, nextState => {
        if (!state.ui) {
          nextState.ui = {};
        }

        if (!state.ui.notification) {
          nextState.ui.notification = {};
        }

        nextState.ui.notification.visible = true;
      }),
    hideUserMessage: state =>
      produce(state, nextState => {
        if (!state.ui) {
          nextState.ui = {};
        }

        if (!state.ui.notification) {
          nextState.ui.notification = {};
        }

        nextState.ui.notification.visible = false;
      }),
  },
};

export default UserIndexModel;
