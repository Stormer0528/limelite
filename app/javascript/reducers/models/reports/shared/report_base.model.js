import produce from "immer";

const ReportBase = {
  // Initial State
  state: {
    title: "",
    subtitle: "",
    startDate: null,
    endDate: null,
    notes: "",
    reportPeriod: "Custom",
    updatedAt: "",
    createdAt: "",
    approvedBy: "",
    createdBy: "",
    errors: [],
    valid: true,
    ui: {
      exportModalOpen: false,
    },
  },

  // Reducer / Actions
  reducers: {
    setTitle: (state, title) => Object.assign({}, state, {title}),
    setSubtitle: (state, subtitle) => Object.assign({}, state, {subtitle}),
    setStartDate: (state, startDate) => Object.assign({}, state, {startDate}),
    setEndDate: (state, endDate) => Object.assign({}, state, {endDate}),
    setNotes: (state, notes) => Object.assign({}, state, {notes}),
    setShowActiveRows: (state, showActiveRows) =>
      Object.assign({}, state, {showActiveRows}),
    setShowActiveColumns: (state, showActiveColumns) =>
      Object.assign({}, state, {showActiveColumns}),
    setPeriods: (state, periods) => Object.assign({}, state, {periods}),
    setDaysPerPeriod: (state, daysPerPeriod) =>
      Object.assign({}, state, {daysPerPeriod}),
    setReportPeriod: (state, reportPeriod) =>
      Object.assign({}, state, {reportPeriod}),
    setExportModalOpen: (state) =>
      produce(state, (draft) => {
        if (!state.ui) {
          draft.ui = {};
        }
        draft.ui.exportModalOpen = true;
      }),
    setExportModalClosed: (state) =>
      produce(state, (draft) => {
        if (!state.ui) {
          draft.ui = {};
        }
        draft.ui.exportModalOpen = false;
      }),
    setLoading: (state, loading) =>
      produce(state, (draft) => {
        if (!state.ui) {
          draft.ui = {};
        }
        draft.ui.loading = loading;
      }),
    setError: (state, errorMessage) =>
      produce(state, (draft) => {
        if (!state.errors) {
          draft.errors = [];
        }
        const {errors = []} = state;
        draft.errors = [...errors, errorMessage];
      }),
    setValid: (state, valid) =>
      produce(state, (draft) => {
        draft.valid = valid;
      }),
    /**
     * Merge Report: For reports that return all data as a JSON string
     *               -- takes the report object and merges co
     */
    mergeReport: (state, report) => Object.assign({}, state, report),
    loadReport: (state, report) =>
      produce(state, (draft) => {
        if (!report) {
          return;
        }

        if (report && report.data) {
          draft.data = JSON.parse(report.data);
        }
        draft.startDate = report.startDate;
        draft.endDate = report.endDate;
        draft.id = report.id;
        draft.name = report.name;
        draft.subtitle = report.subtitle;
        draft.notes = report.notes;
        draft.accountFundId = report.accountFundId;
        draft.accountFundName = report.accountFundName;
        draft.accountFundCode = report.accountFundCode;
        draft.organizationName = report.organizationName;
        draft.url = `${location.protocol}//${location.host}${report.url}`;
        draft.pdf_url = `${location.protocol}//${location.host}${report.pdfUrl}`;
        draft.xlsx_url = `${location.protocol}//${location.host}${report.xlsxUrl}`;

        draft.months = report.months;
        draft.monthTitles = report.monthTitles;
        draft.colspanWidth = report.colspanWidth;

        if (!state.ui) {
          draft.ui = {};
        }

        draft.ui.loading = false;
        draft.persisted = report.persisted;
        draft.valid = report.valid;
        draft.errors = report.errors;

        if (report.account_search_params) {
          draft.account = {};

          if (report.account_search_params["fund_code"]) {
            draft.account.fundCode = report.account_search_params[
              "fund_code"
            ].join(",");
          }
        }
      }),
  },

  // Async Actions
  // effects: (dispatch) => ({}),
};

export default ReportBase;
