import produce from "immer";

const StatementModel = {
  // Initial State
  state: {
    started_at: "",
    ended_at: "",
    starting_balance: "",
    ending_balance: "",
    selected_balance: "",
    aasm_state: "draft",
    aasm_action: "save_draft",
    selectedItems: {},
    availableItems: {},
    persisted: false,
    editable: true,
    filter: {
      show: false,
      type: "ALL",
      start_date: "",
      end_date: "",
      name: "",
      amount: "",
      number: "",
    },
    sort: {
      column: "",
      direction: "asc",
    },
    indexSort: {
      column: "",
      direction: "asc",
    },
    ui: {
      debits: {open: true},
      credits: {open: true},
      confirmationModal: false,
    },
    permissions: {
      save_draft: true,
      send_for_approval: true,
    },
  },
  // Reducer / Actions
  reducers: {
    setStartDate: (state, started_at) => Object.assign({}, state, {started_at}),
    setEndDate: (state, ended_at) => Object.assign({}, state, {ended_at}),
    setFileUrl: (state, file_url) => Object.assign({}, state, {file_url}),
    setStartingBalance: (state, starting_balance) =>
      Object.assign({}, state, {starting_balance}),
    setEndingBalance: (state, ending_balance) =>
      Object.assign({}, state, {ending_balance}),
    addAvailableItem: (state, {item}) =>
      produce(state, (draftState) => {
        draftState.availableItems.push(item);
      }),
    setAvailableItems: (state, {availableItems, starting_balance}) =>
      produce(state, (draftState) => {
        draftState.availableItems = updateItems(availableItems);
        draftState.selectedItems = {};
        draftState.selected_balance = "0.00";

        if (!state.ending_balance || state.ending_balance === "") {
          draftState.ending_balance = `${
            starting_balance + calcItemBalance(availableItems)
          }`;
        }
      }),
    updateAvailableItems: (state, {availableItems, starting_balance}) =>
      produce(state, (draftState) => {
        draftState.availableItems = Object.assign(
          {},
          updateItems(availableItems),
          state.availableItems
        );

        if (!state.ending_balance || state.ending_balance === "") {
          draftState.ending_balance = `${
            starting_balance + calcItemBalance(availableItems)
          }`;
        }
      }),
    addSelectedItem: (state, new_item) =>
      produce(state, (draftState) => {
        draftState.selectedItems[new_item.id] = new_item;
      }),
    removeSelectedItem: (state, {id}) =>
      produce(state, (draftState) => {
        delete draftState.selectedItems[id];
      }),
    setFilterStartDate: (state, start_date) =>
      produce(state, (draftState) => {
        draftState.filter.start_date = start_date;
      }),
    setFilterEndDate: (state, end_date) =>
      produce(state, (draftState) => {
        draftState.filter.end_date = end_date;
      }),
    setFilterType: (state, type) =>
      produce(state, (draftState) => {
        draftState.filter.type = type;
      }),
    setFilterAmount: (state, amount) =>
      produce(state, (draftState) => {
        draftState.filter.amount = amount;
      }),
    setFilterName: (state, name) =>
      produce(state, (draftState) => {
        draftState.filter.name = name;
      }),
    setFilterNumber: (state, number) =>
      produce(state, (draftState) => {
        draftState.filter.number = number;
      }),
    setSortColumnAndDirection: (state, column) =>
      produce(state, (draftState) => {
        draftState.sort.column = column;
        if (state.sort.column === column) {
          draftState.sort.direction =
            state.sort.direction === "asc" ? "desc" : "asc";
        } else {
          draftState.sort.direction = "asc";
        }
      }),
    setIndexSortColumnAndDirection: (state, column) =>
      produce(state, (draftState) => {
        draftState.indexSort.column = column;
        if (state.indexSort.column === column) {
          draftState.indexSort.direction =
            state.indexSort.direction === "asc" ? "desc" : "asc";
        } else {
          draftState.indexSort.direction = "asc";
        }
      }),
    setAasmAction: (state, aasm_action) =>
      Object.assign({}, state, {aasm_action}),
    toggleFilterShow: (state) =>
      produce(state, (draftState) => {
        draftState.filter.show = !state.filter.show;
      }),
    toggleDebitsOpen: (state) =>
      produce(state, (draftState) => {
        draftState.ui.debits.open = !state.ui.debits.open;
      }),
    toggleCreditsOpen: (state) =>
      produce(state, (draftState) => {
        draftState.ui.credits.open = !state.ui.credits.open;
      }),
    toggleConfirmationModal: (state) =>
      produce(state, (draftState) => {
        draftState.ui.confirmationModal = !state.ui.confirmationModal;
      }),
    loadStatement: (state, statement) =>
      produce(state, (draftState) => {
        draftState.started_at = statement.startedAt; // GraphQL is returning a sting w. quotes for some reason
        draftState.ended_at = statement.endedAt; // GraphQL is returning a sting w. quotes for some reason
        draftState.starting_balance = statement.startingBalance;
        draftState.ending_balance = statement.endingBalance;
        draftState.adjustment_amount = statement.adjustmentAmount;
        draftState.aasm_state = statement.aasmState;
        draftState.file_url = statement.fileUrl;
        draftState.permissions = statement.permissions;
        draftState.id = statement.id;
        draftState.persisted = true;
        draftState.audits = statement.audits;
        draftState.editable = statement.aasmState !== "approved";

        // Load items
        const itemAry = statement.items.reduce((obj, item) => {
          obj[item.id] = item;
          return obj;
        }, {});
        draftState.selectedItems = itemAry;
        draftState.availableItems = itemAry;
      }),
  },
  // Async Actions
  effects: {},
};

export default StatementModel;

//  Helper Functions
//------------------------------------------------------------------------------
function updateItems(items = []) {
  return items.reduce(
    (items, item) => Object.assign({}, items, {[item.id]: item}),
    {}
  );
}

function calcItemBalance(items = []) {
  const total = items.reduce(
    (sum, item) =>
      item.type === "Charge" || item.type === "Payment"
        ? sum - parseInt(item.amountInCents)
        : sum + item.amount,
    0
  );

  return (total / 100).toFixed(2);
}
