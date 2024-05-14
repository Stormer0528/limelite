import produce from "immer";

const AccountFinderModel = {
  state: {
    accounts: [],
    selected: {},
    loading: false,
    ui: {
      open: false,
      minimized: false,
      accountModal: {
        open: false,
        name: "",
        budget: 0.0,
      },
    },
  },
  // Reducer / Actions
  reducers: {
    setLoading: (state, loading) => Object.assign({}, state, {loading}),
    // Modal UI
    setModalOpen: (state, open) =>
      produce(state, draftState => {
        draftState.ui.open = open;
      }),
    toggleModalOpen: (state, open) =>
      produce(state, draftState => {
        if (!state.ui) {
          draftState.ui = {};
        }
        draftState.ui.open = !open;
      }),
    // Account Modal UI
    setAccountModalId: (state, id) =>
      produce(state, draftState => {
        draftState.ui.accountModal.id = id;
      }),
    setAccountModalName: (state, {name}) =>
      produce(state, draftState => {
        draftState.ui.accountModal.name = name;
      }),
    setAccountModalBudget: (state, {budget}) =>
      produce(state, draftState => {
        draftState.ui.accountModal.budget = budget;
      }),
    setAccountModalOpen: (state, open) =>
      produce(state, draftState => {
        draftState.ui.accountModal.open = open;

        // Unset errors on close
        if (!open) {
          draftState.ui.accountModal.errors = [];
        }
      }),
    resetAccountModal: state =>
      produce(state, draftState => {
        draftState.ui.accountModal = {
          open: false,
          name: "",
          budget: 0.0,
          errors: [],
        };
      }),
    toggleAccountModalOpen: state =>
      produce(state, draftState => {
        if (!state.ui) {
          draftState.ui = {accountModal: {}};
        }
        draftState.ui.accountModal.open = !open;

        // Unset errors on close
        if (state.ui.accountModal.open) {
          draftState.ui.accountModal.errors = [];
        }
      }),
    setAccountErrors: (state, {errors}) =>
      produce(state, draftState => {
        if (!state.ui) {
          draftState.ui = {accountModal: {}};
        }
        draftState.ui.accountModal.errors = errors;
      }),
    // Finder Table UI
    setFinderMinimized: (state, minimized) =>
      produce(state, draftState => {
        draftState.ui.minimized = minimized;
      }),
    toggleFinderMinimized: state =>
      produce(state, draftState => {
        draftState.ui.minimized = !state.ui.minimized;
      }),
    // Available items
    setAccounts: (state, accounts) => {
      return Object.assign({}, state, {accounts});
    },
    // Set Selected
    setName: (state, name) =>
      produce(state, draftState => {
        draftState.selected.name = name;
      }),
    setFundId: (state, fundId) =>
      produce(state, draftState => {
        draftState.selected.fundId = fundId;
      }),
    setFunctionId: (state, functionId) =>
      produce(state, draftState => {
        draftState.selected.functionId = functionId;
      }),
    setGoalId: (state, goalId) =>
      produce(state, draftState => {
        draftState.selected.goalId = goalId;
      }),
    setLocationId: (state, locationId) =>
      produce(state, draftState => {
        draftState.selected.locationId = locationId;
      }),
    setObjectId: (state, objectId) =>
      produce(state, draftState => {
        draftState.selected.objectId = objectId;
      }),
    setResourceId: (state, resourceId) =>
      produce(state, draftState => {
        draftState.selected.resourceId = resourceId;
      }),
    setYearId: (state, yearId) =>
      produce(state, draftState => {
        draftState.selected.yearId = yearId;
      }),
  },
  // Async Actions
  // effects: {}
};

export default AccountFinderModel;
