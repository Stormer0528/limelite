import {useState, useCallback, useEffect} from "react";
import PropTypes from "prop-types";
import {format, toDate} from "date-fns/esm";
import {useDelta} from "react-delta";
import {KeyboardDatePicker} from "@material-ui/pickers";
import isNil from "lodash/isNil";

/**
 *  KeyboardDate
 *   -- input format must match string provided ... or else date is converted to UTC date and can be off
 *   -- input responds with date with current time zone
 *   -- this component is an adapter for both formats
 *   -- it also maintains state if the date
 * @param {*} param0
 */

export default function KeyboardDate({
  displayFormat = "MM/dd/yyyy",
  outputFormat = "yyyy-MM-dd",
  value,
  onChange,
  ...rest
}) {
  const [currentValue, setCurrentValue] = useState(
    formatDate(value),
    displayFormat
  );

  const handleChange = useCallback(
    (val, partialValue) => {
      setCurrentValue(isValidDate(val) ? formatDate(val) : partialValue);

      if (isValidDate(val)) {
        onChange(formatDate(val, outputFormat));
      }
    },
    [onChange, outputFormat]
  );

  const {curr = value, prev = value} = useDelta(value) || {};

  // Update Dates if prop is changed externally
  useEffect(() => {
    // Date
    if (value === "" || isNil(value)) {
      setCurrentValue(null);
      return;
    }

    if (/^_/.test(currentValue) && isValidDate(value)) {
      setCurrentValue(value);
    }

    if (!currentValue && value) {
      setCurrentValue(formatDate(value));
    }

    if (curr !== prev) {
      setCurrentValue(formatDate(value));
    }
  });

  return (
    <KeyboardDatePicker
      format={displayFormat}
      value={currentValue}
      onChange={handleChange}
      {...rest}
    />
  );
}

KeyboardDate.propTypes = {
  displayFormat: PropTypes.string,
  outputFormat: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
};

// HELPERS
//-----------------------------------------------------------

// Based on https://stackoverflow.com/questions/1353684/detecting-an-invalid-date-date-instance-in-javascript#answer-1353945
const isValidDate = (d) => d instanceof Date && isFinite(d);
const formatDate = (d, dateFormat = "MM/dd/yyyy") => {
  if (d === "" || isNil(d)) {
    return null;
  }
  return format(toDate(d), dateFormat);
};
