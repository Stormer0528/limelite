import PropTypes from "prop-types";
import {useFormikContext} from "formik";
import {format} from "date-fns/esm";

const HiddenInputs = ({parent_class}) => {
  const {values} = useFormikContext();
  const {
    entry: {id: entryId, date, entryType, entryItems, fileUrl},
  } = values;

  return (
    <div className="hidden HiddenInputs">
      {/*  Entry Fields */}
      {entryId && (
        <input
          name={`${parent_class}[entry_attributes][id]`}
          type="hidden"
          value={`${entryId}`}
        />
      )}
      <input
        name={`${parent_class}[entry_attributes][date]`}
        type="hidden"
        value={date}
      />

      <input
        name={`${parent_class}[entry_attributes][entry_type]`}
        type="hidden"
        value={`${entryType}`}
      />
      {fileUrl && (
        <input
          name={`${parent_class}[entry_attributes][file_url]`}
          type="hidden"
          value={`${fileUrl}`}
        />
      )}
      {/*  Entry Items */}
      {entryItems.map(
        (
          {
            accountId,
            account_id,
            id: entry_item_id,
            amount,
            type,
            memo,
            payableType,
            payableId,
          },
          i
        ) => {
          return (
            <div key={i}>
              {entry_item_id && (
                <input
                  name={`${parent_class}[entry_attributes][entry_items_attributes][${i}][id]`}
                  type="hidden"
                  value={`${entry_item_id}`}
                />
              )}
              <input
                name={`${parent_class}[entry_attributes][entry_items_attributes][${i}][amount]`}
                type="hidden"
                value={`${amount}`}
              />
              <input
                name={`${parent_class}[entry_attributes][entry_items_attributes][${i}][type]`}
                type="hidden"
                value={`${type || "Credit"}`}
              />
              <input
                name={`${parent_class}[entry_attributes][entry_items_attributes][${i}][account_id]`}
                type="hidden"
                value={`${accountId === undefined ? account_id : accountId}`}
              />
              <input
                name={`${parent_class}[entry_attributes][entry_items_attributes][${i}][memo]`}
                type="hidden"
                value={`${memo || ""}`}
              />
              <input
                name={`${parent_class}[entry_attributes][entry_items_attributes][${i}][payable_type]`}
                type="hidden"
                value={`${payableType || ""}`}
              />
              <input
                name={`${parent_class}[entry_attributes][entry_items_attributes][${i}][payable_id]`}
                type="hidden"
                value={`${payableId || ""}`}
              />
            </div>
          );
        }
      )}
    </div>
  );
};

HiddenInputs.propTypes = {
  id: PropTypes.string,
  entry_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  parent_class: PropTypes.string,
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  memo: PropTypes.string,
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  finalPay: PropTypes.bool,
  entry_type: PropTypes.string,
  entry_items: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      account_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      entry_item_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
};

export default HiddenInputs;
