import PropTypes from "prop-types";
import {Fragment} from "react";

const HiddenInputs = ({
  values: {
    id = "",
    firstName: first_name = "",
    lastName: last_name = "",
    email = "",
    avatarUrl: avatar_url = "",
    password = "",
    passwordConfirmation: password_confirmation = "",
  } = {},
}) => {
  return (
    <Fragment>
      <input type="hidden" name="id" value={id || ""} />
      <input type="hidden" name="first_name" value={first_name || ""} />
      <input type="hidden" name="last_name" value={last_name || ""} />
      <input type="hidden" name="email" value={email || ""} />
      <input type="hidden" name="password" value={password || ""} />
      <input
        type="hidden"
        name="password_confirmation"
        value={password_confirmation}
      />
      <input type="hidden" name="avatar_url" value={avatar_url || ""} />
    </Fragment>
  );
};

HiddenInputs.propTypes = {
  values: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    avatarUrl: PropTypes.string,
    password: PropTypes.string,
    passwordConfirmation: PropTypes.string,
  }),
};

export default HiddenInputs;
