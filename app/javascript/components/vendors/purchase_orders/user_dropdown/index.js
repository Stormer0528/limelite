import PropTypes from "prop-types";
import {useQuery} from "@apollo/react-hooks";
import uniqBy from "lodash/uniqBy";

import Dropdown from "./dropdown";
import USER_QUERY from "../../../../graphql/queries/user_dropdown.gql";

const UserDropdownContainer = ({
  pollInterval = 0,
  organizationId,
  user: current,
  disabled,
  ...rest
}) => {
  const {loading, data: {users: initial = [current]} = {}} = useQuery(
    USER_QUERY,
    {
      variables: {organizationId},
      skip: !organizationId,
      pollInterval,
    }
  );

  const isDisabled = [disabled, loading, !organizationId].some(Boolean);
  const options = uniqBy([...initial, current].filter(Boolean), "id");

  if (loading) {
    return null;
  }

  return <Dropdown {...{loading, options, disabled: isDisabled, ...rest}} />;
};

UserDropdownContainer.propTypes = {
  organizationId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  pollInterval: PropTypes.number,
  disabled: PropTypes.bool,
  user: PropTypes.shape({
    id: PropTypes.string,
    fullName: PropTypes.string,
  }),
};

export default UserDropdownContainer;
