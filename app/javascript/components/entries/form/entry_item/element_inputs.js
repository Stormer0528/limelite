import {withStyles} from "@material-ui/core/styles";
import clsx from "clsx";
import PropTypes from "prop-types";
import {Fragment, useRef} from "react";

const ElementInputs = ({
  name,
  fieldErrors = {},
  fundCode,
  resourceCode,
  yearCode,
  goalCode,
  functionCode,
  objectCode,
  locationCode,
  disabled = false,
  readOnly = false,
  handleChange,
  handleBlur,
  classes = {},
}) => {
  const fieldStyle = {marginBottom: "none"};
  const locationFieldStyle = {marginBottom: "none", minWidth: "3rem"};

  const resourceInputRef = useRef();
  const yearInputRef = useRef();
  const goalInputRef = useRef();
  const functionInputRef = useRef();
  const objectInputRef = useRef();
  const locationInputRef = useRef();

  return (
    <Fragment>
      <input
        onKeyDown={handleKeyUp}
        onKeyUp={handleKeyDown({ref: resourceInputRef})}
        name={`${name}.fundCode`}
        type="tel"
        min="0"
        maxLength="4"
        placeholder="Fund"
        value={fundCode}
        style={fieldStyle}
        {...{disabled, readOnly, onChange: handleChange}}
        className={clsx({[classes.error]: fieldErrors.fundCode})}
      />
      <span className="dash-spacer">&ndash;</span>
      <input
        onChange={handleChange}
        onBlur={handleBlur}
        ref={resourceInputRef}
        name={`${name}.resourceCode`}
        onKeyDown={handleKeyUp}
        onKeyUp={handleKeyDown({
          ref: yearInputRef,
        })}
        type="tel"
        min="0"
        maxLength="4"
        placeholder="Resource"
        value={resourceCode}
        style={fieldStyle}
        {...{disabled, readOnly, onChange: handleChange}}
        className={clsx({[classes.error]: fieldErrors.resourceCode})}
      />
      <span className="dash-spacer">&ndash;</span>
      <input
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyUp}
        onKeyUp={handleKeyDown({
          maxChars: 1,
          ref: goalInputRef,
        })}
        name={`${name}.yearCode`}
        ref={yearInputRef}
        type="tel"
        min="0"
        maxLength="1"
        placeholder="Year"
        value={yearCode}
        style={fieldStyle}
        {...{disabled, readOnly, onChange: handleChange}}
        className={clsx({[classes.error]: fieldErrors.yearCode})}
      />
      <span className="dash-spacer">&ndash;</span>
      <input
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyUp}
        onKeyUp={handleKeyDown({ref: functionInputRef})}
        name={`${name}.goalCode`}
        ref={goalInputRef}
        type="tel"
        min="0"
        maxLength="4"
        placeholder="Goal"
        value={goalCode}
        style={fieldStyle}
        {...{disabled, readOnly, onChange: handleChange}}
        className={clsx({[classes.error]: fieldErrors.goalCode})}
      />
      <span className="dash-spacer">&ndash;</span>
      <input
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyUp}
        onKeyUp={handleKeyDown({ref: objectInputRef})}
        name={`${name}.functionCode`}
        ref={functionInputRef}
        type="tel"
        min="0"
        maxLength="4"
        placeholder="Function"
        value={functionCode}
        style={fieldStyle}
        {...{disabled, readOnly, onChange: handleChange}}
        className={clsx({[classes.error]: fieldErrors.functionCode})}
      />
      <span className="dash-spacer">&ndash;</span>
      <input
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyUp}
        onKeyUp={handleKeyDown({ref: locationInputRef})}
        name={`${name}.objectCode`}
        ref={objectInputRef}
        type="tel"
        min="0"
        maxLength="4"
        placeholder="Object"
        value={objectCode}
        style={fieldStyle}
        {...{disabled, readOnly, onChange: handleChange}}
        className={clsx({[classes.error]: fieldErrors.objectCode})}
      />
      <span className="dash-spacer">&ndash;</span>
      <input
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyUp={handleKeyUp}
        name={`${name}.locationCode`}
        ref={locationInputRef}
        type="tel"
        min="0"
        maxLength={3}
        placeholder={"School"}
        value={locationCode}
        style={locationFieldStyle}
        {...{disabled, readOnly, onChange: handleChange}}
        className={clsx({[classes.error]: fieldErrors.locationCode})}
      />
    </Fragment>
  );
};

const handleKeyUp = (e) => {
  // Keep non-numeric keys from being processed
  if (e.keyCode >= 65 && e.keyCode <= 90) {
    e.preventDefault();
    e.stopPropagation();
  }
};

const handleKeyDown = ({maxChars = 4, ref}) => {
  return (e) => {
    const {target, target: {value = ""} = {}} = e;
    if (value.length >= maxChars && target.selectionStart === maxChars) {
      if (ref && ref.current) {
        ref.current.select();
      }
    }
  };
};

ElementInputs.propTypes = {
  name: PropTypes.string,
  fundCode: PropTypes.string,
  resourceCode: PropTypes.string,
  yearCode: PropTypes.string,
  goalCode: PropTypes.string,
  functionCode: PropTypes.string,
  objectCode: PropTypes.string,
  locationCode: PropTypes.string,
  fieldErrors: PropTypes.any,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  error: {
    color: "#E53935 !important",
    fontWeight: "600 !important",
    background: "#e539350d !important",
    borderRadius: "3px !important",
  },
});

export default withStyles(styles)(ElementInputs);
