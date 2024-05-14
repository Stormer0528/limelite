import snakeCase from "lodash/snakeCase";
import produce from "immer";

const defaultState = {
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
};

const StatementModel = {
  // Initial State
  state: defaultState,
  // Reducer / Actions
  reducers: {
    resetStatement: () => {
      return defaultState;
    },
    setStartDate: (state, started_at) => {
      return Object.assign({}, state, {started_at});
    },
    setEndDate: (state, ended_at) => {
      return Object.assign({}, state, {ended_at});
    },
    setFileUrl: (state, file_url) => {
      return Object.assign({}, state, {file_url});
    },
    setStartingBalance: (state, starting_balance) => {
      return Object.assign({}, state, {starting_balance});
    },
    setEndingBalance: (state, ending_balance) => {
      return Object.assign({}, state, {ending_balance});
    },
    setFiscalYear: (state, fiscalYear) => {
      return Object.assign({}, state, {fiscalYear});
    },
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
          draftState.ending_balance = "0.00";
          // draftState.ending_balance = `${starting_balance +
          //  calcItemBalance(availableItems)}`;
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
          draftState.ending_balance = "0.00";
          // draftState.ending_balance = `${starting_balance +
          //  calcItemBalance(availableItems)}`;
        }
      }),
    addSelectedItem: (state, new_item) => {
      return produce(state, (draftState) => {
        draftState.selectedItems[new_item.id] = new_item;
      });
    },
    removeSelectedItem: (state, {id}) => {
      return produce(state, (draftState) => {
        delete draftState.selectedItems[id];
      });
    },
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
    setAasmAction: (state, aasm_action) => {
      return Object.assign({}, state, {aasm_action});
    },
    setEditable: (state, editable) => {
      return Object.assign({}, state, {editable});
    },
    setLoading: (state, loading) => {
      return Object.assign({}, state, {loading});
    },
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
        // Note: keys are snake_case for the moment
        Object.entries(statement).forEach(
          ([key, val]) => (draftState[snakeCase(key)] = val)
        );

        draftState.persisted = true;
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
  return items.reduce((items, item) => {
    return Object.assign({}, items, {[item.id]: item});
  }, {});
}

function calcItemBalance(items = []) {
  const total = items.reduce((sum, item) => {
    return item.type === "Check" || item.type === "Deposit"
      ? sum - parseInt(item.amount_in_cents)
      : sum + parseInt(item.amount_in_cents);
  }, 0);

  return (total / 100).toFixed(2);
}
