import PropTypes from "prop-types";
import EntryItemsTotals from "./entry_items_totals";
import useEntryForm from "./use_entry_form";

const ConnectedEntryItemsTotals = ({disabled, readOnly, ...rest}) => {
  const {
    totals,
    totals: {total: {balance, totalCredits, totalDebits} = {}} = {},
  } = useEntryForm();

  return (
    <EntryItemsTotals
      {...{
        ...rest,
        totals,
        totalCredits,
        totalDebits,
        balance,
        disabled,
        readOnly,
      }}
    />
  );
};

ConnectedEntryItemsTotals.propTypes = {
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
};

export default ConnectedEntryItemsTotals;
