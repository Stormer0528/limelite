import {useState, useCallback} from "react";
import PropTypes from "prop-types";

import {makeStyles} from "@material-ui/core/styles";

import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";

import AdminUserTable from "./admin_user_table_container";
import UserGroupTree from "../users/groups";
import AdminSchoolTable from "./admin_school_table";

import UserIcon from "../shared/icons/user_icon";
import UserGroupIcon from "@material-ui/icons/AccountTreeOutlined";

const UserTabs = ({ organizations }) => {
  const [tabIndex, setTabIndex] = useState(1);
  const handleChange = useCallback(
    (_event, index) => {
      setTabIndex(index);
    },
    [setTabIndex]
  );

  const classes = useStyles();

  return (
    <Container className={classes.root} data-cy="user-tabs">
      <Tabs
        value={tabIndex}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChange}
        aria-label="Admin User Tabs"
        className={classes.tabs}
        component={Paper}
      >
        <Tab
          className={classes.tab}
          data-cy="users-tab"
          label={
            <span className={classes.tabText}>
              <UserIcon /> Users
            </span>
          }
        />
        <Tab
          className={classes.tab}
          data-cy="user-groups-tab"
          label={
            <span className={classes.tabText}>
              <UserGroupIcon /> User Groups
            </span>
          }
        />
        <Tab
          className={classes.tab}
          data-cy="schools-tab"
          label={
            <span className={classes.tabText}>
              Schools
            </span>
          }
        />
      </Tabs>

      <TabPanel value={tabIndex} index={0}>
        <AdminUserTable organizations={organizations} />
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        {
          organizations.length && <UserGroupTree organizations={organizations} /> || <></>
        }
      </TabPanel>
      <TabPanel value={tabIndex} index={2}>
        {
          organizations.length && <AdminSchoolTable organizations={organizations} /> || <></>
        }
      </TabPanel>
    </Container>
  );
};

UserTabs.propTypes = {};

const useStyles = makeStyles(() => ({
  root: {
    marginTop: 120,
    height: "calc(100% - 120px)",
    overflow: "auto",
    maxWidth: "100vw",
  },
  tabs: {
    width: "calc(100vw - 48px)",
    overflow: "auto",
    alignItems: "center",
    position: "fixed",
    display: "flex",
    top: 110,
    left: "24px",
    zIndex: 1000,
  },
  tab: {
    width: "30%",
  },
  tabText: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    "& > svg": {
      marginRight: ".35rem",
      position: "relative",
      top: "-0.125rem",
    },
  },
  titleIcon: {
    fontSize: "2.35rem !important",
    position: "relative",
    top: ".065em",
    color: "#455A64",
  },
}));

export default UserTabs;

function TabPanel(props) {
  const {children, value, index, ...other} = props;

  return value === index ? (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      <Box>{children}</Box>
    </div>
  ) : null;
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};
