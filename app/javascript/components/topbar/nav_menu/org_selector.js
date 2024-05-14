import {useCallback} from "react";
import {withStyles, useTheme} from "@material-ui/core/styles";

import {useQuery} from "@apollo/react-hooks";
import ORG_QUERY from "../../../graphql/queries/user_organizations.gql";

import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import InputAdornment from "@material-ui/core/InputAdornment";

import OrgIcon from "../../shared/icons/organization_icon";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";

const StyledTextField = withStyles({
  root: {
    borderBottom: "1px solid #ddd",
    minWidth: "72px",

    "& > div:before, & > div:hover:before": {
      borderBottom: "none !important",
    },

    "& > div > div:first-child": {
      paddingLeft: 16,
    },

    "& > div > div:nth-child(2)": {
      padding: "16px 36px",
      position: "relative",
      paddingLeft: 64,
      marginLeft: "-42px",
    },

    "& > div > svg": {
      right: 8,
    },

    "& svg": {
      fill: "#747474",
    },
  },
})(TextField);

const OrgSelector = () => {
  /** Sent users to url when selected  */
  const handleChange = useCallback(({target: {value}}) => {
    window.location.assign(`//${value}`);
  }, []);

  const {
    data: {
      currentOrg: {url = ""} = {},
      currentUser = {},
    } = {},
  } = useQuery(ORG_QUERY, {fetchPolicy: "cache-and-network"});
  const organizations = [ ...(currentUser.organizations || []) ];
  const {models: modelColors = {}} = useTheme();

  if (currentUser.admin) {
    const index = organizations.findIndex(org => org.name.toLowerCase() > 'admin');
    const subdomain = location.hostname.split('.').shift();

    const admin = { subdomain: 'admin', url: location.host.replace(`${subdomain}.`, ''), name: 'Admin' };

    if (index == -1) {
      organizations.push(admin)
    } else {
      organizations.splice(index, 0, admin);
    }
  }

  return (
    <StyledTextField
      select
      fullWidth
      onChange={handleChange}
      value={url}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <OrgIcon style={{fill: modelColors["Organization"].menuColor}} />
          </InputAdornment>
        ),
      }}
      SelectProps={{
        displayEmpty: true,
        IconComponent: KeyboardArrowDownIcon,
      }}
    >
      <MenuItem value="" disabled>
        <OrgIcon />
        &nbsp;&nbsp; Select An Organization
      </MenuItem>
      {organizations.map(({name, subdomain, url}) => {
        return (
          <MenuItem key={subdomain} value={url}>
            {name}
          </MenuItem>
        );
      })}
    </StyledTextField>
  );
};
OrgSelector.propTypes = {};

export default OrgSelector;
