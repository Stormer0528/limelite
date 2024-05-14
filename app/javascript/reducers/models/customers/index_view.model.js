import produce from "immer";

const IndexViewModel = {
  state: {
    ui: {
      tabIndex: 0,
    },
    customerFilter: {
      aasm_state: "",
    },
    invoiceFilter: {
      aasm_state: "",
      paid: false,
    },
  },
  reducers: {
    setTabIndex: (state, tabIndex) =>
      produce(state, (draftState) => {
        draftState.ui.tabIndex = tabIndex;
      }),
    setCustomerStateFilter: (state, aasm_state) =>
      produce(state, (draftState) => {
        if (!state.customerFilter) {
          draftState.customerFilter = {};
        }

        draftState.customerFilter.aasm_state = aasm_state;
      }),
    setCustomerNameFilter: (state, name) =>
      produce(state, (draftState) => {
        if (!state.customerFilter) {
          draftState.customerFilter = {};
        }

        draftState.customerFilter.name = name;
      }),
    setCustomerInvoiceableIdFilter: (state, id) =>
      produce(state, (draftState) => {
        if (!state.invoiceFilter) {
          draftState.invoiceFilter = {};
        }

        draftState.invoiceFilter.invoiceable_id = id;
      }),
    setCustomerNumberFilter: (state, number) =>
      produce(state, (draftState) => {
        if (!state.customerFilter) {
          draftState.customerFilter = {};
        }

        draftState.customerFilter.number = number;
      }),
    setInvoiceStateFilter: (state, aasm_state) =>
      produce(state, (draftState) => {
        if (!state.customerFilter) {
          draftState.invoiceFilter = {};
        }

        draftState.invoiceFilter.aasm_state = aasm_state;
      }),
    setInvoiceCustomerNameFilter: (state, customer_name) =>
      produce(state, (draftState) => {
        if (!state.invoiceFilter) {
          draftState.invoiceFilter = {};
        }

        draftState.invoiceFilter.customer_name = customer_name;
      }),
    setInvoiceNumberFilter: (state, number) =>
      produce(state, (draftState) => {
        if (!state.invoiceFilter) {
          draftState.invoiceFilter = {};
        }

        draftState.invoiceFilter.number = number;
      }),
    setInvoicePaidFilter: (state, paid) =>
      produce(state, (draftState) => {
        if (!state.invoiceFilter) {
          draftState.invoiceFilter = {};
        }

        draftState.invoiceFilter.paid = paid ? null : false;
      }),
  },
};

export default IndexViewModel;
