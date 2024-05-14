import produce from "immer";

const IndexViewModel = {
  state: {
    ui: {
      tabIndex: 0,
    },
    vendorFilter: {
      aasm_state: "ALL",
    },
    invoiceFilter: {
      aasm_state: "ALL",
      voided: false,
      paid: false,
    },
    batchUploadFilter: {
      aasmState: "",
    },
  },
  reducers: {
    setTabIndex: (state, tabIndex) =>
      produce(state, (draftState) => {
        draftState.ui.tabIndex = tabIndex;
      }),
    setBatchUploadStateFilter: (state, aasmState) =>
      produce(state, (draftState) => {
        if (!state.batchUploadFilter) {
          draftState.batchUploadFilter = {};
        }

        draftState.batchUploadFilter.aasmState = aasmState;
      }),
    setVendorStateFilter: (state, aasm_state) =>
      produce(state, (draftState) => {
        if (!state.vendorFilter) {
          draftState.vendorFilter = {};
        }

        draftState.vendorFilter.aasm_state = aasm_state;
      }),
    setVendorNameFilter: (state, name) =>
      produce(state, (draftState) => {
        if (!state.vendorFilter) {
          draftState.vendorFilter = {};
        }

        draftState.vendorFilter.name = name;
      }),
    setVendorNumberFilter: (state, number) =>
      produce(state, (draftState) => {
        if (!state.vendorFilter) {
          draftState.vendorFilter = {};
        }

        draftState.vendorFilter.number = number;
      }),
    setInvoiceStateFilter: (state, aasm_state) =>
      produce(state, (draftState) => {
        if (!state.vendorFilter) {
          draftState.invoiceFilter = {};
        }

        draftState.invoiceFilter.aasm_state = aasm_state;
      }),
    setInvoiceVendorNameFilter: (state, vendor_name) =>
      produce(state, (draftState) => {
        if (!state.invoiceFilter) {
          draftState.invoiceFilter = {};
        }

        draftState.invoiceFilter.vendor_name = vendor_name;
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

        draftState.invoiceFilter.paid = paid;
      }),
    setInvoiceVoidFilter: (state, voided) =>
      produce(state, (draftState) => {
        if (!state.invoiceFilter) {
          draftState.invoiceFilter = {};
        }

        draftState.invoiceFilter.voided = voided;
      }),
    setVendorInvoiceableIdFilter: (state, id) =>
      produce(state, (draftState) => {
        if (!state.invoiceFilter) {
          draftState.invoiceFilter = {};
        }
        draftState.invoiceFilter.invoiceable_id = id;
      }),
  },
};

export default IndexViewModel;
