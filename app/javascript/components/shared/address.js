import PropTypes from "prop-types";
import {Fragment} from "react";

const Address = ({attention, department, line1, line2, city, state, zip}) => {
  return (
    <Fragment>
      {attention && (
        <div className="attention">
          <b>Attn:&nbsp;</b>
          {attention}
        </div>
      )}
      {department && (
        <div className="department">
          <b>Dept:&nbsp;</b>
          {department}
        </div>
      )}
      <div className="line-1">{line1}</div>
      {line2 && <div className="line-2">{line2}</div>}
      <div className="line-3">
        <span className="city">{city}</span>,&nbsp;
        <span className="state">{state}</span>&nbsp;
        <span className="zip">{zip}</span>
      </div>
    </Fragment>
  );
};

Address.propTypes = {
  name: PropTypes.string,
  attention: PropTypes.string,
  department: PropTypes.string,
  line1: PropTypes.string,
  line2: PropTypes.string,
  city: PropTypes.string,
  state: PropTypes.string,
  zip: PropTypes.string,
  classes: PropTypes.object,
};

export default Address;
