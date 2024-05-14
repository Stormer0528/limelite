import {useEffect} from "react";
import PropTypes from "prop-types";
import {useQuery} from "@apollo/react-hooks";
import {makeStyles} from "@material-ui/core/styles";
import cx from "clsx";

import OrgChart from "./org_chart";

import renderContent from "./render_content";
import USER_GROUP_TREE_QUERY from "../../../graphql/queries/user_group_tree.gql";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import {connect} from "react-redux";

const GroupsView = ({ organizations, organization_id, setCurrentOrg, setUserGroups }) => {
  const classes = useStyles();
  const organizationId = organization_id || organizations[0].id;

  const {
    loading,
    refetch,
    data: {userGroups: tree = {}} = {},
  } = useQuery(USER_GROUP_TREE_QUERY, {fetchPolicy: "cache-and-network", variables: { organizationId }});

  useEffect(() => {
    if (!organization_id) {
      setCurrentOrg(organizations[0]);
    }
  }, [])

  useEffect(() => {
    setUserGroups(tree);
  }, [tree])

  useEffect(() => {
    const elem = document.querySelector("div.org-container > div");
    const elem2 = document.querySelector("div.org-container > div > div");

    if (elem) {
      elem.style.paddingLeft = `${elem.clientWidth + 100}px`;
      elem.style.paddingRight = "100px";
    }

    if (elem2) {
      try {
        elem2.scrollIntoView({
          block: "center",
          inline: "center",
        });
      } catch (e) {
        console.error(e);
      }
    }
  });

  const getFormControl = () => (
    <div className={classes.form}>
      <FormControl>
        <InputLabel htmlFor="organization">
          Organization
        </InputLabel>

        <Select
          displayEmpty
          value={organizationId}
          onChange={(evt) => {
            const id = evt.target.value;
            const organization = organizations.find(organization => organization.id == id);
            setCurrentOrg(organization);
          }}
          inputProps={{
            className: "browser-default",
            id: "organization",
          }}
        >
          {organizations.map((org) => (
            <MenuItem key={org.id} value={org.id}>
              {org.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );

  if (loading) {
    return (
      <div className={classes.root}>
        {getFormControl()}
      </div>
    );
  }

  return (
    <div className={classes.root}>
      {getFormControl()}

      <div className={cx("org-container", classes.chart)}>
        <OrgChart
          className={classes.chart}
          spacingX={4}
          refetch={refetch}
          treeData={tree}
          organizationId={organizationId}
          renderContent={renderContent}
        />
      </div>
    </div>
  );
};

GroupsView.propTypes = {
  tree: PropTypes.object,
};

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 75,
  },
  form: {
    textAlign: 'right',
    paddingRight: 25
  },
  chart: {
    padding: theme.spacing(2),
  },
}));

const mapStateToProps = (state) => {
  const {groups: { organization = {}} = {}} = state;
  return {
    organization_id: organization.id || 0,
  };
};

const mapDispatchToProps = (dispatch) => ({
  setCurrentOrg: (organization) => {
    dispatch({type: "groups/setOrganization", payload: organization});
  },
  setUserGroups: (tree) => {
    dispatch({type: "groups/setUserGroups", payload: tree});
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupsView);

