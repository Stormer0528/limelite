import {connect} from "react-redux";
import {eventHandlers as DateHandlers} from "../../../shared/date_range_toggle";
import {eventHandlers as AmountHandlers} from "../../../shared/amount_toggle";

import EntriesTableFilter from "./entries_table_filter";

const mapStateToProps = ({
  filter: {
    filter: {
      start_date,
      end_date,
      dateFilter,
      entry_type,
      journalable_type,
      aasm_state,
      min_amount,
      max_amount,
      amountFilter,
    } = {},
  } = {},
}) => {
  return {
    start_date,
    end_date,
    dateFilter,
    entry_type,
    journalable_type,
    aasm_state,
    min_amount,
    max_amount,
    amountFilter,
  };
};
const mapDispatchToProps = dispatch => ({
  ...DateHandlers(dispatch, "filter"),
  /* handleFilterDateToggleChange, handleBeforeDateFilterChange, handleAfterDateFilterChange */
  ...AmountHandlers(dispatch, "filter"),
  /* handleFilterAmountToggleChange handleMaxAmountFilterChange handleMinAmountFilterChange */
  handleMemoFilterChange: ({target: {value}}) => {
    dispatch.entryFilter.setMemoFilter(value);
  },
  handleTypeFilterChange: ({target: {value}}) => {
    dispatch.entryFilter.setTypeFilter(value);
  },
  handleEntryTypeFilterChange: ({target: {value}}) => {
    dispatch.entryFilter.setEntryTypeFilter(value);
  },
  handleJournalTypeFilterChange: ({target: {value}}) => {
    dispatch.entryFilter.setJournalTypeFilter(value);
  },
  handleStateFilterChange: ({target: {value}}) => {
    dispatch.entryFilter.setStateFilter(value);
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntriesTableFilter);
