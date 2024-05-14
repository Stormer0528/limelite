import {Fragment} from "react";
import {useFormikContext} from "formik";
import PropTypes from "prop-types";

const HiddenInputsForm = ({items = []}) => {
  const {
    values: {printerSettingId},
  } = useFormikContext();

  return (
    <div className="HiddenInputsForm">
      {printerSettingId && (
        <input
          type="hidden"
          name="config[printer_setting_id]"
          value={printerSettingId}
        />
      )}
      <input
        type="hidden"
        name="authenticity_token"
        value={`${window.Rails.csrfToken()}`}
      />

      {items.map(item => {
        return (
          <Fragment key={item.id}>
            <input
              type="hidden"
              key={item.id}
              name={"config[items][][id]"}
              value={item.id}
            />
            <input
              type="hidden"
              key={item.number}
              name={"config[items][][number]"}
              value={item.number}
            />
          </Fragment>
        );
      })}
    </div>
  );
};

HiddenInputsForm.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      number: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    })
  ),
  printerSettingId: PropTypes.number,
};

export default HiddenInputsForm;
